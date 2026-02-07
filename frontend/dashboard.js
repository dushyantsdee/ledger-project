// ===============================
// DASHBOARD JS
// ===============================

const BASE_URL = "https://ledger-project.onrender.com";

const token = localStorage.getItem("token");
if (!token) {
  window.location.replace("index.html");
}

// --------------------------------
// Fetch Dashboard Data
// --------------------------------
(async function () {
  try {
    const res = await fetch(`${BASE_URL}/api/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Unauthorized");
    }

    const data = await res.json();

    document.getElementById("users").innerText = data.totalUsers || 0;
    document.getElementById("credit").innerText = data.totalCredit || 0;
    document.getElementById("debit").innerText = data.totalDebit || 0;
    document.getElementById("balance").innerText = data.balance || 0;

  } catch (err) {
    localStorage.clear();
    window.location.replace("index.html");
  }
})();

// --------------------------------
// Logout
// --------------------------------
function logout() {
  localStorage.clear();
  window.location.replace("index.html");
}
