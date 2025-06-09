'use client';

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from "@/context/AuthContext";
import { EventProvider } from "@/context/EventContext";
import { Geist } from "next/font/google"; // Using Geist for consistency

// Define fonts here as they are used in the theme
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Theme definition (moved from layout.tsx)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f4f6f8',
    }
  },
  typography: {
    fontFamily: geistSans.style.fontFamily,
  },
});

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <EventProvider>
          {children}
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
