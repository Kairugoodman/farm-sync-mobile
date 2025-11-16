import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const PREMIUM_PRICE_ID = 'price_REPLACE_WITH_YOUR_PRICE_ID'; // Replace this with actual Stripe price ID

export const useSubscription = () => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const checkSubscription = async () => {
    if (!user) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      setIsPremium(data.subscribed || false);
      setSubscriptionEnd(data.subscription_end || null);
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Check local profile as fallback
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single();
      
      setIsPremium(profile?.is_premium || false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
    
    // Check subscription periodically (every 60 seconds)
    const interval = setInterval(checkSubscription, 60000);
    
    return () => clearInterval(interval);
  }, [user]);

  const upgradeToPremium = async () => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        toast.error('Please log in to upgrade');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: PREMIUM_PRICE_ID },
        headers: {
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
      });

      if (error) throw error;
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to start upgrade process. Please try again.');
    }
  };

  return {
    isPremium,
    loading,
    subscriptionEnd,
    checkSubscription,
    upgradeToPremium,
  };
};
