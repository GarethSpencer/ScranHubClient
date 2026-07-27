import "./Layout.scss";
import { Outlet } from "react-router-dom";
import LayoutFooter from "../components/layout/LayoutFooter";
import NavBar from "../components/layout/NavBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import useWatchMyGroups from "../realtime/useWatchMyGroups";

const Layout = () => {
  useWatchMyGroups();

  return (
    <div className="main-layout-container">
      <Container fluid>
        <Row>
          <NavBar />
        </Row>
        <Row className="justify-content-center content-wrapper-row">
          <Outlet />
        </Row>
        <LayoutFooter />
      </Container>
    </div>
  );
};

export default Layout;
