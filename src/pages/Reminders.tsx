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
        className={`p-4 rounded-2xl border-2 transition-all hover:shadow-soft ${
          reminder.completed 
            ? 'bg-muted/50 border-border opacity-60' 
            : isOverdue 
            ? 'bg-destructive/10 border-destructive' 
            : getTypeColor(reminder.type)
        }`}
      >
        <div className="flex items-start gap-3.5">
          <Checkbox
            checked={reminder.completed}
            onCheckedChange={() => toggleReminder(reminder)}
            className="mt-1.5 h-5 w-5 rounded-lg"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className={`font-bold text-base ${reminder.completed ? 'line-through' : ''}`}>
                {reminder.title}
              </p>
              {isOverdue && !reminder.completed && (
                <Badge variant="destructive" className="text-xs font-semibold px-2.5 py-1 rounded-lg">
                  Overdue
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {cow?.name || 'Unknown'} • {format(new Date(reminder.date), 'MMM d, yyyy')}
            </p>
            <Badge variant="outline" className="text-xs capitalize font-semibold px-2.5 py-1 rounded-lg border-2">
              {reminder.type}
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-5 space-y-5">
        {/* Header */}
        <div className="pt-4 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-primary to-success p-3 rounded-2xl shadow-soft-md">
              <Bell className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">🔔 Reminders</h1>
              <p className="text-muted-foreground font-medium">
                {overdueReminders.length} overdue • {upcomingReminders.length + todayReminders.length} upcoming
              </p>
            </div>
          </div>
        </div>

        {/* Overdue */}
        {overdueReminders.length > 0 && (
          <Card className="border-2 border-destructive/40 bg-destructive/5 shadow-soft-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2.5 text-destructive font-bold">
                <div className="p-2 bg-destructive/15 rounded-xl">
                  <Clock className="h-5 w-5" strokeWidth={2.5} />
                </div>
                ⏰ Overdue ({overdueReminders.length})
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
          <Card className="border-2 border-warning/40 bg-warning/5 shadow-soft-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2.5 text-warning font-bold">
                <div className="p-2 bg-warning/15 rounded-xl">
                  <Bell className="h-5 w-5" strokeWidth={2.5} />
                </div>
                📌 Today ({todayReminders.length})
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
          <Card className="shadow-soft-md border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2.5 font-bold">
                <div className="p-2 bg-primary/15 rounded-xl">
                  <CalendarIcon className="h-5 w-5 text-primary" strokeWidth={2.5} />
                </div>
                📅 Upcoming ({upcomingReminders.length})
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
          <Card className="shadow-soft-md border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2.5 text-muted-foreground font-bold">
                <div className="p-2 bg-muted rounded-xl">
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                </div>
                ✅ Completed ({completedReminders.length})
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
          <Card className="shadow-soft-md border-0">
            <CardContent className="p-10 text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" strokeWidth={1.5} />
              <p className="text-muted-foreground font-medium text-lg">No reminders yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Reminders;
