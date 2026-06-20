import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AddGroupByNameForm from "../../components/AddGroupByNameForm";

const FindGroupsPage = () => {
  return (
    <Row className="g-3 align-items-stretch">
      <Col xs={12} md>
        <AddGroupByNameForm />
      </Col>
    </Row>
  );
};

export default FindGroupsPage;
