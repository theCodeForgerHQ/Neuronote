export type NoteType =
  | "note"
  | "idea"
  | "task"
  | "goal"
  | "fact"
  | "definition"
  | "decision"
  | "insight"
  | "event"
  | "reminder"
  | "question"
  | "quote"
  | "bookmark"
  | "contact";

export type NoteCategory =
  | "personal"
  | "work"
  | "health"
  | "finance"
  | "learning"
  | "general";

export type NoteSentiment = "positive" | "negative" | "neutral" | "mixed";

export type NoteUrgency = "none" | "low" | "high";

export type NotePriority = "low" | "medium" | "high" | null;

export type NoteStatus = "active" | "archived" | "completed" | "deferred";

type Note = {
  id: number;
  userId: string;
  createdAt: string;
  updatedAt: string | null;
  note: string;
  type: NoteType;
  people: string[];
  place: string[];
  priority: string | null;
  timeRef: string | null;
  dueDate: string | null;
  tags: string[];
  isDone: boolean | null;
  category: NoteCategory | null;
  urgency: NoteUrgency | null;
  status: NoteStatus | null;
  sentiment: NoteSentiment | null;
  source: string | null;
  relatedNoteIds: number[] | null;
  embedding: number[];
};

export default Note;
