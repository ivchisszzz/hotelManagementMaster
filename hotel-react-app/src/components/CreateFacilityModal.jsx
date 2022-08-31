import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function CreateFacilityModal(props) {
  const [facilityToCreate, setFacilityToCreate] = useState({
    facilityName: "",
    facilityCharge: "",
  });
  const onFacilityToCreateFieldChange = (e) => {
    setFacilityToCreate((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onSaveClick = () => {
    props.onSaveCreate(facilityToCreate);
  };
  return (
    <>
      <Modal show={props.show}>
        <Modal.Header closeButton>
          <Modal.Title>Create facility</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <input
              type="text"
              placeholder="Facility name"
              name="facilityName"
              //   value={facilityToUpdate.nameF}
              onChange={onFacilityToCreateFieldChange}
            ></input>
            <input
              type="text"
              placeholder="Facility charge"
              name="facilityCharge"
              //   value={facilityToUpdate.chargeF}
              onChange={onFacilityToCreateFieldChange}
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
export default CreateFacilityModal;
