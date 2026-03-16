import { BrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout.tsx";
import AppRoutes from "./pages/Routes.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  );
}