import { Book, BookInput } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Request failed (${res.status}): ${body}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export const booksApi = {
  list: () => request<Book[]>("/books"),
  create: (input: BookInput) =>
    request<Book>("/books", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: BookInput) =>
    request<Book>(`/books/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    request<void>(`/books/${id}`, { method: "DELETE" }),
};
