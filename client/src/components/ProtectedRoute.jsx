import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Spinner from "./Spinner";

// Guards routes that require authentication. Waits for the initial auth check so
// a logged-in user (whose token is still being validated) isn't bounced to login.
function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
