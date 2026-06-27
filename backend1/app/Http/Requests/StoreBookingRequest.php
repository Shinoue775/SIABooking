<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $amenities = $this->input('amenities');

        if (is_string($amenities)) {
            $amenities = array_values(array_filter(array_map('trim', explode(',', $amenities))));
        }

        $this->merge([
            'room_id' => $this->toInt($this->input('room_id', $this->input('roomId'))),
            'room_type' => $this->input('room_type', $this->input('roomType')),
            'start_at' => $this->input('start_at', $this->input('startAt')),
            'end_at' => $this->input('end_at', $this->input('endAt')),
            'guests' => $this->toInt($this->input('guests')),
            'amenities' => is_array($amenities) ? $amenities : [],
            'has_pwd' => $this->toBool($this->input('has_pwd', $this->input('hasPwd'))),
            'has_senior' => $this->toBool($this->input('has_senior', $this->input('hasSenior'))),
            'has_child' => $this->toBool($this->input('has_child', $this->input('hasChild'))),
            'child_age_group' => $this->input('child_age_group', $this->input('childAgeGroup')),
            'extra_beds' => $this->toInt($this->input('extra_beds', $this->input('extraBeds'))),
            'total_price' => $this->toFloat($this->input('total_price', $this->input('totalPrice'))),
            'payment_method' => $this->input('payment_method', $this->input('paymentMethod')),
            'amount_paid' => $this->toFloat($this->input('amount_paid', $this->input('amountPaid'))),
            'balance_due' => $this->toFloat($this->input('balance_due', $this->input('balanceDue'))),
            'payment_choice' => $this->input('payment_choice', $this->input('paymentChoice')),
            'guest_email' => $this->input('guest_email', $this->input('email')),
        ]);
    }

    public function rules(): array
    {
        return [
            'room_id' => ['required', 'integer', 'min:1'],
            'room_type' => ['nullable', Rule::in(['deluxe', 'standard'])],
            'start_at' => ['required', 'date'],
            'end_at' => ['required', 'date'],
            'guests' => ['nullable', 'integer', 'min:1'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['integer', 'min:1', 'distinct'],
            'has_pwd' => ['nullable', 'boolean'],
            'has_senior' => ['nullable', 'boolean'],
            'has_child' => ['nullable', 'boolean'],
            'child_age_group' => ['nullable', Rule::in(['under2', 'over2'])],
            'extra_beds' => ['nullable', 'integer', 'min:0', 'max:2'],
            'total_price' => ['required', 'numeric', 'gt:0'],
            'payment_method' => ['nullable', Rule::in(['cash', 'gcash'])],
            'amount_paid' => ['nullable', 'numeric', 'min:0'],
            'balance_due' => ['nullable', 'numeric', 'min:0'],
            'payment_choice' => ['nullable', 'string', 'max:50'],
            'guest_email' => ['nullable', 'email'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $startAt = strtotime((string) $this->input('start_at'));
            $endAt = strtotime((string) $this->input('end_at'));

            if ($startAt === false || $endAt === false || $endAt <= $startAt) {
                $validator->errors()->add('end_at', 'end_at must be later than start_at.');
            }

            if (($this->boolean('has_child') === false) && $this->filled('child_age_group')) {
                $validator->errors()->add('child_age_group', 'child_age_group requires has_child to be true.');
            }

            $totalPrice = (float) $this->input('total_price');
            $amountPaid = (float) ($this->input('amount_paid') ?? 0);
            $balanceDue = (float) ($this->input('balance_due') ?? max($totalPrice - $amountPaid, 0));

            if ($amountPaid > $totalPrice) {
                $validator->errors()->add('amount_paid', 'amount_paid cannot be greater than total_price.');
            }

            if (abs($balanceDue - max($totalPrice - $amountPaid, 0)) > 0.01) {
                $validator->errors()->add('balance_due', 'balance_due must match total_price minus amount_paid.');
            }
        });
    }

    public function validatedPayload(): array
    {
        $validated = $this->validated();
        $validated['amenities'] = array_map('intval', $validated['amenities'] ?? []);

        return $validated;
    }

    private function toInt(mixed $value): mixed
    {
        if ($value === null || $value === '') {
            return null;
        }

        return is_numeric($value) ? (int) $value : $value;
    }

    private function toFloat(mixed $value): mixed
    {
        if ($value === null || $value === '') {
            return null;
        }

        return is_numeric($value) ? (float) $value : $value;
    }

    private function toBool(mixed $value): mixed
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_bool($value)) {
            return $value;
        }

        return filter_var($value, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE);
    }
}
