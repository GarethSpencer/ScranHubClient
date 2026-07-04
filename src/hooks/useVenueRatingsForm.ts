import { useState } from "react";
import {
  useCreateRating,
  useUpdateRating,
  useDeleteRating,
  useGetRatingsForGroupVenue,
} from "../api/controllerHooks/useRatingController";
import { useGetOptionsForGroup } from "../api/controllerHooks/useOptionController";
import { useGetCurrentUser } from "../api/controllerHooks/useUserController";
import type GroupVenueResult from "../models/results/GroupVenueResult";

const persistRating = (
  groupVenueId: string,
  previous: { ratingId: string; optionId: string } | undefined,
  selectedOptionId: string,
  create: (request: {
    groupVenueId: string;
    optionId: string;
  }) => Promise<unknown>,
  update: (request: {
    groupVenueId: string;
    ratingId: string;
    request: { optionId: string };
  }) => Promise<unknown>,
  remove: (request: {
    ratingId: string;
    groupVenueId: string;
  }) => Promise<unknown>,
) => {
  if (!previous && selectedOptionId) {
    return create({ groupVenueId, optionId: selectedOptionId });
  }
  if (previous && !selectedOptionId) {
    return remove({ ratingId: previous.ratingId, groupVenueId });
  }
  if (previous && selectedOptionId && previous.optionId !== selectedOptionId) {
    return update({
      groupVenueId,
      ratingId: previous.ratingId,
      request: { optionId: selectedOptionId },
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

  const { mutateAsync: createQualityRating } = useCreateRating(
    "QualityRating",
    groupId,
    { silent: true },
  );
  const { mutateAsync: updateQualityRating } = useUpdateRating(
    "QualityRating",
    groupId,
    { silent: true },
  );
  const { mutateAsync: deleteQualityRating } = useDeleteRating(
    "QualityRating",
    groupId,
    { silent: true },
  );

  const { mutateAsync: createCostRating } = useCreateRating(
    "CostRating",
    groupId,
    { silent: true },
  );
  const { mutateAsync: updateCostRating } = useUpdateRating(
    "CostRating",
    groupId,
    { silent: true },
  );
  const { mutateAsync: deleteCostRating } = useDeleteRating(
    "CostRating",
    groupId,
    { silent: true },
  );

  const { mutateAsync: createVibeRating } = useCreateRating(
    "VibeRating",
    groupId,
    { silent: true },
  );
  const { mutateAsync: updateVibeRating } = useUpdateRating(
    "VibeRating",
    groupId,
    { silent: true },
  );
  const { mutateAsync: deleteVibeRating } = useDeleteRating(
    "VibeRating",
    groupId,
    { silent: true },
  );

  const reset = () => {
    setQualityOptionId(null);
    setCostOptionId(null);
    setVibeOptionId(null);
  };

  const save = () => {
    if (!venue) return Promise.resolve();
    return Promise.all([
      persistRating(
        venue.groupVenueId,
        currentQualityRating,
        qualitySelection,
        createQualityRating,
        updateQualityRating,
        deleteQualityRating,
      ),
      persistRating(
        venue.groupVenueId,
        currentCostRating,
        costSelection,
        createCostRating,
        updateCostRating,
        deleteCostRating,
      ),
      persistRating(
        venue.groupVenueId,
        currentVibeRating,
        vibeSelection,
        createVibeRating,
        updateVibeRating,
        deleteVibeRating,
      ),
    ]);
  };

  return {
    qualitySelection,
    costSelection,
    vibeSelection,
    setQualityOptionId,
    setCostOptionId,
    setVibeOptionId,
    qualityOptions,
    costOptions,
    vibeOptions,
    areOptionsLoading,
    areRatingsLoading,
    reset,
    save,
  };
};

export default useVenueRatingsForm;
