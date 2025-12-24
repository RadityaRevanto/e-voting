<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;

class ActivityLogController extends Controller
{
    public function index() {
        return response()->json([
            'success' => true,
            'message' => 'Menampilkan semua activity log',
            'data' => ActivityLog::all(),
        ], 200);
    }
}
