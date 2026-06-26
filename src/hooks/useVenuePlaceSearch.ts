import { useState } from "react";
import type { SelectedPlace } from "../components/common/PlaceAutocomplete";
import { isGoogleMapsConfigured } from "../lib/googleMaps";

export interface VenuePlaceFields {
  googlePlaceId?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
}

const fieldsFromPlace = (place: SelectedPlace): VenuePlaceFields => ({
  googlePlaceId: place.placeId,
  formattedAddress: place.formattedAddress,
  latitude: place.location?.lat,
  longitude: place.location?.lng,
});

interface Options {
  initialFields?: VenuePlaceFields;
}

const useVenuePlaceSearch = (options: Options = {}) => {
  const { initialFields } = options;

  const [newPlace, setNewPlace] = useState<SelectedPlace | null>(null);
  const [useAutocomplete, setUseAutocomplete] = useState(
    isGoogleMapsConfigured(),
  );

  const reset = () => {
    setNewPlace(null);
    setUseAutocomplete(isGoogleMapsConfigured());
  };

  const displayedAddress =
    newPlace?.formattedAddress ?? initialFields?.formattedAddress;

  const placeFields: VenuePlaceFields = newPlace
    ? fieldsFromPlace(newPlace)
    : (initialFields ?? {});

  return {
    useAutocomplete,
    onAutocompleteUnavailable: () => setUseAutocomplete(false),
    selectPlace: setNewPlace,
    clearNewPlace: () => setNewPlace(null),
    displayedAddress,
    placeFields,
    reset,
  };
};

export default useVenuePlaceSearch;
