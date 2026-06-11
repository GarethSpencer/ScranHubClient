import type { FriendshipStatus } from "../../enums/FriendshipStatus";

export default interface FriendResult {
  userFriendId: string;
  friendId: string;
  initiator: boolean;
  status: FriendshipStatus;
  displayName: string;
  active: boolean;
}
