import { Router } from 'express';
import { EventController } from '../controllers/index.js';
import { authenticateToken } from '../middleware/auth.js';
import {
    validateCreateEvent,
    validateUpdateEvent,
    validateEventId,
    handleValidationErrors
} from '../middleware/validation.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /events - Get all events for the authenticated user
router.get('/', EventController.getAllEvents);

// GET /events/:id - Get a specific event by ID
router.get(
    '/:id',
    validateEventId,
    handleValidationErrors,
    EventController.getEventById
);

// POST /events - Create a new event
router.post(
    '/',
    validateCreateEvent,
    handleValidationErrors,
    EventController.createEvent
);

// PUT /events/:id - Update an existing event
router.put(
    '/:id',
    validateEventId,
    validateUpdateEvent,
    handleValidationErrors,
    EventController.updateEvent
);

// DELETE /events/:id - Delete an event
router.delete(
    '/:id',
    validateEventId,
    handleValidationErrors,
    EventController.deleteEvent
);

export { router as eventRoutes };
