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
    
    public static function createRegisterPaslonLog ($info, $createdAt) {
        ActivityLog::create([
            'session' => session()->getId(),
            'info' => $info,
            'context' => 'register paslon',
            'subject' => 'admin',
            'created_at' => $createdAt,
        ]);
    }
    
    public static function createVisiMisiLog ($info, $createdAt) {
        ActivityLog::create([
            'session' => session()->getId(),
            'info' => $info,
            'context' => 'udpate visi misi',
            'subject' => 'paslon',
            'created_at' => $createdAt,
        ]);
    }

    public static function createChangePasswordLog ($info, $subject, $createdAt) {
        ActivityLog::create([
            'session' => session()->getId(),
            'info' => $info,
            'context' => 'change password',
            'subject' => $subject,
            'created_at' => $createdAt,
        ]);
    }
}