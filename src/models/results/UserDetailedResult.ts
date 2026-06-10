export default interface UserDetailedResult {
  userId: string;
  authId: string;
  displayName: string;
  email: string;
  active: boolean;
  admin: boolean;
  friendCount: number;
  createdOn: Date;
  createdBy: string;
  updatedOn: Date;
  updatedBy: string;
}
