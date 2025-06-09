export interface Event {
    id: string;
    title: string;
    description: string;
    date: string; // ISO 8601 format
    category: string;
    userId: string; // Added to associate events with users
    createdAt: string;
    updatedAt: string;
}

export interface CreateEventDTO {
    title: string;
    description: string;
    date: string;
    category: string;
}

export interface UpdateEventDTO {
    title?: string;
    description?: string;
    date?: string;
    category?: string;
}
