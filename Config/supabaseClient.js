import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'



dotenv.config({ path: path.resolve(process.cwd(), '.env') });


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

export const supabase = createClient(supabaseUrl, supabaseServiceRole);
