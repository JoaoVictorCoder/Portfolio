function getScaleFactor() {
  const baseWidth = 1440;
  const baseHeight = 900;
  const currentWidth = Math.max(1, window.innerWidth || baseWidth);
  const currentHeight = Math.max(1, window.innerHeight || baseHeight);
  const currentDiagonal = Math.hypot(currentWidth, currentHeight);
  const baseDiagonal = Math.hypot(baseWidth, baseHeight);
  const rawScale = currentDiagonal / baseDiagonal;
  return Math.min(1.45, Math.max(0.6, rawScale));
}

export function initializeHomeGridInteraction() {
  const homeSection = document.getElementById('s-home');
  const homeGrid = document.getElementById('home-grid-bg');

  if (!homeSection || !homeGrid) {
    return;
  }

  const baseGridCellSize = 48;
  const interactiveOrbitRadius = 2;
  let gridCellSize = baseGridCellSize * getScaleFactor();
  let columnCount = 0;
  let rowCount = 0;
  let gridCells = [];
  let animationFramePending = false;
  let orbitAnimationFrameId = 0;
  let pointerInsideHome = false;
  let lastPointerX = 0;
  let lastPointerY = 0;

  function buildGridCells() {
    gridCellSize = baseGridCellSize * getScaleFactor();

    const sectionRect = homeSection.getBoundingClientRect();
    const sectionWidth = Math.max(1, Math.ceil(sectionRect.width));
    const sectionHeight = Math.max(1, Math.ceil(sectionRect.height));

    const nextColumnCount = Math.max(1, Math.ceil(sectionWidth / gridCellSize));
    const nextRowCount = Math.max(1, Math.ceil(sectionHeight / gridCellSize));

    const gridShapeUnchanged =
      nextColumnCount === columnCount &&
      nextRowCount === rowCount &&
      gridCells.length === nextColumnCount * nextRowCount;

    if (gridShapeUnchanged) {
      return;
    }

    columnCount = nextColumnCount;
    rowCount = nextRowCount;

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
      gridCell.style.removeProperty('--grid-shift-x');
      gridCell.style.removeProperty('--grid-shift-y');
      gridCell.style.removeProperty('--grid-glow');
    }
  }

  function highlightGridFromPointer(clientX, clientY, time = 0) {
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

    for (
      let rowOffset = -interactiveOrbitRadius;
      rowOffset <= interactiveOrbitRadius;
      rowOffset += 1
    ) {
      for (
        let columnOffset = -interactiveOrbitRadius;
        columnOffset <= interactiveOrbitRadius;
        columnOffset += 1
      ) {
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
        const distance = Math.hypot(rowOffset, columnOffset);

        if (!neighborCell || distance > interactiveOrbitRadius) {
          continue;
        }

        const intensity = Math.max(0, 1 - distance / (interactiveOrbitRadius + 0.35));
        const angle = Math.atan2(rowOffset, columnOffset);
        const orbitPhase = (time * 0.0022) + (distance * 0.7);
        const orbitRadius = intensity * 8;
        const orbitX = Math.cos(orbitPhase + angle) * orbitRadius;
        const orbitY = Math.sin(orbitPhase + angle) * orbitRadius;

        neighborCell.style.setProperty(
          '--grid-shift-x',
          `${orbitX.toFixed(2)}px`,
        );
        neighborCell.style.setProperty(
          '--grid-shift-y',
          `${orbitY.toFixed(2)}px`,
        );
        neighborCell.style.setProperty('--grid-glow', intensity.toFixed(2));

        if (rowOffset === 0 && columnOffset === 0) {
          neighborCell.classList.add('active');
        } else if (distance <= 2.6) {
          neighborCell.classList.add('near');
        }
      }
    }
  }

  function runOrbitFrame(timestamp) {
    if (!pointerInsideHome) {
      orbitAnimationFrameId = 0;
      return;
    }

    highlightGridFromPointer(lastPointerX, lastPointerY, timestamp);
    orbitAnimationFrameId = window.requestAnimationFrame(runOrbitFrame);
  }

  function ensureOrbitAnimation() {
    if (orbitAnimationFrameId !== 0) {
      return;
    }

    orbitAnimationFrameId = window.requestAnimationFrame(runOrbitFrame);
  }

  function handlePointerMove(event) {
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    pointerInsideHome = true;

    if (!animationFramePending) {
      animationFramePending = true;
      window.requestAnimationFrame(() => {
        highlightGridFromPointer(lastPointerX, lastPointerY, performance.now());
        animationFramePending = false;
      });
    }

    ensureOrbitAnimation();
  }

  function handlePointerLeave() {
    pointerInsideHome = false;

    if (orbitAnimationFrameId !== 0) {
      window.cancelAnimationFrame(orbitAnimationFrameId);
      orbitAnimationFrameId = 0;
    }

    clearGridEffects();
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

        const computedStyles = window.getComputedStyle(cell);
        const shiftX = computedStyles.getPropertyValue('--grid-shift-x').trim() || '0px';
        const shiftY = computedStyles.getPropertyValue('--grid-shift-y').trim() || '0px';

        const baseTransform = `translate3d(${shiftX}, ${shiftY}, 0)`;
        const burstTransform = [
          `translate3d(${shiftX}, ${shiftY}, 0)`,
          'scale(1.08)',
        ].join(' ');

        cell.animate(
          [
            {
              background: 'rgba(0, 200, 255, 0.08)',
              boxShadow: '0 0 6px rgba(0, 200, 255, 0.15)',
              transform: baseTransform,
            },
            {
              background: 'rgba(0, 200, 255, 0.24)',
              boxShadow: '0 0 12px rgba(0, 200, 255, 0.45), 0 0 26px rgba(0, 200, 255, 0.2)',
              transform: burstTransform,
              offset: 0.45,
            },
            {
              background: 'rgba(255, 255, 255, 0.03)',
              boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
              transform: baseTransform,
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
  homeSection.addEventListener('mouseleave', handlePointerLeave);
  window.addEventListener('resize', () => {
    buildGridCells();

    if (pointerInsideHome) {
      highlightGridFromPointer(lastPointerX, lastPointerY, performance.now());
    }
  });

  if ('ResizeObserver' in window) {
    const sectionResizeObserver = new ResizeObserver(() => {
      buildGridCells();
    });

    sectionResizeObserver.observe(homeSection);
  }

  buildGridCells();
}
