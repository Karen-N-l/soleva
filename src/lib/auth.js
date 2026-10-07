import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "./firebase";
import { createUserProfile } from "./firestore";

export async function registerUser(email, password) {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await createUserProfile(result.user);

  return result;
}

export async function loginUser(email, password) {
  return signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}

export async function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
  return signOut(auth);
}