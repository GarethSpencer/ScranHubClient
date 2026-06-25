import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../../lib/googleMaps";

interface Props {
  latitude: number;
  longitude: number;
  name?: string;
}

const VenueMap = ({ latitude, longitude, name }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then(async (maps) => {
        if (cancelled || !containerRef.current) return;

        const { Map } = (await maps.importLibrary(
          "maps",
        )) as google.maps.MapsLibrary;
        const { Marker } = (await maps.importLibrary(
          "marker",
        )) as google.maps.MarkerLibrary;

        const position = { lat: latitude, lng: longitude };
        const map = new Map(containerRef.current, {
          center: position,
          zoom: 16,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
        });
        new Marker({ map, position, title: name });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, name]);

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
