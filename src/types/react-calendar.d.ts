declare module 'react-calendar' {
  import React from 'react';

  export type CalendarType = 'ISO 8601' | 'US' | 'Arabic' | 'Hebrew';
  export type Detail = 'month' | 'year' | 'decade' | 'century';
  export type DateCallback = (date: Date) => void;
  export type ClickCallback = (value: Date, event: React.MouseEvent<HTMLButtonElement>) => void;
  export type ViewCallback = (props: { activeStartDate: Date, view: Detail }) => void;

  export interface CalendarProps {
    activeStartDate?: Date;
    allowPartialRange?: boolean;
    calendarType?: CalendarType;
    className?: string;
    defaultActiveStartDate?: Date;
    defaultValue?: Date | Date[];
    defaultView?: Detail;
    disabled?: boolean;
    disableCalendar?: boolean;
    goToRangeStartOnSelect?: boolean;
    inputRef?: React.RefObject<HTMLInputElement>;
    locale?: string;
    maxDate?: Date;
    maxDetail?: Detail;
    minDate?: Date;
    minDetail?: Detail;
    navigationAriaLabel?: string;
    navigationLabel?: (props: { date: Date, label: string, locale: string, view: Detail }) => string | React.ReactNode;
    next2AriaLabel?: string;
    next2Label?: string | React.ReactNode;
    nextAriaLabel?: string;
    nextLabel?: string | React.ReactNode;
    onActiveStartDateChange?: ViewCallback;
    onChange?: (value: Date | Date[], event: React.MouseEvent<HTMLButtonElement>) => void;
    onClickDay?: ClickCallback;
    onClickDecade?: ClickCallback;
    onClickMonth?: ClickCallback;
    onClickWeekNumber?: (weekNumber: number, date: Date, event: React.MouseEvent<HTMLButtonElement>) => void;
    onClickYear?: ClickCallback;
    onDrillDown?: ViewCallback;
    onDrillUp?: ViewCallback;
    onViewChange?: ViewCallback;
    prev2AriaLabel?: string;
    prev2Label?: string | React.ReactNode;
    prevAriaLabel?: string;
    prevLabel?: string | React.ReactNode;
    returnValue?: 'start' | 'end' | 'range';
    selectRange?: boolean;
    showDoubleView?: boolean;
    showFixedNumberOfWeeks?: boolean;
    showNavigation?: boolean;
    showNeighboringMonth?: boolean;
    showWeekNumbers?: boolean;
    tileClassName?: string | string[] | ((props: { date: Date, view: Detail }) => string | string[] | null);
    tileContent?: React.ReactNode | ((props: { date: Date, view: Detail }) => React.ReactNode);
    tileDisabled?: (props: { activeStartDate: Date, date: Date, view: Detail }) => boolean;
    value?: Date | Date[] | null;
    view?: Detail;
  }

  export default function Calendar(props: CalendarProps): JSX.Element;
}
