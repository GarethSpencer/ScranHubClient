import DeclinedFriendRequests from "../../components/DeclinedFriendRequests";
import PendingFriendRequests from "../../components/PendingFriendRequests";

const ManageRequestsPage = () => {
  return (
    <>
      <PendingFriendRequests showSentRequests={true} />
      <DeclinedFriendRequests />
    </>
  );
};

export default ManageRequestsPage;
