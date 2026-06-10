import "./Layout.css";
import { Outlet } from "react-router-dom";
import LayoutFooter from "../components/LayoutFooter";
import NavBar from "../components/NavBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const Layout = () => {
  return (
    <div className="main-layout-container">
      <Container fluid>
        <Row>
          <NavBar />
        </Row>
        <Row>
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Row>
        <LayoutFooter />
      </Container>
    </div>
  );
};

export default Layout;
