<?php

namespace App\Http\Controllers;

use App\Helpers\HttpStatus;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ScheduleController extends Controller
{
    public function index() {
        return response()->json([
            'success' => true,
            'message' => 'List of schedules',
            'data' => Schedule::all(),
        ]);
    }

    public function store(Request $request) {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:100',
                'start_time' => 'required|date',
                'end_time' => 'required|date|after_or_equal:start_time',
                'tag' => 'required|string|max:50',
            ]);

            $schedule = Schedule::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Schedule created successfully',
                'data' => $schedule,
            ], 201);
        } catch (\Exception $e) {
            return HttpStatus::code500($e);
        }
    }

    public static function isVotingActive() {
        $now = now();
        return Schedule::where('tag', 'voting')
            ->where('start_time', '<=', $now)
            ->where('end_time', '>=', $now)
            ->exists();
    }

    public function currentEvent() {
        $now = now();
        $currentEvent = Schedule::where('start_time', '<=', $now)
            ->where('end_time', '>=', $now)
            ->first();

        if ($currentEvent) {
            return response()->json([
                'success' => true,
                'message' => 'Current active event',
                'data' => $currentEvent,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No active event at the moment',
                'data' => null,
            ]);
        }
    }

    public function setSchedule(Request $request) {
        $validator = Validator::make($request->all(), [
            'tag' => 'required|string|in:registration,voting,announcement',
            'start_time' => 'required|date',
            'end_time' => 'required|date',
        ]);

        if ($validator->fails()) return HttpStatus::code422($validator->errors());

        try {
            $schedule = Schedule::where('tag',  $request->tag)->first();

            $schedule->start_time = $request->start_time;
            $schedule->end_time = $request->end_time;
            $schedule->save();

            return response()->json([
                'success' => true,
                'message' => 'Schedule berhasil diatur',
                'data' => $schedule,
            ], 200);
        } catch (\Exception $e) {
            return HttpStatus::code500('Gagal mengatur schedule: ' . $e->getMessage());
        }
    }
}
