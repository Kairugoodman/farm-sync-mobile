import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getEvents, getCowById, Event } from '@/lib/localStorage';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const dayEvents = events.filter(e => e.date === dateStr);
      setSelectedEvents(dayEvents);
    }
  }, [selectedDate, events]);

  const eventDates = events.map(e => new Date(e.date));

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'heat': return 'bg-warning/20 border-warning';
      case 'insemination': return 'bg-primary/20 border-primary';
      case 'calving': return 'bg-success/20 border-success';
      case 'vaccination': return 'bg-secondary/20 border-secondary';
      case 'checkup': return 'bg-accent/20 border-accent';
      default: return 'bg-muted border-border';
    }
  };

  const getEventBadge = (type: Event['type']) => {
    switch (type) {
      case 'heat': return 'warning';
      case 'insemination': return 'default';
      case 'calving': return 'default';
      case 'vaccination': return 'secondary';
      case 'checkup': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-5 space-y-5">
        {/* Header */}
        <div className="pt-4 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-primary to-success p-3 rounded-2xl shadow-soft-md">
              <CalendarIcon className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">📅 Calendar</h1>
              <p className="text-muted-foreground font-medium">Track events</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <Card className="shadow-soft-md border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2.5">
              <Badge className="bg-warning text-warning-foreground font-semibold px-3 py-1.5 rounded-xl">🌸 Heat</Badge>
              <Badge className="font-semibold px-3 py-1.5 rounded-xl">💉 Insemination</Badge>
              <Badge className="bg-success text-success-foreground font-semibold px-3 py-1.5 rounded-xl">👶 Calving</Badge>
              <Badge variant="secondary" className="font-semibold px-3 py-1.5 rounded-xl">💊 Vaccination</Badge>
              <Badge variant="outline" className="font-semibold px-3 py-1.5 rounded-xl border-2">🩺 Checkup</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="shadow-soft-md border-0">
          <CardContent className="p-5">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-2xl border-0 mx-auto"
              modifiers={{
                event: eventDates,
              }}
              modifiersClassNames={{
                event: 'bg-primary/30 font-bold text-primary rounded-xl',
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Date Events */}
        {selectedDate && (
          <Card className="shadow-soft-md border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold">
                📌 {format(selectedDate, 'MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedEvents.map(event => {
                    const cow = getCowById(event.cowId);
                    return (
                      <div 
                        key={event.id}
                        className={`p-4 rounded-2xl border-2 transition-all hover:shadow-soft ${getEventColor(event.type)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <p className="font-bold text-base">{cow?.name || 'Unknown'}</p>
                              <Badge className="font-semibold px-3 py-1 rounded-xl capitalize" variant={getEventBadge(event.type) as any}>
                                {event.type}
                              </Badge>
                            </div>
                            {event.notes && (
                              <p className="text-sm text-muted-foreground font-medium">{event.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6 font-medium">No events for this date</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* All Events List */}
        <Card className="shadow-soft-md border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">📋 Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map(event => {
                  const cow = getCowById(event.cowId);
                  return (
                    <div 
                      key={event.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-muted/70 transition-all hover:shadow-soft border border-transparent hover:border-border"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-base">{cow?.name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground font-medium">
                          {format(new Date(event.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge className="font-semibold px-3 py-1.5 rounded-xl capitalize" variant={getEventBadge(event.type) as any}>
                        {event.type}
                      </Badge>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
