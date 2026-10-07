import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import app from "./firebase";

const db = getFirestore(app);

export async function getProducts() {
  const snapshot = await getDocs(collection(db, "products"));

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: Number(doc.id),
      name: data.name || "",
      category: data.category || "",
      price: data.price || 0,
      image: data.image || "",
      isNew: data.isNew || false,
    };
  });
}

export async function createUserProfile(user) {
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    createdAt: new Date(),
  });
}

export async function getUserProfile(userId) {
  const snapshot = await getDoc(doc(db, "users", userId));

  return snapshot.exists() ? snapshot.data() : null;
}

export async function updateUserProfile(userId, data) {
  await updateDoc(doc(db, "users", userId), data);
}

export async function createOrder(orderData) {
  const orderRef = await addDoc(collection(db, "orders"), {
    ...orderData,
    status: "Pending",
    paymentStatus: "Pending",
    createdAt: serverTimestamp(),
  });

  return orderRef.id;
}

export async function getUserOrders(userId) {
  const ordersQuery = query(
    collection(db, "orders"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(ordersQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getAllOrders() {
  const snapshot = await getDocs(
    collection(db, "orders")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}