<?php

namespace App\Actions\Fortify;

use App\Models\ParentUser;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * @param  array<string, string>  $input
     *
     * @throws ValidationException
     */
    public function create(array $input): ParentUser
    {
        Validator::make($input, [
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('parents'),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        return ParentUser::create([
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]);
    }
}
