
'use client';

import React, { useEffect } from 'react';
import EventForm from '@/components/EventForm';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const NewEventPage = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    return null; // Or a message prompting to login
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Create New Event
      </Typography>
      <EventForm />
    </Container>
  );
};

export default NewEventPage;
