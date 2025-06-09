'use client';

import React, { useEffect } from 'react'; // Removed unused useContext
import { useRouter } from 'next/navigation';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import EventList from '@/components/EventList';
import Link from 'next/link';

const EventsPage = () => {
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
    return null; // Or a message prompting to login, handled by redirect
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Events
        </Typography>
        <Link href="/events/new" passHref>
          <Button variant="contained" color="primary">
            Create New Event
          </Button>
        </Link>
      </Box>
      <EventList />
    </Container>
  );
};

export default EventsPage;
