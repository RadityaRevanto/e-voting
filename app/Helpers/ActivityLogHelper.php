<?php

namespace App\Helpers;

use App\Models\ActivityLog;

class ActivityLogHelper
{
    public static function createVoteLog ($info, $createdAt) {
        ActivityLog::create([
            'session' => session()->getId(),
            'info' => $info,
            'context' => 'vote',
            'subject' => 'voter',
            'created_at' => $createdAt,
        ]);
    }
}