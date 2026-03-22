import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { hasToken } from "../lib/api.ts";

type ProtectedRouteProps = {
  children: ReactElement;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const useMocks = import.meta.env.VITE_USE_MOCKS === "true";
  if (!hasToken() && !useMocks) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
