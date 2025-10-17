# Basic CRUD with React, Express, and Supabase

This project is a full-stack contact manager that demonstrates how to build a CRUD workflow with React forms on the frontend, an Express server in Node.js, and a PostgreSQL database hosted on Supabase. It includes routing with React Router, REST endpoints, and a simple UI for creating, listing, updating, and deleting contacts.

## Prerequisites

- Node.js 18+
- A Supabase project (or direct PostgreSQL instance) with access to the service role key
- npm

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the sample environment file and update it with your Supabase values:
   ```bash
   cp .env.example .env
   ```
   Required variables:
   - `SUPABASE_URL`: Supabase project URL (https://\*.supabase.co)
   - `SUPABASE_SERVICE_ROLE_KEY`: Service role key with full database access
   - `SUPABASE_CONTACTS_TABLE`: Table name to use (defaults to `contacts`)
   - `PORT`: Express server port (defaults to `4000`)
   - `VITE_API_BASE_URL`: Base URL the React app should use for API calls (defaults to `http://localhost:4000`)
3. Create the `contacts` table inside Supabase (or your PostgreSQL database). You can run the SQL below in the Supabase SQL editor:

   ```sql
   create table if not exists public.contacts (
     id bigserial primary key,
     name text not null,
     email text not null,
     phone text,
     notes text,
     created_at timestamptz default now()
   );
   ```

   \*Note:Phone as a text field, rather than a number, is to support notes and times e.g. 012234 333 444 (only after 9 am)

4. Start the app:

   - Run the Express API only:
     ```bash
     npm run server
     ```
   - Run the React client only:
     ```bash
     npm run dev
     ```

5. Open the client at [http://localhost:5173](http://localhost:5173) (default Vite port) and use the **Add contact** button to launch the create form.

## Project Structure

- `server/index.js`: Express server with CRUD routes backed by Supabase/PostgreSQL.
- `server/supabaseClient.js`: Supabase client factory that reads environment variables.
- `src/api/contacts.js`: Fetch helpers for the REST API.
- `src/pages/ContactListPage.jsx`: Main dashboard with sortable contact list.
- `src/pages/CreateContactPage.jsx`: Dedicated page for adding new contacts.
- `src/pages/EditContactPage.jsx`: Edit form for a single contact.
- `src/components/ContactForm.jsx`: Reusable controlled form component.
- `db/readme.md`: details for database schema and setup
- `db/schema.sql`: sql commands foor initial table setup
- `db/seed.sql`: sql command to insert the demo seed data

Each contact stores `name`, `email`, optional `phone`, and optional `notes` for free-form details.

## Run Scripts

- `npm run dev`: Start the Vite development server.
- `npm run server`: Start the Express API.
- `npm run lint`: Run ESLint across the codebase.

## API Overview

All routes are prefixed with `/api` and currently only operate on the `contacts` table.

| Method | Route               | Description           |
| ------ | ------------------- | --------------------- |
| GET    | `/api/contacts`     | List all contacts     |
| GET    | `/api/contacts/:id` | Fetch a single record |
| POST   | `/api/contacts`     | Create a new contact  |
| PUT    | `/api/contacts/:id` | Update an existing    |
| DELETE | `/api/contacts/:id` | Delete a contact      |

## Notes

- The contact list view automatically refreshes every 60 seconds to pull in remote changes without manual interaction.
  - This is to meet the task objectives. In practice if there is only a single user enviromment then this would not be needed.
- The Express server uses the Supabase **service role** key to perform unrestricted operations; the key is kept secret and never exposed to the browser.
- The React client defaults to `http://localhost:4000` for API calls but can be pointed at any deployment by setting `VITE_API_BASE_URL`.
- The UI is intentionally minimal to keep focus on data. Neo-flat(c)
