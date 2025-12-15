<?php

namespace App\Http\Controllers;

use App\Models\Paslon;
use Illuminate\Http\Request;

class PaslonController extends Controller
{
    public function getVotes(int $id) {
        return response()->json([
            'success' => true,
            'message' => "Vote berhasil dibuat",
            'data' => Paslon::find($id)->votes->count(),
        ], 200);
    }
}
