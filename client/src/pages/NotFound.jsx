import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 gap-md">
      <p className="font-display-lg text-primary">404</p>
      <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-surface">Page not found</h1>
      <p className="font-body-md text-on-surface-variant max-w-md">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-sm px-lg py-2.5 rounded-full bg-primary text-on-primary font-title-md hover:bg-primary/90 transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}

export default NotFound;
