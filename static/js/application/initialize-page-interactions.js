import { initializeFaqAccordion } from '../presentation/features/faq/faq-accordion.js';
import { initializeHomeGridInteraction } from '../presentation/features/home/home-grid-interaction.js';
import { initializeHomeTitleTypewriter } from '../presentation/features/home/home-title-typewriter.js';
import { initializeMobileMenu } from '../presentation/features/navigation/mobile-menu.js';
import { initializeMotion } from '../presentation/features/motion/motion-init.js';

function safelyInitializeFeature(featureName, initializeFeature) {
  try {
    initializeFeature();
  } catch (error) {
    console.error(`[page-init] Failed to initialize ${featureName}.`, error);
  }
}

export function initializePageInteractions() {
  safelyInitializeFeature('mobile menu', initializeMobileMenu);
  safelyInitializeFeature('faq accordion', initializeFaqAccordion);
  safelyInitializeFeature('motion', initializeMotion);
  safelyInitializeFeature('home title typewriter', initializeHomeTitleTypewriter);
  safelyInitializeFeature('home grid interaction', initializeHomeGridInteraction);
}
