export function initializeHomeGridInteraction() {
  const homeSection = document.getElementById('s-home');
  const homeGrid = document.getElementById('home-grid-bg');

  if (!homeSection || !homeGrid) {
    return;
  }

  const gridCellSize = 50;
  let columnCount = 0;
  let rowCount = 0;
  let gridCells = [];
  let animationFramePending = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let chainAnimationTimers = [];

  function buildGridCells() {
    const sectionRect = homeSection.getBoundingClientRect();
    const sectionWidth = Math.max(1, Math.ceil(sectionRect.width));
    const sectionHeight = Math.max(1, Math.ceil(sectionRect.height));

    columnCount = Math.max(1, Math.ceil(sectionWidth / gridCellSize));
    rowCount = Math.max(1, Math.ceil(sectionHeight / gridCellSize));

    homeGrid.style.setProperty('--home-grid-cols', String(columnCount));
    homeGrid.style.setProperty('--home-grid-rows', String(rowCount));

    const totalCells = columnCount * rowCount;
    const documentFragment = document.createDocumentFragment();
    gridCells = [];

    for (let index = 0; index < totalCells; index += 1) {
      const gridCell = document.createElement('div');
      gridCell.className = 'home-grid-cell';
      gridCell.dataset.index = String(index);
      documentFragment.appendChild(gridCell);
      gridCells.push(gridCell);
    }

    homeGrid.replaceChildren(documentFragment);
  }

  function clearGridEffects() {
    for (const gridCell of gridCells) {
      gridCell.classList.remove('active', 'near', 'chain');
    }
  }

  function clearChainAnimationTimers() {
    chainAnimationTimers.forEach((timerId) => window.clearTimeout(timerId));
    chainAnimationTimers = [];
  }

  function highlightGridFromPointer(clientX, clientY) {
    const sectionRect = homeSection.getBoundingClientRect();
    const relativePointerX = clientX - sectionRect.left;
    const relativePointerY = clientY - sectionRect.top;

    if (
      relativePointerX < 0 ||
      relativePointerY < 0 ||
      relativePointerX > sectionRect.width ||
      relativePointerY > sectionRect.height
    ) {
      clearGridEffects();
      return;
    }

    const columnIndex = Math.min(
      columnCount - 1,
      Math.floor((relativePointerX / sectionRect.width) * columnCount),
    );
    const rowIndex = Math.min(
      rowCount - 1,
      Math.floor((relativePointerY / sectionRect.height) * rowCount),
    );

    if (
      columnIndex < 0 ||
      columnIndex >= columnCount ||
      rowIndex < 0 ||
      rowIndex >= rowCount
    ) {
      return;
    }

    clearGridEffects();

    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
        const neighborRow = rowIndex + rowOffset;
        const neighborColumn = columnIndex + columnOffset;

        if (
          neighborRow < 0 ||
          neighborRow >= rowCount ||
          neighborColumn < 0 ||
          neighborColumn >= columnCount
        ) {
          continue;
        }

        const neighborIndex = neighborRow * columnCount + neighborColumn;
        const neighborCell = gridCells[neighborIndex];

        if (!neighborCell) {
          continue;
        }

        if (rowOffset === 0 && columnOffset === 0) {
          neighborCell.classList.add('active');
        } else {
          neighborCell.classList.add('near');
        }
      }
    }
  }

  function handlePointerMove(event) {
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;

    if (!animationFramePending) {
      animationFramePending = true;
      window.requestAnimationFrame(() => {
        highlightGridFromPointer(lastPointerX, lastPointerY);
        animationFramePending = false;
      });
    }
  }

  function startChainAnimationFromIndex(startIndex) {
    if (startIndex < 0 || startIndex >= gridCells.length) {
      return;
    }

    clearChainAnimationTimers();
    clearGridEffects();

    const startRow = Math.floor(startIndex / columnCount);
    const startColumn = startIndex % columnCount;

    for (let index = 0; index < gridCells.length; index += 1) {
      const row = Math.floor(index / columnCount);
      const column = index % columnCount;
      const manhattanDistance = Math.abs(row - startRow) + Math.abs(column - startColumn);
      const animationDelay = manhattanDistance * 35;

      const timerId = window.setTimeout(() => {
        const cell = gridCells[index];

        if (!cell) {
          return;
        }

        cell.classList.remove('chain');
        // Reinicia a animação para cliques em sequência.
        void cell.offsetWidth;
        cell.classList.add('chain');
      }, animationDelay);

      chainAnimationTimers.push(timerId);
    }
  }

  function handleGridClick(event) {
    const clickedCell = event.target.closest('.home-grid-cell');

    if (!clickedCell || !homeGrid.contains(clickedCell)) {
      return;
    }

    const clickedCellIndex = Number(clickedCell.dataset.index);

    if (Number.isNaN(clickedCellIndex)) {
      return;
    }

    startChainAnimationFromIndex(clickedCellIndex);
  }

  window.addEventListener('mousemove', handlePointerMove);
  homeSection.addEventListener('mouseleave', clearGridEffects);
  homeGrid.addEventListener('click', handleGridClick);
  window.addEventListener('resize', buildGridCells);

  if ('ResizeObserver' in window) {
    const sectionResizeObserver = new ResizeObserver(() => {
      buildGridCells();
    });

    sectionResizeObserver.observe(homeSection);
  }

  buildGridCells();
}
