<?php

namespace App\Http\Controllers;

use App\Helpers\HttpStatus;
use App\Helpers\ActivityLogHelper;
use App\Models\ActivityLog;
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
        if (!ScheduleController::isVotingActive()) {
            return HttpStatus::code403('Proses voting sedang tidak aktif');
        }

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
            return HttpStatus::code409('NIK sudah ada atau Paslon tidak ditemukan');
        }

        // Hashing Vote
        $plainVote = $vote->id. "#" .$vote->warga_nik. "#" .$vote->paslon_id. "#" .$vote->created_at;
        $hashedVote = hash('sha256', $plainVote);
        DB::table('registered_vote')->insert([
            'hashed_vote' => $hashedVote
        ]);

        // Buat log vote
        ActivityLogHelper::createVoteLog(
            $request->user()->email." : NIK ".$request->warga_nik." melakukan vote untuk Paslon ID ".$request->paslon_id,
            $vote->created_at
        );

        return response()->json([
            'success' => true,
            'message' => "Vote berhasil dibuat",
            'data' => [],
        ], 200);
    }

    public function lifeResult() {
        $voteCount = Vote::count();
        $registeredVoteCount = RegisteredVote::count();
        $votes = Vote::all();
        $paslonVoteMapping = [];

        if ($voteCount != $registeredVoteCount) {
            return HttpStatus::code409('Manipulasi terdeteksi');
        }

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

        // Vote precentage each paslon
        for ($i = 1; $i <= Paslon::count(); $i++) { 
            $paslonVoteMapping['paslon'.$i.'_precentage'] = ($voteCount > 0)? round(($paslonVoteMapping['paslon'.$i] / $voteCount) * 100, 2)."%" : "0%";
        }
        $paslonVoteMapping['kecurangan_precentage'] = ($voteCount > 0)? round(($paslonVoteMapping['kecurangan'] / $voteCount) * 100, 2)."%" : "0%";

        return response()->json([
            'success' => true,
            'message' => "Data vote",
            'data' => $paslonVoteMapping,
        ], 200);
    }
    
    public function votingProcess() {
        $voteAmount = Vote::count();
        $vilagerAmount = Warga::count();

        return response()->json([
            'success' => true,
            'message' => "Data vote",
            'data' => [
                'vilager_total' => $vilagerAmount,
                'vote_total' => $voteAmount,
                'golput' => $vilagerAmount - $voteAmount,
            ],
        ], 200);
    }

    public function clearVotesData() {
        Vote::truncate();
        RegisteredVote::truncate();

        ActivityLogHelper::createVoteLog(
            "Data vote telah dihapus oleh admin",
            now()
        );

        return response()->json([
            'success' => true,
            'message' => "Data vote berhasil dihapus",
            'data' => [],
        ], 200);
    }
}
