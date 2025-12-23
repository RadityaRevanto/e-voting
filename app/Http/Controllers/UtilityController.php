<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UtilityController extends Controller
{
    public function helloWorld(Request $request) {
        return response()->json([
            'success' => true,
            'message' => "Hello, World!",
            'data' => $request->user(),
        ], 200);
    }
}
