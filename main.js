
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
et budgetChartInstance = null;
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