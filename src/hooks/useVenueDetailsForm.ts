import { useState } from "react";
import { MAX_VENUE_NAME_LENGTH } from "../constants/validation";
import {
  useDeleteGroupVenue,
  useUpdateGroupVenue,
} from "../api/controllerHooks/useGroupVenueController";
import { useGetOptionsForGroup } from "../api/controllerHooks/useOptionController";
import useVenuePlaceSearch from "./useVenuePlaceSearch";
import type { SelectedPlace } from "../components/common/PlaceAutocomplete";
import type GroupVenueResult from "../models/results/GroupVenueResult";
import type RatingOptionResult from "../models/results/generic/RatingOptionResult";

const optionIdForLabel = (
  options: RatingOptionResult[],
  label: string | undefined,
) => options.find((option) => option.label === label)?.optionId ?? "";

const toDateInputValue = (visitedOn: string | undefined) =>
  visitedOn ? visitedOn.slice(0, 10) : "";

const todayDateInputValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const useVenueDetailsForm = (
  groupId: string,
  venue: GroupVenueResult | null,
) => {
  const [venueName, setVenueName] = useState("");
  const [visited, setVisited] = useState(false);
  const [visitedOn, setVisitedOn] = useState("");
  const [venueTypeOptionId, setVenueTypeOptionId] = useState("");
  const [foodTypeOptionId, setFoodTypeOptionId] = useState("");

  const placeSearch = useVenuePlaceSearch({
    initialFields: {
      googlePlaceId: venue?.googlePlaceId,
      formattedAddress: venue?.formattedAddress,
      latitude: venue?.latitude,
      longitude: venue?.longitude,
    },
  });

  const { data: venueTypeData, isLoading: isVenueTypesLoading } =
    useGetOptionsForGroup("VenueTypeOption", groupId);
  const { data: foodTypeData, isLoading: isFoodTypesLoading } =
    useGetOptionsForGroup("FoodTypeOption", groupId);

  const venueTypeOptions = venueTypeData?.options ?? [];
  const foodTypeOptions = foodTypeData?.options ?? [];

  const areOptionsLoading = isVenueTypesLoading || isFoodTypesLoading;

  const { mutateAsync: updateVenue, isPending: isUpdating } =
    useUpdateGroupVenue(groupId);
  const { mutate: deleteVenue, isPending: isDeleting } =
    useDeleteGroupVenue(groupId);

  const canSave = venueName.trim().length > 0;

  const initialise = () => {
    setVenueName(venue?.venueName ?? "");
    setVisited(venue?.visited ?? false);
    setVisitedOn(toDateInputValue(venue?.visitedOn));
    setVenueTypeOptionId(optionIdForLabel(venueTypeOptions, venue?.venueType));
    setFoodTypeOptionId(optionIdForLabel(foodTypeOptions, venue?.foodType));
    placeSearch.reset();
  };

  const onSelectPlace = (place: SelectedPlace) => {
    setVenueName(place.displayName.slice(0, MAX_VENUE_NAME_LENGTH));
    placeSearch.selectPlace(place);
  };

  const onNameChange = (value: string) => {
    setVenueName(value);
    placeSearch.onNameChange(value);
  };

  const onVisitedChange = (value: boolean) => {
    setVisited(value);
    if (value) setVisitedOn((current) => current || todayDateInputValue());
    else setVisitedOn("");
  };

  const save = () => {
    if (!venue || !canSave) return Promise.resolve();
    return updateVenue({
      groupVenueId: venue.groupVenueId,
      request: {
        venueName: venueName.trim(),
        visited,
        visitedOn: visited && visitedOn ? visitedOn : undefined,
        venueTypeOptionId: venueTypeOptionId || undefined,
        foodTypeOptionId: foodTypeOptionId || undefined,
        ...placeSearch.placeFields,
      },
    });
  };

  const remove = (callbacks: {
    onSuccess?: () => void;
    onSettled?: () => void;
  }) => {
    if (!venue) return;
    deleteVenue(venue.groupVenueId, callbacks);
  };

  return {
    values: {
      venueName,
      visited,
      visitedOn,
      venueTypeOptionId,
      foodTypeOptionId,
    },
    setters: {
      setVenueName,
      setVisited,
      setVisitedOn,
      setVenueTypeOptionId,
      setFoodTypeOptionId,
    },
    placeSearch,
    venueTypeOptions,
    foodTypeOptions,
    areOptionsLoading,
    todayDateInputValue: todayDateInputValue(),
    isUpdating,
    isDeleting,
    canSave,
    initialise,
    onSelectPlace,
    onNameChange,
    onVisitedChange,
    save,
    remove,
  };
};

export default useVenueDetailsForm;
