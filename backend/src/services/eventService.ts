import { admin } from './firebase.js';
import { Event, CreateEventDTO, UpdateEventDTO } from '../models/index.js';

const EVENTS_COLLECTION = 'events';

const getDb = () => {
    return admin.firestore();
};

export class EventService {
    static async getAllEvents(userId: string): Promise<Event[]> {
        try {
            const db = getDb();
            const eventsRef = db.collection(EVENTS_COLLECTION);
            const snapshot = await eventsRef.where('userId', '==', userId).get();

            const events: Event[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                events.push({ ...data, id: doc.id } as Event);
            });

            return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } catch (error) {
            console.error('Error getting events:', error);
            throw new Error('Failed to retrieve events');
        }
    }

    static async getEventById(eventId: string, userId: string): Promise<Event | null> {
        try {
            const db = getDb();
            const eventDoc = await db.collection(EVENTS_COLLECTION).doc(eventId).get();

            if (!eventDoc.exists) {
                return null;
            }

            const eventData = eventDoc.data() as Event;

            // Check if the event belongs to the user
            if (eventData.userId !== userId) {
                return null;
            }

            return { ...eventData, id: eventDoc.id };
        } catch (error) {
            console.error('Error getting event by ID:', error);
            throw new Error('Failed to retrieve event');
        }
    }

    static async createEvent(eventData: CreateEventDTO, userId: string): Promise<Event> {
        try {
            const db = getDb();
            const now = new Date().toISOString();
            const newEvent = {
                ...eventData,
                userId,
                createdAt: now,
                updatedAt: now,
            };

            const docRef = await db.collection(EVENTS_COLLECTION).add(newEvent);

            return {
                ...newEvent,
                id: docRef.id,
            } as Event;
        } catch (error) {
            console.error('Error creating event:', error);
            throw new Error('Failed to create event');
        }
    }

    static async updateEvent(eventId: string, eventData: UpdateEventDTO, userId: string): Promise<Event | null> {
        try {
            const db = getDb();
            const eventRef = db.collection(EVENTS_COLLECTION).doc(eventId);
            const eventDoc = await eventRef.get();

            if (!eventDoc.exists) {
                return null;
            }

            const existingEvent = eventDoc.data() as Event;

            // Check if the event belongs to the user
            if (existingEvent.userId !== userId) {
                return null;
            }

            const updateData = {
                ...eventData,
                updatedAt: new Date().toISOString(),
            };

            await eventRef.update(updateData);

            const updatedDoc = await eventRef.get();
            const finalData = updatedDoc.data();
            return { ...finalData, id: updatedDoc.id } as Event;
        } catch (error) {
            console.error('Error updating event:', error);
            throw new Error('Failed to update event');
        }
    }

    static async deleteEvent(eventId: string, userId: string): Promise<boolean> {
        try {
            const db = getDb();
            const eventRef = db.collection(EVENTS_COLLECTION).doc(eventId);
            const eventDoc = await eventRef.get();

            if (!eventDoc.exists) {
                return false;
            }

            const eventData = eventDoc.data() as Event;

            // Check if the event belongs to the user
            if (eventData.userId !== userId) {
                return false;
            }

            await eventRef.delete();
            return true;
        } catch (error) {
            console.error('Error deleting event:', error);
            throw new Error('Failed to delete event');
        }
    }
}
