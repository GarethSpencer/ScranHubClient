import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import MenuCard from "../components/MenuCard";
import { sections } from "../navigation/sections";
import { useGetCurrentUser } from "../api/controllerHooks/useUserController";
import HomePageGroupList from "./HomePageGroupList";

const MenuContainer = () => {
  const { data: currentUser } = useGetCurrentUser();

  const isAdmin = currentUser?.user?.admin ?? false;
  const visibleSections = sections.filter(
    (section) => !section.adminOnly || isAdmin,
  );

  return (
    <>
      <Container fluid>
        <Row className="g-3">
          {visibleSections.map((section) => (
            <Col xs={12} md key={section.path}>
              <MenuCard
                text={section.cardText}
                link={section.path}
                variant={section.variant}
                icon={section.icon}
              />
            </Col>
          ))}
        </Row>
        <HomePageGroupList />
      </Container>
    </>
  );
};

export default MenuContainer;
