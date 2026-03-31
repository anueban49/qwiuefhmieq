// server/routes/auth.ts (or wherever Access lives)
import type { RequestHandler } from "express";
import { auth, db } from "../config/firebase";

export const Access: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️Call Firebase REST API to sign in
    //    (no client SDK needed on the server!) -> firebase-client dependency(?)
    const firebaseRes = await fetch(
      `${process.env.NEXT_PUBLIC_FIREBASE_ADMINLINK}/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      },
    );

    const firebaseData = await firebaseRes.json();

    if (firebaseData.error) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    const idToken = firebaseData.idToken;

    //  token verification with firebase-admin
    const decoded = await auth.verifyIdToken(idToken);

    //  Check if this user has role == "admin" in Firestore
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized", success: false });
    }

    // session cookie that lasts for 7 days
    const expiresIn = 60 * 60 * 24 * 7 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });

    // Send cookie to the browser
    res.cookie("admin_session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
      path: "/",
    });

    return res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Login failed", success: false });
  }
};
