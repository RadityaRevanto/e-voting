<?php

namespace App\Http\Controllers;

use App\Helpers\HttpStatus;
use App\Models\User;
use App\Models\LoginLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
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
            // Hanya admin dan super_admin yang bisa login
            $user = User::where('email', $request->email)
                ->whereIn('role', ['admin', 'super_admin', 'paslon', 'voter'])
                ->first();

            // Dapatkan informasi device untuk tracking (sebelum validasi)
            $deviceInfo = $request->header('User-Agent', 'Unknown');
            $ipAddress = $request->ip();
            $deviceName = $request->input('device_name', $deviceInfo);

            if (!$user || !Hash::check($request->password, $user->password)) {
                // Log login gagal
                LoginLog::create([
                    'user_id' => $user ? $user->id : null,
                    'ip_address' => $ipAddress,
                    'user_agent' => $deviceInfo,
                    'device_name' => $deviceName,
                    'login_at' => now(),
                    'status' => 'failed',
                    'failure_reason' => $user ? 'Password salah' : 'Email tidak ditemukan',
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Email atau password salah',
                    'data' => [],
                ], 401);
            }

            // Hapus token yang sudah expired
            DB::table('personal_access_tokens')
                ->where('expires_at', '<', now())
                ->delete();

            $user->tokens()->delete();

            // Log login berhasil
            LoginLog::create([
                'user_id' => $user->id,
                'ip_address' => $ipAddress,
                'user_agent' => $deviceInfo,
                'device_name' => $deviceName,
                'login_at' => now(),
                'status' => 'success',
            ]);

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

            // Validasi user masih ada dan aktif
            if (!$user) {
                $token->delete();
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak ditemukan',
                    'data' => [],
                ], 401);
            }

            // Validasi user masih memiliki role yang valid
            if (!in_array($user->role, ['admin', 'super_admin', 'paslon'])) {
                $token->delete();
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak memiliki akses',
                    'data' => [],
                ], 403);
            }

            // Dapatkan informasi device dari refresh token untuk konsistensi
            $deviceInfo = $request->header('User-Agent', 'Unknown');
            $ipAddress = $request->ip();

            // Parse device name dari token name (format: refresh-token-DeviceName-IPAddress)
            $nameParts = explode('-', $token->name, 4);
            $deviceName = isset($nameParts[2]) ? $nameParts[2] : $deviceInfo;

            // Hapus access token lama yang sudah expired
            // Menggunakan filter collection karena abilities adalah JSON
            $expiredAccessTokens = $user->tokens()
                ->where('expires_at', '<', now())
                ->get()
                ->filter(function ($t) {
                    return in_array('access-token', $t->abilities ?? []);
                });

            foreach ($expiredAccessTokens as $expiredToken) {
                $expiredToken->delete();
            }

            // Buat access token baru dengan device info yang konsisten
            $accessToken = $user->createToken(
                'access-token-' . $deviceName,
                ['access-token'],
                Carbon::now()->addHours(1)
            );

            // Simpan metadata device ke token (melalui name)
            $accessToken->accessToken->update([
                'name' => 'access-token-' . $deviceName . '-' . $ipAddress
            ]);

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

    /**
     * Get login logs untuk monitoring dan keamanan
     * Hanya Super Admin yang bisa akses endpoint ini
     * Berguna untuk melihat history login dan mendeteksi kecurangan
     * Default menampilkan semua log dari semua user
     */
    public function getLoginLogs(Request $request)
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

            // Hanya super_admin yang bisa akses log login
            if (!$user instanceof User || $user->role !== 'super_admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak. Hanya Super Admin yang bisa melihat log login.',
                    'data' => [],
                ], 403);
            }

            // Query parameters
            $limit = $request->input('limit', 50);
            $offset = $request->input('offset', 0);
            $userId = $request->input('user_id');
            $ipAddress = $request->input('ip_address');
            $status = $request->input('status'); // success, failed
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            // Build query
            // Super admin bisa melihat semua log dari semua user (default)
            $query = LoginLog::with('user:id,name,email')
                ->orderBy('login_at', 'desc');

            // Filter by user_id (jika diisi)
            if ($userId) {
                $query->where('user_id', $userId);
            }

            // Filter by IP address
            if ($ipAddress) {
                $query->where('ip_address', $ipAddress);
            }

            // Filter by status
            if ($status) {
                $query->where('status', $status);
            }

            // Filter by date range
            if ($startDate) {
                $query->where('login_at', '>=', $startDate);
            }
            if ($endDate) {
                $query->where('login_at', '<=', $endDate);
            }

            // Get total count before pagination
            $total = $query->count();

            // Apply pagination
            $logs = $query->limit($limit)
                ->offset($offset)
                ->get()
                ->map(function ($log) {
                    return [
                        'id' => $log->id,
                        'user' => $log->user ? [
                            'id' => $log->user->id,
                            'name' => $log->user->name,
                            'email' => $log->user->email,
                        ] : null,
                        'ip_address' => $log->ip_address,
                        'user_agent' => $log->user_agent,
                        'device_name' => $log->device_name,
                        'login_at' => $log->login_at->format('Y-m-d H:i:s'),
                        'status' => $log->status,
                        'failure_reason' => $log->failure_reason,
                        'created_at' => $log->created_at->format('Y-m-d H:i:s'),
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Log login berhasil diambil',
                'data' => [
                    'logs' => $logs,
                    'total' => $total,
                    'limit' => $limit,
                    'offset' => $offset,
                ],
            ], 200);

        } catch (\Throwable $th) {
            return HttpStatus::code500($th->getMessage());
        }
    }

    public function createAdmin(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|max:255|unique:users,email',
                'password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $name = explode('@', $request->email)[0];

            // Create admin user
            $user = User::create([
                'name' => $name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'admin',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Akun admin berhasil dibuat',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
            ], 201);

        } catch (\Throwable $th) {
            return HttpStatus::code500($th->getMessage());
        }
    }
}
