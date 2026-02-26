<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\ParentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class RegisteredUserController extends Controller
{
    public function store(
        Request $request,
        CreatesNewUsers $creator
    ): JsonResponse {
        /** @var ParentUser $user */
        $user = $creator->create($request->all());

        auth()->login($user);

        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
        ], 201);
    }
}
