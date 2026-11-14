import { FormEvent, useEffect, useState } from "react";
import { Book, BookInput } from "../types";

interface BookFormProps {
  editingBook: Book | null;
  onSubmit: (input: BookInput) => Promise<void>;
  onCancelEdit: () => void;
}

const emptyInput: BookInput = { name: "", description: "" };

export function BookForm({ editingBook, onSubmit, onCancelEdit }: BookFormProps) {
  const [input, setInput] = useState<BookInput>(emptyInput);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setInput(editingBook ? { name: editingBook.name, description: editingBook.description } : emptyInput);
  }, [editingBook]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.name.trim() || !input.description.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(input);
      setInput(emptyInput);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h2>{editingBook ? "Edit book" : "Add a book"}</h2>

      <label>
        Name
        <input
          value={input.name}
          onChange={(e) => setInput({ ...input, name: e.target.value })}
          placeholder="Book name"
          maxLength={200}
          required
        />
      </label>

      <label>
        Description
        <textarea
          value={input.description}
          onChange={(e) => setInput({ ...input, description: e.target.value })}
          placeholder="Book description"
          maxLength={2000}
          rows={3}
          required
        />
      </label>

      <div className="book-form__actions">
        <button type="submit" disabled={submitting}>
          {editingBook ? "Save changes" : "Add book"}
        </button>
        {editingBook && (
          <button type="button" onClick={onCancelEdit} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
