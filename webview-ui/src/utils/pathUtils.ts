export function isAncestorOf(
  ancestorPath: (string | number)[],
  descendantPath: (string | number)[]
): boolean {
  if (ancestorPath.length >= descendantPath.length) return false;
  return ancestorPath.every((val, i) => val === descendantPath[i]);
}
