# {AlgoViz} — DSA Visualizer

An interactive platform to visualize **pathfinding** and **sorting** algorithms in real-time, built with vanilla JavaScript, HTML5, and CSS3.

🔗 **[Live Demo](https://kshitijagarwal77.github.io/dsa-visualizer/)**

---

## Features

### ⬡ Pathfinding Algorithms
| Algorithm | Weighted | Shortest Path Guaranteed |
|-----------|----------|--------------------------|
| Dijkstra's | ✅ | ✅ |
| A* Search | ✅ | ✅ |
| Greedy BFS | ✅ | ❌ |
| BFS | ❌ | ✅ |
| DFS | ❌ | ❌ |

- Draw walls and weighted nodes interactively
- Recursive Division **maze generation**
- Adjustable visualization speed (Fast / Medium / Slow)
- Live stats: visited nodes & path length

### ▦ Sorting Algorithms
| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | ❌ |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ |

- Adjustable array size (10–120 elements)
- Real-time comparison & swap counter
- Live complexity panel per algorithm

---

## Tech Stack
- **Vanilla JavaScript** (ES6+) — zero dependencies
- **HTML5 / CSS3** — grid layout, CSS animations
- **CSS Variables** — dark theme design system

---

## Run Locally

```bash
git clone https://github.com/kshitijagarwal77/dsa-visualizer.git
cd dsa-visualizer
# open index.html in browser — no build step needed
```

---

## Author
**Kshitij Agarwal** — [GitHub](https://github.com/kshitijagarwal77) | [LinkedIn](https://linkedin.com/in/)
