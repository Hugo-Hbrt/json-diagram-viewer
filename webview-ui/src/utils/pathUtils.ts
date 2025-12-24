export function isAncestorOf(
  ancestorPath: (string | number)[],
  descendantPath: (string | number)[]
): boolean {
  if (ancestorPath.length >= descendantPath.length) return false;
  return ancestorPath.every((val, i) => val === descendantPath[i]);
}

export function pathsEqual(a: (string | number)[], b: (string | number)[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}

function needsBracketNotation(key: string): boolean {
  return !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}

export function formatPathForCopy(path: (string | number)[]): string {
  // Skip the "root" prefix used internally
  const pathWithoutRoot = path[0] === "root" ? path.slice(1) : path;
  if (pathWithoutRoot.length === 0) return "";
  return pathWithoutRoot.reduce<string>((result, segment) => {
    if (typeof segment === "number") {
      return result + `[${segment}]`;
    }
    if (needsBracketNotation(segment)) {
      return result + `["${segment}"]`;
    }
    return result ? result + "." + segment : segment;
  }, "");
}
