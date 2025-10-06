import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cow, saveCow } from '@/lib/localStorage';
import { toast } from 'sonner';

interface CowFormProps {
  cow?: Cow;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CowForm = ({ cow, onSuccess, onCancel }: CowFormProps) => {
  const [formData, setFormData] = useState<Cow>(
    cow || {
      id: Date.now().toString(),
      name: '',
      tagNumber: '',
      breed: '',
      dateOfBirth: '',
      status: 'healthy',
      notes: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.tagNumber || !formData.breed || !formData.dateOfBirth) {
      toast.error('Please fill in all required fields');
      return;
    }

    saveCow(formData);
    toast.success(cow ? 'Cow updated successfully' : 'Cow added successfully');
    onSuccess();
  };

  const handleChange = (field: keyof Cow, value: string) => {
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
            <Label htmlFor="tagNumber">Tag Number *</Label>
            <Input
              id="tagNumber"
              value={formData.tagNumber}
              onChange={(e) => handleChange('tagNumber', e.target.value)}
              placeholder="e.g., A101"
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value as Cow['status'])}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="pregnant">Pregnant</SelectItem>
                <SelectItem value="inseminated">Inseminated</SelectItem>
                <SelectItem value="sick">Sick</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastHeat">Last Heat Date</Label>
            <Input
              id="lastHeat"
              type="date"
              value={formData.lastHeat || ''}
              onChange={(e) => handleChange('lastHeat', e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastInsemination">Last Insemination Date</Label>
            <Input
              id="lastInsemination"
              type="date"
              value={formData.lastInsemination || ''}
              onChange={(e) => handleChange('lastInsemination', e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedCalving">Expected Calving Date</Label>
            <Input
              id="expectedCalving"
              type="date"
              value={formData.expectedCalving || ''}
              onChange={(e) => handleChange('expectedCalving', e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional information..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-12">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-12">
              {cow ? 'Update' : 'Add'} Cow
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
