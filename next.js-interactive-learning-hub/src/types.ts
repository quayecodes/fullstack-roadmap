import React from "react";

export interface Lesson {
  id: string;
  title: string;
  category: "Fundamentals" | "Routing" | "Data Fetching" | "Advanced";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  shortDescription: string;
  fullContent: string;
  completed: boolean;
  quizId?: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface CodeFile {
  id: string;
  name: string;
  path: string;
  isFolder: boolean;
  parentId?: string;
  language?: string;
  code?: string;
  explanation?: string;
  associatedRoute?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ActiveRouteRender {
  pathname: string;
  title: string;
  getComponent: (params?: Record<string, string>) => React.ReactNode;
}
