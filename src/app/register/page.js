"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { registerUser } from "../../lib/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerUser(email.trim(), password);

      router.push("/account");
    } catch (err) {
      console.error(err);

      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError("Unable to create your account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="flex min-h-[70vh] items-center justify-center px-5 py-16 sm:px-7 lg:px-10">
        <div className="w-full max-w-md">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#d71920]">
              Join SOLEVA
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black">
              Create Account
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Create an account to manage your orders and profile.
            </p>
          </div>

          <form onSubmit={handleRegister} className="mt-10 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs text-gray-500"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

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
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-xs text-gray-500"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat your password"
                autoComplete="new-password"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#d71920] disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-black underline underline-offset-4 hover:text-[#d71920]"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}