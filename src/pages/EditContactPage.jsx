import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ContactForm } from "../components/ContactForm.jsx";
import { getContact, updateContact } from "../api/contacts.js";

export function EditContactPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Keeps track of the contact being edited along with loading/error flags.
  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Loads the existing contact when the route changes.
  useEffect(() => {
    const loadContact = async () => {
      setError("");
      setIsLoading(true);
      try {
        console.log("[contacts:edit] Loading contact", id);
        const data = await getContact(id);
        console.log("[contacts:edit] Loaded contact", data);
        setContact(data);
      } catch (loadError) {
        console.error("[contacts:edit] Failed to load contact:", loadError);
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadContact();
  }, [id]);

  // Saves updates and should return the user to the list view.
  const handleSubmit = async (payload) => {
    setError("");
    setIsSubmitting(true);
    try {
      console.log("[contacts:edit] Updating contact", id, payload);
      await updateContact(id, payload);
      console.log("[contacts:edit] Contact updated", id);
      navigate("/");
    } catch (submitError) {
      console.error("[contacts:edit] Failed to update contact:", submitError);
      setError(submitError.message);
      throw submitError;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Displays the edit form once data is ready, otherwise shows status messaging.
  return (
    <div className="page">
      <header>
        <h1>Edit contact</h1>
        <p>Click Update to save details and return to the main list.</p>
      </header>
      <nav className="breadcrumbs">
        <Link to="/">← Back to contacts</Link>
      </nav>
      <section className="card">
        {isLoading ? (
          <p>Loading contact…</p>
        ) : error ? (
          <p className="form-error">{error}</p>
        ) : contact ? (
          <ContactForm
            initialValues={contact}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Update"
          />
        ) : (
          <p>Contact not found.</p>
        )}
      </section>
    </div>
  );
}
