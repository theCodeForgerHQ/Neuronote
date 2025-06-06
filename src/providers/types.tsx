type NoteType =
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
  | "quote";

type Note = {
  id: number;
  userId: string;
  createdAt: string;
  note: string;
  type: NoteType;
  people: string[];
  place: string[];
  priority: string | null;
  timeRef: string | null;
  tags: string[];
  isDone: boolean | null;
  embedding: number[];
};

export default Note;
