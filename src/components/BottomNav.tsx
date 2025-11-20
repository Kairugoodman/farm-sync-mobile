import { Home, Beef, Calendar, Bell } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/cows', icon: Beef, label: 'Cows' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/reminders', icon: Bell, label: 'Reminders' },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/98 backdrop-blur-md border-t border-border/60 z-50 pb-safe shadow-soft-lg">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto px-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 rounded-xl px-2',
                isActive
                  ? 'text-primary font-semibold scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  'p-1.5 rounded-lg transition-all duration-200',
                  isActive && 'bg-primary/10'
                )}>
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
