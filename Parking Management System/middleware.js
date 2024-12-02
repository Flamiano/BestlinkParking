
const supabaseUrl = "https://xqanlfwxqtvzlgeukxic.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxYW5sZnd4cXR2emxnZXVreGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNDMxMjMsImV4cCI6MjA0ODYxOTEyM30.2Oa1zmRcXt3KlZ2waTpos5JVO_FyPyRnd03i-U0QkUw";


const supabaseAuth = supabase.createClient(supabaseUrl, supabaseAnonKey)



//protect the routes from unauthenticated users
async function validateUser() {
    const { data: user } = await supabaseAuth.auth.getUser();

    console.log(user.user)
    if (!user.user) {
        console.log("JAJA")
        window.location.href = "main.html"
    }
}

validateUser();



const logOut = document.querySelector(".logOut");



logOut.addEventListener("click", async () => {
    await supabaseAuth.auth.signOut();
    window.location.href = "main.html"
})

