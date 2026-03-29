import { Router } from "express";
import { db } from "../config/firebase";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

// GET all instruments
router.get("/", async (req, res) => {
  try {
    const { categoryId } = req.query;
    let query: any = db.collection("instruments");

    if (categoryId) {
      query = query.where("categoryId", "==", categoryId);
    }

    const snapshot = await query.get();
    const instruments = snapshot.docs.map((doc: any) => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    res.json(instruments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch instruments" });
  }
});

// GET instrument by ID
router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("instruments").doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Instrument not found" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch instrument" });
  }
});

// Admin only: CREATE instrument
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const docRef = await db.collection("instruments").add({
      ...req.body,
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ id: docRef.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: "Failed to create instrument" });
  }
});

// Admin only: UPDATE instrument
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const id = req.params.id as string;
    await db.collection("instruments").doc(id).update({
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: "Failed to update instrument" });
  }
});

// Admin only: DELETE instrument
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const id = req.params.id as string;
    await db.collection("instruments").doc(id).delete();
    res.json({ message: "Instrument deleted", id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete instrument" });
  }
});

export default router;
