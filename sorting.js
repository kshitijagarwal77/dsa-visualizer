// ═══════════════════════════════════════════════════════
// SORTING ALGORITHMS
// ═══════════════════════════════════════════════════════

let sortArray = [], sortRunning = false;

const SORT_COMPLEXITY = {
  bubble:    { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'Yes' },
  selection: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'No' },
  insertion: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'Yes' },
  merge:     { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: 'Yes' },
  quick:     { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: 'No' },
  heap:      { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: 'No' },
};

const SORT_DESCRIPTIONS = {
  bubble:    'Bubble Sort — Repeatedly swaps adjacent elements if out of order. Simple but slow for large inputs.',
  selection: 'Selection Sort — Finds the minimum element and places it at the correct position each pass.',
  insertion: 'Insertion Sort — Builds sorted array one element at a time; efficient for nearly-sorted data.',
  merge:     'Merge Sort — Divide and conquer; splits array, sorts halves, then merges. Stable and efficient.',
  quick:     'Quick Sort — Picks a pivot, partitions array around it recursively. Fast in practice.',
  heap:      'Heap Sort — Builds a max-heap then extracts maximum repeatedly. Guaranteed O(n log n).',
};

function generateArray() {
  const size = parseInt(document.getElementById('arr-size').value);
  sortArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
  renderBars(sortArray, []);
  document.getElementById('sort-stats').textContent = '';
  document.getElementById('sort-desc').textContent = 'Select a sorting algorithm and click Sort';
  updateComplexity(document.getElementById('sort-algo').value);
}

function updateSizeLabel(val) {
  document.getElementById('size-label').textContent = val;
  generateArray();
}

function updateComplexity(algo) {
  const cx = SORT_COMPLEXITY[algo];
  if (!cx) return;
  document.getElementById('cx-best').textContent   = cx.best;
  document.getElementById('cx-avg').textContent    = cx.avg;
  document.getElementById('cx-worst').textContent  = cx.worst;
  document.getElementById('cx-space').textContent  = cx.space;
  const stableEl = document.getElementById('cx-stable');
  stableEl.textContent = cx.stable;
  stableEl.style.color = cx.stable === 'Yes' ? 'var(--accent2)' : 'var(--warn)';
}

function renderBars(arr, highlights = {}) {
  const container = document.getElementById('sort-bars');
  container.innerHTML = '';
  const maxVal = Math.max(...arr);
  arr.forEach((val, i) => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.id = `bar-${i}`;
    bar.style.height = `${(val / maxVal) * 90}%`;
    if (highlights.comparing && highlights.comparing.includes(i)) bar.classList.add('comparing');
    if (highlights.swapping  && highlights.swapping.includes(i))  bar.classList.add('swapping');
    if (highlights.sorted    && highlights.sorted.includes(i))    bar.classList.add('sorted');
    if (highlights.pivot     && highlights.pivot === i)           bar.classList.add('pivot');
    container.appendChild(bar);
  });
}

function getSortDelay() {
  const s = document.getElementById('sort-speed').value;
  const size = sortArray.length;
  if (s === 'fast')   return Math.max(2, Math.floor(300 / size));
  if (s === 'medium') return Math.max(8, Math.floor(800 / size));
  return Math.max(20, Math.floor(2000 / size));
}

async function startSorting() {
  if (sortRunning) return;
  const algo = document.getElementById('sort-algo').value;
  document.getElementById('sort-desc').textContent = SORT_DESCRIPTIONS[algo];
  updateComplexity(algo);
  sortRunning = true;
  document.querySelectorAll('#panel-sort .btn').forEach(b => b.disabled = true);

  const arr = [...sortArray];
  let comparisons = 0, swaps = 0;
  const startTime = performance.now();

  if      (algo === 'bubble')    await bubbleSort(arr, () => comparisons++, () => swaps++);
  else if (algo === 'selection') await selectionSort(arr, () => comparisons++, () => swaps++);
  else if (algo === 'insertion') await insertionSort(arr, () => comparisons++, () => swaps++);
  else if (algo === 'merge')     await mergeSort(arr, 0, arr.length - 1, () => comparisons++, () => swaps++);
  else if (algo === 'quick')     await quickSort(arr, 0, arr.length - 1, () => comparisons++, () => swaps++);
  else if (algo === 'heap')      await heapSort(arr, () => comparisons++, () => swaps++);

  // mark all sorted
  renderBars(arr, { sorted: arr.map((_, i) => i) });
  sortArray = arr;

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
  document.getElementById('sort-stats').textContent =
    `Comparisons: ${comparisons.toLocaleString()} | Swaps: ${swaps.toLocaleString()} | Time: ${elapsed}s`;

  sortRunning = false;
  document.querySelectorAll('#panel-sort .btn').forEach(b => b.disabled = false);
}

// ── BUBBLE SORT ──────────────────────────────────────────
async function bubbleSort(arr, cmp, swp) {
  const n = arr.length, sorted = new Set();
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      cmp();
      renderBars(arr, { comparing: [j, j+1], sorted: [...sorted] });
      await sleep(getSortDelay());
      if (arr[j] > arr[j+1]) {
        swp(); [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        renderBars(arr, { swapping: [j, j+1], sorted: [...sorted] });
        await sleep(getSortDelay());
      }
    }
    sorted.add(n - i - 1);
  }
}

// ── SELECTION SORT ───────────────────────────────────────
async function selectionSort(arr, cmp, swp) {
  const n = arr.length, sorted = new Set();
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      cmp();
      renderBars(arr, { comparing: [minIdx, j], sorted: [...sorted] });
      await sleep(getSortDelay());
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      swp(); [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      renderBars(arr, { swapping: [i, minIdx], sorted: [...sorted] });
      await sleep(getSortDelay());
    }
    sorted.add(i);
  }
}

// ── INSERTION SORT ───────────────────────────────────────
async function insertionSort(arr, cmp, swp) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      cmp();
      renderBars(arr, { comparing: [j-1, j] });
      await sleep(getSortDelay());
      if (arr[j] < arr[j-1]) {
        swp(); [arr[j], arr[j-1]] = [arr[j-1], arr[j]];
        renderBars(arr, { swapping: [j, j-1] });
        await sleep(getSortDelay());
        j--;
      } else break;
    }
  }
}

// ── MERGE SORT ───────────────────────────────────────────
async function mergeSort(arr, l, r, cmp, swp) {
  if (l >= r) return;
  const mid = Math.floor((l + r) / 2);
  await mergeSort(arr, l, mid, cmp, swp);
  await mergeSort(arr, mid+1, r, cmp, swp);
  await merge(arr, l, mid, r, cmp, swp);
}
async function merge(arr, l, mid, r, cmp, swp) {
  const left = arr.slice(l, mid+1), right = arr.slice(mid+1, r+1);
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length) {
    cmp();
    renderBars(arr, { comparing: [k, mid+1+j] });
    await sleep(getSortDelay());
    if (left[i] <= right[j]) { arr[k++] = left[i++]; }
    else { arr[k++] = right[j++]; swp(); }
    renderBars(arr, { swapping: [k-1] });
  }
  while (i < left.length) { arr[k++] = left[i++]; }
  while (j < right.length) { arr[k++] = right[j++]; }
}

// ── QUICK SORT ───────────────────────────────────────────
async function quickSort(arr, lo, hi, cmp, swp) {
  if (lo >= hi) return;
  const pi = await partition(arr, lo, hi, cmp, swp);
  await quickSort(arr, lo, pi-1, cmp, swp);
  await quickSort(arr, pi+1, hi, cmp, swp);
}
async function partition(arr, lo, hi, cmp, swp) {
  const pivot = arr[hi]; let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    cmp();
    renderBars(arr, { comparing: [j, hi], pivot: hi });
    await sleep(getSortDelay());
    if (arr[j] <= pivot) {
      i++; swp(); [arr[i], arr[j]] = [arr[j], arr[i]];
      renderBars(arr, { swapping: [i, j], pivot: hi });
      await sleep(getSortDelay());
    }
  }
  swp(); [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]];
  return i + 1;
}

// ── HEAP SORT ────────────────────────────────────────────
async function heapSort(arr, cmp, swp) {
  const n = arr.length;
  for (let i = Math.floor(n/2)-1; i >= 0; i--) await heapify(arr, n, i, cmp, swp);
  for (let i = n-1; i > 0; i--) {
    swp(); [arr[0], arr[i]] = [arr[i], arr[0]];
    renderBars(arr, { swapping: [0, i] });
    await sleep(getSortDelay());
    await heapify(arr, i, 0, cmp, swp);
  }
}
async function heapify(arr, n, i, cmp, swp) {
  let largest = i, l = 2*i+1, r = 2*i+2;
  cmp(); if (l < n && arr[l] > arr[largest]) largest = l;
  cmp(); if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    swp(); [arr[i], arr[largest]] = [arr[largest], arr[i]];
    renderBars(arr, { swapping: [i, largest] });
    await sleep(getSortDelay());
    await heapify(arr, n, largest, cmp, swp);
  }
}
