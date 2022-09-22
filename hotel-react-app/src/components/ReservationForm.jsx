import axios from "axios";
import { useState } from "react";
import { useContext, useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { HotelContext } from "../App";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import { useCallback } from "react";
import moment from "moment";
import { useNavigate } from "react-router";
const getHotel = (id) => {
  return axios({
    method: "GET",
    url: `http://localhost:8080/hotels/${id}`,
  });
};

function ReservationForm(props) {
  const { hotelDetails } = useContext(HotelContext);
  const [reservation, setReservation] = useState({
    checkIn: " ",
    checkOut: " ",
    firstName: " ",
    lastName: " ",
    email: " ",
    hotelName: " ",
    roomType: " ",
    roomId: " ",
  });
  const [success, setSuccess] = useState();
  const [facilities, setFacilities] = useState([]);
  const navigate = useNavigate();

  const [hotel, setHotel] = useState({
    hotelName: " ",
    location: " ",
  });
  console.log(hotelDetails);
  useEffect(
    () =>
      getHotel(hotelDetails.hotelId)
        .then((response) => {
          if (response.status === 200) {
            setHotel(response.data);
            setSuccess(true);
          }
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        }),
    [hotelDetails.hotelId]
  );
  const onReservationFieldsChange = (e) => {
    setReservation((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onCheckBoxClick = (id, checked) => {
    if (checked) {
      setFacilities([...facilities, id]);
    } else {
      const newFacilities = [...facilities];
      setFacilities(newFacilities.filter((facility) => facility !== id));
    }
  };
  const getTotalValue = useCallback(() => {
    const firstDate = moment(hotelDetails.filters.checkInDate);
    const secondDate = moment(hotelDetails.filters.checkOutDate);
    const days = secondDate.diff(firstDate, "days");
    const charge = days * hotelDetails.room.roomCharge;
    let additionalCharge = 0;
    if (hotel?.facilities?.length > 0) {
      hotel.facilities.forEach((element) => {
        if (facilities.includes(element.id)) {
          additionalCharge += element.facilityCharge;
        }
      });
    }
    const total = charge + additionalCharge;

    return total;
  }, [
    facilities,
    hotel,
    hotelDetails.room.roomCharge,
    hotelDetails.filters.checkInDate,
    hotelDetails.filters.checkOutDate,
  ]);

  const createReservation = (e) => {
    e.preventDefault();
    const checkIn = moment(hotelDetails.filters.checkInDate).format(
      "yyyy-MM-DD"
    );
    const checkOut = moment(hotelDetails.filters.checkOutDate).format(
      "yyyy-MM-DD"
    );
    const nameOfHotel = hotel.hotelName;
    const typeOfRoom = hotelDetails.room.roomType;
    const total = getTotalValue();
    const guests = hotelDetails.room.maxGuests;

    axios({
      method: "POST",
      url: "http://localhost:8080/reservations",
      data: {
        ...reservation,
        hotelName: nameOfHotel,
        roomType: typeOfRoom,
        total: total,
        maxGuests: guests,
        facilitiesList: facilities,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        roomId: hotelDetails.room.id,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          navigate("/list-reservations");
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  // };
  return (
    <>
      <Container>
        <Row>
          <Col sm={6}>
            <div
              className="card mt-4"
              style={{ color: "cadetblue", fontSize: "18px" }}
            >
              <div className="grid-hotel-container mb-3">
                <div className="d-flex">
                  {hotel?.files?.length > 0 && (
                    <img
                      className="hotel-thumbnail h-60 w-100 "
                      src={`data:image/${hotel.files[0].extension};base64,${hotel.files[0].imageData}`}
                      alt="img"
                    />
                  )}
                </div>
                <div className="fw-bold hotel-name py-1">{hotel.hotelName}</div>
                <div className="hotel-location">{hotel.location}</div>
              </div>
            </div>
            <Form.Group className="mb-3" controlId="formBasicCheckIn">
              <Form.Label>Check in</Form.Label>
              <DatePicker
                name="checkIn"
                className="form-control"
                selected={hotelDetails.filters.checkInDate}
                readOnly={true}
              ></DatePicker>
              <Form.Text className="text-muted">14:00 - 17:00</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckOut">
              <Form.Label>Check out</Form.Label>
              <DatePicker
                name="checkOut"
                className="form-control"
                selected={hotelDetails.filters.checkOutDate}
                readOnly={true}
              ></DatePicker>
              <Form.Text className="text-muted">10:00 - 12:00</Form.Text>
            </Form.Group>
          </Col>

          <Col sm={6}>
            {" "}
            <Form onSubmit={createReservation}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  onChange={onReservationFieldsChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicFname">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First name"
                  name="firstName"
                  onChange={onReservationFieldsChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicLname">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last name"
                  name="lastName"
                  onChange={onReservationFieldsChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Phone"
                  name="phone"
                  onChange={onReservationFieldsChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicRoomType">
                <Form.Label>Room type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="roomType"
                  value={hotelDetails.room.roomType}
                  readOnly
                  name="roomType"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCharge">
                <Form.Label>Charge</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="charge"
                  value={hotelDetails.room.roomCharge}
                  readOnly
                  name="roomCharge"
                />
              </Form.Group>

              {success &&
                hotel.facilities.map((f) => {
                  return (
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                      <Checkbox
                        type="checkbox"
                        label={f.facilityName}
                        style={{ left: "0px" }}
                        onClick={(e) => onCheckBoxClick(f.id, e.target.checked)}
                      />
                    </Form.Group>
                  );
                })}
              <Form.Group className="mb-3" controlId="formBasicTotal">
                <Form.Label>Total</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  name="roomCharge"
                  value={getTotalValue()}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="formBasicBtn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="primary"
                  type="submit"
                  onClick={createReservation}
                >
                  Confirm your reservation
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default ReservationForm;

const Checkbox = styled(Form.Check)`
  input {
    left: 20px !important;
  }
`;
