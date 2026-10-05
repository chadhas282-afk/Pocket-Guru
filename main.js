
const inputSection = document.getElementById('input-section');
const resultsSection = document.getElementById('results-section');
const addFixedBtn = document.getElementById('add-fixed-btn');
const addLifestyleBtn = document.getElementById('add-lifestyle-btn');
const fixedContainer = document.getElementById('fixed-expenses-container');
const lifestyleContainer = document.getElementById('lifestyle-expenses-container');
const calculateBtn = document.getElementById('calculate-btn');
const recalculateBtn = document.getElementById('recalculate-btn');
const clearDataBtn = document.getElementById('clear-data-btn');
const downloadBtn = document.getElementById('download-btn');
const realityCheck = document.getElementById('reality-check');
const tableBody = document.getElementById('budget-table-body');
const totalBudgetInput = document.getElementById('total-budget');
const guruScoreBadge = document.getElementById('guru-score');
const exportArea = document.getElementById('export-area');
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>ℹ️</span> <div>${message}</div>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('custom-modal');
    const titleEl = document.getElementById('modal-title');
    const messageEl = document.getElementById('modal-message');
    const cancelBtn = document.getElementById('modal-cancel');
    const confirmBtn = document.getElementById('modal-confirm');
    titleEl.textContent = title;
    messageEl.textContent = message;
    cancelBtn.classList.remove('hidden');
    const newCancel = cancelBtn.cloneNode(true);
    cancelBtn.replaceWith(newCancel);
    const newConfirm = confirmBtn.cloneNode(true);
    confirmBtn.replaceWith(newConfirm);
    newCancel.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    newConfirm.addEventListener('click', () => {
        modal.classList.add('hidden');
        onConfirm();
    });
    modal.classList.remove('hidden');
}
let budgetChartInstance = null;
function createExpenseRow(type, name = '', amount = '') {
    const row = document.createElement('div');
    row.className = 'expense-row';
    row.innerHTML = `
     <input type="text" class="expense-name ${type}-name" placeholder="Expense name" value="${name}" required>
    <input type="number" class="expense-amount ${type}-amount" placeholder="Amount" min="0" value="${amount}" required>
    <button type="button" class="remove-btn" aria-label="Remove" onclick="this.parentElement.remove()">✕</button>
  `;
    return row;
}
addFixedBtn.addEventListener('click', () => {
    fixedContainer.appendChild(createExpenseRow('fixed'));
});
addLifestyleBtn.addEventListener('click', () => {
    lifestyleContainer.appendChild(createExpenseRow('lifestyle'));
});
function saveData(total, fixed, lifestyle) {
    const data = {
        totalBudget: total,
        fixedExpenses: fixed,
        lifestyleExpenses: lifestyle
    };
    localStorage.setItem('pocketguru_data', JSON.stringify(data));
}
function loadData() {
    const data = localStorage.getItem('pocketguru_data');
    if (data) {
        const parsed = JSON.parse(data);
        totalBudgetInput.value = parsed.totalBudget;
        if (parsed.fixedExpenses.length > 0) {
            fixedContainer.innerHTML = '';
            parsed.fixedExpenses.forEach(exp => {
                fixedContainer.appendChild(createExpenseRow('fixed', exp.name, exp.amount));
            });
        } else {
            if (fixedContainer.children.length === 0) fixedContainer.appendChild(createExpenseRow('fixed'));
        }
        if (parsed.lifestyleExpenses.length > 0) {
            lifestyleContainer.innerHTML = '';
            parsed.lifestyleExpenses.forEach(exp => {
                lifestyleContainer.appendChild(createExpenseRow('lifestyle', exp.name, exp.amount));
            });
        } else {
            if (lifestyleContainer.children.length === 0) lifestyleContainer.appendChild(createExpenseRow('lifestyle'));
        }
    } else {
        if (fixedContainer.children.length === 0) fixedContainer.appendChild(createExpenseRow('fixed'));
        if (lifestyleContainer.children.length === 0) lifestyleContainer.appendChild(createExpenseRow('lifestyle'));
    }
}
clearDataBtn.addEventListener('click', () => {
    showConfirmModal(
        "Clear Data",
        "Are you sure you want to completely clear your saved data and start over?",
        () => {
            localStorage.removeItem('pocketguru_data');
            totalBudgetInput.value = '';
            fixedContainer.innerHTML = '';
            lifestyleContainer.innerHTML = '';
            fixedContainer.appendChild(createExpenseRow('fixed'));
            lifestyleContainer.appendChild(createExpenseRow('lifestyle'));
            showToast("Data has been cleared.");
        }
    );
});
function autoSaveData() {
    const totalBudget = totalBudgetInput.value;
    const fixedExpenses = [];
    document.querySelectorAll('#fixed-expenses-container .expense-row').forEach(row => {
        const name = row.querySelector('.fixed-name').value;
        const amount = row.querySelector('.fixed-amount').value;
        fixedExpenses.push({ name, amount });
    });
    const lifestyleExpenses = [];
    document.querySelectorAll('#lifestyle-expenses-container .expense-row').forEach(row => {
        const name = row.querySelector('.lifestyle-name').value;
        const amount = row.querySelector('.lifestyle-amount').value;
        lifestyleExpenses.push({ name, amount });
    });
    saveData(totalBudget, fixedExpenses, lifestyleExpenses);
}
inputSection.addEventListener('input', autoSaveData);
inputSection.addEventListener('click', (e) => {
  if (e.target.closest('.remove-btn') || e.target.closest('.add-btn')) {
    setTimeout(autoSaveData, 10);
  }
});
setTimeout(() => showToast("Your data has been reset for a fresh start!"), 100);
localStorage.removeItem('pocketguru_data');
totalBudgetInput.value = '';
fixedContainer.innerHTML = '';
lifestyleContainer.innerHTML = '';
fixedContainer.appendChild(createExpenseRow('fixed'));
lifestyleContainer.appendChild(createExpenseRow('lifestyle'));
function renderChart(fixed, lifestyle, essentials, emergency) {
  const ctx = document.getElementById('budget-chart').getContext('2d');
  if (budgetChartInstance) {
    budgetChartInstance.destroy();
  }
  budgetChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Fixed', 'Lifestyle', 'Essentials', 'Emergency/Savings'],
      datasets: [{
         data: [fixed, lifestyle, essentials, emergency],
        backgroundColor: [
          '#a855f7',
          '#ec4899',
          '#06b6d4',
          '#10b981'
        ],
        borderWidth: 0,
        hoverOffset: 4
      }]
      },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#f8fafc',
            font: { family: 'Outfit', size: 14 }
            }
        }
      }
    }
  });
  }
calculateBtn.addEventListener('click', () => {
  const totalBudget = parseFloat(totalBudgetInput.value);
  if (isNaN(totalBudget) || totalBudget <= 0) {
    alert("Bhai, enter a valid total budget first!");
    return;
  }
  const fixedExpenses = [];
  let totalFixed = 0;
  document.querySelectorAll('.expense-row').forEach(row => {
     if (row.querySelector('.fixed-name')) {
      const name = row.querySelector('.fixed-name').value.trim();
      const amount = parseFloat(row.querySelector('.fixed-amount').value);
      if (name && !isNaN(amount)) {
        fixedExpenses.push({ name, amount });
        totalFixed += amount;
      }
    }
  });
  const lifestyleExpenses = [];
   let totalLifestyle = 0;
  document.querySelectorAll('.expense-row').forEach(row => {
    if (row.querySelector('.lifestyle-name')) {
      const name = row.querySelector('.lifestyle-name').value.trim();
      const amount = parseFloat(row.querySelector('.lifestyle-amount').value);
       if (name && !isNaN(amount)) {
        lifestyleExpenses.push({ name, amount });
        totalLifestyle += amount;
      }
    }
    });
  saveData(totalBudget, fixedExpenses, lifestyleExpenses);
  const totalRequested = totalFixed + totalLifestyle;
  let remaining = totalBudget - totalRequested;
  realityCheck.classList.add('hidden');
  realityCheck.innerHTML = '';
  let resultData = [];
  let finalAllocated = 0;
  let isRealityCheckTriggered = false;
  if (remaining < 0) {
    isRealityCheckTriggered = true;
    realityCheck.classList.remove('hidden');
    realityCheck.innerHTML = `<strong>Reality Check:</strong> Bhai, you're requesting ₹${totalRequested}, but you only have ₹${totalBudget}. Short by ₹${Math.abs(remaining)}.<br>I'm heavily deducting from your lifestyle to make the math work!`;
    const ratio = Math.max(0, (totalBudget - totalFixed) / totalLifestyle);
    lifestyleExpenses.forEach(exp => {
        exp.amount = Math.floor(exp.amount * ratio);
    });
    totalLifestyle = lifestyleExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    remaining = totalBudget - (totalFixed + totalLifestyle);
    if (remaining < 0) {
        realityCheck.innerHTML += `<br><em>Warning: Fixed expenses (₹${totalFixed}) exceed budget! Time to get a side hustle.</em>`;
    }
  }
  let score = 10;
  if (isRealityCheckTriggered) score -= 4;
   if (totalFixed > totalBudget * 0.6) score -= 2;
  if (totalLifestyle > totalBudget * 0.3) score -= 2;
  score = Math.max(1, score);
  if (score >= 8) {
    guruScoreBadge.style.color = 'var(--success-color)';
     guruScoreBadge.style.background = 'rgba(16, 185, 129, 0.2)';
    guruScoreBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    guruScoreBadge.textContent = `Score: ${score}/10 (Solid!)`;
  } else if (score >= 5) {
    guruScoreBadge.style.color = '#f59e0b';
    guruScoreBadge.style.background = 'rgba(245, 158, 11, 0.2)';
    guruScoreBadge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
    guruScoreBadge.textContent = `Score: ${score}/10 (Careful!)`;
  } else {
    guruScoreBadge.style.color = 'var(--danger-color)';
    guruScoreBadge.style.background = 'rgba(239, 68, 68, 0.2)';
    guruScoreBadge.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    guruScoreBadge.textContent = `Score: ${score}/10 (Yikes!)`;
  }
  fixedExpenses.forEach(exp => {
    resultData.push({ category: 'Fixed', item: exp.name, amount: exp.amount, tip: "Pay on time!" });
    finalAllocated += exp.amount;
  });
  lifestyleExpenses.forEach(exp => {
    resultData.push({ category: 'Lifestyle', item: exp.name, amount: exp.amount, tip: "Use student ID for discounts." });
    finalAllocated += exp.amount;
     });
  let totalEssentialsChart = 0;
  let totalEmergencyChart = 0;
  if (remaining > 0) {
    const essentials = [
      { name: "Daily Food / Canteen", percentage: 0.50, tip: "Eat at college canteen." },
      { name: "Travel (Auto/Metro)", percentage: 0.30, tip: "Share an auto or use metro." },
      { name: "Books", percentage: 0.10, tip: "Buy second-hand." },
      { name: "Emergency Buffer", percentage: 0.10, tip: "Keep this safe!" }
      ];
    let essentialsTotal = 0;
    essentials.forEach((ess, index) => {
      let amount = index === essentials.length - 1 ? remaining - essentialsTotal : Math.round(remaining * ess.percentage);
      essentialsTotal += amount;
      if (amount > 0) {
        resultData.push({ category: 'Essentials', item: ess.name, amount: amount, tip: ess.tip });
        finalAllocated += amount;
        if (ess.name.includes("Emergency")) totalEmergencyChart += amount;
        else totalEssentialsChart += amount;
        }
    });
  }
  tableBody.innerHTML = '';
  resultData.forEach(row => {