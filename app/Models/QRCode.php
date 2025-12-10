<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QRCode extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'qr_codes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'token',
        'qr_data',
        'qr_signature',
        'generated_at',
        'scanned_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'generated_at' => 'datetime',
        'scanned_at' => 'datetime',
    ];

    /**
     * Get the voting token that owns the QR code.
     */
    public function votingToken(): BelongsTo
    {
        return $this->belongsTo(VotingToken::class, 'token', 'token');
    }

    /**
     * Mark the QR code as scanned.
     */
    public function markAsScanned(): void
    {
        $this->update([
            'scanned_at' => now(),
        ]);
    }
}
