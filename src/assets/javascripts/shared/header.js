document
  .querySelectorAll('[data-nav-item]')
  .forEach((e) => {
    e.classList.remove('header__nav-item--active');
    const pathname = window.location.pathname;

    if (pathname.includes('components')) {
      document.querySelector('[data-nav-item="components"]').classList.add('header__nav-item--active');
    } else {
      document.querySelector('[data-nav-item="docs"]').classList.add('header__nav-item--active');
    }
  });
