import type { FriendshipStatus } from "../../../enums/FriendshipStatus";

export default interface UpdateUserFriendRequest {
  status: FriendshipStatus;
}
