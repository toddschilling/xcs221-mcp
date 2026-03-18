import { describe, expect, it } from "vitest";

import {
  answerCourseQuestion,
  detectIntent,
  getAssignmentDeadlineAnswer,
  getTodayProgressAnswer,
  resolveReferenceDate
} from "../src/tools/courseTools.js";

describe("resolveReferenceDate", () => {
  it("returns explicit date when valid", () => {
    expect(resolveReferenceDate("2026-01-07")).toBe("2026-01-07");
  });

  it("throws when date format is invalid", () => {
    expect(() => resolveReferenceDate("01/07/2026")).toThrowError(
      "referenceDate must use YYYY-MM-DD format."
    );
  });
});

describe("getAssignmentDeadlineAnswer", () => {
  it("lists upcoming assignments in deadline order", () => {
    const response = getAssignmentDeadlineAnswer("2026-01-16");

    expect(response).toContain("Assignment 2: Multi-agent search");
    expect(response).toContain("Assignment 3: Reinforcement learning");
    expect(response).not.toContain("Assignment 1: Search and dynamic programming");
  });
});

describe("getTodayProgressAnswer", () => {
  it("returns guidance for current milestone and next due assignment", () => {
    const response = getTodayProgressAnswer("2026-01-13");

    expect(response).toContain("Week 2: Heuristics and adversarial search");
    expect(response).toContain("Finish Assignment 1");
    expect(response).toContain("Next assignment due");
  });
});

describe("detectIntent", () => {
  it("detects deadline question", () => {
    expect(detectIntent("When are assignments due?")).toBe("assignment_deadlines");
  });

  it("detects today pacing question", () => {
    expect(detectIntent("Where should I be in lectures today?")).toBe("today_progress");
  });

  it("detects repository question", () => {
    expect(detectIntent("Which git repository has my setup?")).toBe("repository_lookup");
  });

  it("returns unknown for unrelated question", () => {
    expect(detectIntent("What is the grading rubric for style?")).toBe("unknown");
  });
});

describe("answerCourseQuestion", () => {
  it("returns fallback help for unknown intent", () => {
    const response = answerCourseQuestion("Who are the section leaders?");
    expect(response).toContain("I could not map this question");
    expect(response).toContain("When are assignments due?");
  });
});
