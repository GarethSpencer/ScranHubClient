import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CreateGroupForm from "../../components/CreateGroupForm";
import MyGroupTable from "../../components/MyGroupTable";

const ManageCreatedGroupsPage = () => {
  return (
    <Row className="g-3">
      <Col xs={12}>
        <CreateGroupForm />
      </Col>
      <Col xs={12} className="d-none d-md-block">
        <hr className="section-rule my-0" aria-hidden="true" />
      </Col>
      <Col xs={12}>
        <MyGroupTable />
      </Col>
    </Row>
  );
};

export default ManageCreatedGroupsPage;
