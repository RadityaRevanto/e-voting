<?php

namespace App\Http\Resources\Paslon;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaslonPreviewResource extends JsonResource
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
            'nama_ketua' => $this->nama_ketua,
            'nama_wakil_ketua' => $this->nama_wakil_ketua,
            'created_at' => $this->created_at
        ];
    }
}
