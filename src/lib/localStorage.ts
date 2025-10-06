export interface Cow {
  id: string;
  name: string;
  tagNumber: string;
  breed: string;
  dateOfBirth: string;
  status: 'healthy' | 'pregnant' | 'sick' | 'inseminated';
  lastHeat?: string;
  lastInsemination?: string;
  expectedCalving?: string;
  notes: string;
}

export interface Event {
  id: string;
  cowId: string;
  type: 'heat' | 'insemination' | 'calving' | 'vaccination' | 'checkup';
  date: string;
  notes: string;
  completed: boolean;
}

export interface Reminder {
  id: string;
  cowId: string;
  title: string;
  date: string;
  type: 'heat' | 'insemination' | 'calving' | 'vaccination' | 'checkup';
  completed: boolean;
}

const STORAGE_KEYS = {
  COWS: 'farmsync_cows',
  EVENTS: 'farmsync_events',
  REMINDERS: 'farmsync_reminders',
};

// Initialize with dummy data if empty
const initializeDummyData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.COWS)) {
    const dummyCows: Cow[] = [
      {
        id: '1',
        name: 'Bessie',
        tagNumber: 'A101',
        breed: 'Holstein',
        dateOfBirth: '2020-03-15',
        status: 'pregnant',
        lastHeat: '2024-09-15',
        lastInsemination: '2024-09-16',
        expectedCalving: '2025-06-25',
        notes: 'First pregnancy, doing well',
      },
      {
        id: '2',
        name: 'Daisy',
        tagNumber: 'A102',
        breed: 'Jersey',
        dateOfBirth: '2019-05-20',
        status: 'healthy',
        lastHeat: '2024-10-01',
        notes: 'High milk producer',
      },
      {
        id: '3',
        name: 'Buttercup',
        tagNumber: 'A103',
        breed: 'Guernsey',
        dateOfBirth: '2021-01-10',
        status: 'inseminated',
        lastHeat: '2024-10-03',
        lastInsemination: '2024-10-04',
        notes: 'Second insemination attempt',
      },
    ];

    const dummyEvents: Event[] = [
      { id: '1', cowId: '1', type: 'heat', date: '2024-09-15', notes: 'Strong signs', completed: true },
      { id: '2', cowId: '1', type: 'insemination', date: '2024-09-16', notes: 'Successful AI', completed: true },
      { id: '3', cowId: '2', type: 'heat', date: '2024-10-01', notes: 'Regular cycle', completed: true },
      { id: '4', cowId: '3', type: 'heat', date: '2024-10-03', notes: 'Clear signs', completed: true },
      { id: '5', cowId: '3', type: 'insemination', date: '2024-10-04', notes: 'Second attempt', completed: true },
    ];

    const dummyReminders: Reminder[] = [
      { id: '1', cowId: '1', title: 'Pregnancy check for Bessie', date: '2024-11-16', type: 'checkup', completed: false },
      { id: '2', cowId: '1', title: 'Expected calving - Bessie', date: '2025-06-25', type: 'calving', completed: false },
      { id: '3', cowId: '2', title: 'Watch for heat - Daisy', date: '2024-10-22', type: 'heat', completed: false },
      { id: '4', cowId: '3', title: 'Pregnancy test - Buttercup', date: '2024-11-04', type: 'checkup', completed: false },
    ];

    localStorage.setItem(STORAGE_KEYS.COWS, JSON.stringify(dummyCows));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(dummyEvents));
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(dummyReminders));
  }
};

// Cows
export const getCows = (): Cow[] => {
  initializeDummyData();
  const data = localStorage.getItem(STORAGE_KEYS.COWS);
  return data ? JSON.parse(data) : [];
};

export const getCowById = (id: string): Cow | undefined => {
  const cows = getCows();
  return cows.find(cow => cow.id === id);
};

export const saveCow = (cow: Cow) => {
  const cows = getCows();
  const index = cows.findIndex(c => c.id === cow.id);
  if (index >= 0) {
    cows[index] = cow;
  } else {
    cows.push(cow);
  }
  localStorage.setItem(STORAGE_KEYS.COWS, JSON.stringify(cows));
};

export const deleteCow = (id: string) => {
  const cows = getCows().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.COWS, JSON.stringify(cows));
};

// Events
export const getEvents = (): Event[] => {
  initializeDummyData();
  const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return data ? JSON.parse(data) : [];
};

export const getEventsByCowId = (cowId: string): Event[] => {
  return getEvents().filter(e => e.cowId === cowId);
};

export const saveEvent = (event: Event) => {
  const events = getEvents();
  const index = events.findIndex(e => e.id === event.id);
  if (index >= 0) {
    events[index] = event;
  } else {
    events.push(event);
  }
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
};

// Reminders
export const getReminders = (): Reminder[] => {
  initializeDummyData();
  const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
  return data ? JSON.parse(data) : [];
};

export const saveReminder = (reminder: Reminder) => {
  const reminders = getReminders();
  const index = reminders.findIndex(r => r.id === reminder.id);
  if (index >= 0) {
    reminders[index] = reminder;
  } else {
    reminders.push(reminder);
  }
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
};

export const deleteReminder = (id: string) => {
  const reminders = getReminders().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
};
