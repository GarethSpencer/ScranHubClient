import type FriendResult from "../../results/FriendResult";
import type CommonPaginationResponse from "../generic/CommonPaginationResponse";

export default interface UserFriendsResponse extends CommonPaginationResponse {
  user?: string;
  friends?: FriendResult[];
}
