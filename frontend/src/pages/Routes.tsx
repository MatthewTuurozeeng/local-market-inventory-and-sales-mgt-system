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
// the AppRoutes component defines the routing structure of the application using React Router. 
// it maps specific URL paths to their corresponding components, allowing users to navigate through different sections of the site. 
// some routes are protected, meaning they require authentication to access (like the dashboard and profile), while others are publicly accessible (like the home page, features, and about). 
// a catch-all route is included to handle any undefined paths, directing users to a NotFound component that provides a user-friendly 404 error page.
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