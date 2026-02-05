const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const adminKeyEl = document.getElementById("adminKey");
const msgEl = document.getElementById("msg");
const strengthEl = document.getElementById("strength");

/* =====================
   PASSWORD STRENGTH
===================== */
passwordEl.addEventListener("input", () => {
  const p = passwordEl.value;

  if (p.length < 6) {
    strengthEl.innerText = "Weak password";
    strengthEl.style.color = "red";
  } else if (/[A-Z]/.test(p) && /[0-9]/.test(p)) {
    strengthEl.innerText = "Strong password";
    strengthEl.style.color = "green";
  } else {
    strengthEl.innerText = "Medium password";
    strengthEl.style.color = "orange";
  }
});

/* =====================
   REGISTER + AUTO LOGIN
===================== */
function register() {
  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();
  const adminKey = adminKeyEl.value.trim();

  msgEl.innerText = "";

  if (!email || !password || !adminKey) {
    msgEl.innerText = "All fields are required";
    msgEl.style.color = "red";
    return;
  }

  fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password,
      adminKey
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        // 🔥 AUTO LOGIN
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
      } else {
        msgEl.innerText = data.message || "Registration failed";
        msgEl.style.color = "red";
      }
    })
    .catch(() => {
      msgEl.innerText = "Server error";
      msgEl.style.color = "red";
    });
}
