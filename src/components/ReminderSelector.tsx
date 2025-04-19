import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

interface ReminderSelectorProps {
  value?: number[];
  onChange: (reminderMinutes: number[] | undefined) => void;
}

const ReminderSelector = ({ value = [], onChange }: ReminderSelectorProps) => {
  const [reminders, setReminders] = useState<number[]>(value);

  useEffect(() => {
    onChange(reminders.length > 0 ? reminders : undefined);
  }, [reminders, onChange]);

  const addReminder = () => {
    setReminders([...reminders, 30]); // Default to 30 minutes
  };

  const updateReminder = (index: number, minutes: number) => {
    const newReminders = [...reminders];
    newReminders[index] = minutes;
    setReminders(newReminders);
  };

  const removeReminder = (index: number) => {
    const newReminders = [...reminders];
    newReminders.splice(index, 1);
    setReminders(newReminders);
  };

  // Common reminder options in minutes
  const reminderOptions = [
    { value: 0, label: 'At time of event' },
    { value: 5, label: '5 minutes before' },
    { value: 10, label: '10 minutes before' },
    { value: 15, label: '15 minutes before' },
    { value: 30, label: '30 minutes before' },
    { value: 60, label: '1 hour before' },
    { value: 120, label: '2 hours before' },
    { value: 1440, label: '1 day before' },
    { value: 2880, label: '2 days before' },
    { value: 10080, label: '1 week before' },
  ];

  return (
    <div className="reminder-selector">
      <div className="reminder-header">
        <FontAwesomeIcon icon={faBell} />
        <span>Reminders</span>
      </div>

      {reminders.length === 0 ? (
        <div className="no-reminders">No reminders set</div>
      ) : (
        <div className="reminder-list">
          {reminders.map((minutes, index) => (
            <div key={index} className="reminder-item">
              <select
                value={minutes}
                onChange={(e) => updateReminder(index, parseInt(e.target.value))}
                className="reminder-select"
              >
                {reminderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                className="remove-reminder"
                onClick={() => removeReminder(index)}
                aria-label="Remove reminder"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="add-reminder" onClick={addReminder}>
        <FontAwesomeIcon icon={faPlus} />
        <span>Add Reminder</span>
      </button>
    </div>
  );
};

export default ReminderSelector;
