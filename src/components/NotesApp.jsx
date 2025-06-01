import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Plus, Search, LogOut } from 'lucide-react';
import NotesList from './NotesList';
import NoteDialog from './NoteDialog';
import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../services/NotesService';

const NotesApp = () => {
  const { user, logout } = useAuth0();
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  
  useEffect(() => {
    if (user?.email) {
      getAllNotes(user.email)
        .then(setNotes)
        .catch((err) => setNotes([]));
    }
  }, [user?.email]);

  const filteredNotes = notes.filter(
    note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveNote = async (noteData) => {
    if (!user?.email) return;

    if (editingNote) {
      try {
        const updated = await updateNote(user.email, editingNote._id, noteData);
        setNotes(notes.map(note => (note._id === editingNote._id ? updated : note)));
      } catch (err) {}
    } else {
      try {
        const created = await createNote(user.email, noteData);
        setNotes([created, ...notes]);
      } catch (err) {}
    }
    handleCloseDialog();
  };

  const handleDeleteNote = async (noteId) => {
    if (!user?.email) return;

    try {
      await deleteNote(user.email, noteId);
      setNotes(notes.filter(note => note._id !== noteId));
    } catch (err) {}
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingNote(null);
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">NoteTaker</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search your notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        <NotesList
          notes={filteredNotes}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
        />
      </main>

      <button
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
      >
        <Plus size={24} />
      </button>

      {isDialogOpen && (
        <NoteDialog
          note={editingNote}
          onSave={handleSaveNote}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
};

export default NotesApp; 