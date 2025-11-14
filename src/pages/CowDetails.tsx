import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCowById, getCowEvents, deleteCow, Cow, CowEvent } from '@/lib/supabaseQueries';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cow, setCow] = useState<Cow | null>(null);
  const [events, setEvents] = useState<CowEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCowData();
    }
  }, [id]);

  const fetchCowData = async () => {
    if (!id) return;
    
    try {
      const cowData = await getCowById(id);
      if (cowData) {
        setCow(cowData);
        const cowEvents = await getCowEvents(id);
        setEvents(cowEvents.sort((a, b) => 
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
        ));
      } else {
        navigate('/cows');
      }
    } catch (error) {
      console.error('Error fetching cow data:', error);
      toast.error('Failed to load cow details');
      navigate('/cows');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (id) {
      try {
        await deleteCow(id);
        toast.success('Cow removed from herd');
        navigate('/cows');
      } catch (error) {
        console.error('Error deleting cow:', error);
        toast.error('Failed to delete cow');
      }
    }
  };

  const getEventIcon = (type: CowEvent['event_type']) => {
    return <Calendar className="h-4 w-4" />;
  };

  const getEventColor = (type: CowEvent['event_type']) => {
    switch (type) {
      case 'heat': return 'text-warning';
      case 'insemination': return 'text-primary';
      case 'calving': return 'text-success';
      case 'vaccination': return 'text-secondary';
      case 'checkup': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cow) return null;

  const age = Math.floor(
    (new Date().getTime() - new Date(cow.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365)
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-5 space-y-5">
        {/* Header */}
        <div className="pt-4 pb-2">
          <Button
            variant="ghost"
            size="icon"
            className="mb-3 rounded-xl"
            onClick={() => navigate('/cows')}
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2.5} />
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">🐄 {cow.name}</h1>
              <p className="text-muted-foreground font-medium">{cow.breed}</p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <Card className="shadow-soft-md border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">📋 Basic Information</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-2 shadow-soft"
                  onClick={() => navigate('/cows')}
                >
                  <Edit className="h-4 w-4" strokeWidth={2.5} />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl border-2 shadow-soft">
                      <Trash2 className="h-4 w-4 text-destructive" strokeWidth={2.5} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-bold">Remove cow from herd?</AlertDialogTitle>
                      <AlertDialogDescription className="font-medium">
                        This will permanently delete {cow.name} and all associated records. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl font-semibold">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground rounded-xl font-semibold shadow-soft">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Breed</p>
                <p className="font-bold text-base">{cow.breed}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Age</p>
                <p className="font-bold text-base">{age} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Date of Birth</p>
                <p className="font-bold text-base">{format(new Date(cow.birth_date), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Status</p>
                <Badge 
                  className="font-semibold px-3 py-1.5 rounded-xl"
                  variant={cow.insemination_date && !cow.calving_date ? 'default' : 'outline'}
                >
                  {cow.insemination_date && !cow.calving_date ? 'Pregnant' : 'Active'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reproductive Info */}
        {(cow.calving_date || cow.insemination_date || cow.expected_next_calving) && (
          <Card className="shadow-soft-md border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold">👶 Reproductive Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cow.calving_date && (
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">🌸 Last Calving</p>
                  <p className="font-bold text-base">{format(new Date(cow.calving_date), 'MMM d, yyyy')}</p>
                </div>
              )}
              {cow.insemination_date && (
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">💉 Insemination Date</p>
                  <p className="font-bold text-base">{format(new Date(cow.insemination_date), 'MMM d, yyyy')}</p>
                </div>
              )}
              {cow.expected_next_calving && (
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">📅 Expected Next Calving</p>
                  <p className="font-bold text-base text-success">{format(new Date(cow.expected_next_calving), 'MMM d, yyyy')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Event Timeline */}
        <Card className="shadow-soft-md border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">📅 Event Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length > 0 ? (
              <div className="space-y-5">
                {events.map((event, index) => {
                  const isPredicted = event.id.startsWith('predicted-');
                  const isFuture = new Date(event.event_date) > new Date();
                  
                  return (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`p-2.5 rounded-xl shadow-soft ${getEventColor(event.event_type)}`}>
                          {getEventIcon(event.event_type)}
                        </div>
                        {index < events.length - 1 && (
                          <div className="w-1 h-full bg-border my-2 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                          <p className="font-bold capitalize text-base">{event.event_type.replace('_', ' ')}</p>
                          <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1 rounded-lg border-2">
                            {format(new Date(event.event_date), 'MMM d, yyyy')}
                          </Badge>
                          {isPredicted && isFuture && (
                            <Badge className="bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-lg">
                              predicted
                            </Badge>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-sm text-muted-foreground font-medium leading-relaxed">{event.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8 font-medium">No events recorded</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CowDetails;
