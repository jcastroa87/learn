<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();

        // Cascade soft-delete all child data
        foreach ($user->childProfiles as $child) {
            $child->progressRecords()->delete();
            $child->artworks()->delete();
            $child->cosmetics()->detach();
            $child->sessionConfig?->delete();
            $child->delete();
        }

        auth()->guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $user->delete();

        return response()->json(null);
    }
}
