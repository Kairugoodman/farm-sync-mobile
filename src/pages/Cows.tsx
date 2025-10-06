import { useState, useEffect } from 'react';
import { Plus, Search, Edit } from 'lucide-react';
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
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="pt-2">
          <h1 className="text-2xl font-bold text-foreground">My Cows</h1>
          <p className="text-muted-foreground">{cows.length} animals in herd</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, tag, or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Add Button */}
        <Button 
          className="w-full h-12"
          onClick={() => setShowForm(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Cow
        </Button>

        {/* Cows List */}
        <div className="space-y-3">
          {filteredCows.map(cow => (
            <Card 
              key={cow.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/cows/${cow.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{cow.name}</h3>
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
                    <p className="text-sm text-muted-foreground">
                      Tag: {cow.tagNumber} • {cow.breed}
                    </p>
                    {cow.expectedCalving && (
                      <p className="text-sm text-success font-medium">
                        Expected calving: {new Date(cow.expectedCalving).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(cow);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredCows.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No cows found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cows;
