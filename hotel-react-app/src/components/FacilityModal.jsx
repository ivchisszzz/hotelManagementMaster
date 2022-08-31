import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function FacilityModal(props) {
  const [facilityToUpdate, setFacilityToUpdate] = useState({
    nameF: props.facilityName,
    chargeF: props.facilityCharge,
  });
  const onFacilityToUpdateFieldChange = (e) => {
    setFacilityToUpdate((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onSaveClick = () => {
    props.onSave(facilityToUpdate);
  };
  return (
    <>
      <Modal show={props.show}>
        <Modal.Header closeButton>
          <Modal.Title>Update facility</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <input
              type="text"
              placeholder="Facility name"
              name="nameF"
              value={facilityToUpdate.nameF}
              onChange={onFacilityToUpdateFieldChange}
            ></input>
            <input
              type="text"
              placeholder="Facility charge"
              name="chargeF"
              value={facilityToUpdate.chargeF}
              onChange={onFacilityToUpdateFieldChange}
            ></input>
          </>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={props.onCloseClick}>
            Close Modal
          </Button>
          <Button variant="secondary" onClick={onSaveClick}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default FacilityModal;
