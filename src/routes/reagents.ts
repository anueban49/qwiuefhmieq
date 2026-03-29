import { Router } from "express";
import { db } from "../config/firebase";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

// GET all reagents
router.get("/", async (req, res) => {
  try {
    const { categoryId } = req.query;
    let query: any = db.collection("reagents");

    if (categoryId) {
      query = query.where("categoryId", "==", categoryId);
    }

    const snapshot = await query.get();
    const reagents = snapshot.docs.map((doc: any) => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    res.json(reagents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reagents" });
  }
});

// Admin only: CREATE reagent
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const docRef = await db.collection("reagents").add({
      ...req.body,
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ id: docRef.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: "Failed to create reagent" });
  }
});

// Admin only: UPDATE reagent
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const id = req.params.id as string;
    await db.collection("reagents").doc(id).update({
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: "Failed to update reagent" });
  }
});

// Admin only: DELETE reagent
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const id = req.params.id as string;
    await db.collection("reagents").doc(id).delete();
    res.json({ message: "Reagent deleted", id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete reagent" });
  }
});

export default router;
