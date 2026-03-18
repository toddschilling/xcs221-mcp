import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";

import { courseData } from "./data/courseData.js";
import {
  answerCourseQuestion,
  getAssignmentDeadlineAnswer,
  getRepositoryAnswer,
  getTodayProgressAnswer
} from "./tools/courseTools.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "xcs221-course-guide",
    version: "0.1.0"
  });

  server.registerResource(
    "course_data",
    "xcs221://course-data",
    {
      title: "XCS221 static course data",
      description: "Term schedule, assignment deadlines, pacing milestones, and repo links.",
      mimeType: "application/json"
    },
    async () => ({
      contents: [
        {
          uri: "xcs221://course-data",
          mimeType: "application/json",
          text: JSON.stringify(courseData, null, 2)
        }
      ]
    })
  );

  server.registerTool(
    "get_assignment_deadlines",
    {
      title: "Assignment deadlines",
      description: "Return assignment due dates from static XCS221 course data.",
      inputSchema: {
        referenceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("YYYY-MM-DD"),
        includePast: z
          .boolean()
          .optional()
          .describe("If true, include deadlines before referenceDate. Default false.")
      }
    },
    async ({ referenceDate, includePast }) => ({
      content: [
        {
          type: "text",
          text: getAssignmentDeadlineAnswer(referenceDate, includePast ?? false)
        }
      ]
    })
  );

  server.registerTool(
    "get_today_progress",
    {
      title: "Today pacing guidance",
      description:
        "Return where a student should be in lectures and assignments for a given date.",
      inputSchema: {
        referenceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("YYYY-MM-DD")
      }
    },
    async ({ referenceDate }) => ({
      content: [
        {
          type: "text",
          text: getTodayProgressAnswer(referenceDate)
        }
      ]
    })
  );

  server.registerTool(
    "get_course_repositories",
    {
      title: "Course repositories",
      description: "Return git repository URLs for setup and assignments."
    },
    async () => ({
      content: [
        {
          type: "text",
          text: getRepositoryAnswer()
        }
      ]
    })
  );

  server.registerTool(
    "answer_course_question",
    {
      title: "Question router",
      description:
        "Answer a natural-language XCS221 logistics question using static data (deadlines, pacing, repositories).",
      inputSchema: {
        question: z.string().min(1).describe("Natural-language course logistics question"),
        referenceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("YYYY-MM-DD")
      }
    },
    async ({ question, referenceDate }) => ({
      content: [
        {
          type: "text",
          text: answerCourseQuestion(question, referenceDate)
        }
      ]
    })
  );

  return server;
}

export async function runStdioServer(): Promise<void> {
  // Stdio transport keeps this server stateless and auth-free for local MCP clients.
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
