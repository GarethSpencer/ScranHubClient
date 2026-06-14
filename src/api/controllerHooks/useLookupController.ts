import { useQuery } from "@tanstack/react-query";
import lookupControllerService from "../controllerServices/lookupControllerService";
import type FriendshipStatusResult from "../../models/results/FriendshipStatusResult";

export const useGetFriendshipStatuses = () => {
  return useQuery<FriendshipStatusResult[], Error>({
    queryKey: ["friendshipStatuses"],
    queryFn: () =>
      lookupControllerService.get<FriendshipStatusResult[]>(
        "friendship-statuses",
      ),
    staleTime: 10 * 1000,
  });
};
