function sendReset() {
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("msg");

  msg.innerText = "";

  if (!email) {
    msg.innerText = "Email is required";
    msg.style.color = "red";
    return;
  }

  fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
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
