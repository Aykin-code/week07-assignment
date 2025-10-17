// Points the client at whichever API host the environment provides.
// and fetch commands for the db (google ftw)

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// Shared fetch helper that serves API error details.
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody?.error?.message ||
      errorBody?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
};

// REST helpers used by the React pages.
export const getContacts = () =>
  fetch(`${API_BASE_URL}/api/contacts`).then(handleResponse);

export const getContact = (id) =>
  fetch(`${API_BASE_URL}/api/contacts/${id}`).then(handleResponse);

export const createContact = (payload) =>
  fetch(`${API_BASE_URL}/api/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const updateContact = (id, payload) =>
  fetch(`${API_BASE_URL}/api/contacts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const deleteContact = (id) =>
  fetch(`${API_BASE_URL}/api/contacts/${id}`, {
    method: "DELETE",
  }).then(handleResponse);
