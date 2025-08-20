import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home/Home";
import AuthForm from "./pages/Auth/AuthForm";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Dashboard/Profile";
import Subscriptions from "./pages/Dashboard/Subscriptions";
import TransactionPage from "./pages/Dashboard/TransactionPage";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthForm />} />

        {/* Dashboard with nested routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="transactions" element={<TransactionPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
