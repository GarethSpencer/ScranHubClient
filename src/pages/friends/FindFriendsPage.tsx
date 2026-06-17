import AddFriendByDisplayNameForm from "../../components/AddFriendByDisplayNameForm";
import AddFriendByEmailForm from "../../components/AddFriendByEmailForm";

const FindFriendsPage = () => {
  return (
    <>
      <h2>Find Friends</h2>
      <AddFriendByDisplayNameForm />
      <AddFriendByEmailForm />
    </>
  );
};

export default FindFriendsPage;
