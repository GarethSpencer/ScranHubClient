import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { BiSolidUser } from "react-icons/bi";

interface Props {
  pendingFriendships: number;
  className?: string;
  onClick: () => void;
}

const NotificationIcon = ({
  pendingFriendships,
  className,
  onClick,
}: Props) => {
  const isAlerting = pendingFriendships > 0;

  return (
    <Navbar.Text className={`d-flex align-items-center ${className ?? ""}`}>
      {isAlerting ? (
        <span
          className="d-flex position-relative"
          role="button"
          onClick={onClick}
        >
          <BiSolidUser className="navbar-dim" size={24} />
          <Badge
            bg="danger"
            pill
            className="position-absolute top-0 start-100 translate-middle"
          >
            {pendingFriendships}
            <span className="visually-hidden">pending friend requests</span>
          </Badge>
        </span>
      ) : (
        <OverlayTrigger
          trigger="click"
          rootClose
          placement="bottom"
          overlay={
            <Tooltip id="notification-info-tooltip">
              You have no pending friend requests.
            </Tooltip>
          }
        >
          <span className="d-flex" role="button">
            <BiSolidUser className="navbar-dim" size={24} />
          </span>
        </OverlayTrigger>
      )}
    </Navbar.Text>
  );
};

export default NotificationIcon;
