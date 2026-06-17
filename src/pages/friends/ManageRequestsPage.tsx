import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DeclinedFriendRequests from "../../components/DeclinedFriendRequests";
import PendingFriendRequests from "../../components/PendingFriendRequests";

const ManageRequestsPage = () => {
  return (
    <Row className="g-3 align-items-stretch">
      <Col xs={12} md>
        <PendingFriendRequests showSentRequests={true} />
      </Col>
      <Col xs={12} md="auto" className="section-divider" aria-hidden="true" />
      <Col xs={12} md>
        <DeclinedFriendRequests />
      </Col>
    </Row>
  );
};

export default ManageRequestsPage;
