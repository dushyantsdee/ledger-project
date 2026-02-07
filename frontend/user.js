// ===============================
// USER MANAGEMENT (FRONTEND)
// ===============================

const BASE_URL = "https://ledger-project.onrender.com";

const token = localStorage.getItem("token");
if (!token) {
  window.location.replace("index.html");
}

// DOM
const userList = document.getElementById("userList");
const userForm = document.getElementById("userForm");

const nameInput = document.getElementById("name");
const villageInput = document.getElementById("village");
const phoneInput = document.getElementById("phone");
const interestInput = document.getElementById("interestRate");

// =======================
// LOAD USERS
// =======================
async function loadUsers() {
  try {
    const res = await fetch(`${BASE_URL}/api/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error();

    const users = await res.json();
    userList.innerHTML = "";

    if (!Array.isArray(users) || users.length === 0) {
      userList.innerHTML = "<p>No users found</p>";
      return;
    }

    users.forEach(u => {
      const div = document.createElement("div");
      div.className = "user-card";
      div.innerHTML = `
        <b>${u.name}</b>
        <span>${u.village}</span>
        <button>Ledger</button>
      `;
      div.querySelector("button").onclick = () => openLedger(u._id);
      userList.appendChild(div);
    });
  } catch {
    localStorage.clear();
    window.location.replace("index.html");
  }
}

// =======================
// ADD USER
// =======================
userForm.addEventListener("submit", async e => {
  e.preventDefault();

  const payload = {
    name: nameInput.value.trim(),
    village: villageInput.value.trim(),
    phone: phoneInput.value.trim(),
    interestRate: interestInput.value.trim()
  };

  if (!payload.name || !payload.village) return;

  try {
    const res = await fetch(`${BASE_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error();

    userForm.reset();
    loadUsers();
  } catch {
    localStorage.clear();
    window.location.replace("index.html");
  }
});

// =======================
// NAVIGATION
// =======================
function openLedger(id) {
  localStorage.setItem("userId", id);
  window.location.href = "ledger.html";
}

function logout() {
  localStorage.clear();
  window.location.replace("index.html");
}

// INITIAL LOAD
loadUsers();
