<?php

namespace App\Services;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;

class CryptographicService
{
    /**
     * Generate a cryptographically secure random token.
     *
     * @param int $length
     * @return string
     */
    public function generateSecureToken(int $length = 64): string
    {
        return bin2hex(random_bytes($length / 2));
    }

    /**
     * Generate a cryptographically secure nonce.
     *
     * @return string
     */
    public function generateNonce(): string
    {
        return bin2hex(random_bytes(32));
    }

    /**
     * Generate HMAC-SHA256 signature for data.
     *
     * @param string $data
     * @param string|null $key
     * @return string
     */
    public function generateHMAC(string $data, ?string $key = null): string
    {
        $key = $key ?? config('app.key');
        return hash_hmac('sha256', $data, $key);
    }

    /**
     * Verify HMAC-SHA256 signature.
     *
     * @param string $data
     * @param string $signature
     * @param string|null $key
     * @return bool
     */
    public function verifyHMAC(string $data, string $signature, ?string $key = null): bool
    {
        $expectedSignature = $this->generateHMAC($data, $key);
        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Encrypt data using AES-256-GCM (via Laravel's Crypt).
     *
     * @param mixed $data
     * @return string
     */
    public function encrypt($data): string
    {
        return Crypt::encryptString(json_encode($data));
    }

    /**
     * Decrypt data.
     *
     * @param string $encryptedData
     * @return mixed
     * @throws \Illuminate\Contracts\Encryption\DecryptException
     */
    public function decrypt(string $encryptedData)
    {
        $decrypted = Crypt::decryptString($encryptedData);
        return json_decode($decrypted, true);
    }

    /**
     * Generate digital signature for vote data.
     *
     * @param array $voteData
     * @return string
     */
    public function generateVoteSignature(array $voteData): string
    {
        $dataString = implode('|', $voteData);
        return $this->generateHMAC($dataString);
    }

    /**
     * Verify vote signature.
     *
     * @param array $voteData
     * @param string $signature
     * @return bool
     */
    public function verifyVoteSignature(array $voteData, string $signature): bool
    {
        return $this->verifyHMAC(implode('|', $voteData), $signature);
    }
}
