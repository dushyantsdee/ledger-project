// ===============================
// FORGOT PASSWORD (FRONTEND)
// ===============================

const BASE_URL = "https://ledger-project.onrender.com";

async function sendReset() {
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("msg");

  msg.innerText = "";
  msg.style.color = "red";

  if (!email) {
    msg.innerText = "Email is required";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    msg.innerText = data.message || "Request failed";

    if (res.ok) {
      msg.style.color = "green";
    }
  } catch (err) {
    msg.innerText = "Server error";
    msg.style.color = "red";
  }
}
