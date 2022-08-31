import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import toast from "react-hot-toast";

function ReservationsList(props) {
  const [reservations, setReservations] = useState([]);
  const [success, setSuccess] = useState();
  const getAllReservations = () => {
    axios({
      method: "GET",
      url: `http://localhost:8080/reservations/${1}`,
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
  };
  useEffect(
    () => getAllReservations(),

    []
  );
  // const deleteReservation = (id) => {
  //   axios({
  //     method: "DELETE",
  //     url: `http://localhost:8080/reservations/${id}`,
  //   }).then(() => getAllReservations());
  // };
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
                      <Button
                        className="btn btn-primary"
                        onClick={() => cancelReservation(r.id)}
                      >
                        Cancel
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Container>
    </>
  );
}
export default ReservationsList;
