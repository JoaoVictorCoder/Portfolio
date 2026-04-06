export function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) {
    return;
  }

  faqItems.forEach((item) => {
    const btn = item.querySelector('.toggle-btn');
    if (!btn) {
      return;
    }

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach((faqItem) => {
        faqItem.classList.remove('open');
        const toggleButton = faqItem.querySelector('.toggle-btn');
        if (toggleButton) {
          toggleButton.innerHTML = '<img src="/static/assets/icons/PlusCircle.svg" alt="Abrir" loading="eager" />';
        }
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.innerHTML = '<img src="/static/assets/icons/MinusCircle.svg" alt="Fechar" loading="eager" />';
      }
    });
  });
}
