'use client';

import React from "react";
import { useAuth } from "@/context/AuthContext";
import LoginPage from "@/app/login/page"; // Assuming LoginPage is in app/login
import { useRouter } from "next/navigation";
import { Button, Container, Typography, Box } from "@mui/material";
import { auth } from "@/firebaseConfig";

export default function HomePage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // router.push('/login'); // Optional: redirect to login after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          my: 4, // theme.spacing(4) for margin top and bottom
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: 'center',
          backgroundColor: 'background.paper', // Use theme background paper color
          padding: 3, // theme.spacing(3)
          borderRadius: 2, // theme.shape.borderRadius * 2
          boxShadow: 3, // theme.shadows[3]
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
          Welcome to Event Manager!
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mb: 2, color: 'text.secondary' }}>
          Hello, {currentUser.email}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Manage your events efficiently. You can view existing events, create new ones, and keep everything organized.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => router.push("/events")}
          >
            View My Events
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
