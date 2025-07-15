import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aspoyyswwwsuqpgduaew.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcG95eXN3d3dzdXFwZ2R1YWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzM0NjksImV4cCI6MjA2Njk0OTQ2OX0.MNsjKHVHulbansOvjdXn8L8pq3m2LeZFWxJK-zjfEc0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default supabase;