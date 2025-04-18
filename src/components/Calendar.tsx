import { useState, useEffect } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPlus } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { CalendarEvent } from '../types';
import { getEventsForDate, hasEvents, hasImportantEvents } from '../utils/eventStorage';
import EventList from './EventList';
import EventForm from './EventForm';

const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined);

  // Load events for the selected date
  useEffect(() => {
    const eventsForDate = getEventsForDate(date);
    setEvents(eventsForDate);
  }, [date]);

  // Handle date change
  const handleDateChange = (value: Date | Date[]) => {
    if (value instanceof Date) {
      setDate(value);
    }
  };

  // Add custom class to tiles with events
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      let classes: string[] = [];

      if (hasEvents(date)) {
        classes.push('has-events');
      }

      if (hasImportantEvents(date)) {
        classes.push('has-important-events');
      }

      return classes.length > 0 ? classes.join(' ') : null;
    }
    return null;
  };

  // Add content to tiles with events
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && hasImportantEvents(date)) {
      return (
        <div className="important-marker">
          <FontAwesomeIcon icon={faStar} />
        </div>
      );
    }
    return null;
  };

  // Handle saving an event
  const handleSaveEvent = (event: CalendarEvent) => {
    // In a real app, you would save to a database or API
    // For this example, we'll just update the local state
    const updatedEvents = editingEvent
      ? events.map(e => (e.id === event.id ? event : e))
      : [...events, event];

    setEvents(updatedEvents);

    // Save to localStorage via our utility
    import('../utils/eventStorage').then(({ saveEvent }) => {
      saveEvent(event);
    });

    setShowEventForm(false);
    setEditingEvent(undefined);
  };

  // Handle deleting an event
  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);

    // Delete from localStorage via our utility
    import('../utils/eventStorage').then(({ deleteEvent }) => {
      deleteEvent(eventId);
    });
  };

  // Handle editing an event
  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Calendar</h2>
        <p className="selected-date">{format(date, 'MMMM yyyy')}</p>
      </div>

      <div className="calendar-wrapper">
        <ReactCalendar
          onChange={handleDateChange}
          value={date}
          tileClassName={tileClassName}
          tileContent={tileContent}
          className="react-calendar"
        />
      </div>

      <div className="events-section">
        <div className="events-header">
          <h3>Events for {format(date, 'MMMM d, yyyy')}</h3>
          <button
            className="add-event-btn"
            onClick={() => {
              setEditingEvent(undefined);
              setShowEventForm(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Event
          </button>
        </div>

        {showEventForm ? (
          <EventForm
            selectedDate={date}
            onSave={handleSaveEvent}
            onCancel={() => {
              setShowEventForm(false);
              setEditingEvent(undefined);
            }}
            editEvent={editingEvent}
          />
        ) : (
          <EventList
            events={events}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;
