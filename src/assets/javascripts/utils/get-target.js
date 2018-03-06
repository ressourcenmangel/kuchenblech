// Match or closest helper
export default function getTarget($target, match) {
  return $target.closest(match) || ($target.matches(match) && $target) || false;
}
