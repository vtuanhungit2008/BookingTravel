// scripts/syncReviewToNeo4j.ts
import { neo4jSession } from "@/lib/neo4j";
import prisma from "@/utils/db";
import "dotenv/config";

export async function syncReviewToNeo4j() {
  const reviews = await prisma.review.findMany({
    include: {
      profile: true,
      property: true,
    },
  });

  for (const review of reviews) {
    await neo4jSession.run(
      `
      MERGE (u:User {id: $userId})
      MERGE (p:Property {id: $propertyId})
      MERGE (u)-[r:RATED]->(p)
      SET r.rating = $rating
      `,
      {
        userId: review.profileId,
        propertyId: review.propertyId,
        rating: review.rating,
      }
    );
  }

  console.log(`✅ Synced ${reviews.length} reviews to Neo4j`);
  await neo4jSession.close();
}
syncReviewToNeo4j().catch((err) => {
  console.error("❌ Sync failed:", err);
});
