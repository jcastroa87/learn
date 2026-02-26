<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChildProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->childProfiles()->count() < 5;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'age' => ['required', 'integer', 'min:2', 'max:8'],
            'avatar' => ['required', 'string', 'max:100'],
            'language' => ['required', 'string', 'in:es,ru,en'],
        ];
    }
}
