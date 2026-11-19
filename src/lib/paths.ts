/** A same-site path to return to after registering or signing in; anything else falls back to /reader. */
export function safeNextPath(next: unknown) {
  return typeof next === "string" && /^\/(?!\/)[\w\-/#?=&.%]*$/.test(next) ? next : "/reader";
}
