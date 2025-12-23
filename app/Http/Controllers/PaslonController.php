<?php

namespace App\Http\Controllers;

use App\Models\Paslon;
use App\Models\User;
use App\Helpers\HttpStatus;
use App\Http\Resources\Paslon\PaslonPreviewResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class PaslonController extends Controller
{
    // app/Http/Controllers/PaslonController.php
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:64',
            'email' => 'required|email|unique:App\Models\User,email',
            'password' => 'required',
            'confirm_password' => 'required|same:password',
            'nama_ketua' => 'required|string|max:100',
            'umur_ketua' => 'nullable|integer|min:1|max:100',
            'jurusan_ketua' => 'nullable|string|max:50',
            'nama_wakil_ketua' => 'required|string|max:100',
            'umur_wakil_ketua' => 'nullable|integer|min:1|max:100',
            'jurusan_wakil_ketua' => 'nullable|string|max:50',
            'foto_paslon' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'visi' => 'nullable|string',
            'misi' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        if ($request->password != $request->confirm_password) {
            return response()->json([
                'success' => false,
                'message' => 'Confirm password harus sama dengan password',
                'errors' => [
                    'confirm_password' => ['Confirm password harus sama dengan password']
                ],
            ], 422);
        }

        try {
            $user = User::create([
                'name' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'paslon'
            ]);

            // Handle upload foto paslon
            $fotoPath = null;
            if ($request->hasFile('foto_paslon')) {
                $foto = $request->file('foto_paslon');
                $fotoName = time() . '_' . $foto->getClientOriginalName();
                $fotoPath = $foto->storeAs('paslon', $fotoName, 'public');
            }

            $paslon = Paslon::create([
                'user_id' => $user->id,
                'nama_ketua' => $request->nama_ketua,
                'umur_ketua' => $request->umur_ketua,
                'jurusan_ketua' => $request->jurusan_ketua,
                'nama_wakil_ketua' => $request->nama_wakil_ketua,
                'umur_wakil_ketua' => $request->umur_wakil_ketua,
                'jurusan_wakil_ketua' => $request->jurusan_wakil_ketua,
                'foto_paslon' => $fotoPath,
                'visi' => $request->visi,
                'misi' => $request->misi,
            ]);

            return response()->json([
                'success' => true,
                'message' => "Berhasil buat akun untuk PASLON",
                'data' => [
                    'user' => $user,
                    'paslon' => $paslon,
                ],
            ], 200);
        } catch (\Throwable $th) {
            return HttpStatus::code500($th);
        }
    }

    public function index() {
        $paslon = Paslon::all();
        return response()->json([
            'success' => true,
            'message' => "Menampilkan data preview PASLON",
            'data' => PaslonPreviewResource::collection($paslon),
        ], 200);
    }

    public function show(int $id) {
        $paslon = Paslon::find($id);

        if (is_null($paslon)) return HttpStatus::code404();

        return response()->json([
            'success' => true,
            'message' => "Menampilkan data PASLON $id",
            'data' => $paslon,
        ], 200);
    }

    public function deleteById(int $id) {
        try {
            $paslon = Paslon::find($id);

            if (is_null($paslon)) return HttpStatus::code404();

            $user = User::find($paslon->user_id);
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => "PASLON berhasil di hapus",
                'data' => $user,
            ], 200);
        } catch (\Throwable $th) {
            return HttpStatus::code500($th);
        }
    }
    // app/Http/Controllers/PaslonController.php
    public function updateVisiMisi(Request $request) {
        $validator = Validator::make($request->all(), [
            'visi' => 'nullable|string',
            'misi' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Ambil user yang sedang login
            $user = $request->user();

            if (!$user || $user->role !== 'paslon') {
                return HttpStatus::code403('Akses ditolak. Hanya paslon yang bisa mengupdate visi misi.');
            }

            // Cari data paslon berdasarkan user_id
            $paslon = Paslon::where('user_id', $user->id)->first();

            if (is_null($paslon)) {
                return HttpStatus::code404('Data paslon tidak ditemukan');
            }

            // Update hanya visi dan misi
            $paslon->update([
                'visi' => $request->visi,
                'misi' => $request->misi,
            ]);

            return response()->json([
                'success' => true,
                'message' => "Visi dan misi berhasil diupdate",
                'data' => $paslon,
            ], 200);
        } catch (\Throwable $th) {
            return HttpStatus::code500($th);
        }
    }

    public function test() {
        return redirect('api/hello-world');
    }
}
