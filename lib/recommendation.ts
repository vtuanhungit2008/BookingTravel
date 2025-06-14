import { neo4jSession } from "./neo4j";

/**
 * Lấy danh sách gợi ý property cho user, dựa vào đánh giá (rating)
 */
export async function getRecommendations(userId: string) {
  const result = await neo4jSession.run(
    `
    MATCH (u:User {id: $userId})-[r1:RATED]->(p1:Property)
    WHERE r1.rating >= 4

    MATCH (other:User)-[r2:RATED]->(p1)
    MATCH (other)-[r3:RATED]->(p2:Property)
    WHERE NOT EXISTS {
      MATCH (u)-[:RATED]->(p2)
    }

    RETURN p2.id AS propertyId, AVG(r3.rating) AS score
    ORDER BY score DESC
    LIMIT 5
    `,
    { userId }
  );

  return result.records.map((record) => ({
    propertyId: record.get("propertyId"),
    score: record.get("score"),
  }));
}
