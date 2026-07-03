import { useSyncExternalStore } from "react";

const MOBILE_MAX_WIDTH = 767.98;

const query = `(max-width: ${MOBILE_MAX_WIDTH}px)`;

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(query).matches;

const useIsMobile = () => useSyncExternalStore(subscribe, getSnapshot);

export default useIsMobile;
