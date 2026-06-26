import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../../lib/googleMaps";
import useDarkMode from "../../contexts/darkMode/useDarkMode";

interface Props {
  latitude: number;
  longitude: number;
  name?: string;
}

const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

const VenueMap = ({ latitude, longitude, name }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const { state: isDarkMode } = useDarkMode();

  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then(async (maps) => {
        if (cancelled || !containerRef.current) return;

        const { Map } = (await maps.importLibrary(
          "maps",
        )) as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = (await maps.importLibrary(
          "marker",
        )) as google.maps.MarkerLibrary;

        const position = { lat: latitude, lng: longitude };
        const map = new Map(containerRef.current, {
          center: position,
          zoom: 16,
          mapId: MAP_ID,
          colorScheme: isDarkMode ? "DARK" : "LIGHT",
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
        });
        new AdvancedMarkerElement({ map, position, title: name });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, name, isDarkMode]);

  if (failed) return null;

  return (
    <div
      ref={containerRef}
      className="venue-map rounded"
      role="img"
      aria-label={name ? `Map showing ${name}` : "Map showing the venue"}
    />
  );
};

export default VenueMap;
