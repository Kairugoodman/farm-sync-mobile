import { addDays, format } from 'date-fns';
import { Event, Reminder } from './localStorage';

export interface ScheduledEvent {
  type: Event['type'];
  dayOffset: number;
  title: string;
  description: string;
  reminderDaysBefore?: number;
}

// Standard 12-month dairy cow cycle events
const COW_CYCLE_EVENTS: ScheduledEvent[] = [
  {
    type: 'calving',
    dayOffset: 0,
    title: 'Calving',
    description: 'Cow gives birth; lactation starts',
    reminderDaysBefore: 7,
  },
  {
    type: 'checkup',
    dayOffset: 45,
    title: 'End of Recovery Period',
    description: 'Uterus recovery complete',
    reminderDaysBefore: 3,
  },
  {
    type: 'insemination',
    dayOffset: 60,
    title: 'Service Window Start',
    description: 'Cow should be on heat and ready for insemination',
    reminderDaysBefore: 5,
  },
  {
    type: 'insemination',
    dayOffset: 80,
    title: 'Service Window End',
    description: 'Last recommended day for insemination',
    reminderDaysBefore: 3,
  },
  {
    type: 'checkup',
    dayOffset: 105,
    title: 'Pregnancy Check (Early)',
    description: '30 days after insemination - confirm conception',
    reminderDaysBefore: 7,
  },
  {
    type: 'checkup',
    dayOffset: 120,
    title: 'Pregnancy Check (Late)',
    description: '45 days after insemination - confirm conception',
    reminderDaysBefore: 5,
  },
  {
    type: 'checkup',
    dayOffset: 305,
    title: 'Dry-Off',
    description: 'Stop milking ~60 days before next calving',
    reminderDaysBefore: 7,
  },
  {
    type: 'checkup',
    dayOffset: 320,
    title: 'Steaming-Up Period',
    description: 'Begin high-energy feeding before calving',
    reminderDaysBefore: 5,
  },
  {
    type: 'calving',
    dayOffset: 365,
    title: 'Next Calving Expected',
    description: 'New cycle begins; target one calf per year',
    reminderDaysBefore: 14,
  },
];

/**
 * Calculate all predicted events from a calving date
 */
export const calculateEventsFromCalving = (
  cowId: string,
  calvingDate: Date
): { events: Event[]; reminders: Reminder[] } => {
  const events: Event[] = [];
  const reminders: Reminder[] = [];

  COW_CYCLE_EVENTS.forEach((scheduledEvent, index) => {
    const eventDate = addDays(calvingDate, scheduledEvent.dayOffset);
    const eventId = `predicted-${cowId}-${scheduledEvent.type}-${scheduledEvent.dayOffset}`;
    const reminderId = `reminder-${eventId}`;

    // Create the event
    events.push({
      id: eventId,
      cowId,
      type: scheduledEvent.type,
      date: format(eventDate, 'yyyy-MM-dd'),
      notes: scheduledEvent.description,
      completed: false,
    });

    // Create reminder if specified
    if (scheduledEvent.reminderDaysBefore) {
      const reminderDate = addDays(
        eventDate,
        -scheduledEvent.reminderDaysBefore
      );
      reminders.push({
        id: reminderId,
        cowId,
        title: scheduledEvent.title,
        date: format(reminderDate, 'yyyy-MM-dd'),
        type: scheduledEvent.type,
        completed: false,
      });
    }
  });

  return { events, reminders };
};

/**
 * Calculate all predicted events from an insemination date
 * Insemination to calving is typically 280 days (9 months)
 */
export const calculateEventsFromInsemination = (
  cowId: string,
  inseminationDate: Date
): { events: Event[]; reminders: Reminder[] } => {
  // Calculate expected calving date (280 days after insemination)
  const expectedCalvingDate = addDays(inseminationDate, 280);
  return calculateEventsFromCalving(cowId, expectedCalvingDate);
};
