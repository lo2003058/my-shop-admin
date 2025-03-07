/**
 * Utility function to combine CSS classes.
 */
export function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
