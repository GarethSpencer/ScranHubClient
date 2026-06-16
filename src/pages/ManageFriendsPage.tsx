import AddFriendByDisplayNameForm from "../components/AddFriendByDisplayNameForm";
import AddFriendByEmailForm from "../components/AddFriendByEmailForm";
import DeclinedFriendRequests from "../components/DeclinedFriendRequests";
import PendingFriendRequests from "../components/PendingFriendRequests";
import UserFriendTable from "../components/UserFriendTable";

const ManageFriendsPage = () => {
  return (
    <>
      <h2>Find Friends</h2>
      <AddFriendByDisplayNameForm />
      <AddFriendByEmailForm />

      <h2>Manage Requests</h2>
      <PendingFriendRequests showSentRequests={true} />
      <DeclinedFriendRequests />

      <h2>My Friends</h2>
      <UserFriendTable />
    </>
  );
};

export default ManageFriendsPage;
