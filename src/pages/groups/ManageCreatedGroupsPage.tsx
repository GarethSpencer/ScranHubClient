import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MyGroupTable from "../../components/MyGroupTable";

const ManageCreatedGroupsPage = () => {
  return (
    <Row className="g-3">
      <Col xs={12}>
        <MyGroupTable />
      </Col>
      <Col xs={12}>
        <hr className="my-0" aria-hidden="true" />
      </Col>
      <Col xs={12}>{/* Secondary component to go here */}</Col>
    </Row>
  );
};

export default ManageCreatedGroupsPage;
