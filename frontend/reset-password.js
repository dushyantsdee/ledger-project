// ===============================
// RESET PASSWORD (FRONTEND)
// ===============================

const BASE_URL = "https://ledger-project.onrender.com";

async function resetPassword() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  msg.innerText = "";
  msg.style.color = "red";

  if (!token) {
    msg.innerText = "Invalid or expired reset link";
    return;
  }

  if (!password || password.length < 6) {
    msg.innerText = "Password must be at least 6 characters";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token,
        newPassword: password
      })
    });

    const data = await res.json();

    msg.innerText = data.message || "Password reset failed";

    if (res.ok) {
      msg.style.color = "green";
      setTimeout(() => {
        window.location.replace("index.html");
      }, 1200);
    }
  } catch {
    msg.innerText = "Server error";
    msg.style.color = "red";
  }
}
