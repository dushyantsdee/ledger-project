const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

fetch("http://localhost:3000/api/auth/me", {
  headers: {
    Authorization: "Bearer " + token
  }
})
  .then(res => res.json())
  .then(owner => {
    document.getElementById("email").innerText = owner.email;
    document.getElementById("ownerId").innerText = owner._id;
  });

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "login.html";
}

function goBack() {
  window.location.href = "user.html";
}

function goChangePassword() {
  window.location.href = "change-password.html";
}

