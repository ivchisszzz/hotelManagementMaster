import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function EditRoomModal(props) {
  const [roomToUpdate, setRoomToUpdate] = useState({
    roomNumber: props.roomNumber,
    roomCharge: props.roomCharge,
    roomType: props.roomType,
    roomId: props.roomId,
  });
  const onRoomToUpdateFieldChange = (e) => {
    setRoomToUpdate((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <>
      <Modal show={props.show}>
        <Modal.Header closeButton>
          <Modal.Title>Update room</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <input
              type="text"
              name="roomNumber"
              value={roomToUpdate.roomNumber}
              readOnly={true}
            ></input>
            <input
              type="text"
              name="roomType"
              value={roomToUpdate.roomType}
              readOnly={true}
            ></input>
            <input
              type="text"
              name="roomCharge"
              value={roomToUpdate.roomCharge}
              onChange={onRoomToUpdateFieldChange}
            ></input>
          </>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={props.onCloseClick}>
            Close Modal
          </Button>
          <Button
            variant="secondary"
            onClick={() => props.onSaveRoomClick(roomToUpdate)}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default EditRoomModal;
