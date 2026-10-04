
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