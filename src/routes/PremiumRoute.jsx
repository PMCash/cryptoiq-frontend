import { Navigate } from "react-router-dom";

export default function PremiumRoute({
  user,
  userRole,
  isAuthReady,
  children,
}) {
  // Still loading auth
  if (!isAuthReady) {
    return <p style={{ padding: "20px" }}>Checking subscription...</p>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Not premium
  if (userRole !== "premium") {
    return <Navigate to="/" replace />;
  }

  return children;
}
