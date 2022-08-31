import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { HotelContext } from "../App";
import "../css/style.css";

function HotelList(props) {
  const [success, setSuccess] = useState();
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();
  const { setHotelDetails } = useContext(HotelContext);

  const getAllHotelsByUser = () => {
    return axios({
      method: "GET",
      url: `http://localhost:8080/hotels/user/${2}`,
    });
  };
  useEffect(
    () =>
      getAllHotelsByUser()
        .then((response) => {
          if (response.status === 200) {
            setSuccess(true);
            setHotels(response.data);
          }
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        }),
    []
  );
  return (
    <>
      {success &&
        hotels.map((h) => {
          return (
            <>
              <HotelCard className="card">
                <img
                  className="hotel-thumbnail"
                  src={`data:image/${h.extension};base64,${h.imageData}`}
                  alt="img"
                />
                <div className="px-3 flex-grow-1">
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <div className="fw-bold makeup-product-name fs-30">
                        {h.hotelName}
                      </div>
                      <div className="product-brand">{h.location}</div>

                      <div className="product-description">
                        {h.facilities.map((f) => {
                          return <p>{f.facilityName}</p>;
                        })}
                      </div>
                    </div>

                    <div className="product-price fs-6">{h.city}</div>
                  </div>
                </div>
                <Button
                  className="btn btn-primary"
                  onClick={() => {
                    setHotelDetails({
                      hotelId: h.id,
                      city: h.city,
                      facilities: h.facilities,
                      rooms: h.rooms,
                      hotelName: h.hotelName,
                    });
                    navigate("/update/hotel");
                  }}
                >
                  Update
                </Button>
              </HotelCard>
            </>
          );
        })}
    </>
  );
}
export default HotelList;
const HotelCard = styled.div`
  width: 20%;
  display: flex;
  padding: 0 1rem;
  //height: 55vh;
  color: cadetblue;
  margin-top: 2rem;
  margin-left: 2rem;
`;
