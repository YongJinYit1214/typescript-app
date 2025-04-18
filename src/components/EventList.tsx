import { CalendarEvent } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

interface EventListProps {
  events: CalendarEvent[];
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

const EventList = ({ events, onEdit, onDelete }: EventListProps) => {
  if (events.length === 0) {
    return <p className="no-events">No events for this date.</p>;
  }

  return (
    <div className="event-list">
      <h3>Events for {events.length > 0 ? format(events[0].date, 'MMMM d, yyyy') : ''}</h3>
      {events.map((event) => (
        <div key={event.id} className={`event-item ${event.important ? 'important' : ''}`}>
          <div className="event-header">
            <h4 className="event-title">
              {event.title}
              {event.important && (
                <FontAwesomeIcon icon={faStar} className="star-icon" />
              )}
            </h4>
            <div className="event-actions">
              <button 
                onClick={() => onEdit(event)} 
                className="edit-btn"
                aria-label="Edit event"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button 
                onClick={() => onDelete(event.id)} 
                className="delete-btn"
                aria-label="Delete event"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
          {event.description && (
            <p className="event-description">{event.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventList;
