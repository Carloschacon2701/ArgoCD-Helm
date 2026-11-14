import { Book } from "../types";

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export function BookList({ books, onEdit, onDelete }: BookListProps) {
  if (books.length === 0) {
    return <p className="empty-state">No books yet. Add one above.</p>;
  }

  return (
    <ul className="book-list">
      {books.map((book) => (
        <li key={book.id} className="book-card">
          <div>
            <h3>{book.name}</h3>
            <p>{book.description}</p>
          </div>
          <div className="book-card__actions">
            <button onClick={() => onEdit(book)}>Edit</button>
            <button onClick={() => onDelete(book.id)} className="danger">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
