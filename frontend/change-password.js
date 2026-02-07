// ===============================
// CHANGE PASSWORD (FRONTEND)
// ===============================

const BASE_URL = "https://ledger-project.onrender.com";

const token = localStorage.getItem("token");
if (!token) {
  window.location.replace("index.html");
}

// -------------------------------
// Change Password
// -------------------------------
async function changePassword() {
  const oldPassword = document.getElementById("oldPassword").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const msg = document.getElementById("msg");

  msg.innerText = "";

  if (!oldPassword || !newPassword) {
    msg.innerText = "All fields required";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });

    const data = await res.json();

    msg.innerText = data.message || "Error";

    if (res.ok) {
      setTimeout(() => {
        logout();
      }, 1200);
    }
  } catch (err) {
    localStorage.clear();
    window.location.replace("index.html");
  }
}

// -------------------------------
// Logout
// -------------------------------
function logout() {
  localStorage.clear();
  window.location.replace("index.html");
}

// -------------------------------
// Back to Profile
// -------------------------------
function goBack() {
  window.location.href = "profile.html";
}
