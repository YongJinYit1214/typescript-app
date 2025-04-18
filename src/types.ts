export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  description?: string;
  important: boolean;
}
