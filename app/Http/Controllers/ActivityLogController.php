<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request) {
        $request_role = $request->query('role');
        $confiremed_roles = ['super_admin', 'admin', 'voter', 'paslon'];

        if ($request_role && in_array($request_role, $confiremed_roles)) {
            return response()->json([
                'success' => true,
                'message' => "Menampilkan activity log dengan role: {$request_role}",
                'data' => ActivityLog::where('subject', $request_role)->get(),
            ], 200);
        }

        return response()->json([
            'success' => true,
            'message' => 'Menampilkan semua activity log',
            'data' => ActivityLog::all(),
        ], 200);
    }
}
