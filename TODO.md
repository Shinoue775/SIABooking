# TODO — SIA Booking calendar booked-days fixes

## Plan summary (approved)
- Fix calendar booked-day visibility for Standard vs Deluxe (separate)
- Fix bug: booked days disappear when switching months then returning
- Past days: do NOT show booked styling red for dates < today
- Improve performance: faster booked-day rendering when switching room types/months
- Make booking error modal robust (avoid misleading “internet connection” for non-network failures)

## Steps
- [x] 1) Update frontend `booking.blade.php`: add per-roomType cached unavailable dates keyed by (year, month, roomType)
- [x] 2) Update month navigation + room-type change handlers: render immediately from cache, refresh async without clearing current UI
- [x] 3) Update `refreshAvailabilityForMonth()` to only update the cache after latest request token completes; prevent race conditions
- [x] 4) Update `renderCalendar()` logic: booked/unavailable red styling applies only when `displayDate >= today`
- [ ] 5) Optimize UI update frequency during async refresh (avoid clearing calendar early)

- [ ] 6) Improve booking failure modal handling in `processBooking()` and `submitPaymentConfirmation()`
- [ ] 7) Add/adjust minor throttling/debouncing for room type + month changes so UI feels faster
- [ ] 8) Verify by running frontend with `php artisan serve` (frontend) and manually testing scenarios

