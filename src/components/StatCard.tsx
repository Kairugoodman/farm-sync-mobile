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
    <Card className="shadow-soft-md hover:shadow-soft-lg transition-all duration-300 border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">{title}</p>
            <p className="text-4xl font-bold tracking-tight text-foreground">{value}</p>
          </div>
          <div className={cn('p-4 rounded-2xl border', variantStyles[variant])}>
            <Icon className="h-8 w-8" strokeWidth={2.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
