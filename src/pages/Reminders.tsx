import { useState, useEffect } from 'react';
import { Clock, Check, Bell, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { getReminders, getCowById, saveReminder, Reminder } from '@/lib/localStorage';
import { format, isPast, isFuture } from 'date-fns';
import { toast } from 'sonner';

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = () => {
    setReminders(getReminders().sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
  };

  const toggleReminder = (reminder: Reminder) => {
    const updated = { ...reminder, completed: !reminder.completed };
    saveReminder(updated);
    toast.success(updated.completed ? 'Reminder completed' : 'Reminder reopened');
    loadReminders();
  };

  const overdueReminders = reminders.filter(r => !r.completed && isPast(new Date(r.date)) && !isToday(new Date(r.date)));
  const todayReminders = reminders.filter(r => !r.completed && isToday(new Date(r.date)));
  const upcomingReminders = reminders.filter(r => !r.completed && isFuture(new Date(r.date)) && !isToday(new Date(r.date)));
  const completedReminders = reminders.filter(r => r.completed);

  function isToday(date: Date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  const getTypeColor = (type: Reminder['type']) => {
    switch (type) {
      case 'heat': return 'bg-warning/20 text-warning border-warning';
      case 'insemination': return 'bg-primary/20 text-primary border-primary';
      case 'calving': return 'bg-success/20 text-success border-success';
      case 'vaccination': return 'bg-secondary/20 text-secondary border-secondary';
      case 'checkup': return 'bg-accent/20 text-accent border-accent';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const ReminderCard = ({ reminder }: { reminder: Reminder }) => {
    const cow = getCowById(reminder.cowId);
    const isOverdue = isPast(new Date(reminder.date)) && !isToday(new Date(reminder.date));

    return (
      <div 
        className={`p-4 rounded-lg border-2 transition-all ${
          reminder.completed 
            ? 'bg-muted/50 border-border opacity-60' 
            : isOverdue 
            ? 'bg-destructive/10 border-destructive' 
            : getTypeColor(reminder.type)
        }`}
      >
        <div className="flex items-start gap-3">
          <Checkbox
            checked={reminder.completed}
            onCheckedChange={() => toggleReminder(reminder)}
            className="mt-1"
          />
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <p className={`font-medium ${reminder.completed ? 'line-through' : ''}`}>
                {reminder.title}
              </p>
              {isOverdue && !reminder.completed && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {cow?.name || 'Unknown'} • {format(new Date(reminder.date), 'MMM d, yyyy')}
            </p>
            <Badge variant="outline" className="text-xs capitalize">
              {reminder.type}
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="pt-2">
          <h1 className="text-2xl font-bold text-foreground">Reminders</h1>
          <p className="text-muted-foreground">
            {overdueReminders.length} overdue • {upcomingReminders.length + todayReminders.length} upcoming
          </p>
        </div>

        {/* Overdue */}
        {overdueReminders.length > 0 && (
          <Card className="border-destructive/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <Clock className="h-5 w-5" />
                Overdue ({overdueReminders.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {overdueReminders.map(reminder => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Today */}
        {todayReminders.length > 0 && (
          <Card className="border-warning/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-warning">
                <Bell className="h-5 w-5" />
                Today ({todayReminders.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayReminders.map(reminder => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Upcoming */}
        {upcomingReminders.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Upcoming ({upcomingReminders.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingReminders.map(reminder => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Completed */}
        {completedReminders.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
                <Check className="h-5 w-5" />
                Completed ({completedReminders.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedReminders.slice(0, 5).map(reminder => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {reminders.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No reminders yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Reminders;
