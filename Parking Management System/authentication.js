const supabaseUrl = "https://xqanlfwxqtvzlgeukxic.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxYW5sZnd4cXR2emxnZXVreGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNDMxMjMsImV4cCI6MjA0ODYxOTEyM30.2Oa1zmRcXt3KlZ2waTpos5JVO_FyPyRnd03i-U0QkUw";

const supabaseAuth = supabase.createClient(supabaseUrl, supabaseAnonKey);

const form = document.getElementById("signup");
form.addEventListener("submit", handleSignUp);

async function handleSignUp(event) {
   event.preventDefault();
   const name = document.getElementById("signup-name").value;
   const email = document.getElementById("signup-email").value;
   const password = document.getElementById("signup-password").value;

   const { error } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: {
         data: {
            displayname: name,
         },
         redirect_to: "https://www.google.com",
      },
   });
   if (error) {
      console.log(error.message);
   } else {
      alert("Account created. Please check your email and go for sign in.");

      document.getElementById("signup-name").value = "";
      document.getElementById("signup-email").value = "";
      document.getElementById("signup-password").value = "";
   }
}

const loginForm = document.getElementById("signin");

loginForm.addEventListener("submit", handleSignIn);

async function handleSignIn(event) {
   event.preventDefault();
   const email = document.getElementById("signin-email").value;
   const password = document.getElementById("signin-password").value;

   // Check for admin account
   if (email === "admin123@bcp.com" && password === "admin123") {
      alert("Admin login successful!");
      window.location.href = "dashboard.html"; // Redirect to admin dashboard
      return; // Exit the function
   }

   // Proceed with Supabase authentication for other users
   const { error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
   });
   if (error) {
      alert(error.message);
   } else {
      alert("Signed in successfully");
      window.location.href = "./User/user.html"; // Redirect for regular users
      document.getElementById("signin-email").value = "";
      document.getElementById("signin-password").value = "";
   }
}
