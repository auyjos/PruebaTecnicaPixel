'use client';

import { Event } from '@/types';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface EventItemProps {
  event: Event;
  onDelete: (id: string) => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onDelete }) => {
  const { currentUser } = useAuth();

  // Helper to format date string (YYYY-MM-DD) to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" gutterBottom>
          {event.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Date: {formatDate(event.date)}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          {event.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location: {event.location}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Category: {event.category}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Chip label={`ID: ${event.id}`} size="small" variant="outlined" />
        </Box>
      </CardContent>
      {currentUser && currentUser.uid === event.userId && (
        <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
          {/* Edit button wrapped in Link */}
          <Link href={`/events/edit/${event.id}`}>
            <IconButton aria-label="edit" size="small" color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton aria-label="delete" size="small" color="error" onClick={() => onDelete(event.id)}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
};

export default EventItem;
