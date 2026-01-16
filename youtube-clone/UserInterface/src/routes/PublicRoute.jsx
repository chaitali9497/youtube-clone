import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

function PublicRoute() {
  if (isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
