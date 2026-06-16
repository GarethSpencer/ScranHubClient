import PendingFriendRequests from "../components/PendingFriendRequests";
import UserFriendTable from "../components/UserFriendTable";

const ManageFriendsPage = () => {
  return (
    <>
      <h2>Find Friends</h2>
      <ul>
        <li>Search by displayname (and send request)</li>
        <li>Send request by email</li>
      </ul>
      <h2>Manage Friend Requests</h2>
      <ul>
        <PendingFriendRequests />
        <li>Rejected requests (to)</li>
      </ul>
      <ul>
        <UserFriendTable />
      </ul>
    </>
  );
};

export default ManageFriendsPage;
