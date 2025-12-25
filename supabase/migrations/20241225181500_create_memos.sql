CREATE TABLE IF NOT EXISTS public.memos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.memos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own memos" ON public.memos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memos" ON public.memos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memos" ON public.memos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memos" ON public.memos
    FOR DELETE USING (auth.uid() = user_id);

-- Function to handle updated_at if moddatetime is not available
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_memos_updated_at
    BEFORE UPDATE ON public.memos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
