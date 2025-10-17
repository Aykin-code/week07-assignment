import { useEffect, useState } from "react";

// Controlled input defaults keep the form hydrated during edits and creates.
const defaultValues = {
  name: "",
  email: "",
  phone: "",
  notes: "",
};

export function ContactForm({
  initialValues = defaultValues,
  onSubmit,
  submitLabel = "Save",
  isSubmitting = false,
}) {
  // Local state drives the form inputs and transient error messaging.
  const [formData, setFormData] = useState({
    ...defaultValues,
    ...initialValues,
    notes: initialValues?.notes ?? "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      ...defaultValues,
      ...initialValues,
      notes: initialValues?.notes ?? "",
    });
  }, [initialValues]);

  // Keeps form inputs in sync with local state structure.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validates required fields and forwards trimmed data to the caller.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (!formData.name.trim() || !formData.email.trim()) {
        setError("Name and email are required.");
        return;
      }
      const trimmedNotes = formData.notes.trim();
      await onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        notes: trimmedNotes || null,
      });
      setFormData(defaultValues);
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  // Form layout shared by both create and edit views.
  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Tim Berners-Lee"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="tim@cern.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="01234 123 456"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div className="form-field">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          placeholder="Preferred contact times, context, etc."
          value={formData.notes}
          onChange={handleChange}
          rows={4}
        />
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
