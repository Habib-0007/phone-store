import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

import { Button } from "../components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] py-10 text-center">
      <h1 className="text-9xl font-bold text-muted-foreground">404</h1>
      <h2 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="javascript:history.back()">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Link>
        </Button>
      </div>
    </div>
  );
}
