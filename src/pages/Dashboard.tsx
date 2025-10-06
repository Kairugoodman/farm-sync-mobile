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
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="pt-2">
          <h1 className="text-3xl font-bold text-foreground">FarmSync</h1>
          <p className="text-muted-foreground">Livestock Management Dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
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
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">You have {overdueReminders} overdue reminder{overdueReminders !== 1 ? 's' : ''}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/reminders')}
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full h-14 text-base" 
              onClick={() => navigate('/cows?action=add')}
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Cow
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-14 text-base"
              onClick={() => navigate('/calendar')}
            >
              <Calendar className="mr-2 h-5 w-5" />
              View Calendar
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Herd Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cows.slice(0, 5).map(cow => (
              <div 
                key={cow.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                onClick={() => navigate(`/cows/${cow.id}`)}
              >
                <div>
                  <p className="font-medium">{cow.name}</p>
                  <p className="text-sm text-muted-foreground">Tag: {cow.tagNumber}</p>
                </div>
                <Badge 
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
              className="w-full"
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
