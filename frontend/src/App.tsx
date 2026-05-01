import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./lib/theme.tsx";
import Layout from "./pages/Layout.tsx";
import AppRoutes from "./pages/Routes.tsx";

// the App component serves as the root of the application. 
// It wraps the entire app in a ThemeProvider for managing light/dark themes and a BrowserRouter for handling client-side routing. 
// The Layout component provides a consistent structure (like header and footer) across all pages, while AppRoutes defines the different routes and their corresponding components.

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}