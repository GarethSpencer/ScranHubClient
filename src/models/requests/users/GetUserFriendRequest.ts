import type { FriendshipStatus } from "../../../enums/FriendshipStatus";
import type PaginationBaseRequest from "../generic/PaginationBaseRequest";

export default interface GetUserFriendRequest extends PaginationBaseRequest {
  status: FriendshipStatus;
}
