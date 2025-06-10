'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import { Event, EventInput, RawEvent } from '@/types';
import { useAuth } from './AuthContext';
import { usePathname } from 'next/navigation';

// Base URL for the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';

interface EventContextType {
  events: Event[]; // This will be the paginated/filtered list
  loading: boolean;
  error: string | null;
  addEvent: (eventData: EventInput) => Promise<boolean>;
  updateEvent: (eventId: string, eventData: Partial<EventInput>) => Promise<boolean>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  fetchEvents: () => Promise<void>; // Removed parameters, will fetch all
  getEventById: (eventId: string) => Promise<Event | null>; // This can remain as is, or be client-side if all events are fetched
  setCurrentPage: (page: number) => void;
  setSearchTitle: (title: string) => void;
  setSearchDate: (date: string) => void;
  clearError: () => void;
  currentPage: number;
  totalPages: number;
  searchTitle: string;
  searchDate: string;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const PAGE_SIZE = 6;

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const pathname = usePathname(); // Get current route path

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Function to fetch all events from the backend
  const fetchAllEventsFromAPI = useCallback(async () => {
    if (!currentUser) {
        console.warn('[EventContext] fetchAllEventsFromAPI called when currentUser is null. This should be prevented by the calling useEffect or direct checks.');
        setAllEvents([]); 
        return;
    }

    setLoading(true);
    setError(null);
    console.log(`[EventContext] Initiating API call in fetchAllEventsFromAPI for user: ${currentUser.uid}`);
    try {
      const token = await currentUser.getIdToken();
      console.log('[EventContext] Firebase ID Token for fetch:', token ? 'Token fetched' : 'Failed to fetch token');
      
      const response = await fetch(`${API_BASE_URL}/events`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('[EventContext] Fetch response status:', response.status);
      const responseText = await response.text();
      console.log('[EventContext] Fetch response text:', responseText);

      if (!response.ok) {
        let errorData = { message: `Failed to fetch events. Status: ${response.status}` };
        try {
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.warn('[EventContext] fetchAllEventsFromAPI parse error:', parseError);
        }
        throw new Error(errorData.message ?? `HTTP error! status: ${response.status}`);
      }
      
      const data = JSON.parse(responseText);
      console.log('[EventContext] Parsed fetch data:', data);
      const rawEvents: RawEvent[] = data.data ?? [];
      const fetchedEventsWithFormattedDate: Event[] = rawEvents.map(raw => ({
        id: raw.id,
        title: raw.title,
        description: raw.description,
        date: typeof raw.date === 'string'
          ? raw.date
          : new Date(raw.date._seconds * 1000).toISOString(),
        category: raw.category,
        location: raw.location,
        userId: raw.userId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
      }));
      setAllEvents(fetchedEventsWithFormattedDate);
      console.log(`[EventContext] Successfully fetched and processed ${fetchedEventsWithFormattedDate.length} events.`);
    } catch (err) {
      console.error("Error fetching events from API: ", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      setError(errorMessage);
      setAllEvents([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

 
  const didFetchEventsRef = useRef(false);

  // Effect to fetch all events
  useEffect(() => {
    console.log(`[EventContext] Main fetch useEffect. currentUser UID: ${currentUser?.uid}, path: ${pathname}`);
    // Only fetch when on events pages (/events, /events/new, /events/edit/...)
    if (!pathname.startsWith('/events')) {
      console.log('[EventContext] Not on events route, skipping fetch.');
      return;
    }
    if (currentUser?.uid) {
      if (!didFetchEventsRef.current) {
        console.log(`[EventContext] First-time fetch for UID: ${currentUser.uid}`);
        fetchAllEventsFromAPI();
        didFetchEventsRef.current = true;
      }
    } else {
      console.log('[EventContext] No user or user logged out. Clearing event states.');
      setAllEvents([]);
      setDisplayedEvents([]);
      setCurrentPage(1);
      setTotalPages(0);
      setSearchTitle('');
      setSearchDate('');
      didFetchEventsRef.current = false;
    }
  }, [currentUser?.uid, fetchAllEventsFromAPI, pathname]);

  const processedEvents = useMemo(() => {
    let filtered = [...allEvents];
    if (searchTitle) {
      filtered = filtered.filter(event => event.title.toLowerCase().includes(searchTitle.toLowerCase()));
    }
    if (searchDate) {
      // Assuming date is in YYYY-MM-DD format for startsWith comparison
      filtered = filtered.filter(event => event.date.startsWith(searchDate));
    }
    return filtered;
  }, [allEvents, searchTitle, searchDate]);

  useEffect(() => {
    const newTotalPages = Math.ceil(processedEvents.length / PAGE_SIZE);
    setTotalPages(newTotalPages);
    
    // Adjust current page if it's out of bounds
    if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0 && currentPage !== 1) {
        setCurrentPage(1); // Reset to page 1 if no results
    }

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setDisplayedEvents(processedEvents.slice(start, end));

  }, [processedEvents, currentPage]);
  
  const fetchEvents = useCallback(async () => {
    console.log('[EventContext] Manual fetchEvents called.');
    if (currentUser) {
        // No longer need to manipulate refs, just call the main fetch function
        await fetchAllEventsFromAPI();
    } else {
        console.log('[EventContext] Manual fetchEvents called, but no user. Clearing events.');
        setAllEvents([]);
        // No ref to set to null
    }
  }, [currentUser, fetchAllEventsFromAPI]);

  const addEvent = useCallback(async (eventData: EventInput): Promise<boolean> => {
    if (!currentUser) {
      setError('User not authenticated');
      console.log('[EventContext] User not available, skipping add event.');
      return false;
    }
    setLoading(true);
    setError(null);
    console.log(`[EventContext] Adding event to: ${API_BASE_URL}/events`);
    console.log('[EventContext] Event data for add:', eventData);

    try {
      const token = await currentUser.getIdToken();
      console.log('[EventContext] Firebase ID Token for add:', token ? 'Token fetched' : 'Failed to fetch token');

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      console.log('[EventContext] Add event response status:', response.status);
      const responseText = await response.text();
      console.log('[EventContext] Add event response text:', responseText);

      if (!response.ok) {
        let errorData = { message: `Failed to add event. Status: ${response.status}` };
        try {
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.warn('[EventContext] addEvent parse error:', parseError);
        }
        throw new Error(errorData.message ?? `HTTP error! status: ${response.status}`);
      }
   
      await fetchAllEventsFromAPI(); 
      setCurrentPage(1); 
      setSearchTitle(''); 
      setSearchDate(''); 
      return true;
    } catch (err) {
      console.error("Error adding event via API: ", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add event';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser, fetchAllEventsFromAPI]); // Added fetchAllEventsFromAPI to dependencies

  const updateEvent = useCallback(async (eventId: string, eventData: Partial<EventInput>): Promise<boolean> => {
    if (!currentUser) {
      setError('User not authenticated');
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update event' }));
        throw new Error(errorData.message ?? `HTTP error! status: ${response.status}`);
      }
      // After updating, refresh.
      // No longer need to manipulate refs.
      await fetchAllEventsFromAPI(); 
      return true;
    } catch (err) {
      console.error("Error updating event via API: ", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser, fetchAllEventsFromAPI]); // Added fetchAllEventsFromAPI to dependencies

  const deleteEvent = useCallback(async (eventId: string): Promise<boolean> => {
    if (!currentUser) {
      setError('User not authenticated');
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete event' }));
        throw new Error(errorData.message ?? `HTTP error! status: ${response.status}`);
      }
      // After deleting, refresh.
      // No longer need to manipulate refs.
      await fetchAllEventsFromAPI(); 
      return true;
    } catch (err) {
      console.error("Error deleting event via API: ", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser, fetchAllEventsFromAPI]); // Added fetchAllEventsFromAPI to dependencies

  const getEventById = useCallback(async (eventId: string): Promise<Event | null> => {
    const existingEvent = allEvents.find(event => event.id === eventId);
    if (existingEvent) return existingEvent;

    if (!currentUser) {
        setError("User not authenticated");
        return null;
    }
    setLoading(true); 
    setError(null);
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
            setError('Event not found.');
            return null;
        }
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch event by ID' }));
        throw new Error(errorData.message ?? `HTTP error! status: ${response.status}`);
      }
      const event: Event = await response.json();
      // Optionally add/update this event in allEvents state if it was fetched from API
      // setAllEvents(prev => prev.map(e => e.id === event.id ? event : e).concat(prev.find(e=>e.id === event.id) ? [] : [event]));
      return event;
    } catch (err) {
      console.error("[EventContext] Error fetching event by ID via API: ", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch event by ID';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser, allEvents]); // Added allEvents to dependencies

  const contextValue = useMemo(() => ({
    events: displayedEvents,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    fetchEvents,
    getEventById,
    setCurrentPage,
    setSearchTitle,
    setSearchDate,
    clearError,
    currentPage,
    totalPages,
    searchTitle,
    searchDate,
  }), [displayedEvents, loading, error, addEvent, updateEvent, deleteEvent, fetchEvents, getEventById, currentPage, totalPages, searchTitle, searchDate, clearError]); // Dependencies are correct now that functions are memoized

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
