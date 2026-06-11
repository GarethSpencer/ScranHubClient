export default interface GroupDetailedResult {
  groupId: string;
  groupName: string;
  active: boolean;
  userCount: number;
  venueCount: number;
  createdOn: Date;
  createdBy: string;
  updatedOn?: Date;
  updatedBy?: string;
}
