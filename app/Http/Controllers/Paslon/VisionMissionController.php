<?php

namespace App\Http\Controllers\Paslon;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class VisionMissionController extends Controller
{
    /**
     * Update vision and mission for authenticated user.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vision' => 'required|string|max:1000',
            'missions' => 'required|array|min:1',
            'missions.*' => 'required|string|max:500',
        ], [
            'vision.required' => 'Vision harus diisi',
            'vision.max' => 'Vision maksimal 1000 karakter',
            'missions.required' => 'Minimal harus ada 1 mission',
            'missions.min' => 'Minimal harus ada 1 mission',
            'missions.*.required' => 'Mission tidak boleh kosong',
            'missions.*.max' => 'Setiap mission maksimal 500 karakter',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = Auth::user();

            $user->vision = $request->vision;
            $user->mission = $request->missions;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Vision dan Mission berhasil disimpan',
                'data' => [
                    'vision' => $user->vision,
                    'mission' => $user->mission,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
