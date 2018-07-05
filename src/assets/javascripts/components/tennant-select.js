/*
* Tennant switcher
*/
document.addEventListener('DOMContentLoaded',function() {
  document.querySelector('select[name="tennant-select"]').onchange = changeEventHandler;
}, false);

function changeEventHandler(event) {
  if (event.target.value) location.assign(event.target.value);
}
