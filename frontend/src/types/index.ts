export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  location: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventInput {
  title: string;
  description: string;
  date: string;
  category: string;
  location: string;
}

export interface User {
  uid: string;
  email: string | null;
}

export interface RawEvent {
  id: string;
  title: string;
  description: string;
  date: string | { _seconds: number; _nanoseconds?: number };
  category: string;
  location: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}