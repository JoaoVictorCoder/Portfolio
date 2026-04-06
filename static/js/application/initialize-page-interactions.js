import { initializeFaqAccordion } from '../presentation/features/faq/faq-accordion.js';
import { initializeHomeGridInteraction } from '../presentation/features/home/home-grid-interaction.js';
import { initializeHomeTitleTypewriter } from '../presentation/features/home/home-title-typewriter.js';
import { initializeMobileMenu } from '../presentation/features/navigation/mobile-menu.js';
import { initializeMotion } from '../presentation/features/motion/motion-init.js';

export function initializePageInteractions() {
  initializeMobileMenu();
  initializeFaqAccordion();
  initializeMotion();
  initializeHomeGridInteraction();
  initializeHomeTitleTypewriter();
}
