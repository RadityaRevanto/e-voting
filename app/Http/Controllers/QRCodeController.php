<?php

namespace App\Http\Controllers;

use App\Services\QRCodeService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class QRCodeController extends Controller
{
    protected QRCodeService $qrCodeService;

    public function __construct(QRCodeService $qrCodeService)
    {
        $this->qrCodeService = $qrCodeService;
    }

    /**
     * Generate QR code for a warga (Admin only).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function generate(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'warga_nik' => 'required|string|max:64',
                'expiration_minutes' => 'nullable|integer|min:5|max:1440', // 5 min to 24 hours
            ]);

            $expirationMinutes = $request->input('expiration_minutes', 10);

            $result = $this->qrCodeService->generateSecureQRCode(
                hash('sha256', $request->warga_nik),
                $expirationMinutes
            );

            return response()->json([
                'success' => true,
                'message' => 'QR code generated successfully',
                'data' => [
                    'token' => $result['token'],
                    'qr_code_content' => $result['qr_code_content'],
                    'qr_code_id' => $result['qr_code_id'],
                    'expires_at' => $result['expires_at'],
                    'warga_nik' => $result['warga_nik'],
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('QR code generation failed', [
                'error' => $e->getMessage(),
                'warga_nik' => $request->warga_nik ?? 'unknown',
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Validate scanned QR code.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function validate(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'qr_code_content' => 'required|string',
            ]);

            $result = $this->qrCodeService->validateQRCode($request->qr_code_content);

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => [
                    'valid' => $result['valid'],
                    'token' => $result['token'],
                    'warga_nik' => $result['warga_nik'],
                    'expires_at' => $result['expires_at'],
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => [
                    'valid' => false,
                ],
            ], 400);
        }
    }

    /**
     * Get QR code status by token.
     *
     * @param string $token
     * @return JsonResponse
     */
    public function status(string $token): JsonResponse
    {
        try {
            $isValid = $this->qrCodeService->isQRCodeValid($token);

            return response()->json([
                'success' => true,
                'data' => [
                    'token' => $token,
                    'is_valid' => $isValid,
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
