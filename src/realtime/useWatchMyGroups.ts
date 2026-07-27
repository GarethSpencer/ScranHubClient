import { useEffect } from "react";
import { useGetUserGroups } from "../api/controllerHooks/useGroupController";
import useRealtime from "./useRealtime";

const useWatchMyGroups = () => {
  const { watchGroup, unwatchGroup } = useRealtime();
  const { data } = useGetUserGroups();

  const groupIdKey = (data?.userGroups ?? [])
    .map((group) => group.groupId)
    .join(",");

  useEffect(() => {
    if (!groupIdKey) return;

    const groupIds = groupIdKey.split(",");
    for (const groupId of groupIds) {
      watchGroup(groupId);
    }

    return () => {
      for (const groupId of groupIds) {
        unwatchGroup(groupId);
      }
    };
  }, [groupIdKey, watchGroup, unwatchGroup]);
};

export default useWatchMyGroups;
