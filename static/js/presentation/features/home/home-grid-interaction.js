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

  function getGridIndexFromPoint(clientX, clientY) {
    const sectionRect = homeSection.getBoundingClientRect();
    const relativePointerX = clientX - sectionRect.left;
    const relativePointerY = clientY - sectionRect.top;

    if (
      relativePointerX < 0 ||
      relativePointerY < 0 ||
      relativePointerX > sectionRect.width ||
      relativePointerY > sectionRect.height
    ) {
      return -1;
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
      return -1;
    }

    return rowIndex * columnCount + columnIndex;
  }

  function startChainAnimationFromIndex(startIndex) {
    if (startIndex < 0 || startIndex >= gridCells.length) {
      return;
    }

    const startRow = Math.floor(startIndex / columnCount);
    const startColumn = startIndex % columnCount;

    for (let index = 0; index < gridCells.length; index += 1) {
      const row = Math.floor(index / columnCount);
      const column = index % columnCount;
      const manhattanDistance = Math.abs(row - startRow) + Math.abs(column - startColumn);
      const animationDelay = manhattanDistance * 35;

      window.setTimeout(() => {
        const cell = gridCells[index];

        if (!cell) {
          return;
        }

        cell.animate(
          [
            {
              background: 'rgba(0, 200, 255, 0.08)',
              boxShadow: '0 0 6px rgba(0, 200, 255, 0.15)',
              transform: 'scale(1)',
            },
            {
              background: 'rgba(0, 200, 255, 0.24)',
              boxShadow: '0 0 12px rgba(0, 200, 255, 0.45), 0 0 26px rgba(0, 200, 255, 0.2)',
              transform: 'scale(1.03)',
              offset: 0.45,
            },
            {
              background: 'rgba(255, 255, 255, 0.03)',
              boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
              transform: 'scale(1)',
            },
          ],
          {
            duration: 420,
            easing: 'ease-out',
          },
        );
      }, animationDelay);
    }
  }

  function handleGridClick(event) {
    const clickedCellIndex = getGridIndexFromPoint(event.clientX, event.clientY);

    if (clickedCellIndex < 0) {
      return;
    }

    startChainAnimationFromIndex(clickedCellIndex);
  }

  window.addEventListener('mousemove', handlePointerMove);
  window.addEventListener('click', handleGridClick);
  homeSection.addEventListener('mouseleave', clearGridEffects);
  window.addEventListener('resize', buildGridCells);

  if ('ResizeObserver' in window) {
    const sectionResizeObserver = new ResizeObserver(() => {
      buildGridCells();
    });

    sectionResizeObserver.observe(homeSection);
  }

  buildGridCells();
}
