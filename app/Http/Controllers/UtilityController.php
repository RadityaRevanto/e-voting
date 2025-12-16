<?php

namespace App\Http\Controllers;

use App\Models\Paslon;
use Illuminate\Http\Request;

class UtilityController extends Controller
{
    public function helloWorld() {
        $daftarPaslon = Paslon::all();
        
        return response()->json([
            'success' => true,
            'message' => "Hello, World!",
            'data' => $daftarPaslon,
        ], 200);
    }
}
