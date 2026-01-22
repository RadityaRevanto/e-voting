<?php

namespace App\Helpers;

use App\Models\ActivityLog;

use function Symfony\Component\Clock\now;

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
    
    public static function createGuidelineLog ($info, $createdAt) {
        ActivityLog::create([
            'session' => session()->getId(),
            'info' => $info,
            'context' => 'vote guideline',
            'subject' => 'admin',
            'created_at' => $createdAt,
        ]);
    }
    
    public static function deleteGuidelineLog ($info) {
        ActivityLog::create([
            'session' => session()->getId(),
            'info' => $info,
            'context' => 'vote guideline',
            'subject' => 'admin',
            'created_at' => now(),
        ]);
    }
}