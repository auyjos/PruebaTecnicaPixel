
'use client';

import React, { useEffect, useState } from 'react';
import { useEvents } from '@/context/EventContext';
import EventItem from './EventItem';
import { Event } from '@/types';
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  TextField,
  Button,
  Pagination,
  Paper,
  Alert
} from '@mui/material';

const EventList: React.FC = () => {
  const {
    events,
    loading,
    error,
    fetchEvents,
    deleteEvent,
    currentPage,
    totalPages,
    setCurrentPage,
    setSearchTitle,
    setSearchDate,
    searchTitle,
    searchDate,
  } = useEvents();

  const [titleFilter, setTitleFilter] = useState(searchTitle);
  const [dateFilter, setDateFilter] = useState(searchDate);

  useEffect(() => {
    // Fetch events when the component mounts or when currentPage changes
    fetchEvents();
  }, [fetchEvents, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    setSearchTitle(titleFilter);
    setSearchDate(dateFilter);
    // fetchEvents will be called by the useEffect in EventContext due to dependency changes
  };

  const handleClearSearch = () => {
    setTitleFilter('');
    setDateFilter('');
    setSearchTitle('');
    setSearchDate('');
    setCurrentPage(1);
    // fetchEvents will be called by the useEffect in EventContext
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Effect to re-fetch events when searchTitle or searchDate context values change
  // This ensures that if filters are updated externally or reset, the list reflects it.
  useEffect(() => {
    fetchEvents();
  }, [searchTitle, searchDate, fetchEvents]);


  if (loading && events.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ my: 2 }}>Error fetching events: {error}</Alert>;
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Event List
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          label="Search by Title"
          variant="outlined"
          size="small"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on Enter key
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />
        <TextField
          label="Search by Date"
          type="date"
          variant="outlined"
          size="small"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on Enter key
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ minWidth: '180px' }}
        />
        <Button variant="contained" onClick={handleSearch} sx={{ height: '40px' }}>
          Search
        </Button>
        <Button variant="outlined" onClick={handleClearSearch} sx={{ height: '40px' }}>
          Clear
        </Button>
      </Box>

      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', my: 2 }}/>}

      {!loading && events.length === 0 && (
        <Typography sx={{ textAlign: 'center', my: 4 }}>No events found. Try adjusting your search filters.</Typography>
      )}

      {events.length > 0 && (
        <Grid container spacing={3}>
          {events.map((event: Event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventItem event={event} onDelete={deleteEvent} />
            </Grid>
          ))}
        </Grid>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Paper>
  );
};

export default EventList;
