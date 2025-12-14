<?php

namespace App\Http\Controllers;

use App\Helpers\HttpStatus;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Login untuk admin
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return HttpStatus::code422('Validation failed');
        }

        try {
            // Hanya admin yang bisa login
            $user = User::where('email', $request->email)
                ->where('role', 'admin')
                ->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email atau password salah',
                    'data' => [],
                ], 401);
            }

            // Untuk e-voting desa: Multiple sessions dengan limit
            // Hapus hanya token yang expired, biarkan token aktif tetap valid
            // Ini memungkinkan admin bekerja dari beberapa device (laptop, tablet, dll)
            $user->tokens()->where('expires_at', '<', now())->delete();

            // Limit jumlah session aktif (max 3 device untuk keamanan)
            $maxActiveSessions = 3;
            $activeSessions = $user->tokens()
                ->where('expires_at', '>', now())
                ->count();

            // Jika sudah mencapai limit, hapus session terlama
            if ($activeSessions >= $maxActiveSessions) {
                $oldestToken = $user->tokens()
                    ->where('expires_at', '>', now())
                    ->orderBy('created_at', 'asc')
                    ->first();

                if ($oldestToken) {
                    $oldestToken->delete();
                }
            }

            // Dapatkan informasi device untuk tracking
            $deviceInfo = $request->header('User-Agent', 'Unknown');
            $ipAddress = $request->ip();
            $deviceName = $request->input('device_name', $deviceInfo);

            // Buat access token dengan expiration 1 jam
            $accessToken = $user->createToken(
                'access-token-' . $deviceName,
                ['access-token'],
                Carbon::now()->addHours(1)
            );

            // Simpan metadata device ke token (melalui name)
            $accessToken->accessToken->update([
                'name' => 'access-token-' . $deviceName . '-' . $ipAddress
            ]);

            // Buat refresh token dengan expiration 7 hari
            $refreshToken = $user->createToken(
                'refresh-token-' . $deviceName,
                ['refresh-token'],
                Carbon::now()->addDays(7)
            );

            // Simpan metadata device ke refresh token
            $refreshToken->accessToken->update([
                'name' => 'refresh-token-' . $deviceName . '-' . $ipAddress
            ]);

            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ];

            return response()->json([
                'success' => true,
                'message' => 'Login berhasil',
                'data' => [
                    'user' => $userData,
                    'access_token' => $accessToken->plainTextToken,
                    'refresh_token' => $refreshToken->plainTextToken,
                    'token_type' => 'Bearer',
                    'expires_in' => 3600, // 1 jam dalam detik
                ],
            ], 200);

        } catch (\Throwable $th) {
            return HttpStatus::code500($th->getMessage());
        }
    }

    /**
     * Refresh access token menggunakan refresh token
     */
    public function refreshToken(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'refresh_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return HttpStatus::code422('Refresh token diperlukan');
        }

        try {
            // Cari token berdasarkan refresh token
            $token = \Laravel\Sanctum\PersonalAccessToken::findToken($request->refresh_token);

            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Refresh token tidak valid',
                    'data' => [],
                ], 401);
            }

            // Cek apakah token memiliki ability refresh-token
            if (!in_array('refresh-token', $token->abilities ?? [])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token bukan refresh token',
                    'data' => [],
                ], 401);
            }

            // Cek apakah token sudah expired
            if ($token->expires_at && $token->expires_at->isPast()) {
                $token->delete();
                return response()->json([
                    'success' => false,
                    'message' => 'Refresh token sudah expired',
                    'data' => [],
                ], 401);
            }

            // Dapatkan user dari token
            $user = $token->tokenable;

            // Hapus access token lama yang sudah expired
            $user->tokens()
                ->where('abilities', 'like', '%access-token%')
                ->where('expires_at', '<', now())
                ->delete();

            // Buat access token baru
            $accessToken = $user->createToken(
                'access-token',
                ['access-token'],
                Carbon::now()->addHours(1)
            );

            return response()->json([
                'success' => true,
                'message' => 'Token berhasil di-refresh',
                'data' => [
                    'access_token' => $accessToken->plainTextToken,
                    'token_type' => 'Bearer',
                    'expires_in' => 3600, // 1 jam dalam detik
                ],
            ], 200);

        } catch (\Throwable $th) {
            return HttpStatus::code500($th->getMessage());
        }
    }

    /**
     * Logout - hapus semua token user
     */
    public function logout(Request $request)
    {
        try {
            $user = $request->user();

            if ($user) {
                // Hapus semua token user
                $user->tokens()->delete();

                return response()->json([
                    'success' => true,
                    'message' => 'Logout berhasil',
                    'data' => [],
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'User tidak terautentikasi',
                'data' => [],
            ], 401);

        } catch (\Throwable $th) {
            return HttpStatus::code500($th->getMessage());
        }
    }

    /**
     * Get current authenticated user
     */
    public function me(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak terautentikasi',
                    'data' => [],
                ], 401);
            }

            // Hanya admin yang bisa login
            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ];

            return response()->json([
                'success' => true,
                'message' => 'Data user berhasil diambil',
                'data' => $userData,
            ], 200);

        } catch (\Throwable $th) {
            return HttpStatus::code500($th->getMessage());
        }
    }

    /**
     * Get active sessions untuk user yang sedang login
     * Berguna untuk admin desa melihat device mana yang sedang aktif
     */
    public function getActiveSessions(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak terautentikasi',
                    'data' => [],
                ], 401);
            }

            // Dapatkan current token ID untuk identifikasi session aktif
            $currentToken = $request->user()->currentAccessToken();
            $currentTokenId = $currentToken ? $currentToken->id : null;

            $sessions = $user->tokens()
                ->where('expires_at', '>', now())
                ->orderBy('last_used_at', 'desc')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($token) use ($currentTokenId) {
                    // Parse device info dari token name
                    // Format: "access-token-DeviceName-IPAddress" atau "refresh-token-DeviceName-IPAddress"
                    $nameParts = explode('-', $token->name);
                    $deviceName = isset($nameParts[2]) ? $nameParts[2] : 'Unknown';
                    $ipAddress = isset($nameParts[3]) ? $nameParts[3] : 'Unknown';

                    return [
                        'id' => $token->id,
                        'device_name' => $deviceName,
                        'ip_address' => $ipAddress,
                        'is_current' => $token->id === $currentTokenId,
                        'last_used_at' => $token->last_used_at?->format('Y-m-d H:i:s'),
                        'created_at' => $token->created_at->format('Y-m-d H:i:s'),
                        'expires_at' => $token->expires_at?->format('Y-m-d H:i:s'),
                        'token_type' => in_array('refresh-token', $token->abilities ?? []) ? 'refresh' : 'access',
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Data session berhasil diambil',
                'data' => [
                    'sessions' => $sessions,
                    'total_active' => $sessions->count(),
                    'max_sessions' => 3,
                ],
            ], 200);

        } catch (\Throwable $th) {
            return HttpStatus::code500($th->getMessage());
        }
    }

    /**
     * Revoke session tertentu (logout dari device tertentu)
     * Berguna untuk admin desa logout dari device yang tidak dikenal
     */
    public function revokeSession(Request $request, $tokenId)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak terautentikasi',
                    'data' => [],
                ], 401);
            }

            // Cari token yang dimiliki user
            $token = $user->tokens()->find($tokenId);

            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session tidak ditemukan',
                    'data' => [],
                ], 404);
            }

            // Jangan izinkan revoke current session (harus pakai logout)
            $currentToken = $request->user()->currentAccessToken();
            if ($currentToken && $token->id === $currentToken->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak bisa revoke session yang sedang aktif. Gunakan logout untuk logout dari device ini.',
                    'data' => [],
                ], 400);
            }

            $token->delete();

            return response()->json([
                'success' => true,
                'message' => 'Session berhasil di-revoke',
                'data' => [],
            ], 200);

        } catch (\Throwable $th) {
            return HttpStatus::code500($th->getMessage());
        }
    }
}
