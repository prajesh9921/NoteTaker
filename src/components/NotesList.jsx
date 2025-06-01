import React from "react";
import { FileText, X } from "lucide-react";

const NotesList = ({
  notes,
  onEditNote,
  onDeleteNote,
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText size={64} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No notes yet</h3>
        <p className="text-gray-500">
          Click the + button to create your first note
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note) => (
        <div
          key={note._id || note.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
          onClick={() => onEditNote(note)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900 truncate flex-1">
              {note.title || "Untitled"}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNote(note._id || note.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
            {note.content}
          </p>
          <p className="text-xs text-gray-400">{formatDate(note.updatedAt || note.createdAt)}</p>
        </div>
      ))}
    </div>
  );
};

export default NotesList; 