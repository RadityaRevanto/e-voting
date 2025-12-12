<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VoteLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class VoteLogController extends Controller
{
    /**
     * Store a new vote log.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'candidate_id' => 'required|integer',
            'candidate_name' => 'required|string|max:255',
            'candidate_department' => 'nullable|string|max:255',
            'qr_code_data' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = Auth::user();

        $voteLog = VoteLog::create([
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_email' => $user->email,
            'user_role' => $user->role ?? 'user',
            'candidate_id' => $request->candidate_id,
            'candidate_name' => $request->candidate_name,
            'candidate_department' => $request->candidate_department,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'qr_code_data' => $request->qr_code_data,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Vote berhasil disimpan',
            'data' => $voteLog,
        ], 201);
    }

    /**
     * Get all vote logs (for admin).
     */
    public function index(Request $request)
    {
        $query = VoteLog::with('user')
            ->orderBy('created_at', 'desc');

        // Filter by date if provided
        if ($request->has('date')) {
            $query->whereDate('created_at', $request->date);
        }

        // Filter by candidate if provided
        if ($request->has('candidate_id')) {
            $query->where('candidate_id', $request->candidate_id);
        }

        // Filter by user if provided
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by user role/category if provided
        if ($request->has('user_role') && $request->user_role !== '' && $request->user_role !== 'all') {
            $query->where('user_role', $request->user_role);
        }

        $perPage = $request->get('per_page', 50);
        $voteLogs = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $voteLogs,
        ]);
    }

    /**
     * Get vote statistics.
     */
    public function statistics()
    {
        $totalVotes = VoteLog::count();
        $votesByCandidate = VoteLog::selectRaw('candidate_id, candidate_name, COUNT(*) as vote_count')
            ->groupBy('candidate_id', 'candidate_name')
            ->orderBy('vote_count', 'desc')
            ->get();

        $votesToday = VoteLog::whereDate('created_at', today())->count();
        $votesThisWeek = VoteLog::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count();
        $votesThisMonth = VoteLog::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_votes' => $totalVotes,
                'votes_today' => $votesToday,
                'votes_this_week' => $votesThisWeek,
                'votes_this_month' => $votesThisMonth,
                'votes_by_candidate' => $votesByCandidate,
            ],
        ]);
    }
}
