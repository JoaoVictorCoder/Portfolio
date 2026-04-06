const TYPE_SPEED_MS = 80;
const START_DELAY_MS = 250;

export function initializeHomeTitleTypewriter() {
  const homeTitle = document.querySelector('#home-container-text h1');

  if (!homeTitle) {
    return;
  }

  if (homeTitle.dataset.typewriterInitialized === 'true') {
    return;
  }

  homeTitle.dataset.typewriterInitialized = 'true';

  const fullText = (homeTitle.textContent || '').trim();

  if (!fullText) {
    return;
  }

  const prefersReducedMotion =
    'matchMedia' in window &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    homeTitle.textContent = fullText;
    return;
  }

  homeTitle.textContent = '';
  homeTitle.classList.add('is-typewriting');

  let currentIndex = 0;

  const typeNextCharacter = () => {
    currentIndex += 1;
    homeTitle.textContent = fullText.slice(0, currentIndex);

    if (currentIndex >= fullText.length) {
      homeTitle.classList.remove('is-typewriting');
      return;
    }

    window.setTimeout(typeNextCharacter, TYPE_SPEED_MS);
  };

  window.setTimeout(typeNextCharacter, START_DELAY_MS);
}
