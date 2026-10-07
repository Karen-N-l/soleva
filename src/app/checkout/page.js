"use client";

import Image from "next/image";
import Link from "next/link";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";
import app, { auth } from "../../lib/firebase";

const db = getFirestore(app);

const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  county: "",
  notes: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setForm((current) => ({
          ...current,
          email: user.email || "",
        }));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const formatPhone = (phone) => {
    const value = phone.replace(/\s+/g, "").replace(/-/g, "");

    if (value.startsWith("+254")) return value.slice(1);
    if (value.startsWith("07")) return `254${value.slice(1)}`;
    if (value.startsWith("01")) return `254${value.slice(1)}`;

    return value;
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setError("");

    const user = auth.currentUser;

    if (!user) {
      setError("Please log in before placing your order.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.county
    ) {
      setError("Please complete all required fields.");
      return;
    }

    setPlacingOrder(true);

    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        price: Number(item.price),
        size: item.size,
        quantity: item.quantity,
        image: item.image,
      }));

      const orderData = {
        userId: user.uid,
        customer: {
          name: form.name.trim(),
          email: user.email || form.email,
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          county: form.county.trim(),
          notes: form.notes.trim(),
        },
        items: orderItems,
        total: cartTotal,
        status: "Pending",
        paymentStatus: "Pending",
        createdAt: new Date(),
      };

      const orderRef = await addDoc(
        collection(db, "orders"),
        orderData
      );

      const phone = formatPhone(form.phone);

      const paymentResponse = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          amount: cartTotal,
          orderId: orderRef.id,
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok || !paymentData.success) {
        console.error("M-PESA error:", paymentData);
        setError(
          paymentData.message ||
            "Unable to start M-PESA payment. Please try again."
        );
        setPlacingOrder(false);
        return;
      }

      sessionStorage.setItem(
        "soleva-last-order",
        JSON.stringify({
          id: orderRef.id,
          ...orderData,
        })
      );

      clearCart();
      router.push("/order-confirmation");
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        "Unable to place the order or start M-PESA payment."
      );
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <section className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-gray-500">
            Loading checkout...
          </p>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="px-5 py-12 sm:px-7 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#d71920]">
              Complete Your Order
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">
              Checkout
            </h1>
          </div>

          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <form
              onSubmit={handlePlaceOrder}
              className="grid gap-12 lg:grid-cols-[1fr_400px]"
            >
              <div>
                <h2 className="text-xl font-medium text-black">
                  Delivery Information
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Enter the information needed to deliver your order.
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <Field name="name" label="Full Name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                  <Field name="email" label="Email Address" value={form.email} onChange={handleChange} placeholder="you@example.com" type="email" disabled />
                  <Field name="phone" label="Phone Number" value={form.phone} onChange={handleChange} placeholder="07XX XXX XXX" required />
                  <Field name="city" label="City" value={form.city} onChange={handleChange} placeholder="Nairobi" required />
                  <Field name="county" label="County" value={form.county} onChange={handleChange} placeholder="Nairobi County" required />

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-black">
                      Delivery Address
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Street address or P.O. Box"
                      className="w-full resize-none border border-gray-200 px-4 py-3.5 text-sm outline-none placeholder:text-gray-400 focus:border-black"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-black">
                      Delivery Notes{" "}
                      <span className="font-normal text-gray-400">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Any instructions for delivery?"
                      className="w-full resize-none border border-gray-200 px-4 py-3.5 text-sm outline-none placeholder:text-gray-400 focus:border-black"
                    />
                  </div>
                </div>
              </div>

              <OrderSummary
                items={cartItems}
                total={cartTotal}
                placingOrder={placingOrder}
                error={error}
              />
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field({
  name,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-black"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none placeholder:text-gray-400 focus:border-black disabled:bg-gray-50 disabled:text-gray-500"
      />
    </div>
  );
}

function OrderSummary({ items, total, placingOrder, error }) {
  return (
    <aside className="h-fit bg-[#f5f5f3] p-6 sm:p-8">
      <h2 className="text-lg font-medium text-black">
        Order Summary
      </h2>

      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.size}`}
            className="flex gap-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-white">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-black">
                {item.name}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Size {item.size} · Qty {item.quantity}
              </p>
              <p className="mt-2 text-sm font-medium text-black">
                KSh {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 border-t border-gray-200 pt-5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span>KSh {total.toLocaleString()}</span>
        </div>

        <div className="mt-4 flex justify-between text-sm">
          <span className="text-gray-500">Delivery</span>
          <span>Free</span>
        </div>

        <div className="mt-5 flex justify-between border-t border-gray-200 pt-5">
          <span className="font-medium">Total</span>
          <span className="text-lg font-semibold">
            KSh {total.toLocaleString()}
          </span>
        </div>
      </div>

      {error && (
        <p className="mt-5 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={placingOrder}
        className="mt-7 w-full bg-black px-7 py-4 text-sm font-medium text-white transition hover:bg-[#d71920] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {placingOrder
          ? "Starting M-PESA Payment..."
          : "Pay with M-PESA"}
      </button>

      <Link
        href="/cart"
        className="mt-4 block text-center text-sm text-gray-500 underline underline-offset-4 hover:text-black"
      >
        Back to Cart
      </Link>
    </aside>
  );
}

function EmptyCart() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-semibold text-black">
        Your cart is empty
      </h2>
      <p className="mt-3 text-sm text-gray-500">
        Add some sneakers before checking out.
      </p>
      <Link
        href="/shop"
        className="mt-7 bg-black px-7 py-3.5 text-sm font-medium text-white hover:bg-[#d71920]"
      >
        Shop Sneakers
      </Link>
    </div>
  );
}