(function revealFallbackBootstrap() {
  const revealFallbackSeenAt = new WeakMap();
  let revealFallbackRaf = 0;

  function isNearViewport(element) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    return rect.bottom >= -viewportHeight * 0.15 && rect.top <= viewportHeight * 1.15;
  }

  function releaseStaleRevealState() {
    if (!document.documentElement.classList.contains('sr')) {
      return;
    }

    const now = performance.now();
    document.querySelectorAll('[data-reveal]').forEach((element) => {
      if (!isNearViewport(element)) {
        revealFallbackSeenAt.delete(element);
        return;
      }

      const styles = getComputedStyle(element);
      const isHidden = styles.visibility === 'hidden' || Number(styles.opacity || '1') <= 0.01;
      if (!isHidden) {
        revealFallbackSeenAt.delete(element);
        return;
      }

      const firstSeenAt = revealFallbackSeenAt.get(element);
      if (typeof firstSeenAt !== 'number') {
        revealFallbackSeenAt.set(element, now);
        return;
      }

      if (now - firstSeenAt < 1800) {
        return;
      }

      element.style.visibility = 'visible';
      element.style.opacity = '1';
      element.removeAttribute('data-reveal');
      element.setAttribute('data-interceptor-reveal-fallback', 'true');
      revealFallbackSeenAt.delete(element);
    });
  }

  function scheduleRevealFallback() {
    if (revealFallbackRaf) {
      return;
    }

    revealFallbackRaf = requestAnimationFrame(() => {
      revealFallbackRaf = 0;
      releaseStaleRevealState();
    });
  }

  function bootstrapRevealFallback() {
    scheduleRevealFallback();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapRevealFallback, { once: true });
  } else {
    bootstrapRevealFallback();
  }

  window.addEventListener('scroll', scheduleRevealFallback, { passive: true });
  window.addEventListener('resize', scheduleRevealFallback);
  window.addEventListener('load', () => {
    scheduleRevealFallback();
    setTimeout(scheduleRevealFallback, 1500);
    setTimeout(scheduleRevealFallback, 4000);
  });
})();
