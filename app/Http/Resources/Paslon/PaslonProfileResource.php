<?php

namespace App\Http\Resources\Paslon;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaslonProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'username' => $this->user->name,
            'email' => $this->user->email,
            'nama_ketua' => $this->nama_ketua,
            'umur_ketua' => $this->umur_ketua,
            'jurusan_ketua' => $this->jurusan_ketua,
            'nama_wakil_ketua' => $this->nama_wakil_ketua,
            'umur_wakil_ketua' => $this->umur_wakil_ketua,
            'jurusan_wakil_ketua' => $this->jurusan_wakil_ketua,
            'foto_paslon' => $this->foto_paslon,
            'visi' => $this->visi,
            'misi' => $this->misi,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
