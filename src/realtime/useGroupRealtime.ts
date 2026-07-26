import { useEffect } from "react";
import useRealtime from "./useRealtime";

const useGroupRealtime = (groupId: string) => {
  const { watchGroup, unwatchGroup } = useRealtime();

  useEffect(() => {
    if (!groupId) return;

    watchGroup(groupId);
    return () => unwatchGroup(groupId);
  }, [groupId, watchGroup, unwatchGroup]);
};

export default useGroupRealtime;
