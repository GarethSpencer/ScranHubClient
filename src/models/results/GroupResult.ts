export default interface GroupResult {
  groupId: string;
  groupName: string;
  active: boolean;
  createdOn: Date;
  createdBy: string;
  displayName: string;
  userCount: number;
  venueCount: number;
  icon?: string;
}
