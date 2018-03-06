/*
* Simple iFrame src switcher for variants
*/
import getTarget from '../utils/get-target';

document.addEventListener('click', (event) => {
  const $button = getTarget(event.target, '.variant__tab[data-src]');

  if ($button) {
    const target = $button.getAttribute('data-target');
    const src = $button.getAttribute('data-src');

    document.getElementById(target).src = src;

    const $buttonParent = $button.parentNode;
    $buttonParent.querySelectorAll('.variant__tab').forEach(($tab) => {
      $tab.classList.remove('variant__tab--active');
    });

    $button.classList.add('variant__tab--active');
  }
});
