import axios from "axios";
import { useEffect, useState } from "react";
import { Carousel, Col, Form, ListGroup, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import "../css/style.css";
import DatePicker from "react-datepicker";
import moment from "moment";
import { useContext } from "react";
import { HotelContext } from "../App";

import { useNavigate } from "react-router";

const getHotel = (id) => {
  return axios({
    method: "GET",
    url: `http://localhost:8080/hotels/${id}`,
  });
};

const getAvailableRooms = (filters, id) => {
  let maxGuests = filters.maxGuests;
  let checkIn = moment(filters.checkInDate).format("yyyy-MM-DD");
  let checkOut = moment(filters.checkOutDate).format("yyyy-MM-DD");
  return axios({
    method: "GET",
    url: "http://localhost:8080/rooms",
    params: { id, checkIn, checkOut, maxGuests },
  });
};

function HotelDetails(props) {
  const [hotel, setHotel] = useState();
  const [success, setSuccess] = useState();
  const [filters, setFilters] = useState({
    checkInDate: new Date(),
    checkOutDate: new Date(),
    maxGuests: "",
  });
  const navigate = useNavigate();
  const { setHotelDetails } = useContext(HotelContext);
  const [rooms, setRooms] = useState();
  const onFiltersChange = (e) => {
    setFilters((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onDateChange = (name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const { id } = useParams();

  useEffect(
    () =>
      getHotel(id)
        .then((response) => {
          if (response.status === 200) {
            setHotel(response.data);
            setSuccess(true);
          }
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        }),
    [id]
  );

  useEffect(
    () =>
      getAvailableRooms(filters, id)
        .then((response) => {
          if (response.status === 200) {
            setRooms(response.data);
            setSuccess(true);
          }
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        }),
    [filters, id]
  );
  return (
    <>
      <Row className="details-hotel">
        <Col sm={6} className="d-flex">
          <Carousel>
            {success &&
              hotel?.files.map((f) => {
                return (
                  <Carousel.Item>
                    <img
                      className="d-block w-100 corousel-item"
                      src={`data:image/${f.extension};base64,${f.imageData}`}
                      alt={f.fileName}
                    />
                  </Carousel.Item>
                );
              })}
          </Carousel>
        </Col>
        <Col sm={6} className="details">
          <Row>
            <Form>
              <h2>{hotel?.hotelName}</h2>
              <Form.Group className="mb-3" controlId="formBasicGuests">
                <Form.Label>Number of guests</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Guests"
                  name="maxGuests"
                  onChange={onFiltersChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCheckIn">
                <Form.Label>Check-in date</Form.Label>
                <DatePicker
                  name="checkInDate"
                  className="form-control"
                  selected={filters.checkInDate}
                  onChange={(date) => onDateChange("checkInDate", date)}
                  minDate={moment().toDate()}
                  placeholder="Check In"
                ></DatePicker>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCheckOut">
                <Form.Label>Check-out date</Form.Label>
                <DatePicker
                  name="checkOutDate"
                  className="form-control"
                  selected={filters.checkOutDate}
                  onChange={(date) => onDateChange("checkOutDate", date)}
                  minDate={moment().toDate()}
                  placeholder="Check Out"
                ></DatePicker>
              </Form.Group>
            </Form>
            <Col sm={6}>
              <h4>Facilities</h4>
              <ListGroup variant="flush">
                {success &&
                  hotel?.facilities.map((facility) => {
                    return (
                      <ListGroup.Item>
                        {facility.facilityName} - {facility.facilityCharge}
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup>
              <h4 className="mt-2">Rooms</h4>
              <ListGroup variant="flush">
                {success &&
                  rooms?.map((room) => {
                    return (
                      <ListGroup.Item>
                        {room.roomType} - {room.roomCharge}
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setHotelDetails({ hotelId: id, room, filters });
                            navigate("/reservation-form");
                          }}
                        >
                          Book now
                        </button>
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
export default HotelDetails;
