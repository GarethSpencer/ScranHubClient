import type { FriendshipStatus } from "../../enum/FriendshipStatus";

export default interface UserFriendResult {
  userFriendId: string;
  userId: string;
  friendId: string;
  status: FriendshipStatus;
}
