import type { FriendshipStatus } from "../../../enum/FriendshipStatus";

export default interface UpdateUserFriendRequest {
  status: FriendshipStatus;
}
