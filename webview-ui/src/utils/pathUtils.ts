export function isAncestorOf(
  ancestorPath: (string | number)[],
  descendantPath: (string | number)[]
): boolean {
  if (ancestorPath.length >= descendantPath.length) return false;
  return ancestorPath.every((val, i) => val === descendantPath[i]);
}

function needsBracketNotation(key: string): boolean {
  return !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}

export function formatPathForCopy(path: (string | number)[]): string {
  if (path.length === 0) return "";
  return path.reduce<string>((result, segment) => {
    if (typeof segment === "number") {
      return result + `[${segment}]`;
    }
    if (needsBracketNotation(segment)) {
      return result + `["${segment}"]`;
    }
    return result ? result + "." + segment : segment;
  }, "");
}
