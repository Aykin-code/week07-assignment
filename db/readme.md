# Database Setup & Seed Guide

This folder contains the SQL files used to provision and populate the `contacts` table that powers the app's CRUD API.

## Files

- `.schema.sql` — creates the `public.contacts` table (id, name, email, phone, notes, created_at).
- `seed.sql` — inserts a handful of example contacts so the UI has data to display immediately.

## Supabase

In the Supabase SQL editor:

1. Open the **SQL Editor** in your Supabase project.
2. Paste the contents of `.schema.sql`, run it once.
3. Paste and run `seed.sql` to insert the sample contacts.

## Environment Variables

The server reads these values from `.env`:

- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — Supabase project credentials.
- `SUPABASE_CONTACTS_TABLE` — defaults to `contacts`; update only if you renamed the table in the SQL files.

Update `.env` accordingly before starting the server so the API points at the newly provisioned database.
