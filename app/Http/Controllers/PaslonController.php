<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PaslonController extends Controller
{
    /**
     * Get vision and mission for current paslon
     */
    public function getVisionMission(Request $request)
    {
        try {
            // Ambil data user yang sedang login
            $user = Auth::user();

            // Debug log untuk memastikan user dan paslon tersedia
            Log::info('VisionMission - Get request from user ID: ' . ($user->id ?? 'null'));

            // Pastikan user terautentikasi dan memiliki data paslon
            if (!$user || !$user->paslon) {
                Log::warning('VisionMission - User is not a paslon', [
                    'user_id' => $user->id ?? 'null',
                    'has_paslon' => isset($user->paslon)
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'User is not a paslon',
                ], 403);
            }

            // Ambil data paslon yang terkait dengan user
            $paslon = $user->paslon;

            // Log data paslon yang ditemukan
            Log::info('VisionMission - Paslon data found', [
                'paslon_id' => $paslon->id,
                'visi' => $paslon->visi ?? 'empty',
                'misi' => $paslon->misi ?? []
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Data vision dan mission berhasil diambil',
                'data' => [
                    'ketua' => $paslon->nama_ketua ?? '',
                    'wakilKetua' => $paslon->nama_wakil_ketua ?? '',
                    'title' => 'VILLAGE HEAD ELECTION', // Bisa disesuaikan jika ada di database
                    'vision' => $paslon->visi ?? '',
                    'missions' => $paslon->misi ?? [],
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('VisionMission - Error fetching: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update vision and mission for current paslon
     */
    public function updateVisionMission(Request $request)
    {
        try {
            // Ambil data user yang sedang login
            $user = Auth::user();

            // Debug log untuk memastikan user dan request yang dikirim
            Log::info('VisionMission - Update request', [
                'user_id' => $user->id ?? 'null',
                'request_data' => $request->all()
            ]);

            // Pastikan user terautentikasi dan memiliki data paslon
            if (!$user || !$user->paslon) {
                return response()->json([
                    'success' => false,
                    'message' => 'User is not a paslon',
                ], 403);
            }

            // Ambil data paslon yang terkait dengan user
            $paslon = $user->paslon;

            // Validasi input dari request
            $validator = Validator::make($request->all(), [
                'vision' => 'required|string|max:500',
                'missions' => 'required|array|min:1',
                'missions.*' => 'required|string|max:200',
            ], [
                'vision.required' => 'Vision harus diisi',
                'missions.required' => 'Minimal harus ada 1 mission',
                'missions.min' => 'Minimal harus ada 1 mission',
                'missions.*.required' => 'Setiap mission harus diisi',
                'missions.*.max' => 'Mission maksimal 200 karakter',
            ]);

            // Jika validasi gagal
            if ($validator->fails()) {
                Log::warning('VisionMission - Validation failed', [
                    'errors' => $validator->errors()->toArray()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Update data vision dan mission pada paslon
            $paslon->update([
                'visi' => $request->vision,
                'misi' => $request->missions,
            ]);

            // Log update yang berhasil
            Log::info('VisionMission - Updated successfully', [
                'paslon_id' => $paslon->id,
                'new_vision' => $request->vision,
                'new_missions' => $request->missions
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Vision dan Mission berhasil diperbarui!',
                'data' => [
                    'vision' => $paslon->visi,
                    'missions' => $paslon->misi,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('VisionMission - Error updating: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
