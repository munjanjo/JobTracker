import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import BoardPage from "./pages/BoardPage";
import RequireAuth from "./auth/RequireAuth";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<ApplicationsPage />} />
        <Route path="board" element={<BoardPage />} />
      </Route>
    </Routes>
  );
}
