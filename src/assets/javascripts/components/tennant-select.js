import getTarget from '../utils/get-target';

/**
 * Tennant switcher
 */
document.addEventListener('change', (event) => {
  const $tennantSelect = getTarget(event.target, 'select[name="tennant-select"]');

  if ($tennantSelect && event.target.value) {
    location.assign(event.target.value);
  }
});
