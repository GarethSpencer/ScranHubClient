import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type ApiClient from "../apiClient";
import costOptionControllerService from "../controllerServices/costOptionControllerService";
import foodTypeOptionControllerService from "../controllerServices/foodTypeOptionControllerService";
import qualityOptionControllerService from "../controllerServices/qualityOptionControllerService";
import vibeOptionControllerService from "../controllerServices/vibeOptionControllerService";
import venueTypeOptionControllerService from "../controllerServices/venueTypeOptionControllerService";
import type GetRatingOptionsResponse from "../../models/responses/options/GetRatingOptionsResponse";
import useToast from "../../contexts/toast/useToast";
import type OrderOptionsRequest from "../../models/requests/options/OrderOptionsRequest";
import type CommonResponse from "../../models/responses/generic/CommonResponse";
import type GetRatingOptionResponse from "../../models/responses/options/GetRatingOptionResponse";
import type SetOptionsResponse from "../../models/responses/options/SetOptionsResponse";
import type SetOptionsRequest from "../../models/requests/options/SetOptionsRequest";
import type SetOptionResponse from "../../models/responses/options/SetOptionResponse";
import type SetOptionRequest from "../../models/requests/options/SetOptionRequest";
import type UpdateOptionRequest from "../../models/requests/options/UpdateOptionRequest";
import type GetTypeOptionResponse from "../../models/responses/options/GetTypeOptionResponse";

export type OptionController =
  | "CostOption"
  | "FoodTypeOption"
  | "QualityOption"
  | "VibeOption"
  | "VenueTypeOption";

export type RatingOptionController =
  | "CostOption"
  | "QualityOption"
  | "VibeOption";
export type TypeOptionController = "FoodTypeOption" | "VenueTypeOption";

const ratingControllers: RatingOptionController[] = [
  "CostOption",
  "QualityOption",
  "VibeOption",
];

export const isRatingController = (
  controller: OptionController,
): controller is RatingOptionController =>
  (ratingControllers as OptionController[]).includes(controller);

const optionServices: Record<OptionController, ApiClient> = {
  CostOption: costOptionControllerService,
  FoodTypeOption: foodTypeOptionControllerService,
  QualityOption: qualityOptionControllerService,
  VibeOption: vibeOptionControllerService,
  VenueTypeOption: venueTypeOptionControllerService,
};

const invalidateOptionQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  controller: OptionController,
  groupId: string,
) => {
  queryClient.invalidateQueries({ queryKey: [controller, groupId] });
  queryClient.invalidateQueries({ queryKey: ["groups", groupId, "venues"] });
};

export const useSetCustomOptions = (
  controller: OptionController,
  groupId: string,
) => {
  const service = optionServices[controller];
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<SetOptionsResponse, Error, SetOptionsRequest>({
    mutationFn: (request: SetOptionsRequest) =>
      service.post<SetOptionsResponse, SetOptionsRequest>(undefined, {
        ...request,
        groupId,
      }),
    onSuccess: (data) => {
      invalidateOptionQueries(queryClient, controller, groupId);
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useRemoveCustomOptions = (
  controller: OptionController,
  groupId: string,
) => {
  const service = optionServices[controller];
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<CommonResponse, Error>({
    mutationFn: () => service.delete<CommonResponse>(groupId),
    onSuccess: (data) => {
      invalidateOptionQueries(queryClient, controller, groupId);
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useAddCustomOption = (
  controller: OptionController,
  groupId: string,
) => {
  const service = optionServices[controller];
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<SetOptionResponse, Error, SetOptionRequest>({
    mutationFn: (request: SetOptionRequest) =>
      service.post<SetOptionResponse, SetOptionRequest>("custom", {
        ...request,
        groupId,
      }),
    onSuccess: (data) => {
      invalidateOptionQueries(queryClient, controller, groupId);
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useUpdateCustomOption = (
  controller: OptionController,
  groupId: string,
) => {
  const service = optionServices[controller];
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    CommonResponse,
    Error,
    { optionId: string; request: UpdateOptionRequest }
  >({
    mutationFn: ({ optionId, request }) =>
      service.patch<CommonResponse, UpdateOptionRequest>(
        `custom/${optionId}`,
        request,
      ),
    onSuccess: (data) => {
      invalidateOptionQueries(queryClient, controller, groupId);
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useRemoveCustomOption = (
  controller: OptionController,
  groupId: string,
) => {
  const service = optionServices[controller];
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<CommonResponse, Error, string>({
    mutationFn: (optionId: string) =>
      service.delete<CommonResponse>(`custom/${optionId}`),
    onSuccess: (data) => {
      invalidateOptionQueries(queryClient, controller, groupId);
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useGetOptionsForGroup = (
  controller: OptionController,
  groupId: string,
) => {
  const service = optionServices[controller];

  return useQuery<GetRatingOptionsResponse, Error>({
    queryKey: [controller, groupId],
    queryFn: () => service.get<GetRatingOptionsResponse>(`?GroupId=${groupId}`),
    staleTime: 10 * 1000,
  });
};

export const useGetRatingOption = (
  controller: RatingOptionController,
  groupId: string,
  optionId: string,
) => {
  const service = optionServices[controller];

  return useQuery<GetRatingOptionResponse, Error>({
    queryKey: [controller, groupId, optionId],
    queryFn: () => service.get<GetRatingOptionResponse>(`custom/${optionId}`),
    staleTime: 10 * 1000,
  });
};

export const useGetTypeOption = (
  controller: TypeOptionController,
  groupId: string,
  optionId: string,
) => {
  const service = optionServices[controller];

  return useQuery<GetTypeOptionResponse, Error>({
    queryKey: [controller, groupId, optionId],
    queryFn: () => service.get<GetTypeOptionResponse>(`custom/${optionId}`),
    staleTime: 10 * 1000,
  });
};

export const useReorderRatingOptions = (
  controller: OptionController,
  groupId: string,
) => {
  const service = optionServices[controller];
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<CommonResponse, Error, OrderOptionsRequest>({
    mutationFn: (request: OrderOptionsRequest) =>
      service.patch<CommonResponse, OrderOptionsRequest>(undefined, {
        ...request,
        groupId,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [controller, groupId],
      });
      if (data.message) showToast(data.message, "success");
    },
  });
};
