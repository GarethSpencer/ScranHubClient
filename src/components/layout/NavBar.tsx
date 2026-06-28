import { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import useAuth from "../../auth/useAuth";
import useDarkMode from "../../contexts/darkMode/useDarkMode";
import { useGetCurrentUser } from "../../api/controllerHooks/useUserController";
import UserDetailsModal from "./UserDetailsModal";
import DeactivateAccountModal from "./DeactivateAccountModal";
import NotificationIcon from "./NotificationIcon";
import NotificationsModal from "./NotificationsModal";
import { Link, NavLink } from "react-router-dom";
import { sections } from "../../navigation/sections";

function NavBar() {
  const { logout } = useAuth();
  const { state: darkMode, toggleDarkMode } = useDarkMode();
  const { data, isLoading, isError } = useGetCurrentUser();

  const visibleSections = sections.filter(
    (section) => !section.adminOnly || (data?.user?.admin ?? false),
  );

  const dropdownText =
    "Welcome " + (isLoading || isError ? "" : data?.user?.displayName);

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
          <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
            ScranHub
          </Navbar.Brand>
          <Nav className="d-none d-lg-flex me-auto ms-3 align-items-center">
            {visibleSections.map((section) => {
              const Icon = section.icon;
              return (
                <Nav.Link
                  key={section.path}
                  as={NavLink}
                  to={section.path}
                  className="navbar-section-link d-flex align-items-center gap-2"
                >
                  <Icon aria-hidden="true" />
                  {section.label}
                </Nav.Link>
              );
            })}
          </Nav>
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
              {visibleSections.map((section) => {
                const Icon = section.icon;
                return (
                  <Nav.Link
                    key={section.path}
                    as={NavLink}
                    to={section.path}
                    onClick={() => setExpanded(false)}
                    className="text-white navbar-mobile-link d-flex align-items-center gap-2"
                  >
                    <Icon aria-hidden="true" />
                    {section.label}
                  </Nav.Link>
                );
              })}
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
                className="text-white navbar-mobile-link d-flex align-items-center justify-content-between"
                onClick={() => toggleDarkMode({ type: "SET" })}
              >
                <span>Dark Mode</span>
                <Form.Check
                  type="switch"
                  checked={darkMode}
                  readOnly
                  tabIndex={-1}
                  className="ms-2 pe-none navbar-mobile-switch"
                />
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
                  className="d-flex align-items-center justify-content-between"
                >
                  <span>Dark Mode</span>
                  <Form.Check
                    type="switch"
                    checked={darkMode}
                    readOnly
                    tabIndex={-1}
                    className="ms-2 pe-none navbar-desktop-switch"
                  />
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
