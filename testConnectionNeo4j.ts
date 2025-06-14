import "dotenv/config"; // 👈 bắt buộc nếu chạy ngoài Next.js

import { neo4jSession } from "./lib/neo4j";

async function testNeo4jConnection() {
  const result = await neo4jSession.run(`RETURN "Neo4j connected!" AS msg`);
  console.log(result.records[0].get("msg"));
  await neo4jSession.close(); // cleanup
}

testNeo4jConnection();
