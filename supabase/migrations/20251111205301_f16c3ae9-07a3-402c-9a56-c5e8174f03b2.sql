-- Create cows table
CREATE TABLE IF NOT EXISTS public.cows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  birth_date DATE NOT NULL,
  calving_date DATE,
  insemination_date DATE,
  expected_next_calving DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create cow_events table
CREATE TABLE IF NOT EXISTS public.cow_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cow_id UUID NOT NULL REFERENCES public.cows(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  description TEXT,
  reminder_date DATE,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cow_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public access for now - can be restricted later)
CREATE POLICY "Allow public read access to cows" 
  ON public.cows FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to cows" 
  ON public.cows FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update access to cows" 
  ON public.cows FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete access to cows" 
  ON public.cows FOR DELETE 
  USING (true);

CREATE POLICY "Allow public read access to cow_events" 
  ON public.cow_events FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to cow_events" 
  ON public.cow_events FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update access to cow_events" 
  ON public.cow_events FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete access to cow_events" 
  ON public.cow_events FOR DELETE 
  USING (true);

-- Function to automatically generate standard cow events
CREATE OR REPLACE FUNCTION public.generate_cow_events()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only generate events if calving_date is provided
  IF NEW.calving_date IS NOT NULL THEN
    -- Insemination: +75 days
    INSERT INTO public.cow_events (cow_id, event_type, event_date, description, reminder_date)
    VALUES (
      NEW.id,
      'insemination',
      NEW.calving_date + INTERVAL '75 days',
      'Service / Insemination Window',
      NEW.calving_date + INTERVAL '68 days'
    );

    -- Pregnancy Check: +110 days
    INSERT INTO public.cow_events (cow_id, event_type, event_date, description, reminder_date)
    VALUES (
      NEW.id,
      'checkup',
      NEW.calving_date + INTERVAL '110 days',
      'Pregnancy Check (30-45 days after insemination)',
      NEW.calving_date + INTERVAL '103 days'
    );

    -- Dry-Off: +305 days
    INSERT INTO public.cow_events (cow_id, event_type, event_date, description, reminder_date)
    VALUES (
      NEW.id,
      'checkup',
      NEW.calving_date + INTERVAL '305 days',
      'Dry-Off (Stop milking ~60 days before next calving)',
      NEW.calving_date + INTERVAL '298 days'
    );

    -- Steaming-Up: +315 days
    INSERT INTO public.cow_events (cow_id, event_type, event_date, description, reminder_date)
    VALUES (
      NEW.id,
      'checkup',
      NEW.calving_date + INTERVAL '315 days',
      'Steaming-Up Period (High-energy feeding)',
      NEW.calving_date + INTERVAL '308 days'
    );

    -- Next Calving: +365 days
    INSERT INTO public.cow_events (cow_id, event_type, event_date, description, reminder_date)
    VALUES (
      NEW.id,
      'calving',
      NEW.calving_date + INTERVAL '365 days',
      'Next Calving Expected (New cycle begins)',
      NEW.calving_date + INTERVAL '358 days'
    );

    -- Update expected_next_calving on the cow record
    UPDATE public.cows 
    SET expected_next_calving = NEW.calving_date + INTERVAL '365 days'
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to automatically generate events when a cow is added
CREATE TRIGGER generate_events_on_cow_insert
  AFTER INSERT ON public.cows
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_cow_events();