<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JsonResponseEnvelope
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $response instanceof JsonResponse) {
            return $response;
        }

        $original = $response->getData(true);
        $status = $response->getStatusCode();

        if (isset($original['success'])) {
            return $response;
        }

        if ($status >= 400) {
            $error = $original['message'] ?? 'An error occurred';
            $data = null;

            if (isset($original['errors'])) {
                $data = ['errors' => $original['errors']];
            }

            $response->setData([
                'success' => false,
                'data' => $data,
                'error' => $error,
            ]);
        } else {
            $response->setData([
                'success' => true,
                'data' => $original,
                'error' => null,
            ]);
        }

        return $response;
    }
}
