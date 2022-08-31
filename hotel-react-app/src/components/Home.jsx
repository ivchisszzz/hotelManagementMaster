import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";
import "../css/style.css";
import React from "react";
import { useNavigate } from "react-router";

const getAllHotels = (filters, checkInDate, checkOutDate) => {
  let city = filters.city;
  let maxGuests = filters.maxGuests;
  let checkIn = moment(checkInDate).format("yyyy-MM-DD");
  let checkOut = moment(checkOutDate).format("yyyy-MM-DD");
  return axios({
    method: "GET",
    url: "http://localhost:8080/hotels",
    params: { city, checkIn, checkOut, maxGuests },
  });
};

function Home(props) {
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [hotels, setHotels] = useState([]);
  const [success, setSuccess] = useState();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    city: "",
    maxGuests: "",
  });

  const onFiltersChange = (e) => {
    setFilters((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(
    () =>
      getAllHotels(filters, checkInDate, checkOutDate)
        .then((response) => {
          if (response.status === 200) {
            setSuccess(true);
            setHotels(response.data);
          }
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        }),
    [filters, checkInDate, checkOutDate]
  );

  return (
    <div>
      <div className="image">
        <p className="overlay-text">Book you dream holiday</p>
      </div>
      <Container className="d-flex">
        <Row className="mt-5">
          <div className="card card-body">
            <div className="col-xs-12 ml-auto mr-auto ie-container-width-fix">
              <Row>
                <Col lg={4}>
                  <div className="d-flex">
                    <i className="fa fa-map-marker fa-2x element-icon-text"></i>
                    <input
                      name="city"
                      type="text"
                      className="form-control mr-3"
                      value={filters.city}
                      onChange={onFiltersChange}
                      id="city"
                      placeholder="Type your destination..."
                    />
                  </div>
                </Col>

                <Col sm={4}>
                  <div className="d-flex">
                    <i className="fa fa-calendar fa-2x element-icon"></i>
                    <DatePicker
                      name="checkIn"
                      className="form-control"
                      selected={checkInDate}
                      onChange={(date) => setCheckInDate(date)}
                      minDate={moment().toDate()}
                      id="inputCheckIn"
                      placeholder="Check In"
                    ></DatePicker>
                  </div>
                </Col>

                <Col sm={4}>
                  <div className="d-flex">
                    <i className="fa fa-calendar fa-2x element-icon"></i>
                    <DatePicker
                      name="checkOut"
                      className="form-control"
                      selected={checkOutDate}
                      onChange={(date) => setCheckOutDate(date)}
                      minDate={moment().toDate()}
                      id="inputCheckOut"
                      placeholder="Check Out"
                    ></DatePicker>
                  </div>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col sm={4}>
                  <div className="d-flex form-group">
                    <span>
                      <i className="fa fa-2x fa-user element-icon-text"></i>
                      <input
                        type="number"
                        placeholder="Guests"
                        name="maxGuests"
                        className="form-control tm-select"
                        id="maxGuests"
                        onChange={onFiltersChange}
                      />
                    </span>
                  </div>
                </Col>
                <Col sm={4}>
                  <div className="form-group tm-form-element "></div>
                </Col>
              </Row>
            </div>
          </div>
        </Row>
      </Container>

      {/* <Container> */}
      <div className="hotels">
        <Row className="mt-5">
          {success &&
            hotels.map((h) => {
              return (
                <Col sm={2} className="img-thumbnail mr-2 mb-2" key={h.id}>
                  <div className="grid-hotel-container mb-3">
                    <div className="d-flex" style={{ height: "300px" }}>
                      <img
                        className="hotel-thumbnail img-fluid"
                        src={`data:image/${h.extension};base64,${h.imageData}`}
                        alt="img"
                      />
                    </div>
                    <div className="fw-bold hotel-name py-1">{h.hotelName}</div>
                    <div className="hotel-location">{h.location}</div>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/hotel-details/${h.id}`)}
                  >
                    View more
                  </button>
                </Col>
              );
            })}
        </Row>
      </div>
      {/* </Container> */}
    </div>
  );
}
export default Home;
