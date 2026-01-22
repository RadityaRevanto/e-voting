<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warga extends Model
{
    protected $table = 'warga';
    protected $primaryKey = 'nik';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = true;
    const UPDATED_AT = null;

    protected $fillable = [
        'nik',
    ];
}

