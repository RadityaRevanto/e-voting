<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Paslon extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'paslon';

    // app/Models/Paslon.php
    protected $fillable = [
        'user_id',
        'nama_ketua',
        'umur_ketua',
        'jurusan_ketua',
        'nama_wakil_ketua',
        'umur_wakil_ketua',
        'jurusan_wakil_ketua',
        'foto_paslon',
        'visi',
        'misi'
    ];

    public function votes() : HasMany {
        return $this->hasMany(Vote::class);
    }
}
