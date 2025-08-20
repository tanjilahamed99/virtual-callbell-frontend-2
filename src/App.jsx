import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home/Home";
import AuthForm from "./pages/Auth/AuthForm";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Dashboard/Profile";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthForm />} />

        {/* Dashboard with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="profile" element={<Profile />} />
          {/* <Route path="settings" element={<Settings />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
