import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import useToast from "../../contexts/toast/useToast";
import groupControllerService from "../controllerServices/groupControllerService";
import type GetGroupResponse from "../../models/responses/groups/GetGroupResponse";
import type SearchGroupRequest from "../../models/requests/groups/SearchGroupRequest";
import type GetGroupsResponse from "../../models/responses/groups/GetGroupsResponse";
import type AddGroupResponse from "../../models/responses/groups/AddGroupResponse";
import type CreateGroupRequest from "../../models/requests/groups/CreateGroupRequest";
import type UpdateGroupRequest from "../../models/requests/groups/UpdateGroupRequest";
import type CommonResponse from "../../models/responses/generic/CommonResponse";
import type UserGroupsResponse from "../../models/responses/groups/UserGroupsResponse";
import type GetUsersResponse from "../../models/responses/users/GetUsersResponse";
import type PaginationBaseRequest from "../../models/requests/generic/PaginationBaseRequest";

export const useGetGroup = (groupId: string) => {
  const queryClient = useQueryClient();

  return useQuery<GetGroupResponse, Error>({
    queryKey: ["groups", groupId],
    queryFn: () => groupControllerService.get<GetGroupResponse>(groupId),
    staleTime: 10 * 1000,
    placeholderData: () => {
      const cachedGroup = queryClient
        .getQueryData<UserGroupsResponse>(["userGroups"])
        ?.userGroups?.find((g) => g.groupId === groupId);

      return cachedGroup ? { statusCode: 200, group: cachedGroup } : undefined;
    },
  });
};

export const useGetGroupMembers = (
  groupId: string,
  request: PaginationBaseRequest,
) => {
  return useQuery<GetUsersResponse, Error>({
    queryKey: [
      "groups",
      groupId,
      "members",
      request.pageNumber,
      request.pageSize,
    ],
    queryFn: () =>
      groupControllerService.get<GetUsersResponse>(
        `${groupId}/members?PageNumber=${request.pageNumber}&PageSize=${request.pageSize}`,
      ),
    staleTime: 10 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useSearchGroups = (request: SearchGroupRequest) => {
  return useQuery<GetGroupsResponse>({
    queryKey: ["groups", "search", request],
    queryFn: ({ signal }) =>
      groupControllerService.get<GetGroupsResponse>(
        `?SearchText=${encodeURIComponent(request.searchText)}&PageNumber=${request.pageNumber}&PageSize=${request.pageSize}`,
        signal,
      ),
    staleTime: 10 * 1000,
    enabled: request.searchText.length >= 3,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<AddGroupResponse, Error, CreateGroupRequest>({
    mutationFn: (requestData: CreateGroupRequest) =>
      groupControllerService.post<AddGroupResponse, CreateGroupRequest>(
        undefined,
        requestData,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    CommonResponse,
    Error,
    { groupId: string; requestData: UpdateGroupRequest }
  >({
    mutationFn: ({ groupId, requestData }) =>
      groupControllerService.patch<CommonResponse, UpdateGroupRequest>(
        groupId,
        requestData,
      ),
    onSuccess: (data, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["groups", groupId] });
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<CommonResponse, Error, string>({
    mutationFn: (groupId: string) =>
      groupControllerService.delete<CommonResponse>(groupId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useGetUserGroups = () => {
  return useQuery<UserGroupsResponse, Error>({
    queryKey: ["userGroups"],
    queryFn: () => groupControllerService.get<UserGroupsResponse>("me"),
    staleTime: 10 * 1000,
  });
};

export const useJoinGroup = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<CommonResponse, Error, string>({
    mutationFn: (groupId: string) =>
      groupControllerService.post<CommonResponse, null>(
        `${groupId}/members/me`,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useLeaveGroup = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<CommonResponse, Error, string>({
    mutationFn: (groupId: string) =>
      groupControllerService.delete<CommonResponse>(`${groupId}/members/me`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
      if (data.message) showToast(data.message, "success");
    },
  });
};
