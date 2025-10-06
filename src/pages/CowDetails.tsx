import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCowById, getEventsByCowId, deleteCow, Cow, Event } from '@/lib/localStorage';
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
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (id) {
      const cowData = getCowById(id);
      if (cowData) {
        setCow(cowData);
        setEvents(getEventsByCowId(id).sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      } else {
        navigate('/cows');
      }
    }
  }, [id, navigate]);

  const handleDelete = () => {
    if (id) {
      deleteCow(id);
      toast.success('Cow removed from herd');
      navigate('/cows');
    }
  };

  if (!cow) return null;

  const getEventIcon = (type: Event['type']) => {
    return <Calendar className="h-4 w-4" />;
  };

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'heat': return 'text-warning';
      case 'insemination': return 'text-primary';
      case 'calving': return 'text-success';
      case 'vaccination': return 'text-secondary';
      case 'checkup': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const age = Math.floor(
    (new Date().getTime() - new Date(cow.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365)
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/cows')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{cow.name}</h1>
            <p className="text-muted-foreground">Tag: {cow.tagNumber}</p>
          </div>
        </div>

        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Basic Information</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/cows?edit=${cow.id}`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove cow from herd?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {cow.name} and all associated records. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Breed</p>
                <p className="font-medium">{cow.breed}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{age} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{format(new Date(cow.dateOfBirth), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
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
            </div>
          </CardContent>
        </Card>

        {/* Reproductive Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Reproductive Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cow.lastHeat && (
              <div>
                <p className="text-sm text-muted-foreground">Last Heat</p>
                <p className="font-medium">{format(new Date(cow.lastHeat), 'MMM d, yyyy')}</p>
              </div>
            )}
            {cow.lastInsemination && (
              <div>
                <p className="text-sm text-muted-foreground">Last Insemination</p>
                <p className="font-medium">{format(new Date(cow.lastInsemination), 'MMM d, yyyy')}</p>
              </div>
            )}
            {cow.expectedCalving && (
              <div>
                <p className="text-sm text-muted-foreground">Expected Calving</p>
                <p className="font-medium text-success">{format(new Date(cow.expectedCalving), 'MMM d, yyyy')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        {cow.notes && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{cow.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Event Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Event Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-full bg-muted ${getEventColor(event.type)}`}>
                        {getEventIcon(event.type)}
                      </div>
                      {index < events.length - 1 && (
                        <div className="w-0.5 h-full bg-border my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium capitalize">{event.type}</p>
                        <Badge variant="outline" className="text-xs">
                          {format(new Date(event.date), 'MMM d, yyyy')}
                        </Badge>
                      </div>
                      {event.notes && (
                        <p className="text-sm text-muted-foreground">{event.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No events recorded</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CowDetails;
