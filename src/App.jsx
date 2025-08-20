import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home/Home";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/about"
          element={<h2 className="text-black">About Page</h2>}
        />
        <Route
          path="/contact"
          element={<h2 className="text-black">Contact Page</h2>}
        />
      </Routes>
    </div>
  );
}

export default App;
