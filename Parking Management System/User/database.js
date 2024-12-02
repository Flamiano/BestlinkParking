import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xqanlfwxqtvzlgeukxic.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxYW5sZnd4cXR2emxnZXVreGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNDMxMjMsImV4cCI6MjA0ODYxOTEyM30.2Oa1zmRcXt3KlZ2waTpos5JVO_FyPyRnd03i-U0QkUw";


 const supabase = createClient(supabaseUrl, supabaseAnonKey)


