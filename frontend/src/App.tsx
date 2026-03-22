import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./lib/theme.tsx";
import Layout from "./pages/Layout.tsx";
import AppRoutes from "./pages/Routes.tsx";

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