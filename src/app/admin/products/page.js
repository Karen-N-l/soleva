"use client";

import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import app, { auth } from "../../../lib/firebase";

const db = getFirestore(app);

const emptyForm = {
  name: "",
  category: "Men",
  price: "",
  image: "",
  isNew: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

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

        await loadProducts();
      } catch (err) {
        console.error(err);
        setError("Unable to load products.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function loadProducts() {
    const snapshot = await getDocs(
      collection(db, "products")
    );

    const productData = snapshot.docs.map((productDoc) => ({
      id: productDoc.id,
      ...productDoc.data(),
    }));

    setProducts(productData);
    setLoading(false);
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.image) {
      setError("Please complete all required fields.");
      return;
    }

    setSaving(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        setError("Please log in as an admin.");
        return;
      }

      const adminDoc = await getDoc(
        doc(db, "admins", user.uid)
      );

      if (!adminDoc.exists()) {
        setError("You do not have admin access.");
        return;
      }

      await addDoc(collection(db, "products"), {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        image: form.image.trim(),
        isNew: form.isNew,
      });

      setForm(emptyForm);
      setShowForm(false);
      await loadProducts();
    } catch (err) {
      console.error(err);
      setError("Unable to add product.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      category: product.category || "Men",
      price: product.price || "",
      image: product.image || "",
      isNew: product.isNew || false,
    });

    setShowForm(true);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.image) {
      setError("Please complete all required fields.");
      return;
    }

    setSaving(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        setError("Please log in as an admin.");
        return;
      }

      const adminDoc = await getDoc(
        doc(db, "admins", user.uid)
      );

      if (!adminDoc.exists()) {
        setError("You do not have admin access.");
        return;
      }

      await updateDoc(
        doc(db, "products", editingId),
        {
          name: form.name.trim(),
          category: form.category,
          price: Number(form.price),
          image: form.image.trim(),
          isNew: form.isNew,
        }
      );

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      await loadProducts();
    } catch (err) {
      console.error(err);
      setError("Unable to update product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(product.id);
    setError("");

    try {
      const user = auth.currentUser;

      if (!user) {
        setError("Please log in as an admin.");
        return;
      }

      const adminDoc = await getDoc(
        doc(db, "admins", user.uid)
      );

      if (!adminDoc.exists()) {
        setError("You do not have admin access.");
        return;
      }

      await deleteDoc(
        doc(db, "products", product.id)
      );

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) => item.id !== product.id
        )
      );
    } catch (err) {
      console.error(err);
      setError("Unable to delete product.");
    } finally {
      setDeleting(null);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1400px]">

          <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#d71920] sm:text-sm">
                Admin
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl lg:text-5xl">
                Products
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
                View and manage the sneakers in your store.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (showForm) {
                  closeForm();
                } else {
                  setForm(emptyForm);
                  setEditingId(null);
                  setShowForm(true);
                  setError("");
                }
              }}
              className="w-full bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#d71920] sm:w-auto"
            >
              {showForm
                ? "Close Form"
                : "Add Product"}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={
                editingId
                  ? handleUpdateProduct
                  : handleAddProduct
              }
              className="mb-10 border border-gray-200 p-5 sm:p-7"
            >
              <h2 className="text-lg font-medium text-black">
                {editingId
                  ? "Edit Product"
                  : "Add New Product"}
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-black"
                  >
                    Product Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Aero Runner"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-black"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium text-black"
                  >
                    Price
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="3500"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="mb-2 block text-sm font-medium text-black"
                  >
                    Image Path
                  </label>

                  <input
                    id="image"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="/images/images-2.jpg"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                    required
                  />
                </div>
              </div>

              <label className="mt-5 flex items-center gap-3 text-sm text-black">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={form.isNew}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                Mark as New
              </label>

              {error && (
                <p className="mt-5 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-black px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#d71920] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Save Product"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={closeForm}
                    className="border border-black px-7 py-3.5 text-sm font-medium text-black transition hover:bg-black hover:text-white"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          {!showForm && error && (
            <p className="mb-6 text-sm text-red-600">
              {error}
            </p>
          )}

          {loading && (
            <p className="text-sm text-gray-500">
              Loading products...
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="border border-gray-200 p-6 sm:p-8">
              <p className="text-sm text-gray-500">
                No products found.
              </p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="border border-gray-200"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#f5f5f3]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />

                    {product.isNew && (
                      <span className="absolute left-3 top-3 bg-black px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-white">
                        New
                      </span>
                    )}
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="text-xs text-gray-500">
                      {product.category}
                    </p>

                    <h2 className="mt-1 text-base font-medium text-black">
                      {product.name}
                    </h2>

                    <p className="mt-2 text-sm font-medium text-black">
                      KSh{" "}
                      {Number(product.price).toLocaleString()}
                    </p>

                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleEditProduct(product)
                        }
                        className="flex-1 border border-black px-3 py-2.5 text-xs font-medium text-black transition hover:bg-black hover:text-white"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteProduct(product)
                        }
                        disabled={deleting === product.id}
                        className="flex-1 border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-500 transition hover:border-[#d71920] hover:text-[#d71920] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deleting === product.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-8">
            <Link
              href="/admin/dashboard"
              className="text-sm text-gray-500 underline underline-offset-4 transition hover:text-black"
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