/*
* Simple iFrame src switcher for variants
*/
import getTarget from '../utils/get-target';

document.addEventListener('click', (event) => {
  const $button = getTarget(event.target, '.variant__tab-button[data-src]');

  if ($button) {
    const target = $button.getAttribute('data-target');
    const src = $button.getAttribute('data-src');

    document.getElementById(target).src = src;

    const $tabsParent = $button.parentNode.parentNode;
    $tabsParent.querySelectorAll('.variant__tab').forEach(($tab) => {
      $tab.classList.remove('variant__tab--active');
    });

    $button.parentNode.classList.add('variant__tab--active');
  }
});
