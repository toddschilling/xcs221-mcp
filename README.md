# XCS221 MCP Server Template

Template MCP server that helps AI agents answer common XCS221 course logistics questions from **static in-repo data** (no auth, no external APIs).

## What this template answers

Out of the box, it is designed for questions such as:

1. **When are assignments due?**
2. **Where should I be in lectures/assignments today?**
3. **Which git repository has setup or assignment code?**

The server exposes both direct tools and a natural-language router tool.

## Tech stack

- **Language:** TypeScript (Node.js)
- **MCP SDK:** `@modelcontextprotocol/sdk`
- **Validation:** `zod`
- **Tests:** `vitest`

TypeScript is a strong fit because the official MCP SDK for Node is mature and gives a clean typed API for resources + tools.

## Folder structure

```text
.
├── src
│   ├── data
│   │   └── courseData.ts         # Static schedule/repo data (edit this each term)
│   ├── tools
│   │   └── courseTools.ts        # Pure logic for deadlines, pacing, and routing
│   ├── server.ts                 # MCP server + tool/resource registration
│   └── index.ts                  # Stdio entrypoint
├── tests
│   └── courseTools.test.ts       # Unit tests for tool logic
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Available MCP capabilities

### Resource

- `xcs221://course-data`  
  Full static JSON data for term schedule, assignments, and repositories.

### Tools

- `get_assignment_deadlines`
  - Input:
    - `referenceDate?` (`YYYY-MM-DD`)
    - `includePast?` (`boolean`)
  - Returns assignment due dates from static data.

- `get_today_progress`
  - Input:
    - `referenceDate?` (`YYYY-MM-DD`)
  - Returns pacing guidance (lecture focus + assignment focus) for that day.

- `get_course_repositories`
  - Input: none
  - Returns setup and assignment repository URLs.

- `answer_course_question`
  - Input:
    - `question` (`string`)
    - `referenceDate?` (`YYYY-MM-DD`)
  - Routes natural-language questions to the right static answer set.

## Quick start

### 1) Install

```bash
npm install
```

### 2) Run tests

```bash
npm test
```

### 3) Start MCP server (stdio transport)

```bash
npm run dev
```

or build + run:

```bash
npm run build
npm start
```

## MCP client config example

Use stdio in your MCP client:

```json
{
  "mcpServers": {
    "xcs221-course-guide": {
      "command": "node",
      "args": ["/absolute/path/to/repo/dist/index.js"]
    }
  }
}
```

If running TypeScript directly in development:

```json
{
  "mcpServers": {
    "xcs221-course-guide-dev": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/repo/src/index.ts"]
    }
  }
}
```

## Customizing for your actual course term

Edit `src/data/courseData.ts`:

- update `term`, `timezone`, and `courseStartDate`
- replace assignment `dueDate` and `repo` links
- update `pacingMilestones` date ranges and topics
- update `repositories` list to your real setup/assignment repos

No auth changes are required unless you intentionally add external systems.

## Testing

Current tests cover:

- date validation
- upcoming deadline selection
- day-specific pacing guidance
- natural-language intent routing
- fallback behavior for unknown questions

Add tests in `tests/` as you extend new tools or data fields.
