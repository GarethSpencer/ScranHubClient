import { useState } from "react";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaPencilAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import AnimatedCount from "./common/AnimatedCount";
import GroupIconModal from "./GroupIconModal";
import type GroupResult from "../models/results/GroupResult";
import { useGetUserGroups } from "../api/controllerHooks/useGroupController";
import { useGetCurrentUser } from "../api/controllerHooks/useUserController";

const HomePageGroupList = () => {
  const { data: groups, isLoading, isError } = useGetUserGroups();
  const { data: currentUser } = useGetCurrentUser();

  const [groupToEditIcon, setGroupToEditIcon] = useState<GroupResult | null>(
    null,
  );

  const currentUserId = currentUser?.user?.userId;
  const groupResults = (groups?.userGroups ?? [])
    .filter((x) => x.active)
    .sort((a, b) => a.groupName.localeCompare(b.groupName));

  let statusMessage: string | null = null;
  if (isError) {
    statusMessage = "Couldn't load your groups. Please try again.";
  } else if (groupResults.length === 0) {
    statusMessage = "You're not in any groups yet.";
  }

  if (isLoading || statusMessage) {
    return (
      <div className="mt-4">
        <h2 className="home-group-heading lead mb-3">My Groups</h2>
        <Container fluid className="px-0">
          <Row className="g-3">
            <Col xs={12} md={6}>
              {isLoading ? (
                <Card
                  bg="group"
                  role="status"
                  className="text-white shadow group-card group-card-skeleton"
                >
                  <Card.Body className="d-flex align-items-center justify-content-center text-center">
                    <Card.Text className="mb-0 fw-medium">
                      Loading groups...
                    </Card.Text>
                  </Card.Body>
                </Card>
              ) : (
                <Card
                  bg="group"
                  className="text-white shadow group-card group-card-status"
                >
                  <Card.Body className="d-flex align-items-center justify-content-center text-center">
                    <Card.Text className="mb-0 fw-medium">
                      {statusMessage}
                    </Card.Text>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  const renderAvatar = (x: GroupResult) => {
    const content = x.icon || x.groupName.charAt(0).toUpperCase();
    const isOwner = x.createdBy === currentUserId;

    if (!isOwner) {
      return <span className="group-card-avatar flex-shrink-0">{content}</span>;
    }

    return (
      <OverlayTrigger overlay={<Tooltip>Set group icon</Tooltip>}>
        <button
          type="button"
          className="group-card-avatar group-card-avatar-button flex-shrink-0"
          aria-label="Set group icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setGroupToEditIcon(x);
          }}
        >
          {content}
          <span className="group-card-avatar-edit-badge" aria-hidden="true">
            <FaPencilAlt />
          </span>
        </button>
      </OverlayTrigger>
    );
  };

  return (
    <div className="mt-4">
      <h2 className="home-group-heading lead mb-3">My Groups</h2>
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
                  {renderAvatar(x)}
                  <div className="flex-grow-1 min-width-0">
                    <Card.Text className="lead mb-0 text-break group-card-name">
                      {x.groupName}
                    </Card.Text>
                    {(x.venuesToRate ?? 0) > 0 && (
                      <Badge bg="danger" pill className="group-card-to-rate">
                        <AnimatedCount value={x.venuesToRate ?? 0} />
                        {x.venuesToRate === 1
                          ? " Venue to Rate"
                          : " Venues to Rate"}
                      </Badge>
                    )}
                  </div>
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

      <GroupIconModal
        group={groupToEditIcon}
        onHide={() => setGroupToEditIcon(null)}
      />
    </div>
  );
};

export default HomePageGroupList;
