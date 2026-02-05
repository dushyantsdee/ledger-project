function resetPassword() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  if (!token) {
    msg.innerText = "Invalid reset link";
    msg.style.color = "red";
    return;
  }

  if (password.length < 6) {
    msg.innerText = "Password must be at least 6 characters";
    msg.style.color = "red";
    return;
  }

  fetch("api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      newPassword: password
    })
  })
    .then(res => res.json())
    .then(data => {
      msg.innerText = data.message;
      msg.style.color = "green";
    })
    .catch(() => {
      msg.innerText = "Server error";
      msg.style.color = "red";
    });
}
