export type Assignment = {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  repo: string;
};

export type PacingMilestone = {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  lectureFocus: string[];
  assignmentFocus: string[];
};

export type RepositoryInfo = {
  name: string;
  url: string;
  purpose: string;
};

export type CourseData = {
  course: string;
  term: string;
  timezone: string;
  courseStartDate: string;
  assignments: Assignment[];
  pacingMilestones: PacingMilestone[];
  repositories: RepositoryInfo[];
};

/**
 * Template course data for XCS221.
 * Update this object each quarter with your actual dates and repository URLs.
 */
export const courseData: CourseData = {
  course: "XCS221: Artificial Intelligence: Principles and Techniques",
  term: "Winter 2026 (template)",
  timezone: "America/Los_Angeles",
  courseStartDate: "2026-01-05",
  assignments: [
    {
      id: "setup",
      title: "Course setup and environment check",
      dueDate: "2026-01-08",
      repo: "https://github.com/example-org/xcs221-course-setup"
    },
    {
      id: "a1",
      title: "Assignment 1: Search and dynamic programming",
      dueDate: "2026-01-15",
      repo: "https://github.com/example-org/xcs221-assignment-1"
    },
    {
      id: "a2",
      title: "Assignment 2: Multi-agent search",
      dueDate: "2026-01-29",
      repo: "https://github.com/example-org/xcs221-assignment-2"
    },
    {
      id: "a3",
      title: "Assignment 3: Reinforcement learning",
      dueDate: "2026-02-12",
      repo: "https://github.com/example-org/xcs221-assignment-3"
    },
    {
      id: "a4",
      title: "Assignment 4: Probabilistic models",
      dueDate: "2026-02-26",
      repo: "https://github.com/example-org/xcs221-assignment-4"
    },
    {
      id: "project",
      title: "Final project report",
      dueDate: "2026-03-12",
      repo: "https://github.com/example-org/xcs221-final-project-template"
    }
  ],
  pacingMilestones: [
    {
      id: "week1",
      title: "Week 1: Course logistics and search foundations",
      startDate: "2026-01-05",
      endDate: "2026-01-11",
      lectureFocus: ["Course logistics", "Uninformed search", "Dynamic programming"],
      assignmentFocus: ["Complete setup", "Start Assignment 1"]
    },
    {
      id: "week2",
      title: "Week 2: Heuristics and adversarial search",
      startDate: "2026-01-12",
      endDate: "2026-01-18",
      lectureFocus: ["A* search", "Adversarial games", "Alpha-beta pruning"],
      assignmentFocus: ["Finish Assignment 1", "Start Assignment 2"]
    },
    {
      id: "week3to4",
      title: "Weeks 3-4: CSPs and RL",
      startDate: "2026-01-19",
      endDate: "2026-02-01",
      lectureFocus: ["Constraint satisfaction", "MDPs", "Value iteration", "Policy iteration"],
      assignmentFocus: ["Finish Assignment 2", "Begin Assignment 3"]
    },
    {
      id: "week5to6",
      title: "Weeks 5-6: Learning and model evaluation",
      startDate: "2026-02-02",
      endDate: "2026-02-15",
      lectureFocus: ["Supervised learning", "Generalization", "Model diagnostics"],
      assignmentFocus: ["Finish Assignment 3", "Start Assignment 4", "Project proposal"]
    },
    {
      id: "week7to9",
      title: "Weeks 7-9: Probabilistic graphical models and project execution",
      startDate: "2026-02-16",
      endDate: "2026-03-08",
      lectureFocus: ["Bayes nets", "Inference", "Decision making under uncertainty"],
      assignmentFocus: ["Finish Assignment 4", "Execute final project"]
    },
    {
      id: "week10",
      title: "Week 10: Course review and final project wrap-up",
      startDate: "2026-03-09",
      endDate: "2026-03-15",
      lectureFocus: ["Comprehensive review", "Project presentation guidance"],
      assignmentFocus: ["Finalize and submit final project report"]
    }
  ],
  repositories: [
    {
      name: "Course setup",
      url: "https://github.com/example-org/xcs221-course-setup",
      purpose: "Bootstrap environment, starter notebooks, and helper scripts."
    },
    {
      name: "Assignments monorepo",
      url: "https://github.com/example-org/xcs221-assignments",
      purpose: "Shared assignment handouts and links to assignment-specific repos."
    },
    {
      name: "Assignment 1 repo",
      url: "https://github.com/example-org/xcs221-assignment-1",
      purpose: "Starter code and tests for Assignment 1."
    },
    {
      name: "Assignment 2 repo",
      url: "https://github.com/example-org/xcs221-assignment-2",
      purpose: "Starter code and tests for Assignment 2."
    },
    {
      name: "Assignment 3 repo",
      url: "https://github.com/example-org/xcs221-assignment-3",
      purpose: "Starter code and tests for Assignment 3."
    },
    {
      name: "Assignment 4 repo",
      url: "https://github.com/example-org/xcs221-assignment-4",
      purpose: "Starter code and tests for Assignment 4."
    }
  ]
};
