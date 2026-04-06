const OPEN_ICON_HTML = '<img src="/static/assets/icons/MinusCircle.svg" alt="Fechar" loading="eager" />';
const CLOSED_ICON_HTML = '<img src="/static/assets/icons/PlusCircle.svg" alt="Abrir" loading="eager" />';

export function initializeFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  if (!faqItems.length) {
    return;
  }

  faqItems.forEach((faqItem) => {
    const toggleButton = faqItem.querySelector('.toggle-btn');

    if (!toggleButton) {
      return;
    }

    toggleButton.addEventListener('click', () => {
      const wasOpen = faqItem.classList.contains('open');

      faqItems.forEach((item) => {
        item.classList.remove('open');

        const itemToggleButton = item.querySelector('.toggle-btn');
        if (itemToggleButton) {
          itemToggleButton.innerHTML = CLOSED_ICON_HTML;
        }
      });

      if (!wasOpen) {
        faqItem.classList.add('open');
        toggleButton.innerHTML = OPEN_ICON_HTML;
      }
    });
  });
}
