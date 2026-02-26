"use client";

import Note from "@/providers/types";
import TaskCard from "./TaskCard";
import IdeaCard from "./IdeaCard";
import NoteCard from "./NoteCard";
import GoalCard from "./GoalCard";
import EventCard from "./EventCard";
import QuoteCard from "./QuoteCard";
import BookmarkCard from "./BookmarkCard";
import ContactCard from "./ContactCard";
import InsightCard from "./InsightCard";
import DecisionCard from "./DecisionCard";
import DefinitionCard from "./DefinitionCard";
import FactCard from "./FactCard";
import ReminderCard from "./ReminderCard";
import QuestionCard from "./QuestionCard";
import { Trash2 } from "lucide-react";

interface NoteCardRouterProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onTaskToggle: (id: number, state: boolean) => void;
}

export default function NoteCardRouter({
  note,
  onEdit,
  onDelete,
  onTaskToggle,
}: NoteCardRouterProps) {
  const handleClick = () => onEdit(note);

  const renderCard = () => {
    switch (note.type) {
      case "task":
        return <TaskCard note={note} onToggle={onTaskToggle} onClick={handleClick} />;
      case "idea":
        return <IdeaCard note={note} onClick={handleClick} />;
      case "goal":
        return <GoalCard note={note} onClick={handleClick} />;
      case "event":
        return <EventCard note={note} onClick={handleClick} />;
      case "quote":
        return <QuoteCard note={note} onClick={handleClick} />;
      case "bookmark":
        return <BookmarkCard note={note} onClick={handleClick} />;
      case "contact":
        return <ContactCard note={note} onClick={handleClick} />;
      case "insight":
        return <InsightCard note={note} onClick={handleClick} />;
      case "decision":
        return <DecisionCard note={note} onClick={handleClick} />;
      case "definition":
        return <DefinitionCard note={note} onClick={handleClick} />;
      case "fact":
        return <FactCard note={note} onClick={handleClick} />;
      case "reminder":
        return <ReminderCard note={note} onClick={handleClick} />;
      case "question":
        return <QuestionCard note={note} onClick={handleClick} />;
      default:
        return <NoteCard note={note} onClick={handleClick} />;
    }
  };

  return (
    <div className="group relative">
      {renderCard()}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(note.id);
        }}
        className="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
