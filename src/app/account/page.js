"use client";

import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";
import app, { auth } from "../../lib/firebase";

const db = getFirestore(app);

export default function AccountPage() {
  const { cartItems } = useCart();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("Please log in to view your account.");
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(
          doc(db, "users", user.uid)
        );

        if (userDoc.exists()) {
          const data = userDoc.data();

          setProfile({
            name: data.name || "",
            email: user.email || data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        } else {
          setProfile((current) => ({
            ...current,
            email: user.email || "",
          }));
        }

        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );

        const ordersSnapshot = await getDocs(ordersQuery);

        const orderData = ordersSnapshot.docs.map((orderDoc) => ({
          id: orderDoc.id,
          ...orderDoc.data(),
        }));

        setOrders(orderData);
      } catch (err) {
        console.error(err);
        setError("Unable to load your account.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const user = auth.currentUser;

    if (!user) {
      setError("Please log in first.");
      return;
    }

    setSaving(true);

    try {
      await import("firebase/firestore").then(
        ({ setDoc }) =>
          setDoc(
            doc(db, "users", user.uid),
            {
              name: profile.name.trim(),
              email: user.email || profile.email,
              phone: profile.phone.trim(),
              address: profile.address.trim(),
              updatedAt: new Date(),
            },
            { merge: true }
          )
      );

      setMessage("Profile saved successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      setError("Unable to log out.");
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="px-5 py-12 sm:px-7 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1200px]">

          <div className="mb-10">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#d71920]">
              Your Account
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">
              Account
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
              Manage your account information and view your orders.
            </p>
          </div>

          {loading && (
            <p className="text-sm text-gray-500">
              Loading your account...
            </p>
          )}

          {error && (
            <div className="border border-red-100 bg-red-50 p-4">
              <p className="text-sm text-red-600">
                {error}
              </p>

              <Link
                href="/login"
                className="mt-3 inline-block text-sm font-medium text-black underline underline-offset-4"
              >
                Go to Login
              </Link>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="grid gap-6 lg:grid-cols-2">

                <section className="border border-gray-200 p-6 sm:p-8">
                  <h2 className="text-lg font-medium text-black">
                    Profile
                  </h2>

                  <form
                    onSubmit={handleSaveProfile}
                    className="mt-7 space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-xs text-gray-500"
                      >
                        Email
                      </label>

                      <input
                        id="email"
                        value={profile.email}
                        disabled
                        className="w-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-xs text-gray-500"
                      >
                        Full Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-xs text-gray-500"
                      >
                        Phone
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        placeholder="07XX XXX XXX"
                        className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="mb-2 block text-xs text-gray-500"
                      >
                        Delivery Address
                      </label>

                      <textarea
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Your delivery address"
                        className="w-full resize-none border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                      />
                    </div>

                    {message && (
                      <p className="text-sm text-green-600">
                        {message}
                      </p>
                    )}

                    {error && (
                      <p className="text-sm text-red-600">
                        {error}
                      </p>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-[#d71920] disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save Profile"}
                      </button>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="border border-black px-6 py-3 text-sm font-medium text-black transition hover:bg-black hover:text-white"
                      >
                        Log Out
                      </button>
                    </div>
                  </form>
                </section>

                <section className="bg-[#f5f5f3] p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-medium text-black">
                      Orders
                    </h2>

                    <span className="text-xs text-gray-500">
                      {orders.length} order
                      {orders.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="mt-7">
                      <p className="text-sm text-gray-500">
                        You have not placed any orders yet.
                      </p>

                      <Link
                        href="/shop"
                        className="mt-6 inline-flex bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-[#d71920]"
                      >
                        Shop Sneakers
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 bg-white p-4"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-xs text-gray-500">
                                Order
                              </p>

                              <p className="mt-1 break-all text-sm font-medium text-black">
                                {order.id}
                              </p>
                            </div>

                            <Status
                              status={order.status}
                            />
                          </div>

                          <div className="mt-4 border-t border-gray-100 pt-4">
                            <p className="text-xs text-gray-500">
                              Items
                            </p>

                            <p className="mt-1 text-sm text-black">
                              {order.items?.length || 0} item
                              {(order.items?.length || 0) !== 1
                                ? "s"
                                : ""}
                            </p>

                            <p className="mt-3 text-xs text-gray-500">
                              Total
                            </p>

                            <p className="mt-1 text-sm font-medium text-black">
                              KSh{" "}
                              {Number(
                                order.total || 0
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

              </div>

              <section className="mt-6 bg-[#f5f5f3] p-6 sm:p-8">
                <h2 className="text-lg font-medium text-black">
                  Account Information
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                  Your profile and order information are now
                  connected to Firebase. Payment information will
                  be added when we connect M-PESA.
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  {cartItems.length} item
                  {cartItems.length !== 1 ? "s" : ""} currently in
                  your cart.
                </p>
              </section>
            </>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}

function Status({ status }) {
  const styles = {
    Paid: "bg-green-50 text-green-700",
    Pending: "bg-yellow-50 text-yellow-700",
    Shipped: "bg-blue-50 text-blue-700",
    Delivered: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex w-fit px-3 py-1.5 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "Pending"}
    </span>
  );
}