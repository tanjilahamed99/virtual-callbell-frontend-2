import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home/Home";
import AuthForm from "./pages/Auth/AuthForm";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthForm />} />
        <Route
          path="/contact"
          element={<h2 className="text-black">Contact Page</h2>}
        />
      </Routes>
    </div>
  );
}

export default App;
