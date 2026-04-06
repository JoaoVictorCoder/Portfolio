export function initMenu() {
  const mobileMenu = document.querySelector('.mobile-menu');
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('.nav-list li');
  const navAnchors = document.querySelectorAll('.nav-list li a');

  if (!mobileMenu || !navList) {
    return;
  }

  const toggleMenu = () => {
    navList.classList.toggle('active');
    mobileMenu.classList.toggle('active');

    navLinks.forEach((link, index) => {
      const delay = index / 7 + 0.3;
      link.style.animation = link.style.animation ? '' : `navLinkFade 0.5s ease forwards ${delay}s`;
    });
  };

  mobileMenu.addEventListener('click', toggleMenu);
  navAnchors.forEach((item) => item.addEventListener('click', toggleMenu));
}
