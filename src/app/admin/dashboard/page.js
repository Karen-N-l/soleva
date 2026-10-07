"use client";

import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import app, { auth } from "../../../lib/firebase";

const db = getFirestore(app);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    sales: 0,
    pending: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
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
        const adminDoc = await getDoc(
          doc(db, "admins", user.uid)
        );

        if (!adminDoc.exists()) {
          setError("You do not have admin access.");
          setLoading(false);
          return;
        }

        const productsSnapshot = await getDocs(
          collection(db, "products")
        );

        const ordersSnapshot = await getDocs(
          collection(db, "orders")
        );

        const orders = ordersSnapshot.docs.map((orderDoc) => ({
          id: orderDoc.id,
          ...orderDoc.data(),
        }));

        const totalSales = orders.reduce(
          (total, order) =>
            total + Number(order.total || 0),
          0
        );

        const pendingOrders = orders.filter(
          (order) =>
            (order.status || "Pending").toLowerCase() ===
            "pending"
        ).length;

        setStats({
          products: productsSnapshot.size,
          orders: orders.length,
          sales: totalSales,
          pending: pendingOrders,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const statCards = [
    ["Total Products", stats.products],
    ["Total Orders", stats.orders],
    ["Total Sales", `KSh ${stats.sales.toLocaleString()}`],
    ["Pending Orders", stats.pending],
  ];

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
              Dashboard
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
              Manage your products, orders, and store activity.
            </p>
          </div>

          {loading && (
            <p className="mb-6 text-sm text-gray-500">
              Loading dashboard...
            </p>
          )}

          {error && (
            <p className="mb-6 text-sm text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {statCards.map(([label, value]) => (
                  <div
                    key={label}
                    className="min-w-0 border border-gray-200 p-4 sm:p-6"
                  >
                    <p className="text-xs leading-5 text-gray-500 sm:text-sm">
                      {label}
                    </p>

                    <p className="mt-2 break-words text-xl font-semibold text-black sm:mt-3 sm:text-2xl">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1fr_300px]">

                <section className="min-w-0 border border-gray-200 p-5 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-medium text-black">
                      Recent Orders
                    </h2>

                    <Link
                      href="/admin/orders"
                      className="shrink-0 text-xs text-gray-500 underline underline-offset-4 hover:text-black sm:text-sm"
                    >
                      View all
                    </Link>
                  </div>

                  {recentOrders.length === 0 ? (
                    <p className="mt-6 text-sm text-gray-500">
                      No orders have been placed yet.
                    </p>
                  ) : (
                    <>
                      <div className="mt-6 hidden overflow-x-auto sm:block">
                        <table className="w-full min-w-[560px] text-left">
                          <thead>
                            <tr className="border-b border-gray-200 text-xs text-gray-500">
                              <th className="pb-4 pr-4 font-medium">
                                Order
                              </th>

                              <th className="pb-4 pr-4 font-medium">
                                Customer
                              </th>

                              <th className="pb-4 pr-4 font-medium">
                                Total
                              </th>

                              <th className="pb-4 font-medium">
                                Status
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {recentOrders.map((order) => (
                              <tr
                                key={order.id}
                                className="border-b border-gray-100 text-sm last:border-0"
                              >
                                <td className="py-5 pr-4 font-medium text-black">
                                  {order.id}
                                </td>

                                <td className="py-5 pr-4 text-gray-600">
                                  {order.customer?.name ||
                                    order.customer?.email ||
                                    "Customer"}
                                </td>

                                <td className="py-5 pr-4 font-medium text-black">
                                  KSh{" "}
                                  {Number(
                                    order.total || 0
                                  ).toLocaleString()}
                                </td>

                                <td className="py-5">
                                  <Status
                                    status={order.status}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-6 space-y-4 sm:hidden">
                        {recentOrders.map((order) => (
                          <div
                            key={order.id}
                            className="border-b border-gray-100 pb-4 last:border-0"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="break-all text-sm font-medium text-black">
                                  {order.id}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {order.customer?.name ||
                                    order.customer?.email ||
                                    "Customer"}
                                </p>
                              </div>

                              <Status
                                status={order.status}
                              />
                            </div>

                            <p className="mt-3 text-sm font-medium text-black">
                              KSh{" "}
                              {Number(
                                order.total || 0
                              ).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </section>

                <aside className="h-fit bg-[#f5f5f3] p-5 sm:p-8">
                  <h2 className="text-lg font-medium text-black">
                    Quick Actions
                  </h2>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <Link
                      href="/admin/products"
                      className="block bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-[#d71920]"
                    >
                      Manage Products
                    </Link>

                    <Link
                      href="/admin/orders"
                      className="block border border-black px-5 py-3 text-center text-sm font-medium text-black transition hover:bg-black hover:text-white"
                    >
                      Manage Orders
                    </Link>
                  </div>
                </aside>

              </div>
            </>
          )}

          <div className="mt-8">
            <Link
              href="/"
              className="text-sm text-gray-500 underline underline-offset-4 transition hover:text-black"
            >
              ← Back to Store
            </Link>
          </div>

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
      className={`inline-flex shrink-0 px-3 py-1.5 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "Pending"}
    </span>
  );
}