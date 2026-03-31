import { db } from "./src/config/firebase";

async function check() {
  try {
    const snapshot = await db.collection("categories").get();
    console.log(`Total Categories: ${snapshot.size}`);
    snapshot.forEach((doc) => {
      console.log(`- ${doc.id} (${doc.data().type}): ${doc.data().title}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
