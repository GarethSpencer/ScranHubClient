const getSafeReturnTo = (state: unknown): string | undefined => {
  if (typeof state !== "object" || state === null || !("returnTo" in state)) {
    return undefined;
  }

  const candidate = state.returnTo;
  if (
    typeof candidate !== "string" ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\")
  ) {
    return undefined;
  }

  const url = new URL(candidate, window.location.origin);
  return url.origin === window.location.origin
    ? `${url.pathname}${url.search}${url.hash}`
    : undefined;
};

export default getSafeReturnTo;
