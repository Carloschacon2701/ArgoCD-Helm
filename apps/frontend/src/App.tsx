import { useCallback, useEffect, useState } from "react";
import { booksApi } from "./api";
import { BookForm } from "./components/BookForm";
import { BookList } from "./components/BookList";
import { Book, BookInput } from "./types";

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBooks = useCallback(async () => {
    try {
      setError(null);
      setBooks(await booksApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load books");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  async function handleSubmit(input: BookInput) {
    try {
      setError(null);
      if (editingBook) {
        await booksApi.update(editingBook.id, input);
        setEditingBook(null);
      } else {
        await booksApi.create(input);
      }
      await loadBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save book");
    }
  }

  async function handleDelete(id: string) {
    try {
      setError(null);
      await booksApi.remove(id);
      if (editingBook?.id === id) setEditingBook(null);
      await loadBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete book");
    }
  }

  return (
    <main className="app">
      <h1>Books</h1>

      {error && <p className="error-banner">{error}</p>}

      <BookForm
        editingBook={editingBook}
        onSubmit={handleSubmit}
        onCancelEdit={() => setEditingBook(null)}
      />

      {loading ? (
        <p>Loading books…</p>
      ) : (
        <BookList books={books} onEdit={setEditingBook} onDelete={handleDelete} />
      )}
    </main>
  );
}
