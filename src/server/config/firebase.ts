import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();

const initializeFirebase = () => {
  if (admin.apps.length > 0) return admin.app();

  // If you have a serviceAccountKey.json, you can use it like this:
  // const serviceAccount = require("../../serviceAccountKey.json");
  
  // Or use environment variables for better security:
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined;

  if (serviceAccount) {
    // Ensure newlines in the private key are handled correctly
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    });
  } else {
    // Fallback for development if only using standard client config
    // Note: Some Admin features require a full service account
    console.warn("No FIREBASE_SERVICE_ACCOUNT found. Initializing with default credentials.");
    return admin.initializeApp();
  }
};

const app = initializeFirebase();
const db = admin.firestore(app);
const auth = admin.auth(app);

export { admin, db, auth };
