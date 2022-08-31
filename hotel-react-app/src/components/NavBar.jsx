import { faPlaneArrival } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

function NavBar(props) {
  const { loggedUser, setLoggedUser } = useContext(UserContext);
  const clearContext = () => {
    loggedUser.clearContext();
  };
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/home">
            VamoosApp
            <FontAwesomeIcon icon={faPlaneArrival} />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/loginOrRegister">
              Login or Register
            </Nav.Link>
            <Nav.Link as={Link} to="/create-hotel">
              Create Hotel
            </Nav.Link>
            <Nav.Link as={Link} to="/list-reservations">
              ReservationsList
            </Nav.Link>
            <Nav.Link as={Link} to="/list-hotels">
              My hotels
            </Nav.Link>
            {Object.keys(loggedUser).length === 0 ? (
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
