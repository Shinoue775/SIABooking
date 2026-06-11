<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public readonly array $booking,
    ) {}

    /**
     * Get the message envelope (subject, from, etc.)
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Booking Confirmation - '.($this->booking['id'] ?? 'Reservation'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.booking_confirmation',
            with: ['booking' => $this->booking],
        );
    }
}
