import { courseData, type Assignment, type PacingMilestone } from "../data/courseData.js";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type QuestionIntent =
  | "assignment_deadlines"
  | "today_progress"
  | "repository_lookup"
  | "unknown";

export function resolveReferenceDate(referenceDate?: string, now: Date = new Date()): string {
  if (referenceDate !== undefined && !ISO_DATE_RE.test(referenceDate)) {
    throw new Error("referenceDate must use YYYY-MM-DD format.");
  }

  return referenceDate ?? now.toISOString().slice(0, 10);
}

export function getAssignmentsByDeadline(referenceDate: string, includePast = false): Assignment[] {
  return courseData.assignments
    .filter((assignment) => includePast || assignment.dueDate >= referenceDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

function formatAssignments(assignments: Assignment[]): string {
  if (assignments.length === 0) {
    return `No assignments are due on or after the selected date in the static schedule for ${courseData.term}.`;
  }

  return assignments
    .map(
      (assignment) =>
        `- ${assignment.title} (${assignment.id}) due ${assignment.dueDate} [${courseData.timezone}]` +
        `\n  repo: ${assignment.repo}`
    )
    .join("\n");
}

export function getAssignmentDeadlineAnswer(referenceDate?: string, includePast = false): string {
  const resolvedDate = resolveReferenceDate(referenceDate);
  const assignments = getAssignmentsByDeadline(resolvedDate, includePast);

  return [
    `Assignment deadlines for ${courseData.course} (${courseData.term})`,
    `Reference date: ${resolvedDate}`,
    "",
    formatAssignments(assignments)
  ].join("\n");
}

export function findCurrentMilestone(referenceDate: string): PacingMilestone | undefined {
  return courseData.pacingMilestones.find(
    (milestone) => milestone.startDate <= referenceDate && referenceDate <= milestone.endDate
  );
}

function findNextMilestone(referenceDate: string): PacingMilestone | undefined {
  return courseData.pacingMilestones
    .filter((milestone) => milestone.startDate > referenceDate)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
}

function formatMilestone(milestone: PacingMilestone): string {
  return [
    `Milestone: ${milestone.title} (${milestone.startDate} to ${milestone.endDate})`,
    `Lecture focus: ${milestone.lectureFocus.join("; ")}`,
    `Assignment focus: ${milestone.assignmentFocus.join("; ")}`
  ].join("\n");
}

function nextUpcomingAssignment(referenceDate: string): Assignment | undefined {
  return courseData.assignments
    .filter((assignment) => assignment.dueDate >= referenceDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
}

export function getTodayProgressAnswer(referenceDate?: string): string {
  const resolvedDate = resolveReferenceDate(referenceDate);
  const currentMilestone = findCurrentMilestone(resolvedDate);
  const upcomingAssignment = nextUpcomingAssignment(resolvedDate);

  const lines: string[] = [
    `Today plan for ${courseData.course} (${courseData.term})`,
    `Reference date: ${resolvedDate}`
  ];

  if (currentMilestone) {
    lines.push("", formatMilestone(currentMilestone));
  } else {
    const nextMilestone = findNextMilestone(resolvedDate);
    if (nextMilestone) {
      lines.push(
        "",
        `The term pacing schedule has not reached this date yet.`,
        `Next milestone begins ${nextMilestone.startDate}.`,
        formatMilestone(nextMilestone)
      );
    } else {
      lines.push(
        "",
        "The date appears to be after the published pacing milestones.",
        "Review and finalize any remaining project work."
      );
    }
  }

  if (upcomingAssignment) {
    lines.push(
      "",
      `Next assignment due: ${upcomingAssignment.title} on ${upcomingAssignment.dueDate}`,
      `Repository: ${upcomingAssignment.repo}`
    );
  }

  return lines.join("\n");
}

export function getRepositoryAnswer(): string {
  const lines = [
    `Course repositories for ${courseData.course} (${courseData.term})`,
    "",
    ...courseData.repositories.map(
      (repo) => `- ${repo.name}\n  url: ${repo.url}\n  purpose: ${repo.purpose}`
    )
  ];

  return lines.join("\n");
}

export function detectIntent(question: string): QuestionIntent {
  const normalized = question.toLowerCase();

  if (
    /\b(due|deadline|assignment|assignments)\b/.test(normalized) &&
    /\b(when|date|dates|due)\b/.test(normalized)
  ) {
    return "assignment_deadlines";
  }

  if (
    /\b(today|now|pace|progress|where should i be|what should i work on)\b/.test(normalized) ||
    (/\b(video|lecture)\b/.test(normalized) && /\b(today|progress|pace)\b/.test(normalized))
  ) {
    return "today_progress";
  }

  if (/\b(repo|repository|repositories|git|github|starter code|setup)\b/.test(normalized)) {
    return "repository_lookup";
  }

  return "unknown";
}

export function answerCourseQuestion(question: string, referenceDate?: string): string {
  const intent = detectIntent(question);

  switch (intent) {
    case "assignment_deadlines":
      return getAssignmentDeadlineAnswer(referenceDate);
    case "today_progress":
      return getTodayProgressAnswer(referenceDate);
    case "repository_lookup":
      return getRepositoryAnswer();
    default:
      return [
        "I could not map this question to a known XCS221 template intent.",
        "Try one of the following:",
        '- "When are assignments due?"',
        '- "Where should I be in lectures and assignments today?"',
        '- "Which git repository has my assignment or setup?"'
      ].join("\n");
  }
}
