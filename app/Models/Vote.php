<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    const UPDATED_AT = null;
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'vote';

    protected $fillable = [
        'warga_nik',
        'paslon_id',
    ];

}

