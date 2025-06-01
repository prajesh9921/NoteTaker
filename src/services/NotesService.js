const getStorageKey = function(userId) {
  return `notes_${userId}`;
};

export function getAllNotes(userId) {
  const notesJson = localStorage.getItem(getStorageKey(userId));
  if (!notesJson) return [];
  return JSON.parse(notesJson);
}

export function createNote(
  userId,
  noteData
) {
  const newNote = {
    ...noteData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const notes = getAllNotes(userId);
  notes.unshift(newNote);
  localStorage.setItem(getStorageKey(userId), JSON.stringify(notes));
  return newNote;
}

export function updateNote(
  userId,
  id,
  noteData
) {
  const notes = getAllNotes(userId);
  const noteIndex = notes.findIndex(function(note) {
    return note.id === id;
  });

  if (noteIndex === -1) {
    throw new Error('Note not found');
  }

  const updatedNote = {
    ...notes[noteIndex],
    ...noteData,
    updatedAt: new Date().toISOString(),
  };

  notes[noteIndex] = updatedNote;
  localStorage.setItem(getStorageKey(userId), JSON.stringify(notes));
  return updatedNote;
}

export function deleteNote(userId, id) {
  const notes = getAllNotes(userId);
  const filteredNotes = notes.filter(function(note) {
    return note.id !== id;
  });
  localStorage.setItem(getStorageKey(userId), JSON.stringify(filteredNotes));
} 