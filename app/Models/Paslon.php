<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paslon extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'paslon';

    protected $fillable = [
        'id',
        'nama_ketua',
        'nama_wakil_ketua',
        'visi',
        'misi'
    ];
}
