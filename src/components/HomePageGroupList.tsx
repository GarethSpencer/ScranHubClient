import { useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaPencilAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import TableStatus from "./common/TableStatus";
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
  const groupResults = (groups?.userGroups ?? []).filter((x) => x.active);

  const showStatus = isLoading || isError || groupResults.length === 0;

  if (showStatus) {
    return (
      <div className="mt-4 section-panel">
        <TableStatus
          isLoading={isLoading}
          isError={isError}
          isEmpty={groupResults.length === 0}
          loadingText="Loading groups..."
          errorText="Couldn't load your groups. Please try again."
          emptyText="You're not in any groups yet."
        >
          {null}
        </TableStatus>
      </div>
    );
  }

  const renderAvatar = (x: GroupResult) => {
    const content = x.icon || x.groupName.charAt(0).toUpperCase();
    const isOwner = x.createdBy === currentUserId;

    if (!isOwner) {
      return (
        <span className="group-card-avatar flex-shrink-0">{content}</span>
      );
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
      <TableStatus
        isLoading={isLoading}
        isError={isError}
        isEmpty={groupResults.length === 0}
        loadingText="Loading groups..."
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
                    {renderAvatar(x)}
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

      <GroupIconModal
        group={groupToEditIcon}
        onHide={() => setGroupToEditIcon(null)}
      />
    </div>
  );
};

export default HomePageGroupList;
