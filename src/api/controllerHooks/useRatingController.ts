import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type ApiClient from "../apiClient";
import useToast from "../../contexts/toast/useToast";
import qualityRatingControllerService from "../controllerServices/qualityRatingControllerService";
import costRatingControllerService from "../controllerServices/costRatingControllerService";
import type CreateRatingRequest from "../../models/requests/ratings/CreateRatingRequest";
import type AddRatingResponse from "../../models/responses/ratings/AddRatingResponse";
import type GetRatingResponse from "../../models/responses/ratings/GetRatingResponse";
import type CommonResponse from "../../models/responses/generic/CommonResponse";
import type UpdateRatingRequest from "../../models/requests/ratings/UpdateRatingRequest";
import type GetRatingsResponse from "../../models/responses/ratings/GetRatingsResponse";
import type GetGroupRatingsResponse from "../../models/responses/ratings/GetGroupRatingsResponse";

export type RatingController = "CostRating" | "QualityRating";

const ratingServices: Record<RatingController, ApiClient> = {
  CostRating: costRatingControllerService,
  QualityRating: qualityRatingControllerService,
};

const invalidateRatingQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  controller: RatingController,
  groupId: string,
  groupVenueId: string,
) => {
  queryClient.invalidateQueries({
    queryKey: [controller, groupId, "venues", groupVenueId],
  });
  queryClient.invalidateQueries({ queryKey: [controller, groupId, "me"] });
  queryClient.invalidateQueries({ queryKey: [controller, groupId, "group"] });
  queryClient.invalidateQueries({ queryKey: ["groups", groupId, "venues"] });
};

export const useCreateRating = (
  controller: RatingController,
  groupId: string,
  options?: { silent?: boolean },
) => {
  const service = ratingServices[controller];
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<AddRatingResponse, Error, CreateRatingRequest>({
    mutationFn: (request: CreateRatingRequest) =>
      service.post<AddRatingResponse, CreateRatingRequest>(undefined, request),
    onSuccess: (data, request) => {
      invalidateRatingQueries(
        queryClient,
        controller,
        groupId,
        request.groupVenueId,
      );
      if (!options?.silent && data.message) showToast(data.message, "success");
    },
  });
};

export const useUpdateRating = (
  controller: RatingController,
  groupId: string,
  options?: { silent?: boolean },
) => {
  const service = ratingServices[controller];
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    CommonResponse,
    Error,
    { groupVenueId: string; ratingId: string; request: UpdateRatingRequest }
  >({
    mutationFn: ({ ratingId, request }) =>
      service.patch<CommonResponse, UpdateRatingRequest>(ratingId, request),
    onSuccess: (data, { groupVenueId }) => {
      invalidateRatingQueries(queryClient, controller, groupId, groupVenueId);
      if (!options?.silent && data.message) showToast(data.message, "success");
    },
  });
};

export const useDeleteRating = (
  controller: RatingController,
  groupId: string,
  options?: { silent?: boolean },
) => {
  const service = ratingServices[controller];
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    CommonResponse,
    Error,
    { ratingId: string; groupVenueId: string }
  >({
    mutationFn: ({ ratingId }) => service.delete<CommonResponse>(ratingId),
    onSuccess: (data, { groupVenueId }) => {
      invalidateRatingQueries(queryClient, controller, groupId, groupVenueId);
      if (!options?.silent && data.message) showToast(data.message, "success");
    },
  });
};

export const useGetRating = (
  controller: RatingController,
  groupId: string,
  groupVenueId: string,
  ratingId: string,
) => {
  const service = ratingServices[controller];

  return useQuery<GetRatingResponse, Error>({
    queryKey: [controller, groupId, "venues", groupVenueId, "rating", ratingId],
    queryFn: () => service.get<GetRatingResponse>(ratingId),
    staleTime: 10 * 1000,
  });
};

export const useGetRatingsForGroupVenue = (
  controller: RatingController,
  groupId: string,
  groupVenueId: string,
) => {
  const service = ratingServices[controller];
  return useQuery<GetRatingsResponse, Error>({
    queryKey: [controller, groupId, "venues", groupVenueId],
    queryFn: () =>
      service.get<GetRatingsResponse>(`groupvenue/${groupVenueId}`),
    staleTime: 10 * 1000,
    enabled: groupVenueId.length > 0,
  });
};

export const useGetUserRatingsForGroup = (
  controller: RatingController,
  groupId: string,
) => {
  const service = ratingServices[controller];
  return useQuery<GetRatingsResponse, Error>({
    queryKey: [controller, groupId, "me"],
    queryFn: () => service.get<GetRatingsResponse>(`group/${groupId}/me`),
    staleTime: 10 * 1000,
  });
};

export const useGetRatingsForGroup = (
  controller: RatingController,
  groupId: string,
) => {
  const service = ratingServices[controller];
  return useQuery<GetGroupRatingsResponse, Error>({
    queryKey: [controller, groupId, "group"],
    queryFn: () => service.get<GetGroupRatingsResponse>(`group/${groupId}`),
    staleTime: 10 * 1000,
  });
};
