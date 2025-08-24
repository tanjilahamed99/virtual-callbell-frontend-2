import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../config/constant";

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // steps: 1=email, 2=code, 3=new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Step 1: Send auth code
  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 👉 Replace with your API call
      // await fetch("/api/auth/send-code", { method: "POST", body: JSON.stringify({ email }) });

      const { data } = await axios.post(BASE_URL + `/auth/send-code`, {
        email,
      });
      if (data.success) {
        setStep(2);
        setError("");
      }
    } catch (err) {
      setError(err.response?.data?.email || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(BASE_URL + `/auth/verify-code`, {
        email,
        code,
      });
      if (data.success) {
        setStep(3);
        setError("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(BASE_URL + `/auth/change-password`, {
        email,
        code,
        password,
      });
      if (data.success) {
        Swal.fire("Success", "Your password has been reset!", "success");
        setStep(1);
        setEmail("");
        setCode("");
        setPassword("");
        navigate("/login");
        setError("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" />

      <div className="absolute inset-0 bg-white" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border bg-black p-6 shadow-lg backdrop-blur-md dark:border-zinc-700 sm:p-8">
        <div>
          <img src="/icon.png" alt="Login" className="w-20 h-20 mx-auto mb-5" />
        </div>

        <h1 className="mb-6 text-center text-2xl font-bold uppercase tracking-wide">
          Forgot Password
        </h1>

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="flex flex-col gap-4">
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Enter your email to receive a verification code.
            </p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              required
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-700 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <p className="text-red-500">{error}</p>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md border px-5 py-2 font-semibold uppercase shadow-md transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-white">
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        )}

        {/* Step 2: Code */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Enter the 6-digit code we sent to{" "}
              <span className="font-semibold">{email}</span>.
            </p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              type="text"
              placeholder="Enter Code"
              required
              className="w-full rounded-md border px-3 py-2 text-center tracking-widest outline-none focus:ring-2 focus:ring-zinc-700 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <p className="text-red-500">{error}</p>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md border px-5 py-2 font-semibold uppercase shadow-md transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-white">
              {loading ? "Verifying..." : "Verify Code"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-blue-600 underline dark:text-blue-400">
              Resend Code
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Enter your new password.
            </p>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="New Password"
              required
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-700 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <p className="text-red-500">{error}</p>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md border px-5 py-2 font-semibold uppercase shadow-md transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-white">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          Remembered your password?{" "}
          <Link to="/login" className="font-semibold underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
