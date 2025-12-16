<?php

namespace App\Services;

use App\Models\QRCode;
use App\Models\VotingToken;
use App\Models\Warga;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class QRCodeService
{
    protected CryptographicService $cryptoService;

    public function __construct(CryptographicService $cryptoService)
    {
        $this->cryptoService = $cryptoService;
    }

    /**
     * Generate secure QR code for a warga.
     *
     * @param string $wargaNik
     * @param int $expirationMinutes
     * @return array
     * @throws \Exception
     */
    public function generateSecureQRCode(string $wargaNik, int $expirationMinutes = 30): array
    {
        // Validate warga exists
        if (!Warga::where('nik', $wargaNik)->exists()) {
            throw new \Exception('NIK not found');
        }

        // Check if warga already has an active token
        $existingToken = VotingToken::where('warga_nik', $wargaNik)
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->first();

        if ($existingToken) {
            throw new \Exception('Warga already has an active voting token');
        }

        // Generate token and nonce
        $token = $this->cryptoService->generateSecureToken();
        $nonce = $this->cryptoService->generateNonce();
        $expiresAt = now()->addMinutes($expirationMinutes);

        // Create signature data
        $signatureData = $token . '|' . $wargaNik . '|' . $nonce . '|' . $expiresAt->toIso8601String();
        $signature = $this->cryptoService->generateHMAC($signatureData);

        // Save voting token
        $votingToken = VotingToken::create([
            'token' => $token,
            'warga_nik' => $wargaNik,
            'nonce' => $nonce,
            'signature' => $signature,
            'expires_at' => $expiresAt,
            'is_used' => false,
        ]);

        // Prepare QR code data
        $qrData = [
            'token' => $token,
            'warga_nik' => $wargaNik,
            'nonce' => $nonce,
            'expires_at' => $expiresAt->toIso8601String(),
        ];

        // Encrypt QR data
        $encryptedQRData = $this->cryptoService->encrypt($qrData);

        // Generate QR signature
        $qrSignature = $this->cryptoService->generateHMAC($encryptedQRData);

        // Save QR code record
        $qrCode = QRCode::create([
            'token' => $token,
            'qr_data' => $encryptedQRData,
            'qr_signature' => $qrSignature,
            'generated_at' => now(),
        ]);

        // Prepare final QR code content (to be encoded as QR image)
        $qrCodeContent = json_encode([
            'data' => $encryptedQRData,
            'signature' => $qrSignature,
        ]);

        return [
            'token' => $token,
            'qr_code_content' => $qrCodeContent,
            'qr_code_id' => $qrCode->id,
            'expires_at' => $expiresAt->toIso8601String(),
            'warga_nik' => $wargaNik,
        ];
    }

    /**
     * Validate QR code data.
     *
     * @param string $qrCodeContent
     * @return array
     * @throws \Exception
     */
    public function validateQRCode(string $qrCodeContent): array
    {
        try {
            // Parse QR code content
            $qrData = json_decode($qrCodeContent, true);

            if (!isset($qrData['data']) || !isset($qrData['signature'])) {
                throw new \Exception('Invalid QR code format');
            }

            $encryptedData = $qrData['data'];
            $signature = $qrData['signature'];

            // Verify QR signature
            if (!$this->cryptoService->verifyHMAC($encryptedData, $signature)) {
                throw new \Exception('QR code signature verification failed - possible tampering');
            }

            // Decrypt QR data
            $decryptedData = $this->cryptoService->decrypt($encryptedData);

            if (!isset($decryptedData['token'])) {
                throw new \Exception('Invalid QR code data structure');
            }

            $token = $decryptedData['token'];

            // Find voting token
            $votingToken = VotingToken::where('token', $token)->first();

            if (!$votingToken) {
                throw new \Exception('Token not found');
            }

            // Check if token is valid
            if (!$votingToken->isValid()) {
                if ($votingToken->is_used) {
                    throw new \Exception('Token has already been used');
                }
                if ($votingToken->isExpired()) {
                    throw new \Exception('Token has expired');
                }
            }

            // Verify token signature
            $signatureData = $votingToken->token . '|' . $votingToken->warga_nik . '|' . 
                           $votingToken->nonce . '|' . $votingToken->expires_at->toIso8601String();
            
            if (!$this->cryptoService->verifyHMAC($signatureData, $votingToken->signature)) {
                throw new \Exception('Token signature verification failed');
            }

            return [
                'valid' => true,
                'token' => $token,
                'warga_nik' => $votingToken->warga_nik,
                'expires_at' => $votingToken->expires_at->toIso8601String(),
                'message' => 'QR code is valid',
            ];

        } catch (\Exception $e) {
            Log::error('QR code validation failed', [
                'error' => $e->getMessage(),
                'qr_content' => substr($qrCodeContent, 0, 100), // Log first 100 chars only
            ]);

            throw $e;
        }
    }

    /**
     * Mark QR code as used.
     *
     * @param string $token
     * @return void
     */
    public function markQRCodeAsUsed(string $token): void
    {
        $votingToken = VotingToken::where('token', $token)->first();

        if ($votingToken) {
            $votingToken->markAsUsed();
            
            // Mark QR code as scanned
            $qrCode = $votingToken->qrCode;
            if ($qrCode) {
                $qrCode->markAsScanned();
            }
        }
    }

    /**
     * Check if QR code is valid (not expired, not used).
     *
     * @param string $token
     * @return bool
     */
    public function isQRCodeValid(string $token): bool
    {
        $votingToken = VotingToken::where('token', $token)->first();

        if (!$votingToken) {
            return false;
        }

        return $votingToken->isValid();
    }
}
