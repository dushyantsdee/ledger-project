const token = localStorage.getItem("token");

function changePassword() {
  const oldPassword = document.getElementById("oldPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const msg = document.getElementById("msg");

  msg.innerText = "";

  fetch("http://localhost:3000/api/auth/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ oldPassword, newPassword })
  })
    .then(res => res.json())
    .then(data => {
      msg.innerText = data.message;
      if (data.message === "Password changed successfully") {
        setTimeout(() => {
          logout();
        }, 1500);
      }
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "login.html";
}

function goBack() {
  window.location.href = "profile.html";
}
