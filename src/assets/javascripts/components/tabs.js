import getTarget from '../utils/get-target';

function switchTab($oldTab, $newTab) {
  // Make the active tab focusable by the user (Tab key)
  $newTab.focus();
  $newTab.removeAttribute('tabindex');

  // Set the selected state
  $newTab.setAttribute('aria-selected', 'true');
  $oldTab.removeAttribute('aria-selected');
  $oldTab.setAttribute('tabindex', '-1');

  // Hide old panel, show new panel
  const $oldTabpanel = document.querySelector($oldTab.getAttribute('href'));
  const $newTabpanel = document.querySelector($newTab.getAttribute('href'));
  $oldTabpanel.hidden = true;
  $newTabpanel.hidden = false;
}

document.addEventListener('click', (event) => {
  const $tab = getTarget(event.target, '.js-tabs [role="tab"]');

  if ($tab) {
    event.preventDefault();
    const $container = $tab.closest('.js-tabs');
    const $currentTab = $container.querySelector('[role="tab"][aria-selected="true"]');

    if ($tab !== $currentTab) {
      switchTab($currentTab, $tab);
    }
  }
});

document.addEventListener('keydown', (event) => {
  const $tab = getTarget(event.target, '.js-tabs [role="tab"]');

  if ($tab) {
    const $container = $tab.closest('.js-tabs');
    const $tabs = $container.querySelectorAll('[role="tab"]');
    const index = Array.prototype.indexOf.call($tabs, $tab);

    // If the down key is pressed, move focus to the open panel,
    // otherwise switch to the adjacent tab
    if (event.which === 40) {
      const $tabpanel = document.querySelector($tab.getAttribute('href'));
      $tabpanel.focus();
    } else if (event.which === 37 || event.which === 39) {
      const nextIndex = event.which === 37 ? index - 1 : index + 1;
      if ($tabs[nextIndex]) {
        switchTab($tab, $tabs[nextIndex]);
      }
    }
  }
});
