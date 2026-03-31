import { Router } from "express";
import { db } from "../config/firebase";

const router = Router();

// GET all pillars (home page divisions)
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("pillars").get();
    const pillars = snapshot.docs.map((doc: any) => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    res.json(pillars);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pillars" });
  }
});

export default router;
