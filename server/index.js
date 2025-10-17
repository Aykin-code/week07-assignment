import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Core middleware handles CORS and JSON parsing for the API.
app.use(cors());
app.use(express.json());

// Simple request logger for debugging request flow.
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

const CONTACTS_TABLE = process.env.SUPABASE_CONTACTS_TABLE || "contacts";

// Normalizes Supabase errors so responses stay consistent across routes.
const mapSupabaseError = (error) => {
  if (!error) return null;
  return {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  };
};

// READ collection: returns every contact ordered by id.
app.get("/api/contacts", async (req, res) => {
  const { data, error } = await supabase
    .from(CONTACTS_TABLE)
    .select("*")
    .order("id");
  if (error) {
    console.error("Error fetching contacts list:", error);
    res.status(500).json({ error: mapSupabaseError(error) });
    return;
  }
  console.log(`Fetched ${data.length} contact(s) from Supabase`);
  res.json(data);
});

// READ (GET) single contact by id with basic parameter validation.
// and try to capture errors - PGRST116 - query returned no row. code snipped from googling, need further review into db error handling, this works(or at least causes no other errors) but is not square in my head.

app.get("/api/contacts/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: { message: "Invalid id parameter" } });
    return;
  }
  const { data, error } = await supabase
    .from(CONTACTS_TABLE)
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    console.error(`Error loading contact id=${id}:`, error);
    res.status(status).json({ error: mapSupabaseError(error) });
    return;
  }
  console.log(`Loaded contact id=${id}`);
  res.json(data);
});

// CREATE (POST) a new contact and return the inserted row.
app.post("/api/contacts", async (req, res) => {
  const { name, email, phone, notes } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: { message: "name and email are required" } });
    return;
  }
  const { data, error } = await supabase
    .from(CONTACTS_TABLE)
    .insert([{ name, email, phone, notes }])
    .select()
    .single();
  if (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ error: mapSupabaseError(error) });
    return;
  }
  console.log("Created contact:", data);
  res.status(201).json(data);
});

// UPDATE (PUT) an existing contact after validating the payload.
app.put("/api/contacts/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: { message: "Invalid id parameter" } });
    return;
  }
  const { name, email, phone, notes } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: { message: "name and email are required" } });
    return;
  }
  const { data, error } = await supabase
    .from(CONTACTS_TABLE)
    .update({ name, email, phone, notes })
    .eq("id", id)
    .select()
    .single();
  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    console.error(`Error updating contact id=${id}:`, error);
    res.status(status).json({ error: mapSupabaseError(error) });
    return;
  }
  console.log(`Updated contact id=${id}`);
  res.json(data);
});

// DELETE a contact and return 204 on success.
app.delete("/api/contacts/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: { message: "Invalid id parameter" } });
    return;
  }
  const { error } = await supabase.from(CONTACTS_TABLE).delete().eq("id", id);
  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    console.error(`Error deleting contact id=${id}:`, error);
    res.status(status).json({ error: mapSupabaseError(error) });
    return;
  }
  console.log(`Deleted contact id=${id}`);
  res.status(204).send();
});

// Quick health endpoint for uptime checks.
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ error: { message: "Route not found" } });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
