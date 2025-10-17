import { Link } from "react-router-dom";

export function NotFoundPage() {
  // Simple fallback page for unmatched routes.
  return (
    <div className="page">
      <header>
        <h1>Page not found</h1>
        <p>The page/route you requested does not exist.</p>
      </header>
      <nav className="breadcrumbs">
        <Link to="/">← Back to contacts</Link>
      </nav>
    </div>
  );
}
