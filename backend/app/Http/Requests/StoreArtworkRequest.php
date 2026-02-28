<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreArtworkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->id === $this->route('child')->parent_id;
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:webp,png', 'max:5120'],
            'activity_type' => ['required', 'string', 'in:coloring,free_drawing,abc_puzzles,cooking'],
        ];
    }
}
