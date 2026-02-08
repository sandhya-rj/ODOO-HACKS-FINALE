import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/15 to-blue-500/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-primary">404</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground">Page not found</h1>
        <p className="mb-6 text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
