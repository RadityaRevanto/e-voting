<?php

namespace App\Http\Controllers;

use App\Helpers\HttpStatus;
use App\Models\Warga;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WargaController extends Controller
{
    public function registerNIK(Request $request) {
        // Validate
        $validator = Validator::make($request->all(), [
            'nik' => 'required|integer|digits:16',
        ]);
        if ($validator->fails()) return HttpStatus::code422();

        try {
            $hashNik = hash('sha256', $request->nik);
            if (Warga::where('nik', $hashNik)->exists()) return HttpStatus::code422();

            Warga::create(['nik' => $hashNik]);
        } catch (\Throwable $th) {
            return HttpStatus::code400($th);
        }

        return response()->json([
            'success' => true,
            'message' => "Berhasil Register NIK",
            'data' => [],
        ], 200);
    }
}
