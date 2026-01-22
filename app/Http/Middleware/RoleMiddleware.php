<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Models\Paslon;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
                'data' => [],
            ], 401);
        }

        // Tentukan role user
        $userRole = null;
        if ($user instanceof User) {
            $userRole = $user->role;
        } elseif ($user instanceof Paslon) {
            $userRole = 'paslon';
        }

        // ⚠️ PENTING: Exact match only - tidak ada akses implisit antar role
        // super_admin TIDAK otomatis memiliki akses admin
        // Jika route memerlukan 'admin' DAN 'super_admin', harus didefinisikan eksplisit: role:admin,super_admin
        $allowedRoles = $roles;
        
        // Cek apakah user memiliki role yang diizinkan (exact match)
        if (!in_array($userRole, $allowedRoles)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Role tidak sesuai.',
                'data' => [],
            ], 403);
        }

        return $next($request);
    }
}
