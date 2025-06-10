
'use client';

import React, { useEffect } from 'react';
import EventForm from '@/components/EventForm'
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { useRouter, useParams } from 'next/navigation';
import { Event } from '@/types';

const EditEventPage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const { getEventById, loading: eventsLoading } = useEvents();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [eventToEdit, setEventToEdit] = React.useState<Event | null | undefined>(undefined); // undefined means loading, null means not found

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, authLoading, router]);

  useEffect(() => {
    if (eventId && currentUser) {
      const fetchEvent = async () => {
        const event = await getEventById(eventId);
        setEventToEdit(event);
      };
      fetchEvent();
    }
  }, [eventId, getEventById, currentUser]);

  if (authLoading || eventsLoading || eventToEdit === undefined) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    return null; // Or a message prompting to login
  }

  if (eventToEdit === null) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" sx={{ mt: 4, textAlign: 'center' }}>Event not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Edit Event
      </Typography>
      <EventForm eventToEdit={eventToEdit} />
    </Container>
  );
};

export default EditEventPage;
