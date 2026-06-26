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
  const [cleared, setCleared] = useState(false);
  const [useAutocomplete, setUseAutocomplete] = useState(
    isGoogleMapsConfigured(),
  );

  const reset = () => {
    setNewPlace(null);
    setCleared(false);
    setUseAutocomplete(isGoogleMapsConfigured());
  };

  const selectPlace = (place: SelectedPlace) => {
    setNewPlace(place);
    setCleared(false);
  };

  const onNameChange = (name: string) => {
    if (name.trim() === "") {
      setNewPlace(null);
      setCleared(true);
    }
  };

  const displayedAddress = cleared
    ? undefined
    : (newPlace?.formattedAddress ?? initialFields?.formattedAddress);

  const placeFields: VenuePlaceFields = cleared
    ? {}
    : newPlace
      ? fieldsFromPlace(newPlace)
      : (initialFields ?? {});

  return {
    useAutocomplete,
    onAutocompleteUnavailable: () => setUseAutocomplete(false),
    selectPlace,
    onNameChange,
    displayedAddress,
    placeFields,
    reset,
  };
};

export default useVenuePlaceSearch;
