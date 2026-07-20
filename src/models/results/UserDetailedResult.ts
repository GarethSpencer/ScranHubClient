export default interface UserDetailedResult {
  userId: string;
  authId?: string;
  displayName: string;
  email: string;
  active: boolean;
  admin: boolean;
  friendCount: number;
  pendingReceivedFriendshipCount: number;
  googlePlaceId?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
  createdOn: Date;
  createdBy: string;
  updatedOn?: Date;
  updatedBy?: string;
}
