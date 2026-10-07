"use client";

import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import app from "../../lib/firebase";

const db = getFirestore(app);

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = sessionStorage.getItem("soleva-last-order");

    if (!savedOrder) return;

    const saved = JSON.parse(savedOrder);
    setOrder(saved);

    const unsubscribe = onSnapshot(
      doc(db, "orders", saved.id),
      (snapshot) => {
        if (snapshot.exists()) {
          setOrder({
            id: snapshot.id,
            ...snapshot.data(),
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  if (!order) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <section className="flex min-h-[60vh] items-center justify-center px-5">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-black">
              Order information unavailable
            </h1>
            <p className="mt-3 text-sm text-gray-500">
              Please check your account to view your orders.
            </p>
            <Link
              href="/account"
              className="mt-6 inline-flex bg-black px-6 py-3 text-sm font-medium text-white hover:bg-[#d71920]"
            >
              View Account
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const paymentStatus = order.paymentStatus || "Pending";

  const statusClass =
    paymentStatus === "Paid"
      ? "text-green-700"
      : paymentStatus === "Failed"
        ? "text-red-600"
        : "text-yellow-700";

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="px-5 py-16 sm:px-7 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12l4 4L19 6" />
              </svg>
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-[#d71920]">
              Thank You
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black sm:text-5xl">
              Order Confirmed
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
              Your order has been received successfully. We will
              contact you with delivery details.
            </p>

            <p className="mt-5 text-sm text-gray-500">
              Order Number:{" "}
              <span className="font-medium text-black">
                {order.id}
              </span>
            </p>
          </div>

          <div className="mt-12 bg-[#f5f5f3] p-6 sm:p-8">
            <h2 className="text-lg font-medium text-black">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              {order.items?.map((item, index) => (
                <div
                  key={`${item.productId}-${item.size}-${index}`}
                  className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4"
                >
                  <div>
                    <p className="text-sm font-medium text-black">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Size {item.size} · Qty {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-medium text-black">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between border-t border-gray-200 pt-5">
              <span className="font-medium text-black">Total</span>
              <span className="text-lg font-semibold text-black">
                KSh {Number(order.total || 0).toLocaleString()}
              </span>
            </div>

            <div className="mt-5 flex justify-between text-sm">
              <span className="text-gray-500">Payment Status</span>
              <span className={`font-medium ${statusClass}`}>
                {paymentStatus}
              </span>
            </div>

            {order.mpesaReceiptNumber && (
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-500">M-PESA Receipt</span>
                <span className="font-medium text-black">
                  {order.mpesaReceiptNumber}
                </span>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className="bg-black px-7 py-3.5 text-center text-sm font-medium text-white hover:bg-[#d71920]"
            >
              Continue Shopping
            </Link>

            <Link
              href="/account"
              className="border border-black px-7 py-3.5 text-center text-sm font-medium text-black hover:bg-black hover:text-white"
            >
              View Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}