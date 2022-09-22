import axios from "axios";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import toast from "react-hot-toast";
import "../css/stepper.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
import styled, { keyframes } from "styled-components";
import { Dropzone, FileItem } from "@dropzone-ui/react";
import { zoomIn } from "react-animations";
import { RegionDropdown } from "react-country-region-selector";
import { UserContext } from "../App";

function Home(props) {
  const { loggedUser } = useContext(UserContext);
  const [room, setRoom] = useState({
    roomCharge: "",
    roomType: "",
    maxGuests: "",
    roomNumber: "",
  });
  const [hotel, setHotel] = useState({
    hotelName: "",
    location: "",
    rooms: [],
    facilities: [],
    images: [],
    city: "",
    userId: loggedUser.id,
  });

  const [facility, setFacility] = useState({
    facilityName: "",
    facilityCharge: "",
  });
  const [step, setStep] = useState("step1");

  const [success, setSuccess] = useState(false);

  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(
    () => getAllRoomTypes().then((response) => setRoomTypes(response)),
    []
  );
  const [files, setFiles] = useState([]);

  const [region, setRegion] = useState(" ");

  const onRegionChange = (value) => {
    setRegion(value);
  };

  const onNextStepClick = async () => {
    switch (step) {
      case "step1":
        if (hotel.hotelName === "") {
          toast.error("Hotel name is required!");
          return;
        }
        if (hotel.location === "") {
          toast.error("Hotel location is required!");
          return;
        }
        const result = await validateHotelName();
        if (result) {
          toast.error("Hotel name already exist! Be more creative!");
        } else {
          setStep("step2");
        }
        break;
      case "step2":
        const validRooms = await validateStep2();
        if (validRooms) {
          setStep("step3");
        } else {
          toast.error("You should add at least one room to your hotel!");
        }
        break;
      case "step3":
        const validFacility = await validateStep3();
        if (validFacility) {
          setStep("step4");
        } else {
          toast.error("You should add at least one facility to your hotel!");
        }
        break;
      case "step4":
        if (files.length === 0) {
          toast.error("You should upload at least one file!");
        } else {
          setStep("step5");
        }

        break;
      default:
        break;
    }
  };
  const validateHotelName = () => {
    return axios({
      method: "GET",
      url: `http://localhost:8080/hotels/name/${hotel.hotelName}`,
    }).then((response) => response.data);
  };
  const validateRoomNumber = () => {
    let valid = false;
    hotel.rooms.forEach((element) => {
      if (element.roomNumber === room.roomNumber) {
        valid = true;
      }
    });
    return valid;
  };
  const getAllRoomTypes = () => {
    return axios({
      method: "GET",
      url: "http://localhost:8080/rooms/roomTypes",
    }).then((response) => response.data);
  };
  const onBackBtnClick = () => {
    if (step === "step2") {
      setStep("step1");
    } else if (step === "step3") {
      setStep("step2");
    } else if (step === "step4") {
      setStep("step3");
    } else {
      setStep("step4");
    }
  };
  const validateStep2 = () => {
    let validRoomNumber = false;
    if (hotel.rooms.length !== 0) {
      validRoomNumber = true;
    }
    return validRoomNumber;
  };
  const validateStep3 = () => {
    let valid = false;
    if (hotel.facilities.length !== 0) {
      valid = true;
    }
    return valid;
  };
  const validateRoom = () => {
    let isValid = false;
    const errors = [];
    if (!room.roomNumber) {
      errors.push("Room number is required!");
    }
    if (!room.roomType) {
      errors.push("Room type is required");
    }
    if (room.roomCharge <= 0) {
      errors.push("Room charge is required to be positive number");
    }
    if (room.maxGuests < 0 || room.maxGuests > 10) {
      errors.push("Max guests should be from 1 to 10");
    }
    if (room.roomNumber !== "") {
      const roomExists = validateRoomNumber();
      if (roomExists) {
        errors.push("Room with this number already exists!");
      }
    }

    if (errors.length === 0) {
      isValid = true;
    } else {
      toast.error(errors.join("\n"));
    }
    return isValid;
  };
  const onAddNewRoomClick = async () => {
    let isValid = await validateRoom();
    if (isValid) {
      let newRoom = {
        roomNumber: room.roomNumber,
        roomCharge: room.roomCharge,
        roomType: room.roomType,
        maxGuests: room.maxGuests,
      };
      setHotel((prevState) => ({
        ...prevState,
        rooms: [...hotel.rooms, newRoom],
      }));
      setRoom({
        roomCharge: "",
        roomType: "",
        maxGuests: 0,
        roomNumber: "",
      });
    }
  };
  const onAddNewFacilityClick = async () => {
    let isValid = await validateFacilities();
    if (isValid) {
      let newFacility = {
        facilityName: facility.facilityName,
        facilityCharge: facility.facilityCharge,
      };
      setHotel((prevState) => ({
        ...prevState,
        facilities: [...hotel.facilities, newFacility],
      }));
      setFacility({
        facilityName: "",
        facilityCharge: 0,
      });
    }
  };

  const onRoomFieldChange = (e) => {
    setRoom((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onHotelFieldChange = (e) => {
    setHotel((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onFacilityFieldChange = (e) => {
    setFacility((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const deleteRoom = (roomNumber) => {
    setHotel((prevState) => ({
      ...prevState,
      rooms: prevState.rooms.filter((r) => r.roomNumber !== roomNumber),
    }));
  };

  const deleteFacility = (facilityName) => {
    setHotel((prevState) => ({
      ...prevState,
      facilities: prevState.facilities.filter(
        (f) => f.facilityName !== facilityName
      ),
    }));
  };

  const validateFacilities = () => {
    let errors = [];
    let valid = false;
    if (facility.facilityName === "") {
      errors.push("Facility name is required!");
    }
    if (facility.facilityCharge <= 0) {
      errors.push("Facility charge should be greater than 0");
    }
    if (errors.length === 0) {
      valid = true;
    } else {
      toast.error(errors.join("\n"));
    }

    return valid;
  };

  const updateFiles = (incommingFiles) => {
    let isFileSizeValid = true;
    incommingFiles.forEach((f) => {
      if (f.file.size > 5242880) {
        toast.error("The file size should be less than 5Mb");
        isFileSizeValid = false;
      }
    });
    if (isFileSizeValid) {
      setFiles(incommingFiles);
      setHotel((prevState) => ({
        ...prevState,
        images: incommingFiles,
      }));
    }
  };

  const onSubmitForm = (e) => {
    e.preventDefault();

    const { images, ...hotelObj } = hotel;
    axios({
      method: "POST",
      url: "http://localhost:8080/hotels",
      data: { ...hotelObj, city: region },
    })
      .then((response) => {
        if (response.status === 200) {
          uploadImages(response.data);
          setSuccess(true);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  const uploadImages = (hotelId) => {
    const imagesData = hotel.images;
    var bodyFormData = new FormData();
    for (let image of imagesData.map((imageData) => imageData.file)) {
      bodyFormData.append("files", image);
    }
    axios({
      method: "POST",
      url: `http://localhost:8080/hotels/${hotelId}/upload`,
      data: bodyFormData,
    }).then((response) => response.data);
  };

  return (
    <>
      <Container>
        <div className="container mt-5">
          <div className="card">
            <div className="form">
              <div className="left-side">
                <div className="left-heading">
                  <h2>Create your new hotel</h2>
                </div>
                <div className="steps-content">
                  {step === "step1" && (
                    <>
                      <h3>
                        Step <span className="step-number">1</span>
                      </h3>
                      <p className="step-number-content active">
                        Enter name and location
                      </p>
                    </>
                  )}
                  {step === "step2" && (
                    <>
                      <h3>
                        Step <span className="step-number">2</span>
                      </h3>
                      <p className="step-number-content">
                        Add rooms to your new hotel
                      </p>
                    </>
                  )}
                  {step === "step3" && (
                    <>
                      <h3>
                        Step <span className="step-number">3</span>
                      </h3>
                      <p className="step-number-content">
                        Create your hotel facilities
                      </p>
                    </>
                  )}
                  {step === "step4" && (
                    <>
                      <h3>
                        Step <span className="step-number">4</span>
                      </h3>
                      <p className="step-number-content">
                        Do you confirm your details?
                      </p>
                    </>
                  )}
                  {step === "step5" && (
                    <>
                      <h3>
                        Step <span className="step-number">5</span>
                      </h3>
                      <p className="step-number-content">Upload you photos</p>
                    </>
                  )}
                </div>
                <ul className="progress-bar">
                  <li className="active">Hotel information</li>
                  {step === "step2" ||
                  step === "step3" ||
                  step === "step4" ||
                  step === "step5" ? (
                    <li className="active">Rooms</li>
                  ) : (
                    <li>Rooms</li>
                  )}
                  {step === "step3" || step === "step4" || step === "step5" ? (
                    <li className="active">Facilities</li>
                  ) : (
                    <li>Facilities</li>
                  )}
                  {step === "step4" || step === "step5" ? (
                    <li className="active">Upload images</li>
                  ) : (
                    <li>Upload images</li>
                  )}
                  {step === "step5" ? (
                    <li className="active">Confirmation</li>
                  ) : (
                    <li>Confirmation</li>
                  )}
                </ul>
              </div>
              <div className="right-side">
                {step === "step1" && (
                  <div className="main active">
                    <small>
                      <i className="fa fa-smile-o"></i>
                    </small>
                    <div className="text">
                      <h2>Enter your hotel information</h2>
                      <p>
                        Enter your hotel information to get closer to growing
                        your business.
                      </p>
                    </div>
                    <div className="input-text">
                      <div className="input-div">
                        <input
                          type="text"
                          required
                          require
                          id="hotel_name"
                          value={hotel.hotelName}
                          onChange={onHotelFieldChange}
                          name="hotelName"
                        />
                        <span>Hotel name</span>
                      </div>
                      <div className="input-div">
                        <input
                          type="text"
                          required
                          value={hotel.location}
                          onChange={onHotelFieldChange}
                          name="location"
                        />
                        <span>Hotel address</span>
                      </div>
                    </div>
                    <div className="input-div">
                      <RegionDropdown
                        country={"Bulgaria"}
                        value={region}
                        name="region"
                        onChange={onRegionChange}
                      />
                    </div>
                    <div className="buttons mt-3">
                      <button
                        className="btn btn-primary tm-btn-search"
                        onClick={onNextStepClick}
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}
                {step === "step2" && (
                  <div className="main active">
                    <small>
                      <i className="fa fa-smile-o"></i>
                    </small>
                    <div className="text">
                      <h2>Add rooms</h2>
                      <p>Create rooms to your newly created hotel</p>
                    </div>
                    <div className="input-text">
                      <div className="input-div">
                        <input
                          type="text"
                          required
                          value={room.roomNumber}
                          name="roomNumber"
                          onChange={onRoomFieldChange}
                        />
                        <span>Room number</span>
                      </div>
                      <div className="input-div">
                        <input
                          type="number"
                          required
                          name="roomCharge"
                          min="1"
                          value={room.roomCharge}
                          style={{ border: 0 }}
                          onChange={onRoomFieldChange}
                        />
                        <span>Room charge</span>
                      </div>
                    </div>
                    <div className="input-text">
                      <div class="input-div">
                        <select
                          value={room.roomType}
                          name="roomType"
                          onChange={onRoomFieldChange}
                        >
                          <option selected="selected">Select Type...</option>
                          {roomTypes.map((roomType) => (
                            <option value={roomType.value}>
                              {roomType.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="input-div">
                        <input
                          type="number"
                          required
                          require
                          value={room.maxGuests}
                          name="maxGuests"
                          min="1"
                          max={10}
                          style={{ border: 0 }}
                          onChange={onRoomFieldChange}
                        />
                        <span>Max Guests</span>
                      </div>
                    </div>
                    <div className="buttons button_space">
                      <button
                        className="btn btn-primary"
                        onClick={onBackBtnClick}
                      >
                        Back
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={onNextStepClick}
                      >
                        Next Step
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={onAddNewRoomClick}
                      >
                        Add room
                      </button>
                    </div>
                    <table className="table table-hover mt-3">
                      <thead>
                        <tr>
                          <th scope="col">Room number</th>
                          <th scope="col">Room charge</th>
                          <th scope="col">Room type</th>
                          <th scope="col">Max guests</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hotel.rooms.map((r) => (
                          <tr>
                            <th scope="row">{r.roomNumber}</th>
                            <td>{r.roomCharge}</td>
                            <td>{r.roomType}</td>
                            <td>{r.maxGuests}</td>
                            <td>
                              <FontAwesomeIcon
                                onClick={() => deleteRoom(r.roomNumber)}
                                icon={faMinusCircle}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {step === "step3" && (
                  <div className="main active">
                    <small>
                      <i className="fa fa-smile-o"></i>
                    </small>
                    <div className="text">
                      <h2>Choose your hotel facilities</h2>
                    </div>
                    <div className="input-text">
                      <div className="input-div">
                        <input
                          type="text"
                          required
                          require
                          value={facility.facilityName}
                          onChange={onFacilityFieldChange}
                          name="facilityName"
                        />
                        <span>Facility name</span>
                      </div>
                      <div className="input-div">
                        <input
                          type="number"
                          required
                          require
                          value={facility.facilityCharge}
                          onChange={onFacilityFieldChange}
                          name="facilityCharge"
                          style={{ border: 0 }}
                          className="mt-3"
                        />
                        <span>Facility charge</span>
                      </div>
                    </div>
                    <div className="buttons button_space">
                      <button
                        className="btn btn-primary"
                        onClick={onBackBtnClick}
                      >
                        Back
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={onNextStepClick}
                      >
                        Next step
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={onAddNewFacilityClick}
                      >
                        Add facility
                      </button>
                    </div>
                    <table className="table table-hover mt-3">
                      <thead>
                        <tr>
                          <th scope="col">Facility name</th>
                          <th scope="col">Facility charge</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hotel.facilities.map((f) => (
                          <tr>
                            <th scope="row">{f.facilityName}</th>
                            <td>{f.facilityCharge}</td>
                            <td>
                              <FontAwesomeIcon
                                onClick={() => deleteFacility(f.facilityName)}
                                icon={faMinusCircle}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {step === "step4" && !success && (
                  <div className="main active">
                    <small>
                      <i className="fa fa-smile-o"></i>
                    </small>
                    <div className="text">
                      <h2>Upload images</h2>
                      <p>Add vision for your hotel</p>
                    </div>
                    <Dropzone
                      onChange={updateFiles}
                      value={files}
                      maxSize={5000000}
                    >
                      {files.map((file) => (
                        <FileItem {...file} preview />
                      ))}
                    </Dropzone>

                    <div className="buttons button_space mt-2">
                      <button
                        className="btn btn-primary"
                        onClick={onBackBtnClick}
                      >
                        Back
                      </button>
                      <button
                        className="btn btn-primary"
                        type="submit"
                        onClick={onNextStepClick}
                      >
                        Next step
                      </button>
                    </div>
                  </div>
                )}
                {step === "step5" && !success && (
                  <div className="main active">
                    <small>
                      <i className="fa fa-smile-o"></i>
                    </small>
                    <div className="text">
                      <h2>Confirmation</h2>
                      <p>Confirm your data details</p>
                    </div>

                    <div className="buttons button_space">
                      <button
                        className="btn btn-primary"
                        onClick={onBackBtnClick}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={onSubmitForm}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
                {success && (
                  <AnimatedDiv className="main active">
                    <div className="text">
                      <h2>Congratulations </h2>
                      <p>
                        <FontAwesomeIcon icon={faCheckCircle}></FontAwesomeIcon>
                        You created your hotel successfully
                      </p>
                    </div>
                  </AnimatedDiv>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
export default Home;

const bounceAnimation = keyframes`${zoomIn}`;

const AnimatedDiv = styled.div`
  animation: 1s ${bounceAnimation};
`;

// const AnimatedForm = styled.form`
//   animation: 1s ${animationForm};
// `;
