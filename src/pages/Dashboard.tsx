import { Calendar, AlertTriangle, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { getCows, getCowEvents } from '@/lib/supabaseQueries';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import logoImage from '@/assets/farmsync-logo.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [cows, setCows] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cowsData, eventsData] = await Promise.all([
          getCows(),
          getCowEvents(),
        ]);
        setCows(cowsData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };
  
  const totalCows = cows.length;
  const pregnantCows = cows.filter(c => c.insemination_date && !c.calving_date).length;
  const overdueEvents = events.filter(e => !e.completed && new Date(e.event_date) < new Date()).length;
  
  // Get only the immediate upcoming event per cow within the next 7 days
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  
  const upcomingEventsByCow = new Map<string, typeof events[0]>();
  events
    .filter(e => !e.completed && new Date(e.event_date) >= new Date() && new Date(e.event_date) <= oneWeekFromNow)
    .forEach(event => {
      const existing = upcomingEventsByCow.get(event.cow_id);
      if (!existing || new Date(event.event_date) < new Date(existing.event_date)) {
        upcomingEventsByCow.set(event.cow_id, event);
      }
    });
  
  const upcomingEvents = upcomingEventsByCow.size;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-5 space-y-6">
        {/* Header */}
        <div className="pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <img 
                src={logoImage} 
                alt="FarmSync Logo" 
                className="w-14 h-14 rounded-2xl shadow-soft-md"
              />
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">FarmSync</h1>
                <p className="text-muted-foreground font-medium">Livestock Dashboard</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-xl"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <StatCard
            title="Total Cows"
            value={totalCows}
            icon={Calendar}
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
            value={overdueEvents}
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
        {overdueEvents > 0 && (
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
                <p className="text-sm font-semibold">You have {overdueEvents} overdue event{overdueEvents !== 1 ? 's' : ''}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="shadow-soft"
                  onClick={() => navigate('/calendar')}
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
            {cows.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No cows added yet. Add your first cow to get started!
              </p>
            ) : (
              cows.slice(0, 5).map((cow) => (
                <div
                  key={cow.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer border-2 border-transparent hover:border-primary/20"
                  onClick={() => navigate(`/cows/${cow.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-success flex items-center justify-center text-white font-bold text-lg shadow-soft">
                      {cow.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{cow.name}</p>
                      <p className="text-sm text-muted-foreground">{cow.breed}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {cow.insemination_date && !cow.calving_date && (
                      <Badge variant="default" className="shadow-soft font-semibold">
                        Pregnant
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
