import {
  faEdit,
  faMinusCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { HotelContext } from "../App";
import CreateFacilityModal from "./CreateFacilityModal";
import CreateRoomModal from "./CreateRoomModal";
import EditRoomModal from "./EditRoomModal";
import FacilityModal from "./FacilityModal";
const getHotel = (id) => {
  return axios({
    method: "GET",
    url: `http://localhost:8080/hotels/${id}`,
  });
};
function UpdateHotel(props) {
  const { hotelDetails } = useContext(HotelContext);
  const [hotel, setHotel] = useState({});
  const [success, setSuccess] = useState();
  const [facilityIdToUpdate, setFacilityIdToUpdate] = useState(null);
  const [roomIdtoUpdate, setRoomIdToUpdate] = useState(null);
  const [show, setShow] = useState(false);
  const [showCreation, setShowCreation] = useState(false);
  const [showCreationModalRoom, setShowCreationModalRoom] = useState(false);
  const navigate = useNavigate();
  const handleShow = (id) => {
    setFacilityIdToUpdate(id);
    setShow(true);
  };

  const handleShowEditRoom = (id) => {
    setRoomIdToUpdate(id);
    setShow(true);
  };

  const handleRemoveFacility = (fName) => {
    setHotel((prevState) => ({
      ...prevState,
      facilities: prevState.facilities.filter(
        (facility) => facility.facilityName !== fName
      ),
    }));
  };

  const handleCreationModal = () => {
    setShowCreation(true);
  };
  const handleCreationRoomModal = () => {
    setShowCreationModalRoom(true);
  };
  const onCloseRoomModalCreateBtn = () => {
    setShowCreationModalRoom(false);
  };

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
  const facilityToUpdate = hotel?.facilities?.find(
    (element) => element.id === facilityIdToUpdate
  );
  const roomToUpdate = hotel?.rooms?.find(
    (element) => element.id === roomIdtoUpdate
  );
  const onCloseModalBtn = () => {
    setShow(false);
    setFacilityIdToUpdate(null);
  };
  const onCloseRoomModalBtn = () => {
    setShow(false);
    setRoomIdToUpdate(null);
  };

  const onCloseModalCreateBtn = () => {
    setShowCreation(false);
  };
  const onModalSave = (facilityModalObj) => {
    setHotel((prevState) => {
      const newFacilities = [...prevState.facilities];
      const facilityUpdateIndex = newFacilities.findIndex(
        (element) => element.id === facilityIdToUpdate
      );
      newFacilities[facilityUpdateIndex] = {
        ...newFacilities[facilityUpdateIndex],
        facilityName: facilityModalObj.nameF,
        facilityCharge: facilityModalObj.chargeF,
      };
      return { ...prevState, facilities: newFacilities };
    });
    onCloseModalBtn();
  };
  //edit
  const onSaveRoomClick = (roomObj) => {
    setHotel((prevState) => {
      const newRoomList = [...prevState.rooms];
      newRoomList.forEach((room) => {
        if (room.id === roomObj.roomId) {
          room.roomCharge = roomObj.roomCharge;
        }
      });
      return { ...prevState, rooms: newRoomList };
    });
    onCloseRoomModalBtn();
  };

  const onSaveCreateRoomClick = (newRoom) => {
    let roomNumberExists = false;
    setHotel((prevState) => {
      const newRoomList = [...prevState.rooms];
      newRoomList.forEach((room) => {
        if (room.roomNumber === newRoom.roomNumber) {
          roomNumberExists = true;
          toast.error("There is already room with this number!");
        }
      });
      if (!roomNumberExists) {
        newRoomList.push(newRoom);
      }

      return { ...prevState, rooms: newRoomList };
    });
    if (!roomNumberExists) {
      onCloseRoomModalCreateBtn();
    }
  };

  const onModalCreationSave = (newFacilityObject) => {
    setHotel((prevState) => {
      const newFacilityArray = [...prevState.facilities];
      newFacilityArray.push(newFacilityObject);
      return { ...prevState, facilities: newFacilityArray };
    });
    onCloseModalCreateBtn();
  };
  const onHotelFieldChange = (e) => {
    setHotel((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onEditHotelClick = (e) => {
    e.preventDefault();
    axios({
      method: "PUT",
      url: `http://localhost:8080/hotels/${hotel.id}`,
      data: hotel,
    }).then(() => {
      navigate("/home");
    });
  };
  return (
    <>
      <Container>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Hotel name</Form.Label>
            <Form.Control
              type="name"
              value={hotel.hotelName}
              name="hotelName"
              onChange={onHotelFieldChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="name"
              value={hotel.location}
              name="location"
              onChange={onHotelFieldChange}
            />
          </Form.Group>
          <table className="table mt-3" style={{ color: "white" }}>
            <thead>
              <tr>
                <th scope="col">Facility name</th>
                <th scope="col">Facility charge</th>
                <th></th>
                <th>
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    onClick={handleCreationModal}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {hotel?.facilities?.map((f) => (
                <tr>
                  <td>{f.facilityName}</td>
                  <td>{f.facilityCharge}</td>
                  <td>
                    <FontAwesomeIcon
                      onClick={() => handleShow(f.id)}
                      icon={faEdit}
                    />
                  </td>
                  {!f.id ? (
                    <td>
                      <FontAwesomeIcon
                        onClick={() => handleRemoveFacility(f.facilityName)}
                        icon={faMinusCircle}
                      />
                    </td>
                  ) : (
                    <td></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <table className="table mt-5" style={{ color: "white" }}>
            <thead>
              <tr>
                <th scope="col">Room number</th>
                <th scope="col">Room type</th>
                <th scope="col">Room charge</th>
                <th>
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    onClick={handleCreationRoomModal}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {hotel?.rooms?.map((r) => (
                <tr>
                  <td>{r.roomNumber}</td>
                  <td>{r.roomType}</td>
                  <td>{r.roomCharge}</td>
                  <td>
                    <FontAwesomeIcon
                      onClick={() => handleShowEditRoom(r.id)}
                      icon={faEdit}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Button variant="primary" type="submit" onClick={onEditHotelClick}>
            Edit hotel
          </Button>
        </Form>
      </Container>
      {facilityToUpdate && (
        <FacilityModal
          show={show}
          facilityName={facilityToUpdate.facilityName}
          facilityCharge={facilityToUpdate.facilityCharge}
          facilityId={facilityIdToUpdate}
          onCloseClick={onCloseModalBtn}
          onSave={onModalSave}
        />
      )}
      <CreateFacilityModal
        show={showCreation}
        onCloseClick={onCloseModalCreateBtn}
        onSaveCreate={onModalCreationSave}
      />
      {roomToUpdate && (
        <EditRoomModal
          show={show}
          roomId={roomIdtoUpdate}
          roomNumber={roomToUpdate.roomNumber}
          roomCharge={roomToUpdate.roomCharge}
          roomType={roomToUpdate.roomType}
          onCloseClick={onCloseRoomModalBtn}
          onSaveRoomClick={onSaveRoomClick}
        />
      )}
      <CreateRoomModal
        show={showCreationModalRoom}
        onCloseClick={onCloseRoomModalCreateBtn}
        onSaveClick={onSaveCreateRoomClick}
      ></CreateRoomModal>
    </>
  );
}
export default UpdateHotel;
