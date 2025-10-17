# Basic CRUD with React, Express, and Supabase

This project is a full-stack contact manager that demonstrates how to build a CRUD workflow with React forms on the frontend, an Express server in Node.js, and a PostgreSQL database hosted on Supabase. It includes routing with React Router, REST endpoints, and a simple UI for Creating, Reading/listing, Updating, and Deleting contacts.

# REFLECTIONS

Despite promosing myself to it simple, I again dug holes.

I rushed the start and didnt think to properly separate the client and server sides at the top level. I got the basics working quicker than expected so decided to try to present the database table as an api routes. This started ok, but got complex all to quickly again.
I played around with adding additional folders for the api routes (based off an idea from some web).
The layout is basic with an A-Z sort on contact cards. I lost some time with two lines of code try to sort the order correctly. (It worked A-Z but not Z-A) This was down to using `sortDirection === "asc" and sortDirection === "desc"` incorrectly. Google sorted the issue and I came away with a better understanding of the underlying logic, so not a complete waste of time.

I was going to add more tables and try in include options for a read only clients, but overrach and time again beat me.

At the moment my coding is jumping around to much. Copying an example snippet and then bashing it until it works with my projects. This helps my big picture understanding but comes at the exspense of smaller details and muscle memory for the syntax (and I keep mixing up my variables).

## Prerequisites

- Node.js 18+
- A Supabase project (or direct PostgreSQL instance) with access to the service role key
- npm
- Onrender hosting

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
   - `VITE_API_BASE_URL`: Base URL the React app should use for API calls ( and should default to `http://localhost:4000`)
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

   Seed data is also available in the `/db/seed.sql` file.

4. Start the app:

   - Run the Express API only:
     ```bash
     npm run server
     ```
   - Run the React client only:
     ```bash
     npm run dev
     ```

5. Open the client at [http://localhost:5173](http://localhost:5173) (default Vite port) or [week07-assignment](https://week07-assignment-new-0i5q.onrender.com/) and use the **Add contact** button to launch the create form.

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

- example https://week07-assignment-1-new.onrender.com/api/contacts - returns the contacts table as an 'API'

- /health - return a basic status 'ok'

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
