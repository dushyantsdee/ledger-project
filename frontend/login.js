// ===============================
// LOGIN (FRONTEND)
// ===============================

const BASE_URL = "https://ledger-project.onrender.com";

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorEl = document.getElementById("error");

  errorEl.innerText = "";

  if (!email || !password) {
    errorEl.innerText = "Email and password required";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok || !data.token) {
      errorEl.innerText = data.message || "Login failed";
      return;
    }

    localStorage.setItem("token", data.token);

    if (data.ownerId) {
      localStorage.setItem("userId", data.ownerId);
    }

    window.location.replace("dashboard.html");

  } catch (err) {
    errorEl.innerText = "Server error";
  }
}
