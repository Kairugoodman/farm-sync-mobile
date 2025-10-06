import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export const StatCard = ({ title, value, icon: Icon, variant = 'default' }: StatCardProps) => {
  const variantStyles = {
    default: 'bg-primary/15 text-primary border-primary/20',
    success: 'bg-success/15 text-success border-success/20',
    warning: 'bg-warning/15 text-warning border-warning/20',
    destructive: 'bg-destructive/15 text-destructive border-destructive/20',
  };

  return (
    <Card className="shadow-soft-md hover:shadow-soft-lg transition-all duration-300 border-0">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
          </div>
          <div className={cn('p-4 rounded-2xl border-2', variantStyles[variant])}>
            <Icon className="h-7 w-7" strokeWidth={2.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
