import { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import useAuth from "../auth/useAuth";
import useDarkMode from "../contexts/darkMode/useDarkMode";
import ApiClient from "../api/apiClient";
import type GetUserResponse from "../models/responses/GetUserResponse";
import { useQuery } from "@tanstack/react-query";

function NavBar() {
  const { logout } = useAuth();
  const { toggleDarkMode } = useDarkMode();
  const apiClient = new ApiClient<GetUserResponse>("/user/me");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userInfo", "me"],
    queryFn: apiClient.get,
  });

  const dropdownText =
    "Logged In: " + (isLoading || isError ? "" : data?.user.displayName);

  const logoutAction = () =>
    logout({ logoutParams: { returnTo: window.location.origin } });

  const [expanded, setExpanded] = useState(false);
  const navRef = useRef<HTMLElement>(null);

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
    <Navbar
      expand="lg"
      bg="primary"
      variant="dark"
      fixed="top"
      expanded={expanded}
      onToggle={setExpanded}
      ref={navRef}
    >
      <Container fluid>
        <Navbar.Brand href="#">ScranHub</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-lg-none">
            <Navbar.Text className="fw-bold">{dropdownText}</Navbar.Text>
            <hr className="dropdown-divider navbar-divider" />
            <Nav.Link role="button" className="text-white navbar-mobile-link">
              My Details
            </Nav.Link>
            <Nav.Link
              role="button"
              className="text-white navbar-mobile-link"
              onClick={() => toggleDarkMode({ type: "SET" })}
            >
              Toggle Dark Mode
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
          <Nav className="ms-auto d-none d-lg-flex">
            <NavDropdown title={dropdownText} id="basic-nav-dropdown">
              <NavDropdown.Item role="button">My Details</NavDropdown.Item>
              <NavDropdown.Item
                role="button"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleDarkMode({ type: "SET" });
                }}
              >
                Toggle Dark Mode
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
  );
}

export default NavBar;
