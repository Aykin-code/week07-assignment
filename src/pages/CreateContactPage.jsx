//  CREATE CONTACTS AND WRIETS TO DB
//  =================================

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ContactForm } from "../components/ContactForm.jsx";
import { createContact } from "../api/contacts.js";

export function CreateContactPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Creates the contact then returns the user to the list view.
  const handleCreate = async (payload) => {
    setError("");
    setIsSubmitting(true);
    try {
      console.log("[contacts:create] Submitting new contact payload:", payload);
      await createContact(payload);
      console.log("[contacts:create] Contact created successfully");
      navigate("/");
    } catch (createError) {
      console.error("[contacts:create] Failed to create contact:", createError);
      setError(createError.message);
      throw createError;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <header>
        <h1>Add a new contact</h1>
        <p>Capture key details and they will appear in the contacts list.</p>
      </header>
      <nav className="breadcrumbs">
        <Link to="/">← Back to contacts</Link>
      </nav>
      <section className="card">
        {error ? <p className="form-error">{error}</p> : null}
        <ContactForm
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
          submitLabel="Create"
        />
      </section>
    </div>
  );
}
