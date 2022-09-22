import React from "react";
import { useEffect, useState } from "react";
import {
  Button,
  Carousel,
  Col,
  ListGroup,
  Pagination,
  Row,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import "../css/style.css";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import { getHotel } from "./HotelsDetails";
import styled from "styled-components";
import axios from "axios";

const getReservationStatusStatistics = (hotelId) => {
  return axios({
    method: "GET",
    url: `http://localhost:8080/hotels/${hotelId}/status-statistics`,
  });
};

const getReservationStatusMonthlyStatistics = (hotelId, year) => {
  return axios({
    method: "GET",
    url: `http://localhost:8080/hotels/${hotelId}/monthly-statistics?year=${year}`,
  });
};

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

function HotelAdminDetails() {
  const navigate = useNavigate();
  const [hotel, setHotel] = useState();
  const [pieData, setPieData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [success, setSuccess] = useState();
  const [year, setYear] = useState(2022);
  const { id } = useParams();

  useEffect(
    () =>
      getHotel(id)
        .then((response) => {
          if (response.status === 200) {
            setHotel(response.data);
            setSuccess(true);
          }
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        }),
    [id]
  );

  useEffect(
    () =>
      getReservationStatusStatistics(id)
        .then((response) => {
          if (response.status === 200) {
            setPieData(
              response.data
                .filter((stat) => stat.statusCount !== 0)
                .map((stat) => ({
                  name: stat.status,
                  value: stat.statusCount,
                }))
            );
            setSuccess(true);
          }
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        }),
    [id]
  );

  useEffect(
    () =>
      getReservationStatusMonthlyStatistics(id, year)
        .then((response) => {
          if (response.status === 200) {
            setChartData(
              response.data.map((stat) => ({
                name: stat.monthName,
                cancelled: stat.cancelledCount,
                completed: stat.completedCount,
              }))
            );
            setSuccess(true);
          }
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        }),
    [id, year]
  );

  return (
    <>
      <Row className="details-hotel">
        <CustomizedCol sm={4}>
          <h1 className="text-center">{hotel?.hotelName}</h1>
          <Carousel>
            {success &&
              hotel?.files.map((f) => {
                return (
                  <Carousel.Item>
                    <img
                      className="d-block w-100 corousel-item"
                      src={`data:image/${f.extension};base64,${f.imageData}`}
                      alt={f.fileName}
                    />
                  </Carousel.Item>
                );
              })}
          </Carousel>
        </CustomizedCol>
        <Col sm={8} className="details">
          <Row className="mx-2">
            <Col sm="3">
              <h3 className="mt-2">Hotel Details</h3>
              <h4>Address</h4>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  {hotel?.location}, {hotel?.city}
                </ListGroup.Item>
              </ListGroup>
              <h4 className="mt-2">Facilities</h4>
              <ListGroup variant="flush">
                {success &&
                  hotel?.facilities.map((facility) => {
                    return (
                      <ListGroup.Item>
                        {facility.facilityName} - {facility.facilityCharge}$
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup>
              <Button
                className="mt-3"
                variant="secondary"
                onClick={() => navigate("/list-reservations/" + id)}
              >
                Reservations
              </Button>
            </Col>

            <Col sm={9}>
              {pieData.length > 0 && (
                <ListGroup className="mt-2">
                  <h3 className="text-center">All time Statistics</h3>
                  <ChartCentered>
                    <PieChart width={400} height={350}>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx={200}
                        cy={200}
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartCentered>
                </ListGroup>
              )}

              <ListGroup className="mt-4">
                <h3 className="text-center">Monthly Statistics</h3>
                <ChartCentered>
                  <YearContainer>
                    <PaginationStyled>
                      <Pagination.Prev onClick={() => setYear(year - 1)} />
                      <input
                        type="text"
                        disabled
                        className="mx-2"
                        value={year}
                        onChange={() => null}
                        name="year"
                      />
                      <Pagination.Next onClick={() => setYear(year + 1)} />
                    </PaginationStyled>
                  </YearContainer>
                  <LineChart width={800} height={300} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#8884d8"
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cancelled"
                      stroke="#82ca9d"
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartCentered>
              </ListGroup>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
export default HotelAdminDetails;

const ChartCentered = styled(ListGroup.Item)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const CustomizedCol = styled(Col)``;

const YearContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PaginationStyled = styled(Pagination)`
  width: 50%;

  input {
    width: 15%;
  }
`;
