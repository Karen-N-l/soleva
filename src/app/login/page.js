"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { loginUser, resetPassword } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await loginUser(email.trim(), password);
      router.push("/account");
    } catch (err) {
      console.error(err);

      if (err.code === "auth/invalid-credential") {
        setError("Incorrect email or password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Unable to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    try {
      await resetPassword(email.trim());
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      console.error(err);
      setError("Unable to send the reset email.");
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="flex min-h-[70vh] items-center justify-center px-5 py-16 sm:px-7 lg:px-10">
        <div className="w-full max-w-md">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#d71920]">
              Welcome Back
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black">
              Sign In
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Sign in to manage your account and view your orders.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-10 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs text-gray-500"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs text-gray-500"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p className="text-sm text-green-600">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#d71920] disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={handleResetPassword}
              className="w-full text-center text-sm text-gray-500 underline underline-offset-4 hover:text-black"
            >
              Forgot Password?
            </button>
          </form>

          <div className="mt-8 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-black underline underline-offset-4 hover:text-[#d71920]"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}