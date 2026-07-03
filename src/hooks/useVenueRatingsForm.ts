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

  const { data: qualityOptionData, isLoading: isQualityOptionsLoading } =
    useGetOptionsForGroup("QualityOption", groupId);
  const { data: costOptionData, isLoading: isCostOptionsLoading } =
    useGetOptionsForGroup("CostOption", groupId);

  const qualityOptions = [...(qualityOptionData?.options ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const costOptions = [...(costOptionData?.options ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const areOptionsLoading = isQualityOptionsLoading || isCostOptionsLoading;

  const { data: currentUserData } = useGetCurrentUser();
  const currentUserId = currentUserData?.user?.userId;

  const { data: qualityRatingsData, isLoading: isQualityRatingLoading } =
    useGetRatingsForGroupVenue("QualityRating", groupId, groupVenueId);
  const { data: costRatingsData, isLoading: isCostRatingLoading } =
    useGetRatingsForGroupVenue("CostRating", groupId, groupVenueId);

  const currentQualityRating = qualityRatingsData?.ratings?.find(
    (rating) => rating.userId === currentUserId,
  );
  const currentCostRating = costRatingsData?.ratings?.find(
    (rating) => rating.userId === currentUserId,
  );

  const areRatingsLoading = isQualityRatingLoading || isCostRatingLoading;

  const qualitySelection =
    qualityOptionId ?? currentQualityRating?.optionId ?? "";
  const costSelection = costOptionId ?? currentCostRating?.optionId ?? "";

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

  const reset = () => {
    setQualityOptionId(null);
    setCostOptionId(null);
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
    ]);
  };

  return {
    qualitySelection,
    costSelection,
    setQualityOptionId,
    setCostOptionId,
    qualityOptions,
    costOptions,
    areOptionsLoading,
    areRatingsLoading,
    reset,
    save,
  };
};

export default useVenueRatingsForm;
