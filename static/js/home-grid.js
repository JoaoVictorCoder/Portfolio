export function initHomeGrid() {
  const section = document.getElementById('s-home');
  const grid = document.getElementById('home-grid-bg');

  if (!section || !grid) {
    return;
  }

  const cellSize = 50;
  let cols = 0;
  let rows = 0;
  let cells = [];
  let rafPending = false;
  let lastX = 0;
  let lastY = 0;
  let chainTimers = [];

  function buildGrid() {
    const rect = section.getBoundingClientRect();
    const width = Math.max(1, Math.ceil(rect.width));
    const height = Math.max(1, Math.ceil(rect.height));

    cols = Math.max(1, Math.ceil(width / cellSize));
    rows = Math.max(1, Math.ceil(height / cellSize));

    grid.style.setProperty('--home-grid-cols', String(cols));
    grid.style.setProperty('--home-grid-rows', String(rows));

    const total = cols * rows;
    const fragment = document.createDocumentFragment();
    cells = [];

    for (let i = 0; i < total; i += 1) {
      const cell = document.createElement('div');
      cell.className = 'home-grid-cell';
      cell.dataset.index = String(i);
      fragment.appendChild(cell);
      cells.push(cell);
    }

    grid.replaceChildren(fragment);
  }

  function clearEffects() {
    for (const cell of cells) {
      cell.classList.remove('active', 'near', 'chain');
    }
  }

  function clearChainTimers() {
    chainTimers.forEach((timerId) => window.clearTimeout(timerId));
    chainTimers = [];
  }

  function highlightFromMouse(clientX, clientY) {
    const rect = section.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      clearEffects();
      return;
    }

    const col = Math.min(cols - 1, Math.floor((x / rect.width) * cols));
    const row = Math.min(rows - 1, Math.floor((y / rect.height) * rows));

    if (col < 0 || col >= cols || row < 0 || row >= rows) {
      return;
    }

    clearEffects();

    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
        const neighborRow = row + rowOffset;
        const neighborCol = col + colOffset;

        if (
          neighborRow < 0 ||
          neighborRow >= rows ||
          neighborCol < 0 ||
          neighborCol >= cols
        ) {
          continue;
        }

        const neighborIndex = neighborRow * cols + neighborCol;
        const cell = cells[neighborIndex];

        if (!cell) {
          continue;
        }

        if (rowOffset === 0 && colOffset === 0) {
          cell.classList.add('active');
        } else {
          cell.classList.add('near');
        }
      }
    }
  }

  function onMouseMove(event) {
    lastX = event.clientX;
    lastY = event.clientY;

    if (!rafPending) {
      rafPending = true;
      window.requestAnimationFrame(() => {
        highlightFromMouse(lastX, lastY);
        rafPending = false;
      });
    }
  }

  function runChainFromIndex(startIndex) {
    if (startIndex < 0 || startIndex >= cells.length) {
      return;
    }

    clearChainTimers();
    clearEffects();

    const startRow = Math.floor(startIndex / cols);
    const startCol = startIndex % cols;

    for (let i = 0; i < cells.length; i += 1) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const distance = Math.abs(row - startRow) + Math.abs(col - startCol);
      const delay = distance * 35;

      const timerId = window.setTimeout(() => {
        const cell = cells[i];

        if (!cell) {
          return;
        }

        cell.classList.remove('chain');
        // Reinicia a animação para cliques em sequência.
        void cell.offsetWidth;
        cell.classList.add('chain');
      }, delay);

      chainTimers.push(timerId);
    }
  }

  function onGridClick(event) {
    const clickedCell = event.target.closest('.home-grid-cell');

    if (!clickedCell || !grid.contains(clickedCell)) {
      return;
    }

    const index = Number(clickedCell.dataset.index);

    if (Number.isNaN(index)) {
      return;
    }

    runChainFromIndex(index);
  }

  window.addEventListener('mousemove', onMouseMove);
  section.addEventListener('mouseleave', clearEffects);
  grid.addEventListener('click', onGridClick);
  window.addEventListener('resize', buildGrid);

  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
      buildGrid();
    });

    resizeObserver.observe(section);
  }

  buildGrid();
}
