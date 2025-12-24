<?php

namespace App\Helpers;

class HttpStatus
{
    public static function code400 (String $message = "Bad request"){
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => [],
        ], 400);
    }
    
    public static function code403 (String $message = "Forbidden"){
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => [],
        ], 403);
    }
    
    public static function code404 (String $message = "Not found"){
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => [],
        ], 404);
    }
    
    public static function code409 (String $message = "Conflict"){
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => [],
        ], 409);
    }
    
    public static function code422 (String $message = "Unprocessable Entity"){
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => [],
        ], 422);
    }
    
    public static function code500 (String $message = "Something Wrong"){
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => [],
        ], 500);
    }
}