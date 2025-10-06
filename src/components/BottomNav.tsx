import { Home, Beef, Calendar, Bell } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/cows', icon: Beef, label: 'Cows' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/reminders', icon: Bell, label: 'Reminders' },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50 pb-safe shadow-soft-lg">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all duration-200 rounded-xl',
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
