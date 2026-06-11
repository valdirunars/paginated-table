export function get(
  obj: Record<string, unknown> | undefined | null | object,
  path: string,
  defaultValue?: unknown,
): unknown {
  if (obj == null) return defaultValue;
  const keys = path.split(".");
  let result: unknown = obj;
  for (const key of keys) {
    if (result == null || typeof result !== "object") return defaultValue;
    result = (result as Record<string, unknown>)[key];
  }
  return result === undefined ? defaultValue : result;
}
