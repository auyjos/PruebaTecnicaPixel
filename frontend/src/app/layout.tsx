import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google"; // Geist (sans-serif) is now in ClientProviders
import "./globals.css";
import ClientProviders from "@/components/ClientProviders"; // Import the new ClientProviders
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Link from "next/link";
import Button from "@mui/material/Button";
import UserActions from "@/components/UserActions"; // Import the new component

// geistSans is moved to ClientProviders.tsx as it's part of the theme
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Management App",
  description: "Manage your events with ease",
};

// Theme definition is moved to ClientProviders.tsx

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* geistSans.variable is applied via theme in ClientProviders */}
      {/* CssBaseline is also applied in ClientProviders */}
      <body className={`${geistMono.variable} antialiased`}>
        <ClientProviders>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <AppBar position="static">
              <Toolbar>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1 }}
                >
                  <Link
                    href="/"
                    passHref
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    Event Manager
                  </Link>
                </Typography>
                <Button color="inherit" component={Link} href="/events">
                  Events
                </Button>
                <UserActions /> {/* Replace the old Login button with UserActions */}
              </Toolbar>
            </AppBar>
            <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
              {children}
            </Container>
            <Box
              component="footer"
              sx={{
                py: 2,
                textAlign: "center",
                backgroundColor: "primary.main", // This will now correctly use the theme from ClientProviders
                color: "white",
              }}
            >
              <Typography variant="body2">
                © {new Date().getFullYear()} Event Management App
              </Typography>
            </Box>
          </Box>
        </ClientProviders>
      </body>
    </html>
  );
}
