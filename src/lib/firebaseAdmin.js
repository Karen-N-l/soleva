import { cert, getApps, initializeApp } from "firebase-admin/app";
import serviceAccount from "../../serviceAccountKey.json";

const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
      });

export default adminApp;