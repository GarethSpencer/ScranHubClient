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

export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<CommonResponse, Error, UpdateUserRequest>({
    mutationFn: (requestData: UpdateUserRequest) =>
      userControllerService.patch<CommonResponse, UpdateUserRequest>(
        userId,
        requestData,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
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
