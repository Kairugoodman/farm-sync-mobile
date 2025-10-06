import { useState, useEffect } from 'react';
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
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="pt-2">
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Track reproductive events</p>
        </div>

        {/* Legend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="bg-warning text-warning-foreground">Heat</Badge>
              <Badge variant="default">Insemination</Badge>
              <Badge variant="default" className="bg-success text-success-foreground">Calving</Badge>
              <Badge variant="secondary">Vaccination</Badge>
              <Badge variant="outline">Checkup</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0"
              modifiers={{
                event: eventDates,
              }}
              modifiersClassNames={{
                event: 'bg-primary/20 font-bold',
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Date Events */}
        {selectedDate && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Events for {format(selectedDate, 'MMMM d, yyyy')}
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
                        className={`p-3 rounded-lg border-2 ${getEventColor(event.type)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{cow?.name || 'Unknown'}</p>
                              <Badge variant={getEventBadge(event.type) as any}>
                                {event.type}
                              </Badge>
                            </div>
                            {event.notes && (
                              <p className="text-sm text-muted-foreground">{event.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No events for this date</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* All Events List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">All Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {events
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map(event => {
                  const cow = getCowById(event.cowId);
                  return (
                    <div 
                      key={event.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{cow?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(event.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge variant={getEventBadge(event.type) as any}>
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
