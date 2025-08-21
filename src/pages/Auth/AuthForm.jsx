import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useCall } from "../../Provider/Provider";
import register from "../../hooks/auth/regsiter";
import setAuthToken from "../../config/setAuthToken";
import { Link, useNavigate } from "react-router-dom";
import login from "../../hooks/auth/login";
import QrScanner from "../../components/Dashboard/QrScaner";

const AuthForm = () => {
  const [signUp, setSignUp] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setToken, setUser } = useCall();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (signUp) {
        const { data } = await register(userData);
        if (!data.success)
          throw new Error(data.message || "Registration failed");
      }

      const { data: user } = await login({
        email: userData.email,
        password: userData.password,
      });

      localStorage.setItem("token", user.token);
      localStorage.setItem("user", JSON.stringify(jwtDecode(user.token)));

      setAuthToken(user.token);
      setUser(jwtDecode(user.token));
      setToken(user.token);

      Swal.fire({
        title: "Success",
        text: "You have successfully logged in!",
        icon: "success",
      });

      navigate("/");
    } catch (err) {
      if (err.message !== "NEXT_REDIRECT") {
        setError(err?.response?.data?.message || err.message);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/login.jpg')" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Form card */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-gray-700 bg-black p-6 shadow-lg backdrop-blur-md sm:p-8">
        {/* Scan Section */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-600 p-2">
          <h2 className="text-lg font-semibold text-white tracking-tight">
            Scan for Call
          </h2>
          <div className="flex items-center justify-center rounded-lg border border-gray-600 p-2">
            <QrScanner />
          </div>
        </div>

        {/* Toggle Tabs */}
        <div className="flex border-b border-gray-700 text-white">
          <button
            className={`flex-1 p-3 text-center font-semibold uppercase transition ${
              !signUp
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setSignUp(false)}
          >
            Sign In
          </button>
          <button
            className={`flex-1 p-3 text-center font-semibold uppercase transition ${
              signUp
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setSignUp(true)}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 pt-6 text-white"
        >
          <h1 className="text-center text-xl font-bold uppercase tracking-wide">
            {signUp ? "Create Account" : "Welcome Back"}
          </h1>

          {signUp && (
            <input
              name="name"
              value={userData.name}
              onChange={handleChange}
              type="text"
              placeholder="Full Name"
              required
              className="w-full rounded-md border border-gray-600 bg-black px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          )}

          <input
            name="email"
            value={userData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-md border border-gray-600 bg-black px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="password"
            value={userData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-md border border-gray-600 bg-black px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />

          {!signUp && (
            <p className="text-right text-sm text-gray-400">
              <Link to="/forget-password" className="hover:underline">
                Forgot password?
              </Link>
            </p>
          )}

          {error && (
            <p className="text-center text-sm font-medium text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md border border-gray-600 bg-white px-5 py-2 font-semibold uppercase text-black shadow-md transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Processing..." : "Submit"}
          </button>

          <p className="text-center text-sm text-gray-300">
            {signUp ? "Already have an account?" : "Don’t have an account?"}{" "}
            <button
              type="button"
              onClick={() => setSignUp(!signUp)}
              className="font-semibold underline"
            >
              {signUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
