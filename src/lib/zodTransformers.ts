export function trim(v: string) {
  return v.trim();
}

export function falsyToNull<T>(v: T) {
  return v || null;
}
