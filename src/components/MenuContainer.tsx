import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import MenuCard from "../components/MenuCard";
import { FaUserFriends } from "react-icons/fa";
import { RiGroup2Line } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";
import { useGetCurrentUser } from "../api/controllerHooks/useUserController";

const MenuContainer = () => {
  const { data } = useGetCurrentUser();

  let showAdmin = false;

  if (data?.user?.admin) showAdmin = true;

  return (
    <Container fluid>
      <Row className="g-3">
        <Col xs={12} md key={1}>
          <MenuCard
            text="Manage My Friends"
            link="/friends"
            variant="menu1"
            icon={FaUserFriends}
          />
        </Col>
        <Col xs={12} md key={2}>
          <MenuCard
            text="Manage My Groups"
            link="/groups"
            variant="menu2"
            icon={RiGroup2Line}
          />
        </Col>
        {showAdmin && (
          <Col xs={12} md key={3}>
            <MenuCard
              text="Admin"
              link="/admin"
              variant="menu3"
              icon={MdAdminPanelSettings}
            />
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default MenuContainer;
