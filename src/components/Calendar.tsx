import { useState, useEffect } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPlus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { format, addMonths, subMonths, addYears, subYears, getYear, isWithinInterval } from 'date-fns';
import { CalendarEvent } from '../types';
import { getEventsForDate, hasEvents, hasImportantEvents, getEvents } from '../utils/eventStorage';
import EventList from './EventList';
import EventForm from './EventForm';
import Weather from './Weather';
import SearchBar, { FilterOptions } from './SearchBar';
import { initializeNotifications, scheduleEventNotifications } from '../services/notificationService';

const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined);
  const [viewDate, setViewDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    onlyImportant: false,
    dateRange: {
      start: null,
      end: null
    }
  });

  // Calculate min and max years (5 years in past and future)
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 5;
  const maxYear = currentYear + 5;

  // Initialize notifications
  useEffect(() => {
    initializeNotifications(getEvents());
  }, []);

  // Load events for the selected date
  useEffect(() => {
    const eventsForDate = getEventsForDate(date);
    setEvents(eventsForDate);
    setFilteredEvents(eventsForDate);
  }, [date]);

  // Apply search and filters
  useEffect(() => {
    let filtered = [...events];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        (event.description && event.description.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filterOptions.categories.length > 0) {
      filtered = filtered.filter(event =>
        filterOptions.categories.includes(event.category)
      );
    }

    // Apply importance filter
    if (filterOptions.onlyImportant) {
      filtered = filtered.filter(event => event.important);
    }

    // Apply date range filter
    if (filterOptions.dateRange.start && filterOptions.dateRange.end) {
      filtered = filtered.filter(event =>
        isWithinInterval(event.date, {
          start: filterOptions.dateRange.start!,
          end: filterOptions.dateRange.end!
        })
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, filterOptions]);

  // Handle date change
  const handleDateChange = (value: Date | Date[]) => {
    if (value instanceof Date) {
      setDate(value);
      setViewDate(value);
    }
  };

  // Navigation functions
  const handlePrevMonth = () => {
    setViewDate(prevDate => {
      const newDate = subMonths(prevDate, 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setViewDate(prevDate => {
      const newDate = addMonths(prevDate, 1);
      return newDate;
    });
  };

  const handlePrevYear = () => {
    setViewDate(prevDate => {
      const newDate = subYears(prevDate, 1);
      return getYear(newDate) >= minYear ? newDate : prevDate;
    });
  };

  const handleNextYear = () => {
    setViewDate(prevDate => {
      const newDate = addYears(prevDate, 1);
      return getYear(newDate) <= maxYear ? newDate : prevDate;
    });
  };

  // Handle month selection
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(event.target.value, 10);
    setViewDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(month);
      return newDate;
    });
  };

  // Handle year selection
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(event.target.value, 10);
    setViewDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setFullYear(year);
      return newDate;
    });
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

    // Schedule notifications for the event
    if (event.reminderMinutes && event.reminderMinutes.length > 0) {
      scheduleEventNotifications(event);
    }

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

  // Generate month options
  const monthOptions = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' },
  ];

  // Generate year options (5 years in past and future)
  const yearOptions = [];
  for (let year = minYear; year <= maxYear; year++) {
    yearOptions.push({ value: year, label: year.toString() });
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle filter
  const handleFilter = (options: FilterOptions) => {
    setFilterOptions(options);
  };

  return (
    <div className="calendar-container">
      <Weather date={date} />

      <SearchBar onSearch={handleSearch} onFilter={handleFilter} />

      <div className="calendar-header">
        <h2>Calendar</h2>
        <div className="calendar-navigation">
          <div className="year-navigation">
            <button
              className="nav-btn"
              onClick={handlePrevYear}
              aria-label="Previous Year"
            >
              <FontAwesomeIcon icon={faChevronLeft} /> Year
            </button>

            <select
              value={viewDate.getFullYear()}
              onChange={handleYearChange}
              className="year-select"
              aria-label="Select Year"
            >
              {yearOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              className="nav-btn"
              onClick={handleNextYear}
              aria-label="Next Year"
            >
              Year <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>

          <div className="month-navigation">
            <button
              className="nav-btn"
              onClick={handlePrevMonth}
              aria-label="Previous Month"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <select
              value={viewDate.getMonth()}
              onChange={handleMonthChange}
              className="month-select"
              aria-label="Select Month"
            >
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              className="nav-btn"
              onClick={handleNextMonth}
              aria-label="Next Month"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-wrapper">
        <ReactCalendar
          onChange={handleDateChange}
          value={date}
          activeStartDate={viewDate}
          tileClassName={tileClassName}
          tileContent={tileContent}
          className="react-calendar"
          showNavigation={false}
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
            events={filteredEvents}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;
