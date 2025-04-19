import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faCalendarDay, faCalendarWeek, faCalendarAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { RecurrenceRule, RecurrenceType } from '../types';
import { format } from 'date-fns';

interface RecurrenceSelectorProps {
  value?: RecurrenceRule;
  onChange: (recurrence: RecurrenceRule | undefined) => void;
  startDate: Date;
}

const RecurrenceSelector = ({ value, onChange, startDate }: RecurrenceSelectorProps) => {
  const [type, setType] = useState<RecurrenceType>(value?.type || 'none');
  const [interval, setInterval] = useState<number>(value?.interval || 1);
  const [endType, setEndType] = useState<'never' | 'on' | 'after'>(
    value?.endDate ? 'on' : value?.count ? 'after' : 'never'
  );
  const [endDate, setEndDate] = useState<string>(
    value?.endDate ? format(value.endDate, 'yyyy-MM-dd') : ''
  );
  const [occurrences, setOccurrences] = useState<number>(value?.count || 10);

  useEffect(() => {
    if (type === 'none') {
      onChange(undefined);
      return;
    }

    const recurrence: RecurrenceRule = {
      type,
      interval
    };

    if (endType === 'on' && endDate) {
      recurrence.endDate = new Date(endDate);
    } else if (endType === 'after') {
      recurrence.count = occurrences;
    }

    onChange(recurrence);
  }, [type, interval, endType, endDate, occurrences, onChange]);

  const recurrenceOptions: { value: RecurrenceType; label: string; icon: any }[] = [
    { value: 'none', label: 'Does not repeat', icon: faTimes },
    { value: 'daily', label: 'Daily', icon: faCalendarDay },
    { value: 'weekly', label: 'Weekly', icon: faCalendarWeek },
    { value: 'monthly', label: 'Monthly', icon: faCalendarAlt },
    { value: 'yearly', label: 'Yearly', icon: faCalendarAlt }
  ];

  return (
    <div className="recurrence-selector">
      <div className="recurrence-header">
        <FontAwesomeIcon icon={faRedo} />
        <span>Repeat</span>
      </div>

      <div className="recurrence-options">
        {recurrenceOptions.map(option => (
          <div
            key={option.value}
            className={`recurrence-option ${type === option.value ? 'selected' : ''}`}
            onClick={() => setType(option.value)}
          >
            <FontAwesomeIcon icon={option.icon} />
            <span>{option.label}</span>
          </div>
        ))}
      </div>

      {type !== 'none' && (
        <>
          <div className="recurrence-interval">
            <span>Repeat every</span>
            <div className="interval-input">
              <input
                type="number"
                min="1"
                max="99"
                value={interval}
                onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
              />
              <span>
                {type === 'daily' && (interval === 1 ? 'day' : 'days')}
                {type === 'weekly' && (interval === 1 ? 'week' : 'weeks')}
                {type === 'monthly' && (interval === 1 ? 'month' : 'months')}
                {type === 'yearly' && (interval === 1 ? 'year' : 'years')}
              </span>
            </div>
          </div>

          <div className="recurrence-end">
            <span>Ends</span>
            <div className="end-options">
              <label className="end-option">
                <input
                  type="radio"
                  name="endType"
                  checked={endType === 'never'}
                  onChange={() => setEndType('never')}
                />
                <span>Never</span>
              </label>

              <label className="end-option">
                <input
                  type="radio"
                  name="endType"
                  checked={endType === 'on'}
                  onChange={() => setEndType('on')}
                />
                <span>On</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={endType !== 'on'}
                  min={format(startDate, 'yyyy-MM-dd')}
                />
              </label>

              <label className="end-option">
                <input
                  type="radio"
                  name="endType"
                  checked={endType === 'after'}
                  onChange={() => setEndType('after')}
                />
                <span>After</span>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={occurrences}
                  onChange={(e) => setOccurrences(parseInt(e.target.value) || 1)}
                  disabled={endType !== 'after'}
                />
                <span>occurrences</span>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RecurrenceSelector;
