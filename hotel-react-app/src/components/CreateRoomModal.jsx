import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

function CreateRoomModal(props) {
  const [roomTypes, setRoomTypes] = useState([]);
  const [newRoom, setNewRoom] = useState({
    roomNumber: 0,
    roomType: "",
    roomCharge: 0,
  });
  useEffect(
    () => getAllRoomTypes().then((response) => setRoomTypes(response)),
    []
  );

  const getAllRoomTypes = () => {
    return axios({
      method: "GET",
      url: "http://localhost:8080/rooms/roomTypes",
    }).then((response) => response.data);
  };

  const onRoomFieldChange = (e) => {
    setNewRoom((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSaveClickRoom = () => {
    props.onSaveClick(newRoom);
  };
  return (
    <>
      <Modal show={props.show}>
        <Modal.Header closeButton>
          <Modal.Title>Create room</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <input
              type="text"
              placeholder="Room number"
              name="roomNumber"
              onChange={onRoomFieldChange}
            ></input>
            <input
              type="text"
              placeholder="Room charge"
              name="roomCharge"
              onChange={onRoomFieldChange}
            ></input>
            <input
              type="number"
              placeholder="Room max guests"
              name="maxGuests"
              onChange={onRoomFieldChange}
            ></input>
            <select name="roomType" onChange={onRoomFieldChange}>
              <option selected="selected">Select Type...</option>
              {roomTypes.map((roomType) => (
                <option value={roomType.value}>{roomType.label}</option>
              ))}
            </select>
          </>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={props.onCloseClick}>
            Close Modal
          </Button>
          <Button variant="secondary" onClick={onSaveClickRoom}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default CreateRoomModal;
