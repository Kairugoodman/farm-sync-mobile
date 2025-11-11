import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Cow, saveCow, saveEvent, saveReminder } from '@/lib/localStorage';
import { toast } from 'sonner';
import { calculateEventsFromCalving, calculateEventsFromInsemination } from '@/lib/eventScheduler';

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
  const [startDateType, setStartDateType] = useState<'calving' | 'insemination'>('calving');
  const [startDate, setStartDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.tagNumber || !formData.breed || !formData.dateOfBirth) {
      toast.error('Please fill in all required fields');
      return;
    }

    saveCow(formData);

    // Generate automatic events and reminders if start date is provided (new cow only)
    if (startDate && !cow) {
      const dateObj = new Date(startDate);
      const { events, reminders } = 
        startDateType === 'calving'
          ? calculateEventsFromCalving(formData.id, dateObj)
          : calculateEventsFromInsemination(formData.id, dateObj);

      // Save all generated events and reminders
      events.forEach(event => saveEvent(event));
      reminders.forEach(reminder => saveReminder(reminder));

      toast.success(`Cow added with ${events.length} predicted events!`);
    } else {
      toast.success(cow ? 'Cow updated successfully' : 'Cow added successfully');
    }

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

          {!cow && (
            <>
              <div className="pt-6 border-t-2 border-border space-y-4">
                <div>
                  <Label className="text-base font-bold text-foreground mb-2 block">
                    🗓️ Automatic Event Scheduling
                  </Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Automatically generate a 12-month cycle of events and reminders based on a starting date.
                  </p>
                </div>

                <RadioGroup 
                  value={startDateType} 
                  onValueChange={(value: 'calving' | 'insemination') => setStartDateType(value)}
                >
                  <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-border hover:border-primary transition-colors">
                    <RadioGroupItem value="calving" id="calving" />
                    <Label htmlFor="calving" className="text-base cursor-pointer font-semibold flex-1">
                      Start from Calving Date
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-border hover:border-primary transition-colors">
                    <RadioGroupItem value="insemination" id="insemination" />
                    <Label htmlFor="insemination" className="text-base cursor-pointer font-semibold flex-1">
                      Start from Insemination Date
                    </Label>
                  </div>
                </RadioGroup>

                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-base font-semibold">
                    {startDateType === 'calving' ? '📅 Calving Date' : '💉 Insemination Date'}
                  </Label>
                  <Input 
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-12"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {startDateType === 'calving' 
                      ? 'Events will be scheduled from this calving date (Day 0)'
                      : 'Expected calving date will be calculated (280 days after insemination)'}
                  </p>
                </div>
              </div>
            </>
          )}

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
