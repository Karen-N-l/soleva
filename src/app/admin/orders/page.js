"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import app, { auth } from "../../../lib/firebase";

const db = getFirestore(app);

const statuses = [
  "Pending",
  "Paid",
  "Shipped",
  "Delivered",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("Please log in as an admin.");
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDocs(
          collection(db, "orders")
        );

        const data = snapshot.docs.map((orderDoc) => ({
          id: orderDoc.id,
          ...orderDoc.data(),
        }));

        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load orders.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    setError("");

    try {
      await updateDoc(
        doc(db, "orders", orderId),
        {
          status,
        }
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? { ...order, status }
            : order
        )
      );
    } catch (err) {
      console.error(err);
      setError("Unable to update order status.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1400px]">

          <div className="mb-8 sm:mb-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#d71920] sm:text-sm">
              Admin
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl lg:text-5xl">
              Orders
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
              View and manage customer orders.
            </p>
          </div>

          {loading && (
            <p className="text-sm text-gray-500">
              Loading orders...
            </p>
          )}

          {error && (
            <p className="mb-6 text-sm text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="border border-gray-200 p-6">
              <p className="text-sm text-gray-500">
                No orders have been placed yet.
              </p>
            </div>
          )}

          {!loading && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  updating={updating === order.id}
                  onStatusChange={updateStatus}
                />
              ))}
            </div>
          )}

          <div className="mt-8">
            <Link
              href="/admin/dashboard"
              className="text-sm text-gray-500 underline underline-offset-4 hover:text-black"
            >
              ← Back to Dashboard
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

function OrderCard({
  order,
  updating,
  onStatusChange,
}) {
  const customer = order.customer || {};
  const items = order.items || [];

  return (
    <article className="border border-gray-200 p-5 sm:p-7">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="min-w-0">
          <p className="text-xs text-gray-500">
            Order
          </p>

          <h2 className="mt-1 break-all text-sm font-medium text-black">
            {order.id}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {customer.name ||
              customer.email ||
              "Customer"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:flex lg:items-center">

          <div>
            <p className="text-xs text-gray-500">
              Items
            </p>

            <p className="mt-1 text-sm text-black">
              {items.length} item
              {items.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Total
            </p>

            <p className="mt-1 text-sm font-medium text-black">
              KSh{" "}
              {Number(
                order.total || 0
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Status
            </p>

            <select
              value={order.status || "Pending"}
              disabled={updating}
              onChange={(event) =>
                onStatusChange(
                  order.id,
                  event.target.value
                )
              }
              className="mt-1 border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-black disabled:opacity-50"
            >
              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-5">
        <Link
          href={`/admin/orders/${order.id}`}
          className="text-xs font-medium text-black underline underline-offset-4 hover:text-[#d71920]"
        >
          View Order Details
        </Link>

        {updating && (
          <span className="ml-4 text-xs text-gray-500">
            Updating...
          </span>
        )}
      </div>

    </article>
  );
}