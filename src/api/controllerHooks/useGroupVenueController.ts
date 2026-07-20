import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import groupVenueControllerService from "../controllerServices/groupVenueControllerService";
import { useGetCurrentUser } from "./useUserController";
import type GetGroupVenueResponse from "../../models/responses/groupVenues/GetGroupVenueResponse";
import type GetGroupVenuesResponse from "../../models/responses/groupVenues/GetGroupVenuesResponse";
import type SortablePaginationRequest from "../../models/requests/generic/SortablePaginationRequest";
import type SearchGroupVenueRequest from "../../models/requests/groupVenues/SearchGroupVenueRequest";
import type CreateGroupVenueRequest from "../../models/requests/groupVenues/CreateGroupVenueRequest";
import type AddGroupVenueResponse from "../../models/responses/groupVenues/AddGroupVenueResponse";
import useToast from "../../contexts/toast/useToast";
import type UpdateGroupVenueRequest from "../../models/requests/groupVenues/UpdateGroupVenueRequest";
import type CommonResponse from "../../models/responses/generic/CommonResponse";

const VENUE_STALE_TIME = 5 * 60 * 1000;

export const useGetGroupVenue = (groupId: string, groupVenueId: string) => {
  const queryClient = useQueryClient();

  return useQuery<GetGroupVenueResponse, Error>({
    queryKey: ["groups", groupId, "venues", groupVenueId],
    queryFn: () =>
      groupVenueControllerService.get<GetGroupVenueResponse>(groupVenueId),
    staleTime: VENUE_STALE_TIME,
    placeholderData: () => {
      const cachedVenue = queryClient
        .getQueriesData<GetGroupVenuesResponse>({
          queryKey: ["groups", groupId, "venues"],
        })
        .flatMap(([, response]) => response?.groupVenues ?? [])
        .find((g) => g.groupVenueId === groupVenueId);

      return cachedVenue
        ? { statusCode: 200, groupVenue: cachedVenue }
        : undefined;
    },
  });
};

export const useGetVenuesForGroup = (
  groupId: string,
  request: SortablePaginationRequest,
) => {
  const { data: currentUserData } = useGetCurrentUser();
  const userId = currentUserData?.user?.userId;

  return useQuery<GetGroupVenuesResponse, Error>({
    queryKey: [
      "groups",
      groupId,
      "venues",
      userId,
      request.pageNumber,
      request.pageSize,
      request.sortBy,
      request.sortDescending,
    ],
    queryFn: () =>
      groupVenueControllerService.get<GetGroupVenuesResponse>(
        `group/${groupId}?PageNumber=${request.pageNumber}&PageSize=${request.pageSize}&SortBy=${request.sortBy}&SortDescending=${request.sortDescending}`,
      ),
    staleTime: VENUE_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

export const useSearchGroupVenues = (
  groupId: string,
  request: SearchGroupVenueRequest,
) => {
  const { data: currentUserData } = useGetCurrentUser();
  const userId = currentUserData?.user?.userId;

  return useQuery<GetGroupVenuesResponse, Error>({
    queryKey: ["groups", groupId, "venues", "search", userId, request],
    queryFn: () =>
      groupVenueControllerService.get<GetGroupVenuesResponse>(
        `search/${groupId}?SearchText=${encodeURIComponent(request.searchText)}&PageNumber=${request.pageNumber}&PageSize=${request.pageSize}`,
      ),
    staleTime: VENUE_STALE_TIME,
    enabled: request.searchText.length >= 3,
  });
};

export const useCreateGroupVenue = (groupId: string) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    AddGroupVenueResponse,
    Error,
    Omit<CreateGroupVenueRequest, "groupId">
  >({
    mutationFn: (request: Omit<CreateGroupVenueRequest, "groupId">) =>
      groupVenueControllerService.post<
        AddGroupVenueResponse,
        CreateGroupVenueRequest
      >(undefined, { ...request, groupId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["groups", groupId, "venues"],
      });
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useUpdateGroupVenue = (groupId: string) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    CommonResponse,
    Error,
    { groupVenueId: string; request: UpdateGroupVenueRequest }
  >({
    mutationFn: ({ groupVenueId, request }) =>
      groupVenueControllerService.patch<
        CommonResponse,
        UpdateGroupVenueRequest
      >(groupVenueId, request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["groups", groupId, "venues"],
      });
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useDeleteGroupVenue = (groupId: string) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<CommonResponse, Error, string>({
    mutationFn: (groupVenueId: string) =>
      groupVenueControllerService.delete<CommonResponse>(groupVenueId),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["groups", groupId, "venues"],
      });
      if (data.message) showToast(data.message, "success");
    },
  });
};
