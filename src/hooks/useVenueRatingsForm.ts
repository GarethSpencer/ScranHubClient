import { useState } from "react";
import {
  useCreateRating,
  useUpdateRating,
  useDeleteRating,
  useGetRatingsForGroupVenue,
  useInvalidateRatingQueries,
} from "../api/controllerHooks/useRatingController";
import { useGetOptionsForGroup } from "../api/controllerHooks/useOptionController";
import { useGetCurrentUser } from "../api/controllerHooks/useUserController";
import type GroupVenueResult from "../models/results/GroupVenueResult";

const persistRating = (
  groupVenueId: string,
  previous: { ratingId: string; optionId: string | null } | undefined,
  selectedOptionId: string,
  canCreate: boolean,
  create: (request: {
    groupVenueId: string;
    optionId: string | null;
  }) => Promise<unknown>,
  update: (request: {
    groupVenueId: string;
    ratingId: string;
    request: { optionId: string | null };
  }) => Promise<unknown>,
) => {
  const optionId = selectedOptionId || null;

  if (!previous) {
    return canCreate ? create({ groupVenueId, optionId }) : Promise.resolve();
  }
  if ((previous.optionId ?? null) !== optionId) {
    return update({
      groupVenueId,
      ratingId: previous.ratingId,
      request: { optionId },
    });
  }
  return Promise.resolve();
};

const useVenueRatingsForm = (
  groupId: string,
  venue: GroupVenueResult | null,
) => {
  const groupVenueId = venue?.groupVenueId ?? "";

  const [qualityOptionId, setQualityOptionId] = useState<string | null>(null);
  const [costOptionId, setCostOptionId] = useState<string | null>(null);
  const [vibeOptionId, setVibeOptionId] = useState<string | null>(null);

  const [wasRemoved, setWasRemoved] = useState(false);

  const selectOption =
    (setOptionId: (optionId: string) => void) => (optionId: string) => {
      setWasRemoved(false);
      setOptionId(optionId);
    };

  const { data: qualityOptionData, isLoading: isQualityOptionsLoading } =
    useGetOptionsForGroup("QualityOption", groupId);
  const { data: costOptionData, isLoading: isCostOptionsLoading } =
    useGetOptionsForGroup("CostOption", groupId);
  const { data: vibeOptionData, isLoading: isVibeOptionsLoading } =
    useGetOptionsForGroup("VibeOption", groupId);

  const qualityOptions = [...(qualityOptionData?.options ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const costOptions = [...(costOptionData?.options ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const vibeOptions = [...(vibeOptionData?.options ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const areOptionsLoading =
    isQualityOptionsLoading || isCostOptionsLoading || isVibeOptionsLoading;

  const { data: currentUserData } = useGetCurrentUser();
  const currentUserId = currentUserData?.user?.userId;

  const { data: qualityRatingsData, isLoading: isQualityRatingLoading } =
    useGetRatingsForGroupVenue("QualityRating", groupId, groupVenueId);
  const { data: costRatingsData, isLoading: isCostRatingLoading } =
    useGetRatingsForGroupVenue("CostRating", groupId, groupVenueId);
  const { data: vibeRatingsData, isLoading: isVibeRatingLoading } =
    useGetRatingsForGroupVenue("VibeRating", groupId, groupVenueId);

  const currentQualityRating = qualityRatingsData?.ratings?.find(
    (rating) => rating.userId === currentUserId,
  );
  const currentCostRating = costRatingsData?.ratings?.find(
    (rating) => rating.userId === currentUserId,
  );
  const currentVibeRating = vibeRatingsData?.ratings?.find(
    (rating) => rating.userId === currentUserId,
  );

  const areRatingsLoading =
    isQualityRatingLoading || isCostRatingLoading || isVibeRatingLoading;

  const qualitySelection =
    qualityOptionId ?? currentQualityRating?.optionId ?? "";
  const costSelection = costOptionId ?? currentCostRating?.optionId ?? "";
  const vibeSelection = vibeOptionId ?? currentVibeRating?.optionId ?? "";

  const isQualitySet =
    qualityOptionId !== null || (!wasRemoved && currentQualityRating != null);
  const isCostSet =
    costOptionId !== null || (!wasRemoved && currentCostRating != null);
  const isVibeSet =
    vibeOptionId !== null || (!wasRemoved && currentVibeRating != null);

  const areAllRatingsSet = isQualitySet && isCostSet && isVibeSet;

  const { mutateAsync: createQualityRating } = useCreateRating(
    "QualityRating",
    groupId,
    { silent: true, deferInvalidation: true },
  );
  const { mutateAsync: updateQualityRating } = useUpdateRating(
    "QualityRating",
    groupId,
    { silent: true, deferInvalidation: true },
  );
  const { mutateAsync: deleteQualityRating } = useDeleteRating(
    "QualityRating",
    groupId,
    { silent: true, deferInvalidation: true },
  );

  const { mutateAsync: createCostRating } = useCreateRating(
    "CostRating",
    groupId,
    { silent: true, deferInvalidation: true },
  );
  const { mutateAsync: updateCostRating } = useUpdateRating(
    "CostRating",
    groupId,
    { silent: true, deferInvalidation: true },
  );
  const { mutateAsync: deleteCostRating } = useDeleteRating(
    "CostRating",
    groupId,
    { silent: true, deferInvalidation: true },
  );

  const { mutateAsync: createVibeRating } = useCreateRating(
    "VibeRating",
    groupId,
    { silent: true, deferInvalidation: true },
  );
  const { mutateAsync: updateVibeRating } = useUpdateRating(
    "VibeRating",
    groupId,
    { silent: true, deferInvalidation: true },
  );
  const { mutateAsync: deleteVibeRating } = useDeleteRating(
    "VibeRating",
    groupId,
    { silent: true, deferInvalidation: true },
  );

  const invalidateRatingQueries = useInvalidateRatingQueries();

  const hasSavedRatings =
    currentQualityRating != null ||
    currentCostRating != null ||
    currentVibeRating != null;

  const reset = () => {
    setQualityOptionId(null);
    setCostOptionId(null);
    setVibeOptionId(null);
    setWasRemoved(false);
  };

  const remove = () => {
    if (!venue) return Promise.resolve();
    const groupVenueId = venue.groupVenueId;
    setWasRemoved(true);
    return Promise.all([
      currentQualityRating
        ? deleteQualityRating({
            ratingId: currentQualityRating.ratingId,
            groupVenueId,
          })
        : Promise.resolve(),
      currentCostRating
        ? deleteCostRating({
            ratingId: currentCostRating.ratingId,
            groupVenueId,
          })
        : Promise.resolve(),
      currentVibeRating
        ? deleteVibeRating({
            ratingId: currentVibeRating.ratingId,
            groupVenueId,
          })
        : Promise.resolve(),
    ]).then((results) => {
      invalidateRatingQueries(groupId, groupVenueId);
      return results;
    });
  };

  const save = (isVisited: boolean = venue?.visited ?? false) => {
    if (!venue) return Promise.resolve();
    const groupVenueId = venue.groupVenueId;
    const canCreate = isVisited && !wasRemoved;
    return Promise.all([
      persistRating(
        venue.groupVenueId,
        currentQualityRating,
        qualitySelection,
        canCreate,
        createQualityRating,
        updateQualityRating,
      ),
      persistRating(
        venue.groupVenueId,
        currentCostRating,
        costSelection,
        canCreate,
        createCostRating,
        updateCostRating,
      ),
      persistRating(
        venue.groupVenueId,
        currentVibeRating,
        vibeSelection,
        canCreate,
        createVibeRating,
        updateVibeRating,
      ),
    ]).then((results) => {
      invalidateRatingQueries(groupId, groupVenueId);
      return results;
    });
  };

  return {
    qualitySelection,
    costSelection,
    vibeSelection,
    setQualityOptionId: selectOption(setQualityOptionId),
    setCostOptionId: selectOption(setCostOptionId),
    setVibeOptionId: selectOption(setVibeOptionId),
    isQualitySet,
    isCostSet,
    isVibeSet,
    areAllRatingsSet,
    qualityOptions,
    costOptions,
    vibeOptions,
    areOptionsLoading,
    areRatingsLoading,
    hasSavedRatings,
    reset,
    save,
    remove,
  };
};

export const ratingsSaveLabel = (
  form: ReturnType<typeof useVenueRatingsForm>,
  notVisited = false,
) =>
  !notVisited &&
  !form.areOptionsLoading &&
  !form.areRatingsLoading &&
  !form.areAllRatingsSet
    ? "Select your ratings"
    : undefined;

export default useVenueRatingsForm;
