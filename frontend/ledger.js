const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

const ledgerBody = document.getElementById("ledgerBody");
const userName = document.getElementById("userName");

const totalCreditEl = document.getElementById("totalCredit");
const totalDebitEl = document.getElementById("totalDebit");
const finalBalanceEl = document.getElementById("finalBalance");

let runningBalance = 0;
let editEntryId = null;

// ================= USER NAME =================
fetch(`http://localhost:3000/api/user/${userId}`, {
  headers: { Authorization: "Bearer " + token }
})
  .then(res => res.json())
  .then(user => {
    userName.innerText = `Ledger of ${user.name} (${user.village})`;
  });

// ================= LOAD LEDGER =================
function loadLedger() {
  fetch(`http://localhost:3000/api/ledger/${userId}`, {
    headers: { Authorization: "Bearer " + token }
  })
  
    .then(res => res.json())
    .then(entries => {
      ledgerBody.innerHTML = "";
      runningBalance = 0;

      let credit = 0;
      let debit = 0;

      entries.forEach(e => {
        let cr = "", dr = "";

        if (e.type === "credit") {
          cr = e.amount;
          credit += e.amount;
          runningBalance += e.amount;
        } else {
          dr = e.amount;
          debit += e.amount;
          runningBalance -= e.amount;
        }

        ledgerBody.innerHTML += `
          <tr>
            <td>${new Date(e.date).toLocaleDateString()}</td>
            <td>${e.particular}</td>
            <td class="green">${cr}</td>
            <td class="red">${dr}</td>
            <td class="${runningBalance >= 0 ? "green" : "red"}">
              ${runningBalance}
            </td>
            <td>
              <button class="edit-btn"
                onclick="editEntry(
                  '${e._id}',
                  '${e.particular}',
                  ${e.amount},
                  '${e.type}',
                  '${e.date}'
                )">Edit</button>

              <button class="delete-btn"
                onclick="deleteEntry('${e._id}')">Delete</button>
            </td>
          </tr>
          
        `;
      });
      

      totalCreditEl.innerText = credit;
      totalDebitEl.innerText = debit;
      finalBalanceEl.innerText = runningBalance;
    });
    const ledgerCards = document.getElementById("ledgerCards");
ledgerCards.innerHTML = "";

entries.forEach(e => {
  ledgerCards.innerHTML += `
    <div class="ledger-card">
      <div class="row"><b>Date</b> <span>${new Date(e.date).toLocaleDateString()}</span></div>
      <div class="row"><b>Reason</b> <span>${e.particular}</span></div>
      <div class="row"><b>Amount</b> <span>₹ ${e.amount}</span></div>
      <div class="row"><b>Type</b> <span>${e.type}</span></div>

      <div class="actions row">
        <button class="edit-btn" onclick="editEntry('${e._id}','${e.particular}',${e.amount},'${e.type}','${e.date}')">Edit</button>
        <button class="delete-btn" onclick="deleteEntry('${e._id}')">Delete</button>
      </div>
    </div>
  `;
});

}

// ================= ADD / UPDATE ENTRY =================
function addEntry() {
  const data = {
    userId,
    particular: particular.value,
    amount: Number(amount.value),
    type: type.value,
    date: entryDate.value
  };

  // EDIT MODE
  if (editEntryId) {
    fetch(`http://localhost:3000/api/ledger/${editEntryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(data)
    }).then(() => {
      editEntryId = null;
      resetForm();
      loadLedger();
    });
  }
  // ADD MODE
  else {
    fetch("http://localhost:3000/api/ledger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(data)
    }).then(() => {
      resetForm();
      loadLedger();
    });
  }
}

// ================= EDIT =================
function editEntry(id, particularVal, amountVal, typeVal, dateVal) {
  editEntryId = id;

  particular.value = particularVal;
  amount.value = amountVal;
  type.value = typeVal;
  entryDate.value = new Date(dateVal).toISOString().split("T")[0];

  document.querySelector(".ledger-right button").innerText = "Update Entry";
}

// ================= DELETE =================
function deleteEntry(id) {
  if (!confirm("Delete this entry?")) return;

  fetch(`http://localhost:3000/api/ledger/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  }).then(loadLedger);
}

// ================= RESET FORM =================
function resetForm() {
  particular.value = "";
  amount.value = "";
  entryDate.value = "";
  type.value = "credit";
  document.querySelector(".ledger-right button").innerText = "Save Entry";
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("show");
}

loadLedger();
