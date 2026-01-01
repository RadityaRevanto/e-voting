<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'misi' => 'array',
        ];
    }

    /**
     * Get the user that owns the paslon.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function votes() : HasMany {
        return $this->hasMany(Vote::class);
    }
}
