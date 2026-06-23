import { useQuery } from "@tanstack/react-query";
import adminControllerService from "../controllerServices/adminControllerService";
import type PaginationBaseRequest from "../../models/requests/generic/PaginationBaseRequest";
import type SearchUserRequest from "../../models/requests/users/SearchUserRequest";
import type SearchGroupRequest from "../../models/requests/groups/SearchGroupRequest";
import type GetUsersDetailedResponse from "../../models/responses/users/GetUsersDetailedResponse";
import type GetGroupsDetailedResponse from "../../models/responses/groups/GetGroupsDetailedResponse";

export const useGetAllUsers = (request: PaginationBaseRequest) => {
  return useQuery<GetUsersDetailedResponse>({
    queryKey: ["admin", "users", request],
    queryFn: ({ signal }) =>
      adminControllerService.get<GetUsersDetailedResponse>(
        `users?PageNumber=${request.pageNumber}&PageSize=${request.pageSize}`,
        signal,
      ),
    staleTime: 10 * 1000,
  });
};

export const useGetAllGroups = (request: PaginationBaseRequest) => {
  return useQuery<GetGroupsDetailedResponse>({
    queryKey: ["admin", "groups", request],
    queryFn: ({ signal }) =>
      adminControllerService.get<GetGroupsDetailedResponse>(
        `groups?PageNumber=${request.pageNumber}&PageSize=${request.pageSize}`,
        signal,
      ),
    staleTime: 10 * 1000,
  });
};

export const useSearchAllUsers = (request: SearchUserRequest) => {
  return useQuery<GetUsersDetailedResponse>({
    queryKey: ["admin", "users", "search", request],
    queryFn: ({ signal }) =>
      adminControllerService.get<GetUsersDetailedResponse>(
        `users?SearchText=${encodeURIComponent(request.searchText)}&PageNumber=${request.pageNumber}&PageSize=${request.pageSize}`,
        signal,
      ),
    staleTime: 10 * 1000,
    enabled: request.searchText.length >= 3,
  });
};

export const useSearchAllGroups = (request: SearchGroupRequest) => {
  return useQuery<GetGroupsDetailedResponse>({
    queryKey: ["admin", "groups", "search", request],
    queryFn: ({ signal }) =>
      adminControllerService.get<GetGroupsDetailedResponse>(
        `groups?SearchText=${encodeURIComponent(request.searchText)}&PageNumber=${request.pageNumber}&PageSize=${request.pageSize}`,
        signal,
      ),
    staleTime: 10 * 1000,
    enabled: request.searchText.length >= 3,
  });
};
