import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AddFriendByDisplayNameForm from "../../components/AddFriendByDisplayNameForm";
import AddFriendByEmailForm from "../../components/AddFriendByEmailForm";

const FindFriendsPage = () => {
  return (
    <Row className="g-3 align-items-stretch">
      <Col xs={12} md>
        <AddFriendByEmailForm />
      </Col>
      <Col
        xs={12}
        md="auto"
        className="section-divider d-none d-md-flex"
        aria-hidden="true"
      />
      <Col xs={12} md>
        <AddFriendByDisplayNameForm />
      </Col>
    </Row>
  );
};

export default FindFriendsPage;
