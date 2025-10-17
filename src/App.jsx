// DONT FORGET TO IMPORT THE PAGES OR THEY WILL NOT RENDER
import { Routes, Route } from "react-router-dom";
import { ContactListPage } from "./pages/ContactListPage.jsx";
import { CreateContactPage } from "./pages/CreateContactPage.jsx";
import { EditContactPage } from "./pages/EditContactPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import "./App.css";

function App() {
  return (
    // Main router defines the dashboard, create/edit forms, and 404 fallback.
    <Routes>
      <Route path="/" element={<ContactListPage />} />
      <Route path="/contacts/new" element={<CreateContactPage />} />
      <Route path="/contacts/:id/edit" element={<EditContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
