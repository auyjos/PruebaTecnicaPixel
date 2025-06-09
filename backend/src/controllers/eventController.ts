import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { EventService } from '../services/eventService.js';
import { CreateEventDTO, UpdateEventDTO } from '../models/index.js';

export class EventController {
    static async getAllEvents(req: AuthenticatedRequest, res: Response): Promise<void> {
        console.log(`[EventController] getAllEvents: User ID - ${req.user!.uid}`);
        try {
            const userId = req.user!.uid;
            const events = await EventService.getAllEvents(userId);

            console.log(`[EventController] getAllEvents: Successfully retrieved ${events.length} events for User ID - ${userId}`);
            res.status(200).json({
                success: true,
                data: events,
                message: 'Events retrieved successfully'
            });
        } catch (error) {
            console.error('[EventController] Error in getAllEvents:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to retrieve events'
            });
        }
    }

    static async getEventById(req: AuthenticatedRequest, res: Response): Promise<void> {
        const { id } = req.params;
        console.log(`[EventController] getEventById: Event ID - ${id}, User ID - ${req.user!.uid}`);
        try {
            const userId = req.user!.uid;
            const event = await EventService.getEventById(id, userId);

            if (!event) {
                console.log(`[EventController] getEventById: Event ID - ${id} not found for User ID - ${userId}`);
                res.status(404).json({
                    error: 'Not Found',
                    message: 'Event not found'
                });
                return;
            }

            console.log(`[EventController] getEventById: Successfully retrieved Event ID - ${id} for User ID - ${userId}`);
            res.status(200).json({
                success: true,
                data: event,
                message: 'Event retrieved successfully'
            });
        } catch (error) {
            console.error(`[EventController] Error in getEventById (Event ID: ${id}):`, error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to retrieve event'
            });
        }
    }

    static async createEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
        const eventData: CreateEventDTO = req.body;
        console.log(`[EventController] createEvent: User ID - ${req.user!.uid}, Event Data:`, eventData);
        try {
            const userId = req.user!.uid;
            const newEvent = await EventService.createEvent(eventData, userId);

            console.log(`[EventController] createEvent: Successfully created Event ID - ${newEvent.id} for User ID - ${userId}`);
            res.status(201).json({
                success: true,
                data: newEvent,
                message: 'Event created successfully'
            });
        } catch (error) {
            console.error('[EventController] Error in createEvent:', error);
            // Consider sending back more specific error messages if possible, e.g., validation errors
            if (error instanceof Error && error.message.includes('validation')) { // Example for specific error handling
                res.status(400).json({
                    error: 'Bad Request',
                    message: error.message
                });
            } else {
                res.status(500).json({
                    error: 'Internal Server Error',
                    message: 'Failed to create event'
                });
            }
        }
    }

    static async updateEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
        const { id } = req.params;
        const eventData: UpdateEventDTO = req.body;
        console.log(`[EventController] updateEvent: Event ID - ${id}, User ID - ${req.user!.uid}, Event Data:`, eventData);
        try {
            const userId = req.user!.uid;
            const updatedEvent = await EventService.updateEvent(id, eventData, userId);

            if (!updatedEvent) {
                console.log(`[EventController] updateEvent: Event ID - ${id} not found for User ID - ${userId}`);
                res.status(404).json({
                    error: 'Not Found',
                    message: 'Event not found'
                });
                return;
            }

            console.log(`[EventController] updateEvent: Successfully updated Event ID - ${id} for User ID - ${userId}`);
            res.status(200).json({
                success: true,
                data: updatedEvent,
                message: 'Event updated successfully'
            });
        } catch (error) {
            console.error(`[EventController] Error in updateEvent (Event ID: ${id}):`, error);
            if (error instanceof Error && error.message.includes('validation')) { // Example for specific error handling
                res.status(400).json({
                    error: 'Bad Request',
                    message: error.message
                });
            } else {
                res.status(500).json({
                    error: 'Internal Server Error',
                    message: 'Failed to update event'
                });
            }
        }
    }

    static async deleteEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
        const { id } = req.params;
        console.log(`[EventController] deleteEvent: Event ID - ${id}, User ID - ${req.user!.uid}`);
        try {
            const userId = req.user!.uid;
            const deleted = await EventService.deleteEvent(id, userId);

            if (!deleted) {
                console.log(`[EventController] deleteEvent: Event ID - ${id} not found or not authorized for User ID - ${userId}`);
                res.status(404).json({
                    error: 'Not Found',
                    message: 'Event not found or user not authorized'
                });
                return;
            }

            console.log(`[EventController] deleteEvent: Successfully deleted Event ID - ${id} for User ID - ${userId}`);
            res.status(200).json({
                success: true,
                message: 'Event deleted successfully'
            });
        } catch (error) {
            console.error(`[EventController] Error in deleteEvent (Event ID: ${id}):`, error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to delete event'
            });
        }
    }
}
