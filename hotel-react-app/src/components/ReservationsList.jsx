import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { UserContext } from "../App";

function ReservationsList(props) {
  const { hotelId } = useParams();
  const [reservations, setReservations] = useState([]);
  const [success, setSuccess] = useState();
  const { isAdmin, loggedUser } = useContext(UserContext);
  const getAllReservations = useCallback(() => {
    axios({
      method: "GET",
      url: `http://localhost:8080/reservations/${loggedUser.id}`,
    })
      .then((response) => {
        if (response.status === 200) {
          setSuccess(true);
          setReservations(response.data);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, [loggedUser.id]);

  const getAllReservationsForHotel = useCallback(() => {
    axios({
      method: "GET",
      url: `http://localhost:8080/hotels/${hotelId}/reservations`,
    })
      .then((response) => {
        if (response.status === 200) {
          setSuccess(true);
          setReservations(response.data);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, [hotelId]);

  useEffect(() => {
    isAdmin ? getAllReservationsForHotel() : getAllReservations();
  }, [getAllReservations, getAllReservationsForHotel, isAdmin]);

  const cancelReservation = (id) => {
    axios({
      method: "PUT",
      url: `http://localhost:8080/reservations/${id}`,
    })
      .then(() => getAllReservations())
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <>
      <Container>
        <Table className="table  mt-3" style={{ color: "white" }}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Hotel name</th>
              <th>Phone</th>
              <th>Room type</th>
              <th>Total</th>
              <th>CheckIn</th>
              <th>CheckOut</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {success &&
              reservations.map((r) => {
                return (
                  <tr>
                    <td>{r.firstName}</td>
                    <td>{r.lastName}</td>
                    <td>{r.hotelName}</td>
                    <td>{r.phone}</td>
                    <td>{r.roomType}</td>
                    <td>{r.total}</td>
                    <td>{r.checkInDate}</td>
                    <td>{r.checkOutDate}</td>
                    <td>{r.status}</td>
                    <td>
                      {(r.status === "ONGOING" || isAdmin) && (
                        <Button
                          className="btn btn-primary"
                          onClick={() => cancelReservation(r.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Container>
      {success && reservations.length === 0 && (
        <h2 className="text-center">No reservations found!</h2>
      )}
    </>
  );
}
export default ReservationsList;
