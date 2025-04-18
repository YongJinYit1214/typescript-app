import { useState, useEffect } from 'react';
import { CalendarEvent } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';

interface EventFormProps {
  selectedDate: Date;
  onSave: (event: CalendarEvent) => void;
  onCancel: () => void;
  editEvent?: CalendarEvent;
}

const EventForm = ({ selectedDate, onSave, onCancel, editEvent }: EventFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [important, setImportant] = useState(false);

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setDescription(editEvent.description || '');
      setImportant(editEvent.important);
    }
  }, [editEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const event: CalendarEvent = {
      id: editEvent ? editEvent.id : uuidv4(),
      date: selectedDate,
      title,
      description: description || undefined,
      important
    };
    
    onSave(event);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImportant(false);
  };

  return (
    <div className="event-form">
      <h3>{editEvent ? 'Edit Event' : 'Add New Event'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Event title"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event description (optional)"
            rows={3}
          />
        </div>
        
        <div className="form-group important-checkbox">
          <label>
            <input
              type="checkbox"
              checked={important}
              onChange={(e) => setImportant(e.target.checked)}
            />
            <span className="important-label">
              Mark as important <FontAwesomeIcon icon={solidStar} className="star-icon" />
            </span>
          </label>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="save-btn">
            {editEvent ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
