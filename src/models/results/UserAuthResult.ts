export default interface UserAuthResult {
  userId: string;
  email: string;
  authId?: string;
  admin: boolean;
  active: boolean;
}
