export interface Book {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookInput {
  name: string;
  description: string;
}
