<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChildProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->id === $this->route('child')->parent_id;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:100'],
            'age' => ['sometimes', 'integer', 'min:2', 'max:8'],
            'avatar' => ['sometimes', 'string', 'max:100'],
            'language' => ['sometimes', 'string', 'in:es,ru,en'],
        ];
    }
}
