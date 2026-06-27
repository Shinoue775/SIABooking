-- Database schema for Supabase / PostgreSQL
-- This schema is for context only and is not meant to be run as a single migration.

CREATE TABLE public.users_backup (
  id uuid,
  fname character varying,
  created_at timestamp without time zone,
  lname character varying
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  fname character varying NOT NULL,
  lname character varying NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  role USER-DEFINED DEFAULT 'user'::user_role,
  email text,
  email_hash character varying,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.amenities (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL UNIQUE,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT amenities_pkey PRIMARY KEY (id)
);
CREATE TABLE public.room_types (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  description text,
  capacity integer NOT NULL,
  base_price numeric NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT room_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.rooms (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  room_type_id integer NOT NULL,
  room_number character varying NOT NULL UNIQUE,
  floor integer,
  price_override numeric,
  status USER-DEFINED DEFAULT 'available'::room_status,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT rooms_pkey PRIMARY KEY (id),
  CONSTRAINT rooms_room_type_id_fkey FOREIGN KEY (room_type_id) REFERENCES public.room_types(id)
);
CREATE TABLE public.room_amenities (
  room_type_id integer NOT NULL,
  amenity_id integer NOT NULL,
  CONSTRAINT room_amenities_pkey PRIMARY KEY (room_type_id, amenity_id),
  CONSTRAINT room_amenities_room_type_id_fkey FOREIGN KEY (room_type_id) REFERENCES public.room_types(id),
  CONSTRAINT room_amenities_amenity_id_fkey FOREIGN KEY (amenity_id) REFERENCES public.amenities(id)
);
CREATE TABLE public.room_images (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  room_id integer NOT NULL,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  CONSTRAINT room_images_pkey PRIMARY KEY (id),
  CONSTRAINT room_images_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id)
);
CREATE TABLE public.settings (
  key text NOT NULL,
  value text,
  CONSTRAINT settings_pkey PRIMARY KEY (key)
);
CREATE TABLE public.housekeeping_tasks (
  id integer NOT NULL DEFAULT nextval('housekeeping_tasks_id_seq'::regclass),
  room_id integer,
  booking_id integer,
  assigned_to uuid,
  started_at timestamp without time zone,
  completed_at timestamp without time zone,
  note text,
  template_id integer,
  status USER-DEFINED DEFAULT 'pending'::housekeeping_status,
  created_at timestamp without time zone DEFAULT now(),
  duration_minutes integer,
  completed_by uuid,
  CONSTRAINT housekeeping_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT fk_housekeeping_completed_by FOREIGN KEY (completed_by) REFERENCES public.users(id),
  CONSTRAINT housekeeping_tasks_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id),
  CONSTRAINT fk_template FOREIGN KEY (template_id) REFERENCES public.housekeeping_templates(id),
  CONSTRAINT fk_assigned_user FOREIGN KEY (assigned_to) REFERENCES public.users(id),
  CONSTRAINT fk_completed_user FOREIGN KEY (completed_by) REFERENCES public.users(id)
);
CREATE TABLE public.housekeeping_task_items (
  id integer NOT NULL DEFAULT nextval('housekeeping_task_items_id_seq'::regclass),
  task_id integer,
  item_name text,
  is_done boolean DEFAULT false,
  quantity integer DEFAULT 1,
  note text,
  CONSTRAINT housekeeping_task_items_pkey PRIMARY KEY (id),
  CONSTRAINT fk_task_items_task FOREIGN KEY (task_id) REFERENCES public.housekeeping_tasks(id)
);
CREATE TABLE public.housekeeping_templates (
  id integer NOT NULL DEFAULT nextval('housekeeping_templates_id_seq'::regclass),
  room_type_id integer NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT housekeeping_templates_pkey PRIMARY KEY (id),
  CONSTRAINT fk_room_type FOREIGN KEY (room_type_id) REFERENCES public.room_types(id)
);
CREATE TABLE public.housekeeping_template_items (
  id integer NOT NULL DEFAULT nextval('housekeeping_template_items_id_seq'::regclass),
  template_id integer NOT NULL,
  item_name text NOT NULL,
  default_quantity integer DEFAULT 1,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT housekeeping_template_items_pkey PRIMARY KEY (id),
  CONSTRAINT fk_template FOREIGN KEY (template_id) REFERENCES public.housekeeping_templates(id)
);
CREATE TABLE public.room_status_logs (
  id integer NOT NULL DEFAULT nextval('room_status_logs_id_seq'::regclass),
  room_id integer NOT NULL,
  changed_by uuid,
  note text,
  created_at timestamp without time zone DEFAULT now(),
  status USER-DEFINED DEFAULT 'available'::room_status,
  CONSTRAINT room_status_logs_pkey PRIMARY KEY (id),
  CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES public.rooms(id),
  CONSTRAINT fk_room_status_room FOREIGN KEY (room_id) REFERENCES public.rooms(id)
);
CREATE TABLE public.audit_logs (
  id bigint NOT NULL DEFAULT nextval('audit_logs_id_seq'::regclass),
  entity_type text,
  entity_id integer,
  action text,
  old_value jsonb,
  new_value jsonb,
  changed_by uuid,
  reason text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.bookings (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  room_id integer NOT NULL,
  start_at timestamp without time zone NOT NULL,
  guests integer DEFAULT 1,
  extra_beds integer DEFAULT 0,
  price_at_booking numeric NOT NULL,
  total_amount numeric NOT NULL,
  message text,
  checked_in_at timestamp without time zone,
  checked_out_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  status USER-DEFINED DEFAULT 'pending'::booking_status,
  approved_by uuid,
  rejected_by uuid,
  checked_in_by uuid,
  checked_out_by uuid,
  has_child boolean DEFAULT false,
  child_age_group text,
  has_pwd boolean DEFAULT false,
  has_senior boolean DEFAULT false,
  end_at timestamp without time zone,
  payment_method text CHECK (payment_method IS NULL OR (lower(payment_method) = ANY (ARRAY['gcash'::text, 'cash'::text]))),
  room_type text CHECK (room_type IS NULL OR (lower(room_type) = ANY (ARRAY['standard'::text, 'deluxe'::text]))),
  amount_paid numeric DEFAULT 0,
  balance_due numeric DEFAULT 0,
  payment_choice text,
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT fk_bookings_room FOREIGN KEY (room_id) REFERENCES public.rooms(id),
  CONSTRAINT fk_bookings_approved_by FOREIGN KEY (approved_by) REFERENCES public.users(id),
  CONSTRAINT fk_bookings_rejected_by FOREIGN KEY (rejected_by) REFERENCES public.users(id),
  CONSTRAINT fk_bookings_checked_in_by FOREIGN KEY (checked_in_by) REFERENCES public.users(id),
  CONSTRAINT fk_bookings_checked_out_by FOREIGN KEY (checked_out_by) REFERENCES public.users(id)
);
CREATE TABLE public.archived_bookings (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  original_booking_id integer NOT NULL,
  user_id uuid NOT NULL,
  room_id integer NOT NULL,
  start_at timestamp without time zone NOT NULL,
  guests integer DEFAULT 1,
  status text NOT NULL,
  message text,
  checked_in_at timestamp without time zone,
  checked_out_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  price_at_booking numeric,
  total_amount numeric,
  extra_beds integer DEFAULT 0,
  has_child boolean DEFAULT false,
  child_age_group text,
  has_pwd boolean DEFAULT false,
  has_senior boolean DEFAULT false,
  guest_fname text,
  guest_lname text,
  room_number text,
  approved_by uuid,
  rejected_by uuid,
  checked_in_by uuid,
  checked_out_by uuid,
  room_type_name text,
  room_type_id integer,
  room_capacity integer,
  room_base_price numeric,
  room_floor integer,
  end_at timestamp without time zone,
  payment_method text,
  guest_email_hash character varying,
  CONSTRAINT archived_bookings_pkey PRIMARY KEY (id),
  CONSTRAINT fk_archived_approved_by FOREIGN KEY (approved_by) REFERENCES public.users(id),
  CONSTRAINT fk_archived_checked_in_by FOREIGN KEY (checked_in_by) REFERENCES public.users(id),
  CONSTRAINT fk_archived_checked_out_by FOREIGN KEY (checked_out_by) REFERENCES public.users(id)
);
CREATE TABLE public.migrations (
  id integer NOT NULL DEFAULT nextval('migrations_id_seq'::regclass),
  migration character varying NOT NULL,
  batch integer NOT NULL,
  CONSTRAINT migrations_pkey PRIMARY KEY (id)
);
