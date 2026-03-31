import { Router } from "express";
import { db } from "../config/firebase";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    let query: any = db.collection("categories");

    if (type) {
      query = query.where("type", "==", type);
    }

    const snapshot = await query.get();
    const categories = snapshot.docs.map((doc: any) => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Admin only: CREATE category
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const docRef = await db.collection("categories").add({
      ...req.body,
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ id: docRef.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

// Admin only: UPDATE category
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const id = req.params.id as string;
    await db.collection("categories").doc(id).update({
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

// Admin only: DELETE category
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const id = req.params.id as string;
    await db.collection("categories").doc(id).delete();
    res.json({ message: "Category deleted", id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;
