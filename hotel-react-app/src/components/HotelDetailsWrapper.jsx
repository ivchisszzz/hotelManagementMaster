import { useContext } from "react";
import { UserContext } from "../App";
import HotelAdminDetails from "./HotelAdminDetails";
import HotelDetails from "./HotelsDetails";

const HotelDetailsWrapper = () => {
  const { isAdmin } = useContext(UserContext);
  return isAdmin ? <HotelAdminDetails /> : <HotelDetails />;
};

export default HotelDetailsWrapper;
