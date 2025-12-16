<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    const UPDATED_AT = null;
    
    protected $fillable = [
        'session',
        'info',
        'context',
        'subject',
        'created_at',
    ];
}
