'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { Button, TextField, Container, Typography, Box, Alert, Paper, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useRouter } from 'next/navigation'; // Import useRouter

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const handleAuth = async () => {
    setError(null);
    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // If sign up is successful, sign the user out immediately
        // so they are redirected to the sign-in form.
        if (userCredential && userCredential.user) {
          await auth.signOut(); // Sign out the newly created user
        }
        setIsSignUp(false); // Switch to Sign In mode
        setPassword('');    // Clear password field
        // The email field (email state) will retain its value.
        // Optionally, you could set an informational message here for the user.
        // For example: setError("Sign up successful! Please sign in."); 
        // However, this might be confusing with actual errors, so a different state for info might be better.
      } else {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (userCredential && userCredential.user) {
          console.log("User signed in successfully:", userCredential.user.uid);
          router.push('/'); // Redirect to the root page
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2, mb: 1 }}>{error}</Alert>}
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleAuth(); }} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <Button
            fullWidth
            onClick={() => setIsSignUp(!isSignUp)}
            sx={{ textTransform: 'none' }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
