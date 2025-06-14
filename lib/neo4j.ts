import neo4j from "neo4j-driver";
import "dotenv/config";
const uri = process.env.NEO4J_URI!;
const user = process.env.NEO4J_USER!;
const password = process.env.NEO4J_PASSWORD!;

export const neo4jDriver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export const neo4jSession = neo4jDriver.session();

// Optional: cleanup connection khi server tắt (dev)
process.on("exit", async () => {
  await neo4jDriver.close();
});
