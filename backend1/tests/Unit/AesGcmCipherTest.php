<?php

namespace Tests\Unit;

use App\Services\AesGcmCipher;
use InvalidArgumentException;
use Tests\TestCase;

class AesGcmCipherTest extends TestCase
{
    public function test_it_encrypts_and_decrypts_payloads(): void
    {
        config()->set('app.key', 'base64:'.base64_encode(random_bytes(32)));
        config()->set('siabooking.data_encryption_key', config('app.key'));

        $cipher = new AesGcmCipher;
        $payload = [
            'room_id' => 7,
            'guest' => 'Alice',
            'price' => 4999.5,
        ];

        $encrypted = $cipher->encrypt($payload);

        $this->assertNotSame(json_encode($payload), $encrypted);
        $this->assertSame($payload, $cipher->decrypt($encrypted));
    }

    public function test_it_rejects_tampered_payloads(): void
    {
        config()->set('app.key', 'base64:'.base64_encode(random_bytes(32)));
        config()->set('siabooking.data_encryption_key', config('app.key'));

        $cipher = new AesGcmCipher;
        $encrypted = $cipher->encrypt(['secure' => true]);
        $tampered = substr($encrypted, 0, -4).'AAAA';

        $this->expectException(InvalidArgumentException::class);

        $cipher->decrypt($tampered);
    }
}
