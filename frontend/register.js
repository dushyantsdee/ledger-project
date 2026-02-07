// ===============================
// REGISTER (FRONTEND)
// ===============================

const BASE_URL = "https://ledger-project.onrender.com";

const form = document.getElementById("registerForm");
const status = document.getElementById("status");

form.addEventListener("submit", async e => {
  e.preventDefault();

  status.textContent = "Registering...";
  status.className = "status loading";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const adminKey = document.getElementById("adminKey").value.trim();

  if (!email || !password || !adminKey) {
    status.textContent = "All fields required";
    status.className = "status error";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password, adminKey })
    });

    const data = await res.json();

    if (!res.ok || !data.token) {
      status.textContent = data.message || "Registration failed";
      status.className = "status error";
      return;
    }

    localStorage.setItem("token", data.token);

    if (data.ownerId) {
      localStorage.setItem("userId", data.ownerId);
    }

    status.textContent = "Registered successfully";
    status.className = "status success";

    setTimeout(() => {
      window.location.replace("dashboard.html");
    }, 1000);

  } catch {
    status.textContent = "Server error";
    status.className = "status error";
  }
});
