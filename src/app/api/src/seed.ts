import { db } from "./config/firebase";
import { 
  TG_CATEGORIES, 
  INSTRUMENT_PRODUCTS, 
  REAGENT_PRODUCTS, 
  TOP_LEVEL_PILLARS 
} from "../../lib/mockData";

async function clearCollection(collectionName: string) {
  const snapshot = await db.collection(collectionName).get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}

async function seedDatabase() {
  console.log("🚀 Starting database seeding...");

  try {
    // 0. Clear old data
    console.log("🧹 Clearing old data...");
    await clearCollection("categories");
    await clearCollection("instruments");
    await clearCollection("reagents");
    await clearCollection("pillars");

    // 1. Seed Categories
    console.log("📂 Seeding categories...");
    const categoryPromises = TG_CATEGORIES.map(cat => 
      db.collection("categories").doc(cat.id).set(cat)
    );
    await Promise.all(categoryPromises);

    // 2. Seed Instruments
    console.log("🔬 Seeding instruments...");
    const instrumentPromises = INSTRUMENT_PRODUCTS.map(inst => 
      db.collection("instruments").doc(inst.id).set(inst)
    );
    await Promise.all(instrumentPromises);

    // 3. Seed Reagents
    console.log("🧪 Seeding reagents...");
    const reagentPromises = REAGENT_PRODUCTS.map(reag => 
      db.collection("reagents").doc(reag.id).set(reag)
    );
    await Promise.all(reagentPromises);

    // 4. Seed Pillars (Home page)
    console.log("🏛️ Seeding pillars...");
    const pillarPromises = TOP_LEVEL_PILLARS.map(pillar => 
      db.collection("pillars").doc(pillar.id).set(pillar)
    );
    await Promise.all(pillarPromises);

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
