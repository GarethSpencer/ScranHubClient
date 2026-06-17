export default interface UserDetailedResult {
  userId: string;
  authId?: string;
  displayName: string;
  active: boolean;
  admin: boolean;
  createdOn: Date;
  createdBy: string;
  updatedOn?: Date;
  updatedBy?: string;
}
