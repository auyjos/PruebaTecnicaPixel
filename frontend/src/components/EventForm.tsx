'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { Event, EventInput } from '@/types';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Typography,
} from '@mui/material';

interface EventFormProps {
  eventToEdit?: Event | null;
}

const EventForm: React.FC<EventFormProps> = ({ eventToEdit }) => {
  const { currentUser } = useAuth();
  const { addEvent, updateEvent, loading, error, clearError } = useEvents();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState(''); // Added category state
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description);
      // Ensure date is in 'yyyy-MM-dd' format for the input[type="date"]
      // The date from the backend is an ISO string, so we need to format it.
      const formattedDate = eventToEdit.date ? new Date(eventToEdit.date).toISOString().split('T')[0] : '';
      setDate(formattedDate);
      setLocation(eventToEdit.location);
      setCategory(eventToEdit.category || ''); // Set category, default to empty string if not present
    }
    clearError();
    setFormError(null);
  }, [eventToEdit, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!currentUser) {
      setFormError('You must be logged in to create or edit events.');
      return;
    }

    if (!title || !date || !location || !category) { // Added category to validation
      setFormError('Title, Date, Location, and Category are required.');
      return;
    }

    // Ensure the date is sent in ISO format if it's not already
    // The input type="date" provides it as yyyy-MM-dd
    // We need to convert it to a full ISO string if the backend expects that.
    // For now, assuming backend can handle yyyy-MM-dd or full ISO string.
    // If specific ISO format is needed: const isoDate = new Date(date).toISOString();
    const eventData: EventInput = { title, description, date, location, category }; // Added category to eventData

    let success = false;
    if (eventToEdit && eventToEdit.id) {
      success = await updateEvent(eventToEdit.id, eventData);
    } else {
      success = await addEvent(eventData);
    }

    if (success) {
      router.push('/events');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        {eventToEdit ? 'Edit Event' : 'Create Event'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {(error || formError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || formError}
          </Alert>
        )}
        {/* Use CSS Grid for responsive layout */}
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }
          }}
        >
          <Box sx={{ gridColumn: 'span 2' }}>
            <TextField
              name="title"
              required
              fullWidth
              id="title"
              label="Event Title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>
          <Box sx={{ gridColumn: 'span 2' }}>
            <TextField
              name="description"
              fullWidth
              id="description"
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
          <Box>
            <TextField
              name="date"
              required
              fullWidth
              id="date"
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Box>
          <Box>
            <TextField
              name="location"
              required
              fullWidth
              id="location"
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Box>
          <Box sx={{ gridColumn: 'span 2' }}>
            <TextField
              name="category"
              required
              fullWidth
              id="category"
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Box>
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : (eventToEdit ? 'Save Changes' : 'Create Event')}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => router.push('/events')}
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>
    </Paper>
  );
};

export default EventForm;
