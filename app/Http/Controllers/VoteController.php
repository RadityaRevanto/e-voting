<?php

namespace App\Http\Controllers;

use App\Helpers\HttpStatus;
use App\Models\Paslon;
use App\Models\RegisteredVote;
use App\Models\Vote;
use App\Models\Warga;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class VoteController extends Controller
{
    public function create(Request $request) {
        // Validate
        $validator = Validator::make($request->all(), [
            'warga_nik' => 'required|string|max:64',
            'paslon_id' => 'required|integer',
        ]);
        if ($validator->fails()) return HttpStatus::code422();

        // Cek daftar NIK
        if (!Warga::where('nik', $request->warga_nik)->exists()) return HttpStatus::code404();

        // Buat Vote
        try {
            $vote = Vote::create([
                'warga_nik' => $request->warga_nik,
                'paslon_id' => $request->paslon_id,
            ]);
        } catch (\Throwable $th) {
            return HttpStatus::code409('NIK sudah ada');
        }

        // Hashing Vote
        $plainVote = $vote->id. "#" .$vote->warga_nik. "#" .$vote->paslon_id. "#" .$vote->created_at;
        $hashedVote = hash('sha256', $plainVote);
        DB::table('registered_vote')->insert([
            'hashed_vote' => $hashedVote
        ]);

        return response()->json([
            'success' => true,
            'message' => "Vote berhasil dibuat",
            'data' => [],
        ], 200);
    }

    public function validate() {
        $votes = Vote::all();
        $paslonVoteMapping = [];

        // Mapping return value
        for ($i = 1; $i <= Paslon::count(); $i++) { 
            $paslonVoteMapping['paslon'.$i] = 0;
        }
        $paslonVoteMapping['kecurangan'] = 0;

        // Cek data vote dengan hash yang terdaftar
        foreach ($votes as $vote) {
            $plainVote = $vote->id. "#" .$vote->warga_nik. "#" .$vote->paslon_id. "#" .$vote->created_at;
            $hashedVote = hash('sha256', $plainVote);

            if (!RegisteredVote::where('hashed_vote', $hashedVote)->exists()) {
                $paslonVoteMapping['kecurangan']++;
                continue;
            }

            $paslonVoteMapping['paslon'.$vote->paslon_id]++;
        }

        return response()->json([
            'success' => true,
            'message' => "Data vote",
            'data' => $paslonVoteMapping,
        ], 200);
    }
}
