import { CalendarEvent } from '../types';

// Check if browser notifications are supported
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show a notification for an event
export const showEventNotification = (event: CalendarEvent, minutesBefore: number = 0): void => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  const title = event.title;
  const options: NotificationOptions = {
    body: event.description || '',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: `event-${event.id}`,
    data: {
      eventId: event.id,
      date: event.date
    }
  };

  if (minutesBefore > 0) {
    options.body = `Reminder: ${event.title} starts in ${minutesBefore} ${minutesBefore === 1 ? 'minute' : 'minutes'}`;
  }

  const notification = new Notification(title, options);

  notification.onclick = () => {
    window.focus();
    notification.close();
    // You could add navigation to the event details here
  };
};

// Schedule notifications for an event
export const scheduleEventNotifications = (event: CalendarEvent): void => {
  if (!event.reminderMinutes || event.reminderMinutes.length === 0) {
    return;
  }

  const now = new Date();
  const eventTime = new Date(event.date);

  event.reminderMinutes.forEach(minutes => {
    const reminderTime = new Date(eventTime.getTime() - minutes * 60000);
    
    // If reminder time is in the future, schedule it
    if (reminderTime > now) {
      const timeUntilReminder = reminderTime.getTime() - now.getTime();
      
      setTimeout(() => {
        showEventNotification(event, minutes);
      }, timeUntilReminder);
    }
  });
};

// Schedule notifications for all events
export const scheduleAllNotifications = (events: CalendarEvent[]): void => {
  events.forEach(event => {
    scheduleEventNotifications(event);
  });
};

// Initialize notifications system
export const initializeNotifications = async (events: CalendarEvent[]): Promise<boolean> => {
  const hasPermission = await requestNotificationPermission();
  
  if (hasPermission) {
    scheduleAllNotifications(events);
  }
  
  return hasPermission;
};
