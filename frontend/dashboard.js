const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

fetch("http://localhost:3000/api/dashboard", {
  headers: {
    Authorization: "Bearer " + token
  }
})

  .then(res => res.json())
  .then(data => {
    document.getElementById("users").innerText = data.totalUsers;
    document.getElementById("credit").innerText = data.totalCredit;
    document.getElementById("debit").innerText = data.totalDebit;
    document.getElementById("balance").innerText = data.balance;
  })
  .catch(err => {
    console.error("Dashboard error:", err);
  });

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
