const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
  | string
  | undefined;

export const isGoogleMapsConfigured = (): boolean =>
  Boolean(GOOGLE_MAPS_API_KEY);

let loadPromise: Promise<typeof google.maps> | null = null;

const hasImportLibrary = (): boolean =>
  typeof window.google?.maps?.importLibrary === "function";

const appendBootstrapScript = (key: string): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    const callbackName = "__googleMapsReady";
    (window as unknown as Record<string, () => void>)[callbackName] = () =>
      resolve();

    const params = new URLSearchParams({
      key,
      v: "weekly",
      libraries: "places",
      loading: "async",
      callback: callbackName,
    });

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.onerror = () =>
      reject(new Error("Google Maps script failed to load."));
    document.head.appendChild(script);
  });

export const loadGoogleMaps = (): Promise<typeof google.maps> => {
  if (loadPromise) return loadPromise;

  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error("Google Maps API key is not configured."));
  }

  loadPromise = (async () => {
    if (!hasImportLibrary()) {
      await appendBootstrapScript(GOOGLE_MAPS_API_KEY);
    }
    return google.maps;
  })();

  loadPromise.catch(() => {
    loadPromise = null;
  });

  return loadPromise;
};
