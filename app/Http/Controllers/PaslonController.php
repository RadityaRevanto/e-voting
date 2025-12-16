<?php

namespace App\Http\Controllers;

use App\Helpers\HttpStatus;
use App\Http\Resources\Paslon\PaslonPreviewResource;
use App\Models\Paslon;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class PaslonController extends Controller
{
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:64',
            'email' => 'required|email|unique:App\Models\User,email',
            'password' => 'required',
            'confirm_password' => 'required',
            'nama_ketua' => 'required|string|max:100',
            'nama_wakil_ketua' => 'required|string|max:100'
        ]);
        if ($validator->fails()) return HttpStatus::code422($validator->errors());

        if ($request->password != $request->confirm_password) {
            return HttpStatus::code422('Confirm password harus sama dengan password');
        }

        try {
            $user = User::create([
                'name' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'paslon'
            ]); 

            $paslon = Paslon::create([
                'user_id' => $user->id,
                'nama_ketua' => $request->nama_ketua,
                'jurusan_ketua' => $request->jurusan_ketua,
                'nama_wakil_ketua' => $request->nama_wakil_ketua,
                'jurusan_wakil_ketua' => $request->jurusan_wakil_ketua,
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


    public function test() {
        return redirect('api/hello-world');
    }
}
