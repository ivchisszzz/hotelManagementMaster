import { faPlaneArrival } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import Session from "react-session-api";

function NavBar(props) {
  const { loggedUser, isAdmin, isNormalUser, setLoggedUser } =
    useContext(UserContext);
  const navigate = useNavigate();
  const clearContext = () => {
    Session.clear();
    setLoggedUser({});
    navigate("/");
  };

  const isNotLoggedIn = Object.keys(loggedUser).length === 0;
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            VamoosApp
            <FontAwesomeIcon icon={faPlaneArrival} />
          </Navbar.Brand>
          <Nav className="me-auto">
            {!isAdmin && (
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
            )}

            {isNotLoggedIn && (
              <Nav.Link as={Link} to="/loginOrRegister">
                Login or Register
              </Nav.Link>
            )}
            {isAdmin && (
              <>
                <Nav.Link as={Link} to="/create-hotel">
                  Create Hotel
                </Nav.Link>{" "}
                <Nav.Link as={Link} to="/list-hotels">
                  My hotels
                </Nav.Link>
              </>
            )}
            {isNormalUser && (
              <Nav.Link as={Link} to="/list-reservations">
                Reservations
              </Nav.Link>
            )}

            {isNotLoggedIn ? (
              <></>
            ) : (
              <Nav.Link
                as={Link}
                to="/loginOrRegister"
                onClick={() => clearContext()}
              >
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}
export default NavBar;
