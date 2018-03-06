/*
* Simple collapse script based on aria-attributes
*/

document
  .querySelectorAll('[data-collapse*="true"]')
  .forEach((e) => {
    e.addEventListener('click', (event) => {
      const $button = event.currentTarget;
      const $target = document.getElementById($button.getAttribute('aria-controls'));
      const expanded = $button.getAttribute('aria-expanded');

      $button.setAttribute('aria-expanded', (expanded === 'false') ? 'true' : 'false');
      $target.setAttribute('aria-hidden', (expanded === 'false') ? 'false' : 'true');
    });
  });
