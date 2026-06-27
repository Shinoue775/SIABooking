<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Confirmation</title>
</head>
<body>
    <h2>Booking Confirmation</h2>
    <p>Thank you for your reservation. Below are your booking details:</p>

    <ul>
        <li><strong>Booking ID:</strong> {{ $booking['id'] ?? 'N/A' }}</li>
        <li><strong>Room:</strong> {{ $booking['room_type'] ?? 'N/A' }}</li>
        <li><strong>Check-in:</strong> {{ $booking['start_at'] ?? 'N/A' }}</li>
        <li><strong>Check-out:</strong> {{ $booking['end_at'] ?? 'N/A' }}</li>
        <li><strong>Guests:</strong> {{ $booking['guests'] ?? 'N/A' }}</li>
        <li><strong>Extra Beds:</strong> {{ $booking['extra_beds'] ?? 0 }}</li>
        <li><strong>Total Amount:</strong> {{ $booking['total_amount'] ?? 'N/A' }}</li>
        <li><strong>Payment Method:</strong> {{ $booking['payment_method'] ?? 'N/A' }}</li>
    </ul>

    <p>If you have any questions, reply to this email.</p>
</body>
</html>
