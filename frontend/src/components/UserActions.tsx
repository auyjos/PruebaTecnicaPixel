'use client';

import React, { useState } from 'react'; // Added useState
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/firebaseConfig';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu'; // Added Menu
import MenuItem from '@mui/material/MenuItem'; // Added MenuItem

export default function UserActions() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for Menu anchor
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose(); // Close the menu first
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (currentUser) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem disabled sx={{ opacity: '1 !important' }}> {/* Disabled to make it non-interactive but visible */}
            <Typography variant="body2">{currentUser.email}</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    );
  }

  return (
    <Button color="inherit" component={Link} href="/login">
      Login
    </Button>
  );
}
