<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FotoAdmin extends Model
{
    protected $table = 'foto_admins';

    protected $fillable = [
        'user_id',
        'foto_path',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
