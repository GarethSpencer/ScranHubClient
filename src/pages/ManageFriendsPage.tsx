import DeclinedFriendRequests from "../components/DeclinedFriendRequests";
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
      <ul>
        <PendingFriendRequests />
        <DeclinedFriendRequests />
      </ul>
      <ul>
        <UserFriendTable />
      </ul>
    </>
  );
};

export default ManageFriendsPage;
