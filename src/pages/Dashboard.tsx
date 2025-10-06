import { Beef, Calendar, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import { getCows, getReminders } from '@/lib/localStorage';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const navigate = useNavigate();
  const cows = getCows();
  const reminders = getReminders();
  
  const totalCows = cows.length;
  const pregnantCows = cows.filter(c => c.status === 'pregnant').length;
  const overdueReminders = reminders.filter(r => !r.completed && new Date(r.date) < new Date()).length;
  const upcomingEvents = reminders.filter(r => !r.completed && new Date(r.date) >= new Date()).length;

  const recentAlerts = cows
    .filter(c => c.status === 'sick' || overdueReminders > 0)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-5 space-y-6">
        {/* Header */}
        <div className="pt-4 pb-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-primary to-success p-3 rounded-2xl shadow-soft-md">
              <Beef className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">FarmSync</h1>
              <p className="text-muted-foreground font-medium">Livestock Dashboard</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <StatCard
            title="Total Cows"
            value={totalCows}
            icon={Beef}
            variant="default"
          />
          <StatCard
            title="Pregnant"
            value={pregnantCows}
            icon={Calendar}
            variant="success"
          />
          <StatCard
            title="Overdue"
            value={overdueReminders}
            icon={AlertTriangle}
            variant="destructive"
          />
          <StatCard
            title="Upcoming"
            value={upcomingEvents}
            icon={Calendar}
            variant="warning"
          />
        </div>

        {/* Alerts */}
        {overdueReminders > 0 && (
          <Card className="border-2 border-destructive/30 bg-destructive/5 shadow-soft-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2.5">
                <div className="p-2 bg-destructive/15 rounded-xl">
                  <AlertTriangle className="h-5 w-5 text-destructive" strokeWidth={2.5} />
                </div>
                <span className="font-bold">⚠️ Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">You have {overdueReminders} overdue reminder{overdueReminders !== 1 ? 's' : ''}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="shadow-soft"
                  onClick={() => navigate('/reminders')}
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="shadow-soft-md border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">⚡ Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full h-14 text-base font-semibold shadow-soft-md hover:shadow-soft-lg transition-all rounded-2xl" 
              onClick={() => navigate('/cows?action=add')}
            >
              <Plus className="mr-2 h-6 w-6" strokeWidth={2.5} />
              Add New Cow
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-14 text-base font-semibold shadow-soft hover:shadow-soft-md transition-all rounded-2xl border-2"
              onClick={() => navigate('/calendar')}
            >
              <Calendar className="mr-2 h-6 w-6" strokeWidth={2.5} />
              View Calendar
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-soft-md border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              🐄 Herd Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cows.slice(0, 5).map(cow => (
              <div 
                key={cow.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-muted/70 cursor-pointer transition-all duration-200 hover:shadow-soft border border-transparent hover:border-border"
                onClick={() => navigate(`/cows/${cow.id}`)}
              >
                <div>
                  <p className="font-semibold text-base">{cow.name}</p>
                  <p className="text-sm text-muted-foreground">Tag: {cow.tagNumber}</p>
                </div>
                <Badge 
                  className="font-semibold px-3 py-1 rounded-xl"
                  variant={
                    cow.status === 'pregnant' ? 'default' :
                    cow.status === 'sick' ? 'destructive' :
                    cow.status === 'inseminated' ? 'secondary' :
                    'outline'
                  }
                >
                  {cow.status}
                </Badge>
              </div>
            ))}
            <Button 
              variant="ghost" 
              className="w-full font-semibold rounded-xl hover:bg-muted/70"
              onClick={() => navigate('/cows')}
            >
              View All Cows
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
