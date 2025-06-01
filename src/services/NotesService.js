const API_URL = import.meta.env.VITE_API_URL

export async function getAllNotes(email) {
  const res = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return await res.json();
}

export async function createNote(email, noteData) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...noteData, email })
  });
  if (!res.ok) throw new Error('Failed to create note');
  return await res.json();
}

export async function updateNote(email, id, noteData) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...noteData, email })
  });
  if (!res.ok) throw new Error('Failed to update note');
  return await res.json();
}

export async function deleteNote(email, id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error('Failed to delete note');
  return await res.json();
} 