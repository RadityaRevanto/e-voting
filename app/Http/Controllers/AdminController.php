<?php

namespace App\Http\Controllers;

use App\Helpers\HttpStatus;
use App\Http\Resources\Admin\AdminProfileResource;
use App\Models\FotoAdmin;
use App\Models\Paslon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function profile(Request $request) {
        $user = $request->user();
        $foto = FotoAdmin::where('user_id', $user->id)->first();

        return response()->json([
            'success' => true,
            'message' => 'Data user berhasil diambil',
            'data' => AdminProfileResource::make($foto),
        ], 200);
    }

    public function onlyPhoto(Request $request) {
        $user = $request->user();
        $foto = FotoAdmin::where('user_id', $user->id)->first();

        return response()->json([
            'success' => true,
            'message' => 'Data user berhasil diambil',
            'data' => [
                'foto_admin' => $foto->foto_path
            ],
        ], 200);
    }

    public function edit(Request $request) {
        $validator = Validator::make($request->all(), [
            'username' => 'nullable|string|max:64',
            'foto_path' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) HttpStatus::code422($validator->errors());

        try {
            $user = $request->user();
            $fotoAdmin = FotoAdmin::where('user_id', $user->id)->first();

            // Update data paslon
            if (!is_null($request->username)) {
                $user->name = $request->username;
                $user->save();
            }

            if(!is_null($request->foto_path)) $fotoAdmin->foto_path = $request->foto_path;

            // Handle upload foto paslon
            if ($request->hasFile('foto_path')) {
                $foto = $request->file('foto_path');
                $fotoName = time() . '_' . $foto->getClientOriginalName();
                $fotoPath = $foto->storeAs('admin', $fotoName, 'public');
                $fotoAdmin->foto_path = $fotoPath;
            }

            $fotoAdmin->save();

            return response()->json([
                'success' => true,
                'message' => "Update profile PASLON berhasil",
                'data' => AdminProfileResource::make($fotoAdmin),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate profile: ' . $e->getMessage(),
            ], 500);
        }
    }
}
