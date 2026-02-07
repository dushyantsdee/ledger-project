// ===============================
// LEDGER FRONTEND JS
// ===============================

const BASE_URL = "https://ledger-project.onrender.com";

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

if (!token || !userId) {
  window.location.replace("index.html");
}

// DOM
const ledgerBody = document.getElementById("ledgerBody");
const ledgerCards = document.getElementById("ledgerCards");
const userName = document.getElementById("userName");

const totalCreditEl = document.getElementById("totalCredit");
const totalDebitEl = document.getElementById("totalDebit");
finalBalanceEl.innerText = runningBalance;
finalBalanceEl.classList.remove("negative");

if (runningBalance < 0) {
  finalBalanceEl.classList.add("negative");
}


const entryDate = document.getElementById("entryDate");
const particular = document.getElementById("particular");
const amount = document.getElementById("amount");
const type = document.getElementById("type");

let editEntryId = null;

// ================= USER INFO =================
(async function () {
  try {
    const res = await fetch(`${BASE_URL}/api/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error();
    const user = await res.json();

    userName.innerText = `Ledger of ${user.name} (${user.village})`;
  } catch {
    localStorage.clear();
    window.location.replace("index.html");
  }
})();

// ================= LOAD LEDGER =================
async function loadLedger() {
  try {
    const res = await fetch(`${BASE_URL}/api/ledger/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error();

    const entries = await res.json();

    ledgerBody.innerHTML = "";
    ledgerCards.innerHTML = "";

    let balance = 0;
    let credit = 0;
    let debit = 0;

    entries.forEach(e => {
      let cr = "";
      let dr = "";

      if (e.type === "credit") {
        cr = e.amount;
        credit += e.amount;
        balance += e.amount;
      } else {
        dr = e.amount;
        debit += e.amount;
        balance -= e.amount;
      }

      ledgerBody.innerHTML += `
        <tr>
          <td>${new Date(e.date).toLocaleDateString()}</td>
          <td>${e.particular}</td>
          <td class="green">${cr}</td>
          <td class="red">${dr}</td>
          <td class="${balance >= 0 ? "green" : "red"}">${balance}</td>
          <td>
            <button onclick="editEntry('${e._id}','${e.particular}',${e.amount},'${e.type}','${e.date}')">Edit</button>
            <button onclick="deleteEntry('${e._id}')">Delete</button>
          </td>
        </tr>
      `;

      ledgerCards.innerHTML += `
        <div class="ledger-card">
          <div><b>Date:</b> ${new Date(e.date).toLocaleDateString()}</div>
          <div><b>Reason:</b> ${e.particular}</div>
          <div><b>Amount:</b> ₹ ${e.amount}</div>
          <div><b>Type:</b> ${e.type}</div>
          <div class="actions">
            <button onclick="editEntry('${e._id}','${e.particular}',${e.amount},'${e.type}','${e.date}')">Edit</button>
            <button onclick="deleteEntry('${e._id}')">Delete</button>
          </div>
        </div>
      `;
    });

    totalCreditEl.innerText = credit;
    totalDebitEl.innerText = debit;
    finalBalanceEl.innerText = balance;

  } catch {
    localStorage.clear();
    window.location.replace("index.html");
  }
}

// ================= ADD / UPDATE =================
async function addEntry() {
  const payload = {
    userId,
    particular: particular.value.trim(),
    amount: Number(amount.value),
    type: type.value,
    date: entryDate.value
  };

  if (!payload.particular || !payload.amount || !payload.date) return;

  try {
    if (editEntryId) {
      await fetch(`${BASE_URL}/api/ledger/${editEntryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      editEntryId = null;
    } else {
      await fetch(`${BASE_URL}/api/ledger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    }

    resetForm();
    loadLedger();
  } catch {
    localStorage.clear();
    window.location.replace("index.html");
  }
}

// ================= EDIT =================
function editEntry(id, p, a, t, d) {
  editEntryId = id;
  particular.value = p;
  amount.value = a;
  type.value = t;
  entryDate.value = new Date(d).toISOString().split("T")[0];
  document.querySelector(".ledger-right button").innerText = "Update Entry";
}

// ================= DELETE =================
async function deleteEntry(id) {
  if (!confirm("Delete this entry?")) return;

  try {
    await fetch(`${BASE_URL}/api/ledger/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    loadLedger();
  } catch {
    localStorage.clear();
    window.location.replace("index.html");
  }
}

// ================= RESET =================
function resetForm() {
  particular.value = "";
  amount.value = "";
  entryDate.value = "";
  type.value = "credit";
  document.querySelector(".ledger-right button").innerText = "Save Entry";
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  window.location.replace("index.html");
}

// ================= SIDEBAR =================
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("show");
}

loadLedger();
