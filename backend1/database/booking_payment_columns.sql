-- Run this in Supabase SQL Editor if these columns are missing from public.bookings.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS amount_paid numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS balance_due numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_choice text;

UPDATE public.bookings
SET
  amount_paid = COALESCE(amount_paid, 0),
  balance_due = COALESCE(balance_due, total_amount - COALESCE(amount_paid, 0))
WHERE amount_paid IS NULL OR balance_due IS NULL;
