<?php

namespace App\Services;

use InvalidArgumentException;
use JsonException;
use RuntimeException;

class AesGcmCipher
{
    private const CIPHER = 'aes-256-gcm';

    private const IV_LENGTH = 12;

    private const TAG_LENGTH = 16;

    public function encrypt(mixed $value): string
    {
        $iv = random_bytes(self::IV_LENGTH);
        $tag = '';
        $plaintext = json_encode($value, JSON_THROW_ON_ERROR);
        $ciphertext = openssl_encrypt(
            $plaintext,
            self::CIPHER,
            $this->resolveKey(),
            OPENSSL_RAW_DATA,
            $iv,
            $tag,
            '',
            self::TAG_LENGTH,
        );

        if ($ciphertext === false) {
            throw new RuntimeException('Unable to encrypt payload.');
        }

        return base64_encode(json_encode([
            'iv' => base64_encode($iv),
            'tag' => base64_encode($tag),
            'value' => base64_encode($ciphertext),
        ], JSON_THROW_ON_ERROR));
    }

    public function decrypt(string $payload): mixed
    {
        try {
            $decoded = json_decode(base64_decode($payload, true) ?: '', true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            throw new InvalidArgumentException('Encrypted payload is malformed.');
        }

        $iv = base64_decode((string) ($decoded['iv'] ?? ''), true);
        $tag = base64_decode((string) ($decoded['tag'] ?? ''), true);
        $value = base64_decode((string) ($decoded['value'] ?? ''), true);

        if ($iv === false || $tag === false || $value === false) {
            throw new InvalidArgumentException('Encrypted payload is malformed.');
        }

        $plaintext = openssl_decrypt(
            $value,
            self::CIPHER,
            $this->resolveKey(),
            OPENSSL_RAW_DATA,
            $iv,
            $tag,
        );

        if ($plaintext === false) {
            throw new InvalidArgumentException('Encrypted payload authentication failed.');
        }

        try {
            return json_decode($plaintext, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            throw new InvalidArgumentException('Encrypted payload could not be decoded.');
        }
    }

    private function resolveKey(): string
    {
        $configuredKey = (string) (config('siabooking.data_encryption_key') ?: config('app.key'));

        if (str_starts_with($configuredKey, 'base64:')) {
            $decoded = base64_decode(substr($configuredKey, 7), true);

            if ($decoded !== false) {
                return strlen($decoded) === 32 ? $decoded : hash('sha256', $decoded, true);
            }
        }

        return strlen($configuredKey) === 32 ? $configuredKey : hash('sha256', $configuredKey, true);
    }
}
