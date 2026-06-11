export const FriendshipStatus = {
  Pending: "Pending",
  Accepted: "Accepted",
  Declined: "Declined",
} as const;

export type FriendshipStatus =
  (typeof FriendshipStatus)[keyof typeof FriendshipStatus];
