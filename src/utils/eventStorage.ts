import { CalendarEvent } from '../types';

// Get all events from local storage
export const getEvents = (): CalendarEvent[] => {
  const eventsJson = localStorage.getItem('calendarEvents');
  if (!eventsJson) return [];
  
  try {
    const events = JSON.parse(eventsJson);
    // Convert string dates back to Date objects
    return events.map((event: any) => ({
      ...event,
      date: new Date(event.date)
    }));
  } catch (error) {
    console.error('Error parsing events from localStorage:', error);
    return [];
  }
};

// Save an event to local storage
export const saveEvent = (event: CalendarEvent): void => {
  const events = getEvents();
  const existingEventIndex = events.findIndex(e => e.id === event.id);
  
  if (existingEventIndex >= 0) {
    // Update existing event
    events[existingEventIndex] = event;
  } else {
    // Add new event
    events.push(event);
  }
  
  localStorage.setItem('calendarEvents', JSON.stringify(events));
};

// Delete an event from local storage
export const deleteEvent = (eventId: string): void => {
  const events = getEvents();
  const filteredEvents = events.filter(event => event.id !== eventId);
  localStorage.setItem('calendarEvents', JSON.stringify(filteredEvents));
};

// Get events for a specific date
export const getEventsForDate = (date: Date): CalendarEvent[] => {
  const events = getEvents();
  return events.filter(event => 
    event.date.getFullYear() === date.getFullYear() &&
    event.date.getMonth() === date.getMonth() &&
    event.date.getDate() === date.getDate()
  );
};

// Check if a date has any events
export const hasEvents = (date: Date): boolean => {
  return getEventsForDate(date).length > 0;
};

// Check if a date has any important events
export const hasImportantEvents = (date: Date): boolean => {
  const events = getEventsForDate(date);
  return events.some(event => event.important);
};
