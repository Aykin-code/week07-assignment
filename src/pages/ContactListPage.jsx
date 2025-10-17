// THIS IS THE LANDING PAGE - DISPLAYS CURRENT/EXISTING CONTACTS
// ==============================================================

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getContacts, deleteContact } from "../api/contacts.js";

export function ContactListPage() {
  // Front page state drives list rendering, loading status, and inline errors.
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // Tracks the active alphabetical sort direction.
  const [sortDirection, setSortDirection] = useState("asc");
  // tracks the last polling of the db
  const [lastUpdated, setLastUpdated] = useState(null);

  // Pulls fresh contacts from the API and reflects failure to the user.
  const loadContacts = useCallback(async ({ silent = false } = {}) => {
    setError("");
    if (!silent) {
      setIsLoading(true);
    }
    try {
      console.log("[contacts] Loading contacts from API…");
      const data = await getContacts();
      console.log("[contacts] Loaded contacts count:", data.length);
      setContacts(data);
      setLastUpdated(new Date());
    } catch (loadError) {
      console.error("[contacts] Failed to load contacts:", loadError);
      setError(loadError.message);
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);

  // Initial load when the dashboard mounts.
  useEffect(() => {
    loadContacts();

    const intervalId = setInterval(() => {
      loadContacts({ silent: true });
    }, 60000);

    return () => clearInterval(intervalId);
  }, [loadContacts]);

  // Removes a contact after confirming the backend delete.
  const handleDelete = async (contact) => {
    const confirmed = window.confirm(
      `Delete ${contact.name}?  *** WARNING *** - This action cannot be undone.`
    );
    if (!confirmed) return;

    setError("");
    try {
      console.log("[contacts] Deleting contact", contact.id);
      await deleteContact(contact.id);
      setContacts((prev) => prev.filter((item) => item.id !== contact.id));
      console.log("[contacts] Deleted contact", contact.id);
    } catch (deleteError) {
      console.error("[contacts] Failed to delete contact:", deleteError);
      setError(deleteError.message);
    }
  };

  // Builds a sorted list using the selected direction without changing the state.
  // get contacts, sort alphabetically, resorts when sortDirection changes
  // useMemo react hook used to cache information for optimisation
  // ideally would expand on this sort by everyfield via clicking on the header, no point doing at this time.
  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      // -1 a before b, 1 a after b  (0 no change) - use 'asc' boths times (and not desc) as the 1 -1 inversion has already done it.. so to speak, anyway, remember the mistake for future reference.

      if (nameA < nameB) return sortDirection === "asc" ? -1 : 1;
      if (nameA > nameB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [contacts, sortDirection]);

  // Page layout: list header with 'create button' link, then last updated then followed by the contacts listing cards.
  return (
    <div className="page">
      <header>
        <div className="header-top">
          <h1>Contact Manager</h1>
          <Link to="/contacts/new" className="primary-action">
            Add New Contact
          </Link>
        </div>
        <p>
          Week-07 Track colleagues, clients and friends, with a simple
          Supabase-backed CRUD app.
        </p>
        <p className="last-updated">
          Last updated:{" "}
          {lastUpdated
            ? lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "—"}
        </p>
      </header>

      <section className="card">
        <div className="section-header">
          <h2>All contacts</h2>
          <div className="section-actions">
            <button
              type="button"
              className="secondary"
              onClick={() =>
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
              }
            >
              Sort {sortDirection === "asc" ? "A → Z" : "Z → A"}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => loadContacts()}
              disabled={isLoading}
            >
              {isLoading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        {isLoading ? (
          <p>Loading contacts…</p>
        ) : sortedContacts.length === 0 ? (
          <p>
            No contacts yet or DB connection lost.{" "}
            <Link to="/contacts/new">Try creating your first contact </Link> or
            call support to get started.
          </p>
        ) : (
          <ul className="contact-list">
            {sortedContacts.map((contact) => (
              <li key={contact.id} className="contact-item">
                <div>
                  <p className="contact-name">{contact.name}</p>
                  <p className="contact-meta">
                    <span>{contact.email}</span>
                    {contact.phone ? <span>{contact.phone}</span> : null}
                  </p>
                  {contact.notes ? (
                    <p className="contact-notes">{contact.notes}</p>
                  ) : null}
                </div>
                <div className="contact-actions">
                  <Link to={`/contacts/${contact.id}/edit`} className="success">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleDelete(contact)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
