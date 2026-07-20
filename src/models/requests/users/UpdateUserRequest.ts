export default interface UpdateUserRequest {
  displayName: string;
  admin: boolean;
  active: boolean;
  googlePlaceId?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
}
