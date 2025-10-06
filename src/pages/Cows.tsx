import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Beef } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCows, Cow } from '@/lib/localStorage';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CowForm } from '@/components/CowForm';

const Cows = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cows, setCows] = useState<Cow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCow, setEditingCow] = useState<Cow | undefined>();

  useEffect(() => {
    setCows(getCows());
    if (searchParams.get('action') === 'add') {
      setShowForm(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const filteredCows = cows.filter(cow =>
    cow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cow.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cow.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSuccess = () => {
    setCows(getCows());
    setShowForm(false);
    setEditingCow(undefined);
  };

  const handleEdit = (cow: Cow) => {
    setEditingCow(cow);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-2xl mx-auto p-4">
          <CowForm 
            cow={editingCow}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingCow(undefined);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-5 space-y-5">
        {/* Header */}
        <div className="pt-4 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-primary to-success p-3 rounded-2xl shadow-soft-md">
              <Beef className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">🐄 My Herd</h1>
              <p className="text-muted-foreground font-medium">{cows.length} animals</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
          <Input
            placeholder="Search by name, tag, or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 rounded-2xl shadow-soft border-2 font-medium"
          />
        </div>

        {/* Add Button */}
        <Button 
          className="w-full h-14 text-base font-semibold rounded-2xl shadow-soft-md hover:shadow-soft-lg transition-all"
          onClick={() => setShowForm(true)}
        >
          <Plus className="mr-2 h-6 w-6" strokeWidth={2.5} />
          Add New Cow
        </Button>

        {/* Cows List */}
        <div className="space-y-4">
          {filteredCows.map(cow => (
            <Card 
              key={cow.id}
              className="cursor-pointer hover:shadow-soft-lg transition-all duration-200 shadow-soft-md border-0"
              onClick={() => navigate(`/cows/${cow.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-lg">{cow.name}</h3>
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
                    <p className="text-sm text-muted-foreground font-medium">
                      Tag: {cow.tagNumber} • {cow.breed}
                    </p>
                    {cow.expectedCalving && (
                      <p className="text-sm text-success font-semibold flex items-center gap-1.5">
                        👶 Expected calving: {new Date(cow.expectedCalving).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl hover:bg-muted/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(cow);
                    }}
                  >
                    <Edit className="h-5 w-5" strokeWidth={2.5} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredCows.length === 0 && (
            <Card className="shadow-soft-md border-0">
              <CardContent className="p-10 text-center">
                <Beef className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" strokeWidth={1.5} />
                <p className="text-muted-foreground font-medium text-lg">No cows found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cows;
