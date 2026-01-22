<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegisteredVote extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'registered_vote';

    protected $fillable = [
        'hashed_vote'
    ];
}

