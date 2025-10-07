import { useEffect, useState } from 'react';
import logoImage from '@/assets/farmsync-logo.png';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-300">
      <div className="animate-in fade-in zoom-in duration-500">
        <img 
          src={logoImage} 
          alt="FarmSync Logo" 
          className="w-32 h-32 mb-6"
        />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
        FarmSync
      </h1>
      <p className="text-muted-foreground font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        Smart Farming, Simplified
      </p>
    </div>
  );
};
