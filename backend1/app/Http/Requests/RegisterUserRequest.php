<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'full_name' => $this->input('full_name', $this->input('fullName')),
        ]);
    }

    public function rules(): array
    {
        return [
            'id'        => ['required', 'uuid'],
            'email'     => ['required', 'email'],
            'full_name' => ['required', 'string', 'max:255'],
            'fname'     => ['nullable', 'string', 'max:100'],
            'lname'     => ['nullable', 'string', 'max:100'],
            'phone'     => ['nullable', 'string', 'max:50'],
            'address'   => ['nullable', 'string', 'max:1000'],
            'role'      => ['nullable', Rule::in(['user', 'staff', 'admin'])],
        ];
    }

    public function validated($key = null, $default = null): array
    {
        $validated = parent::validated($key, $default);
        $validated['role'] ??= 'user';

        return $validated;
    }
}
