import type { FriendshipStatus } from "../../enums/FriendshipStatus";

export default interface UserFriendResult {
  userFriendId: string;
  userId: string;
  friendId: string;
  status: FriendshipStatus;
}
