import { runStdioServer } from "./server.js";

runStdioServer().catch((error) => {
  console.error("Failed to start XCS221 MCP server:", error);
  process.exit(1);
});
