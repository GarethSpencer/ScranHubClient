import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "../../contexts/toast/useToast";
import userControllerService from "../controllerServices/userControllerService";
import type GetUserDetailedResponse from "../../models/responses/users/GetUserDetailedResponse";
import type GetUserResponse from "../../models/responses/users/GetUserResponse";
import type GetUsersResponse from "../../models/responses/users/GetUsersResponse";
import type CreateUserRequest from "../../models/requests/users/CreateUserRequest";
import type AddUserResponse from "../../models/responses/users/AddUserResponse";
import type CommonResponse from "../../models/responses/generic/CommonResponse";
import type UpdateUserRequest from "../../models/requests/users/UpdateUserRequest";
import type UserFriendsResponse from "../../models/responses/users/UserFriendsResponse";
import type AddUserFriendResponse from "../../models/responses/users/AddUserFriendResponse";
import type AddFriendRequest from "../../models/requests/users/AddFriendRequest";
import type UpdateUserFriendRequest from "../../models/requests/users/UpdateUserFriendRequest";
import type PaginationBaseRequest from "../../models/requests/generic/PaginationBaseRequest";

export const useGetCurrentUser = () => {
  return useQuery<GetUserDetailedResponse, Error>({
    queryKey: ["currentUser"],
    queryFn: () => userControllerService.get<GetUserDetailedResponse>("me"),
    staleTime: 10 * 1000,
  });
};

export const useGetUser = (userId: string) => {
  return useQuery<GetUserResponse, Error>({
    queryKey: ["users", userId],
    queryFn: () => userControllerService.get<GetUserResponse>(userId),
    staleTime: 10 * 1000,
  });
};

export const useSearchUsers = (searchText: string) => {
  return useQuery<GetUsersResponse>({
    queryKey: ["users", "search", searchText],
    queryFn: () =>
      userControllerService.get<GetUsersResponse>(
        `?SearchText='${searchText}'`,
      ),
    staleTime: 10 * 1000,
  });
};

export const useCreateUser = () => {
  const { showToast } = useToast();

  return useMutation<AddUserResponse, Error, CreateUserRequest>({
    mutationFn: (requestData: CreateUserRequest) =>
      userControllerService.post<AddUserResponse, CreateUserRequest>(
        undefined,
        requestData,
      ),
    onSuccess: (data) => {
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useUpdateUser = (
  userId: string,
  options?: { skipInvalidation?: boolean },
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<CommonResponse, Error, UpdateUserRequest>({
    mutationFn: (requestData: UpdateUserRequest) =>
      userControllerService.patch<CommonResponse, UpdateUserRequest>(
        userId,
        requestData,
      ),
    onSuccess: (data) => {
      if (!options?.skipInvalidation) {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        queryClient.invalidateQueries({ queryKey: ["users", userId] });
      }
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<CommonResponse, Error, string>({
    mutationFn: (userId: string) =>
      userControllerService.delete<CommonResponse>(userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useGetFriends = (request: PaginationBaseRequest) => {
  return useQuery<UserFriendsResponse, Error>({
    queryKey: ["friends", request],
    queryFn: () =>
      userControllerService.get<UserFriendsResponse>(
        `me/friends?PageNumber=${request.pageNumber}&PageSize=${request.pageSize}`,
      ),
    staleTime: 10 * 1000,
  });
};

export const useAddFriend = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<AddUserFriendResponse, Error, string>({
    mutationFn: (friendId: string) =>
      userControllerService.post<AddUserFriendResponse, null>(
        `me/friends/${friendId}`,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useAddFriendByEmail = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<CommonResponse, Error, AddFriendRequest>({
    mutationFn: (requestData: AddFriendRequest) =>
      userControllerService.post<CommonResponse, AddFriendRequest>(
        "me/friends",
        requestData,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useUpdateFriend = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    CommonResponse,
    Error,
    { friendId: string; requestData: UpdateUserFriendRequest }
  >({
    mutationFn: ({ friendId, requestData }) =>
      userControllerService.patch<CommonResponse, UpdateUserFriendRequest>(
        `me/friends/${friendId}`,
        requestData,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      if (data.message) showToast(data.message, "success");
    },
  });
};

export const useDeleteFriend = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<CommonResponse, Error, string>({
    mutationFn: (userFriendId: string) =>
      userControllerService.delete<CommonResponse>(
        `me/friends/${userFriendId}`,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      if (data.message) showToast(data.message, "success");
    },
  });
};
