const form = document.getElementById("registerForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  status.textContent = "Registering...";
  status.className = "status loading";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const adminKey = document.getElementById("adminKey").value;

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, adminKey })
    });

    const data = await res.json();

    if (!res.ok) {
      status.textContent = data.message || "Registration failed";
      status.className = "status error";
      return;
    }

    status.textContent = "✅ Registered successfully!";
    status.className = "status success";

  } catch (err) {
    status.textContent = "Server error";
    status.className = "status error";
  }
});
