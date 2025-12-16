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

    protected $fillable = [
        'id',
        'nama_ketua',
        'nama_wakil_ketua',
        'visi',
        'misi'
    ];

    public function votes() : HasMany {
        return $this->hasMany(Vote::class);
    }
}
