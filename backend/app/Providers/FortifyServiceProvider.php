<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Laravel\Fortify\Contracts\PasswordResetResponse as PasswordResetResponseContract;
use Laravel\Fortify\Contracts\SuccessfulPasswordResetLinkRequestResponse as ResetLinkResponseContract;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->instance(RegisterResponseContract::class, new class implements RegisterResponseContract {
            public function toResponse($request): JsonResponse
            {
                $user = $request->user();
                return response()->json(['id' => $user->id, 'email' => $user->email], 201);
            }
        });

        $this->app->instance(LoginResponseContract::class, new class implements LoginResponseContract {
            public function toResponse($request): JsonResponse
            {
                $user = $request->user();
                return response()->json(['id' => $user->id, 'email' => $user->email]);
            }
        });

        $this->app->instance(LogoutResponseContract::class, new class implements LogoutResponseContract {
            public function toResponse($request): JsonResponse
            {
                return response()->json(null);
            }
        });

        $this->app->instance(PasswordResetResponseContract::class, new class implements PasswordResetResponseContract {
            public function toResponse($request): JsonResponse
            {
                return response()->json(null);
            }
        });

        $this->app->instance(ResetLinkResponseContract::class, new class implements ResetLinkResponseContract {
            public function toResponse($request): JsonResponse
            {
                return response()->json(['message' => 'Reset link sent']);
            }
        });
    }

    public function boot(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(
                Str::lower($request->input(Fortify::username())).'|'.$request->ip()
            );

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}
