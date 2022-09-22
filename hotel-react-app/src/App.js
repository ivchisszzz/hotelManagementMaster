import "./App.css";
import LoginAndRegisterComponent from "./components/LoginAndRegisterComponent";
import Hotel from "./components/Hotel";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import { Toaster } from "react-hot-toast";
import HotelList from "./components/HotelList";
import Home from "./components/Home";
import ReservationForm from "./components/ReservationForm";
import ReservationsList from "./components/ReservationsList";
import UpdateHotel from "./components/UpdateHotel";
import HotelDetailsWrapper from "./components/HotelDetailsWrapper";
import Session from 'react-session-api'


export const HotelContext = React.createContext();
export const UserContext = React.createContext();


Session.config(true, 600000000);
function App() {
  const user = Session.get("loggedUser");
  const [hotelDetails, setHotelDetails] = useState({});
  const [loggedUser, setLoggedUser] = useState(user ?? {});


  useEffect(() => {
    const setUser = (data) => {
      if (Object.keys(data).length !== 0) {
        setLoggedUser(JSON.parse(data["loggedUser"]));
      }

    };

    Session.onSet(setUser);
  }, [])

  const isAdmin = loggedUser.role === "HOTEL_ADMIN";
  const isNormalUser = loggedUser.role === "USER";

  const getRoutes = () => {

    let routes = [
      {
        path: "/loginOrRegister",
        component: <LoginAndRegisterComponent />,
        exact: true,
      }, {
        path: "/hotel-details/:id",
        component: <HotelDetailsWrapper />,
        exact: true,
      },
    ];

    if (isAdmin) {
      routes = routes.concat({
        path: "/create-hotel",
        component: <Hotel />,
        exact: true,
      }, {
        path: "/update/hotel",
        component: <UpdateHotel />,
        exact: true,
      },
        {
          path: "/list-reservations/:hotelId",
          component: <ReservationsList />,
          exact: true,
        }, {
        path: "/list-hotels",
        component: <HotelList />,
        exact: true,
      },);
    } else {
      routes = routes.concat({
        path: "/home",
        component: <Home />,
        exact: true,
      }, {
        path: "/",
        component: <Home />,
        exact: true,
      })
    }

    if (isNormalUser) {
      routes = routes.concat({
        path: "/reservation-form",
        component: <ReservationForm />,
        exact: true,
      }, {
        path: "/list-reservations",
        component: <ReservationsList />,
        exact: true,
      },);
    }


    return routes.map((route, index) => {
      return (
        <Route
          key={index}
          exact={route.exact}
          path={route.path}
          element={route.component}
        />
      );
    });
  };


  const noUrlMatch = loggedUser.id ? isAdmin ? "/list-hotels" : "/" : "/loginOrRegister"
  return (
    <HotelContext.Provider value={{ hotelDetails, setHotelDetails }}>
      <UserContext.Provider
        value={{ loggedUser, setLoggedUser, isNormalUser, isAdmin }}
      >
        <Router>
          <NavBar />

          <Routes>{getRoutes()}

            <Route
              path="*"
              element={
                <Navigate to={noUrlMatch} replace />
              }
            />
          </Routes>

          <Toaster />
        </Router>
      </UserContext.Provider>
    </HotelContext.Provider>
  );
}

export default App;
