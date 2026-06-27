import { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { loadGoogleMaps } from "../../lib/googleMaps";
import useDarkMode from "../../contexts/darkMode/useDarkMode";

export interface SelectedPlace {
  placeId: string;
  displayName: string;
  formattedAddress?: string;
  location?: { lat: number; lng: number };
}

interface Props {
  onSelect: (place: SelectedPlace) => void;
  onUnavailable?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const PLACE_FIELDS = ["displayName", "formattedAddress", "location", "id"];

const PlaceAutocomplete = ({
  onSelect,
  onUnavailable,
  disabled,
  placeholder,
}: Props) => {
  const { state: isDarkMode } = useDarkMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(
    null,
  );
  const onSelectRef = useRef(onSelect);
  const onUnavailableRef = useRef(onUnavailable);
  const placeholderRef = useRef(placeholder);
  useEffect(() => {
    onSelectRef.current = onSelect;
    onUnavailableRef.current = onUnavailable;
    placeholderRef.current = placeholder;
  }, [onSelect, onUnavailable, placeholder]);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let element: google.maps.places.PlaceAutocompleteElement | null = null;

    const handleSelect = async (event: Event) => {
      const { placePrediction } = event as unknown as {
        placePrediction: google.maps.places.PlacePrediction;
      };
      if (!placePrediction) return;

      const place = placePrediction.toPlace();
      await place.fetchFields({ fields: PLACE_FIELDS });

      const location = place.location
        ? { lat: place.location.lat(), lng: place.location.lng() }
        : undefined;

      onSelectRef.current({
        placeId: place.id,
        displayName: place.displayName ?? "",
        formattedAddress: place.formattedAddress ?? undefined,
        location,
      });
    };

    loadGoogleMaps()
      .then(async (maps) => {
        if (cancelled || !containerRef.current) return;

        const { PlaceAutocompleteElement } = (await maps.importLibrary(
          "places",
        )) as google.maps.PlacesLibrary;

        element = new PlaceAutocompleteElement();
        element.addEventListener("gmp-select", handleSelect as EventListener);
        if (placeholderRef.current) {
          (element as unknown as { placeholder?: string }).placeholder =
            placeholderRef.current;
        }
        containerRef.current.appendChild(element);
        elementRef.current = element;
        setIsReady(true);
      })
      .catch(() => {
        if (!cancelled) onUnavailableRef.current?.();
      });

    return () => {
      cancelled = true;
      if (element) {
        element.removeEventListener(
          "gmp-select",
          handleSelect as EventListener,
        );
        element.remove();
      }
      elementRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isReady || !elementRef.current) return;
    elementRef.current.style.colorScheme = isDarkMode ? "dark" : "light";
  }, [isDarkMode, isReady]);

  return (
    <>
      <div
        ref={containerRef}
        className={`place-autocomplete ${disabled ? "pe-none opacity-50" : ""}`}
        aria-disabled={disabled}
      />
      {!isReady && (
        <Form.Control type="text" placeholder={placeholder} disabled readOnly />
      )}
    </>
  );
};

export default PlaceAutocomplete;
