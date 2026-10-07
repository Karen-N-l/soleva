"use client";

import { use, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import { auth } from "../../../../lib/firebase";
import { getAllOrders } from "../../../../lib/firestore";

export default function OrderDetails({ params }) {
  const { id } = use(params);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("Please log in as an admin.");
        setLoading(false);
        return;
      }

      try {
        const orders = await getAllOrders();

        const selectedOrder = orders.find(
          (item) => item.id === id
        );

        if (!selectedOrder) {
          setError("Order not found.");
        } else {
          setOrder(selectedOrder);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load this order.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />

        <section className="flex min-h-[60vh] items-center justify-center px-5">
          <p className="text-sm text-gray-500">
            Loading order...
          </p>
        </section>

        <Footer />
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />

        <section className="flex min-h-[60vh] items-center justify-center px-5">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-black">
              {error || "Order not found"}
            </h1>

            <Link
              href="/admin/orders"
              className="mt-6 inline-flex bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-[#d71920]"
            >
              Back to Orders
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  const customer = order.customer || {};
  const items = order.items || [];
  const total = order.total || 0;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1100px]">

          <Link
            href="/admin/orders"
            className="text-sm text-gray-500 underline underline-offset-4 transition hover:text-black"
          >
            ← Back to Orders
          </Link>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#d71920] sm:text-sm">
                Order Details
              </p>

              <h1 className="break-all text-2xl font-semibold tracking-tight text-black sm:text-4xl">
                {order.id}
              </h1>
            </div>

            <Status status={order.status} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="border border-gray-200 p-5 sm:p-7">
              <h2 className="text-lg font-medium text-black">
                Customer Information
              </h2>

              <div className="mt-6 space-y-5">
                <Info
                  label="Name"
                  value={customer.name || "Not provided"}
                />

                <Info
                  label="Email"
                  value={customer.email || "Not provided"}
                />

                <Info
                  label="Phone"
                  value={customer.phone || "Not provided"}
                />

                <Info
                  label="Delivery Address"
                  value={customer.address || "Not provided"}
                />

                <Info
                  label="City"
                  value={customer.city || "Not provided"}
                />

                <Info
                  label="County"
                  value={customer.county || "Not provided"}
                />
              </div>
            </section>

            <section className="border border-gray-200 p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-medium text-black">
                  Payment
                </h2>

                <PaymentStatus
                  status={order.paymentStatus}
                />
              </div>

              <div className="mt-6 space-y-5">
                <Info
                  label="Order Status"
                  value={order.status || "Pending"}
                />

                <Info
                  label="Payment Status"
                  value={order.paymentStatus || "Pending"}
                />

                <Info
                  label="Items"
                  value={`${items.length} item${
                    items.length !== 1 ? "s" : ""
                  }`}
                />

                <Info
                  label="Total"
                  value={`KSh ${total.toLocaleString()}`}
                />
              </div>
            </section>
          </div>

          <section className="mt-6 border border-gray-200 p-5 sm:p-7">
            <h2 className="text-lg font-medium text-black">
              Ordered Items
            </h2>

            <div className="mt-6 space-y-5">
              {items.map((item, index) => (
                <div
                  key={`${item.productId}-${item.size}-${index}`}
                  className="flex flex-col gap-3 border-b border-gray-100 pb-5 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-black">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Size {item.size} · Qty {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-medium text-black">
                    KSh{" "}
                    {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-200 pt-5">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-black">
                  Total
                </span>

                <span className="text-lg font-semibold text-black">
                  KSh {total.toLocaleString()}
                </span>
              </div>
            </div>
          </section>

          {customer.notes && (
            <section className="mt-6 bg-[#f5f5f3] p-5 sm:p-7">
              <h2 className="text-lg font-medium text-black">
                Delivery Notes
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {customer.notes}
              </p>
            </section>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-black">
        {value}
      </p>
    </div>
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
      className={`w-fit shrink-0 px-4 py-2 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "Pending"}
    </span>
  );
}

function PaymentStatus({ status }) {
  const styles = {
    Paid: "bg-green-50 text-green-700",
    Pending: "bg-yellow-50 text-yellow-700",
    Failed: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`w-fit shrink-0 px-3 py-1.5 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "Pending"}
    </span>
  );
}