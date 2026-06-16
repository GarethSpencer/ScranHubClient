import { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import useAuth from "../auth/useAuth";
import useDarkMode from "../contexts/darkMode/useDarkMode";
import { useGetCurrentUser } from "../api/controllerHooks/useUserController";
import UserDetailsModal from "./UserDetailsModal";
import DeactivateAccountModal from "./DeactivateAccountModal";
import NotificationIcon from "./NotificationIcon";
import NotificationsModal from "./NotificationsModal";
import { Link } from "react-router-dom";

function NavBar() {
  const { logout } = useAuth();
  const { toggleDarkMode } = useDarkMode();
  const { data, isLoading, isError } = useGetCurrentUser();

  const dropdownText =
    "Logged In: " + (isLoading || isError ? "" : data?.user?.displayName);

  const logoutAction = () =>
    logout({ logoutParams: { returnTo: window.location.origin } });

  const [expanded, setExpanded] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showDeactivateAccountModal, setShowDeactivateAccountModal] =
    useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Navbar
        expand="lg"
        bg="primary"
        variant="dark"
        fixed="top"
        expanded={expanded}
        onToggle={setExpanded}
        ref={navRef}
        className="shadow navbar-fixed"
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            ScranHub
          </Navbar.Brand>
          <NotificationIcon
            pendingFriendships={data?.user?.pendingReceivedFriendshipCount ?? 0}
            className="ms-auto d-lg-none me-4"
            onClick={() => {
              setShowNotificationsModal(true);
              setExpanded(false);
            }}
          />
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-2" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-lg-none">
              <Navbar.Text className="fw-bold">{dropdownText}</Navbar.Text>
              <hr className="dropdown-divider navbar-divider" />
              <Nav.Link
                role="button"
                onClick={() => {
                  setShowUserDetailsModal(true);
                  setExpanded(false);
                }}
                className="text-white navbar-mobile-link"
              >
                My Details
              </Nav.Link>
              <Nav.Link
                role="button"
                className="text-white navbar-mobile-link"
                onClick={() => toggleDarkMode({ type: "SET" })}
              >
                Toggle Dark Mode
              </Nav.Link>
              <Nav.Link
                role="button"
                onClick={() => {
                  setShowDeactivateAccountModal(true);
                  setExpanded(false);
                }}
                className="text-white navbar-mobile-link"
              >
                Deactivate Account
              </Nav.Link>
              <hr className="dropdown-divider navbar-divider" />
              <Nav.Link
                role="button"
                className="text-white navbar-mobile-link"
                onClick={logoutAction}
              >
                Logout
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto d-none d-lg-flex align-items-center">
              <NotificationIcon
                pendingFriendships={
                  data?.user?.pendingReceivedFriendshipCount ?? 0
                }
                className="me-4"
                onClick={() => setShowNotificationsModal(true)}
              />
              <NavDropdown
                title={dropdownText}
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item
                  role="button"
                  onClick={() => {
                    setShowUserDetailsModal(true);
                    setExpanded(false);
                  }}
                >
                  My Details
                </NavDropdown.Item>
                <NavDropdown.Item
                  role="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleDarkMode({ type: "SET" });
                  }}
                >
                  Toggle Dark Mode
                </NavDropdown.Item>
                <NavDropdown.Item
                  role="button"
                  onClick={() => {
                    setShowDeactivateAccountModal(true);
                    setExpanded(false);
                  }}
                >
                  Deactivate Account
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item role="button" onClick={logoutAction}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <NotificationsModal
        showNotificationsModal={showNotificationsModal}
        setShowNotificationsModal={setShowNotificationsModal}
      />
      <UserDetailsModal
        showUserDetailsModal={showUserDetailsModal}
        setShowUserDetailsModal={setShowUserDetailsModal}
      />
      <DeactivateAccountModal
        showDeactivateAccountModal={showDeactivateAccountModal}
        setShowDeactivateAccountModal={setShowDeactivateAccountModal}
      />
    </>
  );
}

export default NavBar;
