import DeclinedFriendRequests from "../../components/DeclinedFriendRequests";
import PendingFriendRequests from "../../components/PendingFriendRequests";

const ManageRequestsPage = () => {
  return (
    <>
      <h2>Manage Requests</h2>
      <PendingFriendRequests showSentRequests={true} />
      <DeclinedFriendRequests />
    </>
  );
};

export default ManageRequestsPage;
