import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import TableStatus from "./TableStatus";
import type GroupResult from "../models/results/GroupResult";
import { useGetUserGroups } from "../api/controllerHooks/useGroupController";

const HomePageGroupList = () => {
  const { data: groups, isLoading, isError } = useGetUserGroups();

  const groupResults = (groups?.userGroups ?? []).filter((x) => x.active);

  return (
    <div className="mt-4">
      <h2 className="text-white lead fw-bold mb-3">Your Groups</h2>
      <TableStatus
        isLoading={isLoading}
        isError={isError}
        isEmpty={groupResults.length === 0}
        loadingText="Loading your groups..."
        errorText="Couldn't load your groups. Please try again."
        emptyText="You're not in any groups yet."
      >
        <Container fluid className="px-0">
          <Row className="g-3">
            {groupResults.map((x: GroupResult) => (
              <Col xs={12} md={6} key={x.groupId}>
                <Card
                  as={Link}
                  to={`/group/${x.groupId}`}
                  bg="group"
                  className="text-decoration-none text-white shadow menu-card group-card h-100"
                >
                  <Card.Body className="d-flex align-items-center gap-3">
                    <span className="group-card-avatar flex-shrink-0">
                      {x.groupName.charAt(0).toUpperCase()}
                    </span>
                    <Card.Text className="lead mb-0 text-break flex-grow-1 group-card-name">
                      {x.groupName}
                    </Card.Text>
                    <div className="d-flex flex-column gap-1 flex-shrink-0 text-end small">
                      <span className="group-card-stat">
                        Members: <strong>{x.userCount}</strong>
                      </span>
                      <span className="group-card-stat">
                        Venues: <strong>{x.venueCount}</strong>
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </TableStatus>
    </div>
  );
};

export default HomePageGroupList;
