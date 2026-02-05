const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

const userList = document.getElementById("userList");
const userForm = document.getElementById("userForm");

const nameInput = document.getElementById("name");
const villageInput = document.getElementById("village");
const phoneInput = document.getElementById("phone");
const interestInput = document.getElementById("interestRate");

// =======================
// LOAD USERS
// =======================
function loadUsers() {
  fetch("http://localhost:3000/api/user", {
  headers: {
    Authorization: "Bearer " + token
  }
})

    .then(res => {
      if (!res.ok) {
        throw new Error("API Error");
      }
      return res.json();
    })
    .then(users => {
  console.log("USERS 👉", users);

  if (!Array.isArray(users)) {
    userList.innerHTML = "<p>Invalid user data</p>";
    return;
  }

  userList.innerHTML = "";


      if (users.length === 0) {
        userList.innerHTML = "<p>No users found</p>";
        return;
      }

      users.forEach(u => {
        const div = document.createElement("div");
        div.className = "user-card";

        div.innerHTML = `
          <b>${u.name}</b>
          <span>${u.village}</span>
          <button onclick="openLedger('${u._id}')">Ledger</button>
        `;

        userList.appendChild(div);
      });
    })
    .catch(err => {
      console.error("LOAD USERS ERROR:", err);
      userList.innerHTML = "<p>Error loading users</p>";
    });
}


// =======================
// ADD USER
// =======================
userForm.onsubmit = e => {
  e.preventDefault();

  if (!nameInput.value || !villageInput.value) {
    alert("Name aur Village required hai");
    return;
  }

  fetch("http://localhost:3000/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      name: nameInput.value,
      village: villageInput.value,
      phone: phoneInput.value,
      interestRate: interestInput.value
    })
  }).then(() => {
    userForm.reset();
    loadUsers();
  });
};


// =======================
// NAVIGATION
// =======================
function openLedger(id) {
  localStorage.setItem("userId", id);
  window.location.href = "ledger.html";
}

function goDashboard() {
  window.location.href = "dashboard.html";
}

function goProfile() {
  window.location.href = "profile.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// INITIAL LOAD
loadUsers();
