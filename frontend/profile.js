// ===============================
// PROFILE PAGE SCRIPT
// ===============================

const BASE_URL = "https://ledger-project.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  const emailEl = document.getElementById("email");
  const idEl = document.getElementById("ownerId");
  const statusEl = document.getElementById("status");

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace("index.html");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error();

    const data = await res.json();

    emailEl.innerText = data.email;
    idEl.innerText = data._id;
    statusEl.innerText = "Profile loaded";

  } catch {
    localStorage.clear();
    window.location.replace("index.html");
  }
});
