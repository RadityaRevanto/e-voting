<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warga extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'warga';

    protected $fillable = [
        'nik',
    ];
}

