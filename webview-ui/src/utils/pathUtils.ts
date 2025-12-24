export function isAncestorOf(
  ancestorPath: (string | number)[],
  descendantPath: (string | number)[]
): boolean {
  if (ancestorPath.length >= descendantPath.length) return false;
  return ancestorPath.every((val, i) => val === descendantPath[i]);
}

export function formatPathForCopy(path: (string | number)[]): string {
  if (path.length === 0) return "";
  return String(path[0]);
}
