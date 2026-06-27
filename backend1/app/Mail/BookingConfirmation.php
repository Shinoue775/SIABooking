<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public array $booking;

    /**
     * Create a new message instance.
     */
    public function __construct(array $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $subject = 'Booking Confirmation - ' . ($this->booking['id'] ?? 'Reservation');

        return $this->subject($subject)
            ->view('emails.booking_confirmation')
            ->with(['booking' => $this->booking]);
    }
}
