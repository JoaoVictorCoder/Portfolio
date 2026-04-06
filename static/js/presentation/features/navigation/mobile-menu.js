export function initializeMobileMenu() {
  const mobileMenuButton = document.querySelector('.mobile-menu');
  const navigationList = document.querySelector('.nav-list');
  const navigationItems = document.querySelectorAll('.nav-list li');
  const navigationLinks = document.querySelectorAll('.nav-list li a');

  if (!mobileMenuButton || !navigationList) {
    return;
  }

  const toggleNavigationMenu = () => {
    navigationList.classList.toggle('active');
    mobileMenuButton.classList.toggle('active');

    navigationItems.forEach((item, index) => {
      const delayInSeconds = index / 7 + 0.3;
      item.style.animation = item.style.animation
        ? ''
        : `navLinkFade 0.5s ease forwards ${delayInSeconds}s`;
    });
  };

  mobileMenuButton.addEventListener('click', toggleNavigationMenu);
  navigationLinks.forEach((link) => link.addEventListener('click', toggleNavigationMenu));
}
