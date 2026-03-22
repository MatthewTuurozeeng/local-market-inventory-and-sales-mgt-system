import { Route, Routes } from "react-router-dom";
import About from "./About.tsx";
import Features from "./Features.tsx";
import GetStarted from "./GetStarted.tsx";
import Home from "./Home.tsx";
import HowItWorks from "./HowItWorks.tsx";
import Login from "./Login.tsx";
import PublicReport from "./PublicReport.tsx";
import Dashboard from "./Dashboard.tsx";
import Profile from "./Profile.tsx";
import NotFound from "./NotFound.tsx";
import ResetPassword from "./ResetPassword.tsx";
import ResetConfirm from "./ResetConfirm.tsx";
import Signup from "./Signup.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
  <Route path="/reset-password/confirm" element={<ResetConfirm />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/report" element={<PublicReport />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}