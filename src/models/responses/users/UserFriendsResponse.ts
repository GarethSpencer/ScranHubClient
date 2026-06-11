import type FriendResult from "../../results/FriendResult";
import type CommonResponse from "../generic/CommonResponse";

export default interface UserFriendsResponse extends CommonResponse {
  user?: string;
  friends?: FriendResult[];
  friendCount?: number;
}
