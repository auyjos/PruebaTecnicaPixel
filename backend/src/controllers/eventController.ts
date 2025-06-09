import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { EventService } from '../services/eventService.js';
import { CreateEventDTO, UpdateEventDTO } from '../models/index.js';

export class EventController {
    static async getAllEvents(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.uid;
            const events = await EventService.getAllEvents(userId);

            res.status(200).json({
                success: true,
                data: events,
                message: 'Events retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getAllEvents:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to retrieve events'
            });
        }
    }

    static async getEventById(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.uid;

            const event = await EventService.getEventById(id, userId);

            if (!event) {
                res.status(404).json({
                    error: 'Not Found',
                    message: 'Event not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: event,
                message: 'Event retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getEventById:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to retrieve event'
            });
        }
    }

    static async createEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.uid;
            const eventData: CreateEventDTO = req.body;

            const newEvent = await EventService.createEvent(eventData, userId);

            res.status(201).json({
                success: true,
                data: newEvent,
                message: 'Event created successfully'
            });
        } catch (error) {
            console.error('Error in createEvent:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to create event'
            });
        }
    }

    static async updateEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.uid;
            const eventData: UpdateEventDTO = req.body;

            const updatedEvent = await EventService.updateEvent(id, eventData, userId);

            if (!updatedEvent) {
                res.status(404).json({
                    error: 'Not Found',
                    message: 'Event not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: updatedEvent,
                message: 'Event updated successfully'
            });
        } catch (error) {
            console.error('Error in updateEvent:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to update event'
            });
        }
    }

    static async deleteEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.uid;

            const deleted = await EventService.deleteEvent(id, userId);

            if (!deleted) {
                res.status(404).json({
                    error: 'Not Found',
                    message: 'Event not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Event deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteEvent:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to delete event'
            });
        }
    }
}
