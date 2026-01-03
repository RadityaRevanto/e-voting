<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->user->id,
            'username' => $this->user->name,
            'email' => $this->user->email,
            'role' => $this->user->role,
            'foto_admin' => $this->foto_path,
        ];
    }
}
