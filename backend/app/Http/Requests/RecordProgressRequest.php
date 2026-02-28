<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RecordProgressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->id === $this->route('child')->parent_id;
    }

    public function rules(): array
    {
        return [
            'module_type' => ['required', 'string', 'in:letter_tracing,number_tracing,matching,coloring,free_drawing,memory_cards,puzzles,fill_the_gaps,sorting,abc_puzzles,cooking'],
            'item_identifier' => ['required', 'string', 'max:100'],
            'status' => ['required', 'string', 'in:attempted,completed'],
            'metadata' => ['sometimes', 'array'],
            'duration_seconds' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
