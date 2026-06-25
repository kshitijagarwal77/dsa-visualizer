// ═══════════════════════════════════════════════════════
// MAIN — Tab switching & initialization
// ═══════════════════════════════════════════════════════

function switchTab(tab) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`panel-${tab}`).classList.add('active');
  document.getElementById(`tab-${tab}`).classList.add('active');
}

// Sync complexity panel when algo changes
document.addEventListener('DOMContentLoaded', () => {
  // Init pathfinding
  buildGrid();
  renderGrid();

  // Init sorting
  generateArray();
  updateComplexity('bubble');

  // Sort algo change → update complexity
  document.getElementById('sort-algo').addEventListener('change', e => {
    updateComplexity(e.target.value);
    document.getElementById('sort-desc').textContent = SORT_DESCRIPTIONS[e.target.value];
  });

  // Path algo change → update desc
  document.getElementById('path-algo').addEventListener('change', e => {
    document.getElementById('algo-desc').textContent = ALGO_DESCRIPTIONS[e.target.value];
  });
});
