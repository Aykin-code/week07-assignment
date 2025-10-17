import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// load environment variables from .env and add all to process.env
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// catch missign URLs  --  !(not)  || (or)   if URL missing or KEY missing then do something
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables."
  );
}

// Service-role client powers the backend API (to never expose these secrets to the browser).
// autorefreshtoken false - stops token automatic renewal - session simply ends. see SERVICE_ROLE_KEY for more info
// persistentsession false - tells Supabase to NOT save session data locally. client is created statelessly, it just connects, does the job, and exits. - see 'short-lived' API scripts for more info
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
