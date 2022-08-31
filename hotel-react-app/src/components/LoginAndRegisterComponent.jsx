import "../css/style.css";
import "react-bootstrap";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlaneArrival } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { UserContext } from "../App";

function LoginAndRegisterComponent(props) {
  const [registerUser, setRegisterUser] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    companyName: "",
    vatNumber: "",
  });
  const [loginUser, setLoginuser] = useState({ email: "", password: "" });
  const { setLoggedUser } = useContext(UserContext);

  const [isPersonal, setIsPersonal] = useState(true);

  let navigate = useNavigate();

  const onLoginFieldChange = (e) => {
    setLoginuser((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onRegisterFieldChange = (e) => {
    setRegisterUser((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitLogin = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "http://localhost:8080/login",
      data: {
        email: loginUser.email,
        password: loginUser.password,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setLoggedUser(response.data);
          navigate("/home");
        }
      })
      .catch((error) => {
        toast(error.response.data.message);
      });
  };
  const clearRegisterForm = () => {
    setRegisterUser({
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      phoneNumber: "",
      companyName: "",
      vatNumber: "",
    });
  };

  const onSubmitRegister = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "http://localhost:8080/register",
      data: {
        firstName: registerUser.firstname,
        lastName: registerUser.lastname,
        username: registerUser.username,
        email: registerUser.email,
        password: registerUser.password,
        phoneNumber: registerUser.phoneNumber,
        companyName: registerUser.companyName,
        vatNumber: registerUser.vatNumber,
        isPersonal: isPersonal,
      },
    })
      .then((response) => {
        if (response) {
          toast.success("User registrated successfully!!");
          clearRegisterForm();
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="section">
      <div className="container">
        <div className="row full-height justify-content-center">
          <div className="col-12 text-center align-self-center py-5">
            <h2>
              VamoosApp
              <FontAwesomeIcon icon={faPlaneArrival} />
            </h2>
            <div className="section pb-5 pt-5 pt-sm-2 text-center">
              <h6 className="mb-0 pb-3">
                <span>Log In </span>
                <span>Sign Up</span>
              </h6>
              <input
                className="checkbox"
                type="checkbox"
                id="reg-log"
                name="reg-log"
              />
              <label htmlFor="reg-log"></label>
              <div className="card-3d-wrap mx-auto" style={{ height: "560px" }}>
                <div className="card-3d-wrapper">
                  <div className="card-front">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">Log In</h4>
                        <div className="form-group">
                          <input
                            type="email"
                            name="email"
                            className="form-style"
                            placeholder="Your Email"
                            id="loginEmail"
                            value={loginUser.email}
                            onChange={onLoginFieldChange}
                          />
                          <i className="input-icon uil uil-at"></i>
                        </div>
                        <div className="form-group mt-2">
                          <input
                            type="password"
                            name="password"
                            className="form-style"
                            placeholder="Your Password"
                            id="loginPass"
                            value={loginUser.password}
                            onChange={onLoginFieldChange}
                          />
                          <i className="input-icon uil uil-lock-alt"></i>
                        </div>
                        <button
                          href="#"
                          id="submitLogin"
                          className="btn mt-4"
                          onClick={onSubmitLogin}
                        >
                          submit
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-back">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">Sign Up</h4>
                        {isPersonal ? (
                          <>
                            <div className="form-group">
                              <input
                                type="text"
                                name="firstname"
                                className="form-style"
                                placeholder="Your First Name"
                                id="firstname"
                                value={registerUser.firstname}
                                onChange={onRegisterFieldChange}
                              />
                              <i className="input-icon uil uil-user"></i>
                            </div>
                            <div className="form-group mt-2">
                              <input
                                type="text"
                                name="lastname"
                                className="form-style"
                                placeholder="Your Last Name"
                                id="lastname"
                                value={registerUser.lastname}
                                onChange={onRegisterFieldChange}
                              />
                              <i className="input-icon uil uil-user"></i>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="form-group">
                              <input
                                type="text"
                                name="companyName"
                                className="form-style"
                                placeholder="Your Company Name"
                                id="lastname"
                                value={registerUser.companyName}
                                onChange={onRegisterFieldChange}
                              />
                              <i className="input-icon uil uil-user"></i>
                            </div>
                            <div className="form-group mt-2">
                              <input
                                type="text"
                                name="vatNumber"
                                className="form-style"
                                placeholder="Your VAT"
                                id="vat"
                                value={registerUser.vatNumber}
                                onChange={onRegisterFieldChange}
                              />
                              <i className="input-icon uil uil-user"></i>
                            </div>
                          </>
                        )}
                        <div className="form-group mt-2">
                          <input
                            type="text"
                            name="username"
                            className="form-style"
                            placeholder="Your username"
                            id="username"
                            value={registerUser.username}
                            onChange={onRegisterFieldChange}
                          />
                          <i className="input-icon uil uil-user"></i>
                        </div>
                        <div className="form-group mt-2">
                          <input
                            type="email"
                            name="email"
                            className="form-style"
                            placeholder="Your Email"
                            id="email"
                            value={registerUser.email}
                            onChange={onRegisterFieldChange}
                          />
                          <i className="input-icon uil uil-at"></i>
                        </div>
                        <div className="form-group mt-2">
                          <input
                            type="password"
                            name="password"
                            className="form-style"
                            placeholder="Your Password"
                            id="password"
                            value={registerUser.password}
                            onChange={onRegisterFieldChange}
                          />
                          <i className="input-icon uil uil-lock-alt"></i>
                        </div>
                        <div className="form-group mt-2">
                          <input
                            type="text"
                            name="phoneNumber"
                            className="form-style"
                            placeholder="Your Phone number"
                            id="phoneNumber"
                            value={registerUser.phoneNumber}
                            onChange={onRegisterFieldChange}
                          />
                          <i className="input-icon uil uil-lock-alt"></i>
                        </div>
                        <div className="form-group mt-2">
                          <input
                            className="mr-2"
                            type="radio"
                            id="personal"
                            name="typeUser"
                            checked={isPersonal}
                            onChange={(e) => setIsPersonal(true)}
                          />
                          <label htmlFor="personal" className="mr-5">
                            Personal
                          </label>
                          <input
                            className="mr-2"
                            type="radio"
                            id="company"
                            name="typeUser"
                            checked={!isPersonal}
                            onChange={(e) => setIsPersonal(false)}
                          />
                          <label htmlFor="company">Company</label>
                        </div>

                        <button
                          id="submitRegister"
                          className="btn mt-4"
                          onClick={onSubmitRegister}
                        >
                          submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginAndRegisterComponent;
