import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cow, saveCow } from '@/lib/supabaseQueries';
import { toast } from 'sonner';

interface CowFormProps {
  cow?: Cow;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CowForm = ({ cow, onSuccess, onCancel }: CowFormProps) => {
  const [formData, setFormData] = useState({
    name: cow?.name || '',
    breed: cow?.breed || '',
    birth_date: cow?.birth_date || '',
    calving_date: cow?.calving_date || '',
    insemination_date: cow?.insemination_date || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.breed || !formData.birth_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await saveCow({
        id: cow?.id,
        name: formData.name,
        breed: formData.breed,
        birth_date: formData.birth_date,
        calving_date: formData.calving_date || null,
        insemination_date: formData.insemination_date || null,
      });
      
      toast.success(cow ? 'Cow updated successfully' : 'Cow added successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Error saving cow:', error);
      toast.error(error.message || 'Failed to save cow');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cow ? 'Edit Cow' : 'Add New Cow'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Bessie"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="breed">Breed *</Label>
            <Input
              id="breed"
              value={formData.breed}
              onChange={(e) => handleChange('breed', e.target.value)}
              placeholder="e.g., Holstein"
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_date">Date of Birth *</Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => handleChange('birth_date', e.target.value)}
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="calving_date">Last Calving Date (Optional)</Label>
            <Input
              id="calving_date"
              type="date"
              value={formData.calving_date}
              onChange={(e) => handleChange('calving_date', e.target.value)}
              className="h-12"
            />
            <p className="text-sm text-muted-foreground">
              Events will be automatically generated based on this date
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="insemination_date">Insemination Date (Optional)</Label>
            <Input
              id="insemination_date"
              type="date"
              value={formData.insemination_date}
              onChange={(e) => handleChange('insemination_date', e.target.value)}
              className="h-12"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-12"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12"
              disabled={loading}
            >
              {loading ? 'Saving...' : (cow ? 'Update Cow' : 'Add Cow')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
