<?php

namespace App\Http\Controllers;

use App\Models\Paslon;
use App\Models\RegisteredVote;
use App\Models\Vote;
use App\Models\Warga;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VoteController extends Controller
{
    public function create(Request $request) {
        $request->validate([
            'warga_nik' => 'required',
            'paslon_id' => 'required',
        ]);

        if (!Warga::where('nik', $request->warga_nik)->exists()) {
            return response()->json([
                'success' => false,
                'message' => "NIK not found",
            ], 404);
        }

        $vote = Vote::create([
            'warga_nik' => $request->warga_nik,
            'paslon_id' => $request->paslon_id,
        ]);

        $plainVote = $vote->warga_nik. "|" .$vote->paslon_id. "|" .$vote->created_at;
        $hashedVote = hash('sha256', $plainVote);

        DB::table('registered_vote')->insert([
            'hashed_vote' => $hashedVote
        ]);

        return response()->json([
            'success' => true,
            'message' => "Hello, World!",
            'data' => $hashedVote,
        ], 200);
    }

    public function validate() {
        $votes = Vote::all();

        foreach ($votes as $vote) {
            $plainVote = $vote->warga_nik. "|" .$vote->paslon_id. "|" .$vote->created_at;
            $hashedVote = hash('sha256', $plainVote);

            if (!RegisteredVote::where('hashed_vote', $hashedVote)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => "Kecurangannnn!!!",
                ], 400);
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Hello, World!",
            'data' => "aman",
        ], 200);
    }
}
