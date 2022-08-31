
import './App.css';
import LoginAndRegisterComponent from './components/LoginAndRegisterComponent';
import Hotel from './components/Hotel';
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import NavBar from './components/NavBar';
import { Toaster } from 'react-hot-toast';
import HotelList from './components/HotelList';
import Home from './components/Home';
import HotelDetails from './components/HotelsDetails';
import ReservationForm from './components/ReservationForm';
import ReservationsList from './components/ReservationsList';
import UpdateHotel from './components/UpdateHotel';


export const HotelContext = React.createContext();
export const UserContext = React.createContext();
const routes = [
  {
    path: 'home',
    component: <Home />,
    exact: true
  },
  {
    path: 'loginOrRegister',
    component: <LoginAndRegisterComponent />,
    exact: true
  },
  {
    path: "/create-hotel",
    component: <Hotel />,
    exact: true
  },
  {
    path: "/list-hotels",
    component: <HotelList />,
    exact: true
  },
  {
    path: "/hotel-details/:id",
    component: <HotelDetails />,
    exact: true,
  },
  {
    path: "/reservation-form",
    component: <ReservationForm />,
    exact: true
  },
  {
    path: "/list-reservations",
    component: <ReservationsList />,
    exact: true
  },
  {
    path: "/list-hotels",
    component: <HotelList />,
    exact: true
  },
  {
    path: "/update/hotel",
    component: <UpdateHotel />,
    exact: true
  }

]

function App() {

  const getRoutes = () => {
    return routes.map((route, index) => {
      return <Route key={index}
        exact={route.exact}
        path={route.path}
        element={route.component}
      />
    })
  }

  const [hotelDetails, setHotelDetails] = useState({})
  const [loggedUser, setLoggedUser] = useState({})
  return (
    <HotelContext.Provider value={{ hotelDetails, setHotelDetails }}>
      <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
        <Router>
          <NavBar />

          <Routes>
            {getRoutes()}
          </Routes>

          <Toaster />
        </Router>
      </UserContext.Provider>
    </HotelContext.Provider>


  );

}

export default App;
