<?php

return [

    /*
    |--------------------------------------------------------------------------
    | QR Code Expiration Time
    |--------------------------------------------------------------------------
    |
    | Default expiration time for QR codes in minutes.
    | Default: 30 minutes
    |
    */

    'qr_code_expiration_minutes' => env('VOTING_QR_EXPIRATION', 30),

    /*
    |--------------------------------------------------------------------------
    | Maximum QR Code Expiration
    |--------------------------------------------------------------------------
    |
    | Maximum allowed expiration time for QR codes in minutes.
    | Default: 1440 minutes (24 hours)
    |
    */

    'max_qr_expiration_minutes' => env('VOTING_MAX_QR_EXPIRATION', 1440),

    /*
    |--------------------------------------------------------------------------
    | Minimum QR Code Expiration
    |--------------------------------------------------------------------------
    |
    | Minimum allowed expiration time for QR codes in minutes.
    | Default: 5 minutes
    |
    */

    'min_qr_expiration_minutes' => env('VOTING_MIN_QR_EXPIRATION', 5),

    /*
    |--------------------------------------------------------------------------
    | Enable Double Voting Prevention
    |--------------------------------------------------------------------------
    |
    | Prevent warga from voting multiple times.
    | Default: true
    |
    */

    'prevent_double_voting' => env('VOTING_PREVENT_DOUBLE', true),

    /*
    |--------------------------------------------------------------------------
    | Token Length
    |--------------------------------------------------------------------------
    |
    | Length of the generated token in characters.
    | Default: 64
    |
    */

    'token_length' => env('VOTING_TOKEN_LENGTH', 64),

];
