// ===============================
// LEDGER JS – REGISTER + YEAR MODE (FIXED)
// ===============================
console.log("LEDGER JS LOADED - FIXED VERSION");

const BASE_URL = "https://ledger-project.onrender.com";
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

if (!token || !userId) window.location.replace("index.html");

// DOM
const ledgerBody = document.getElementById("ledgerBody");
const userName = document.getElementById("userName");
const yearSelect = document.getElementById("yearSelect");
const totalCreditEl = document.getElementById("totalCredit");
const totalDebitEl = document.getElementById("totalDebit");
const finalBalanceEl = document.getElementById("finalBalance");

// STATE
let entries = [];
let selectedYear = new Date().getFullYear();
const EMPTY_ROWS = 10;

// ================= USER INFO =================
(async function () {
  try {
    const res = await fetch(`${BASE_URL}/api/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = await res.json();
    userName.innerText = `${user.name} (${user.village})`;
  } catch {
    logout();
  }
})();

// ================= LOAD LEDGER =================
async function loadLedger() {
  try {
    const res = await fetch(`${BASE_URL}/api/ledger/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error();

    const data = await res.json();
    entries = Array.isArray(data) ? data : [];

    setupYearDropdown();
    renderTable();

  } catch (err) {
    console.error(err);
    alert("Ledger load failed");
  }
}

// ================= YEAR DROPDOWN =================
function setupYearDropdown() {
  const years = [
    ...new Set(entries.map(e => new Date(e.date).getFullYear()))
  ];

  if (!years.includes(selectedYear)) years.push(selectedYear);
  years.sort((a, b) => a - b);

  yearSelect.innerHTML = `<option value="">Select Year</option>`;

  years.forEach(y => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    if (y === selectedYear) opt.selected = true;
    yearSelect.appendChild(opt);
  });

  yearSelect.onchange = () => {
    selectedYear = Number(yearSelect.value);
    renderTable();
  };
}

// ================= RENDER TABLE =================
function renderTable() {
  ledgerBody.innerHTML = "";

  let balance = 0;
  let credit = 0;
  let debit = 0;

  const yearEntries = entries.filter(
    e => new Date(e.date).getFullYear() === selectedYear
  );

  yearEntries.forEach((e, i) => {
    if (e.type === "credit") {
      balance += e.amount;
      credit += e.amount;
    } else {
      balance -= e.amount;
      debit += e.amount;
    }

    ledgerBody.appendChild(makeRow(e, i, balance, false));
  });

  // Empty register-style rows
  for (let i = 0; i < EMPTY_ROWS; i++) {
    ledgerBody.appendChild(
      makeRow({}, yearEntries.length + i, balance, true)
    );
  }

  totalCreditEl.innerText = credit;
  totalDebitEl.innerText = debit;
  finalBalanceEl.innerText = balance;
  finalBalanceEl.className = balance < 0 ? "red" : "green";

  attachHandlers();
}

// ================= MAKE ROW =================
function makeRow(e, row, balance, empty) {
  const tr = document.createElement("tr");

  tr.dataset.empty = empty;
  tr.dataset.id = e._id || "";

  tr.innerHTML = `
    <td><input type="checkbox" ${empty ? "disabled" : ""}></td>
    <td>${row + 1}</td>

    <td>
      <input type="date" data-row="${row}" data-col="0"
        value="${e.date ? formatDate(e.date) : ""}">
    </td>

    <td>
      <input data-row="${row}" data-col="1"
        value="${e.particular || ""}">
    </td>

    <td>
      <input data-row="${row}" data-col="2"
        value="${e.type === "credit" ? e.amount : ""}">
    </td>

    <td>
      <input data-row="${row}" data-col="3"
        value="${e.type === "debit" ? e.amount : ""}">
    </td>

    <td class="${balance < 0 ? "red" : "green"}">
      ${empty ? "" : balance}
    </td>
  `;

  return tr;
}

// ================= EVENTS =================
function attachHandlers() {
  ledgerBody.querySelectorAll("input").forEach(input => {
    input.onkeydown = e => {
      if (e.key === "Enter") {
        e.preventDefault();
        moveNext(input);
      }
    };
    input.onblur = saveCell;
  });
}

// ================= NAVIGATION =================
function moveNext(input) {
  const row = Number(input.dataset.row);
  const col = Number(input.dataset.col);

  const next =
    document.querySelector(`input[data-row="${row}"][data-col="${col + 1}"]`) ||
    document.querySelector(`input[data-row="${row + 1}"][data-col="0"]`);

  if (next) next.focus();
}

// ================= SAVE =================
async function saveCell(e) {
  const tr = e.target.closest("tr");
  const row = e.target.dataset.row;

  const v = getRowValues(row);
  if (!v.date || !v.particular || !v.amount) return;

  try {
    if (tr.dataset.empty === "true") {
      await fetch(`${BASE_URL}/api/ledger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, ...v })
      });
    } else {
      await fetch(`${BASE_URL}/api/ledger/${tr.dataset.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(v)
      });
    }

    loadLedger();
  } catch {
    alert("Save failed");
  }
}

// ================= HELPERS =================
function getRowValues(row) {
  const date = document.querySelector(`input[data-row="${row}"][data-col="0"]`).value;
  const particular = document.querySelector(`input[data-row="${row}"][data-col="1"]`).value;
  const cr = document.querySelector(`input[data-row="${row}"][data-col="2"]`).value;
  const dr = document.querySelector(`input[data-row="${row}"][data-col="3"]`).value;

  return {
    date,
    particular,
    amount: Number(cr || dr),
    type: cr ? "credit" : "debit"
  };
}

function formatDate(d) {
  return new Date(d).toISOString().split("T")[0];
}

function logout() {
  localStorage.clear();
  window.location.replace("index.html");
}

loadLedger();
