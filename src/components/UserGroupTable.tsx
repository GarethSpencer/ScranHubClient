import {
  useGetUserGroups,
  useLeaveGroup,
} from "../api/controllerHooks/useGroupController";
import { useGetCurrentUser } from "../api/controllerHooks/useUserController";
import useActingState from "../hooks/useActingState";
import GroupTable from "./GroupTable";

const UserGroupTable = () => {
  const { data, isLoading, isError } = useGetUserGroups();
  const { data: currentUser } = useGetCurrentUser();
  const { mutate, isPending } = useLeaveGroup();

  const { isActing, mutationCallbacks } = useActingState();

  const groups = data?.userGroups ?? [];
  const currentUserId = currentUser?.user?.userId;

  const activeGroups = groups.filter((x) => x.active);
  const joinedGroups = activeGroups.filter(
    (x) => x.createdBy !== currentUserId,
  );
  const createdGroups = activeGroups.filter(
    (x) => x.createdBy === currentUserId,
  );

  const onLeaveGroup = (groupId: string) => {
    mutate(groupId, mutationCallbacks(groupId, "delete"));
  };

  return (
    <>
      <GroupTable
        heading="Groups I've Joined"
        helperText="Groups created by other users. You can leave these at any time."
        groups={joinedGroups}
        isLoading={isLoading}
        isError={isError}
        emptyText="You haven't joined any groups yet"
        showActions
        isLeaving={isPending}
        isActing={isActing}
        onLeaveGroup={onLeaveGroup}
      />
      <GroupTable
        heading="Groups I've Created"
        headingClassName="mt-5"
        helperText="You're added to these automatically when you create them."
        groups={createdGroups}
        isLoading={isLoading}
        isError={isError}
        emptyText="You haven't created any groups yet"
      />
    </>
  );
};

export default UserGroupTable;
