import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import RightNewArrow from "../../../../images/quotationFour/rightNewArrow.svg";
import LeftNewArrow from "../../../../images/quotationFour/leftNewArrow.svg";
import MiniClose from "../../../../images/quotationFour/sliderInnerClose.svg";
import HotelIcon from "../../../../images/quotationFour/hotelNew.svg";
import MonumentIcon from "../../../../images/quotationFour/MonumentNew.svg";
import GuideIcon from "../../../../images/quotationFour/GuideNew.svg";
import ActivityIcon from "../../../../images/quotationFour/ActivityNew.svg";
import RestaurantIcon from "../../../../images/quotationFour/RestaurantNew.svg";
import TransportIcon from "../../../../images/quotationFour/TransportNew.svg";
import FlightIcon from "../../../../images/quotationFour/FlightNew.svg";
import TrainIcon from "../../../../images/quotationFour/TrainNew.svg";
import AdditionalIcon from "../../../../images/quotationFour/Additional.svg";
import M from "../../../../images/quotationFour/m.svg";
import S from "../../../../images/quotationFour/s.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getQuotationDataFromApi } from "./utils/helper.method";

const CustomArrow = ({ onClick, direction }) => (
  <button
    onClick={onClick}
    className="sliderButtons"
    style={{
      border: "none",
      position: "absolute",
      transform: "translateY(-50%)",
      padding: "2px",
      top: "50%",
      [direction === "left" ? "left" : "right"]: "-20px",
      zIndex: 2,
    }}
  >
    {direction === "left" ? (
      <img src={LeftNewArrow} alt="LeftNewArrow" />
    ) : (
      <img src={RightNewArrow} alt="RightNewArrow" />
    )}
  </button>
);

const FinalQoutation = () => {
  const navigate = useNavigate();
  const QueryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  const [quotationFourData, setQuotationFourData] = useState([]);
  const [dayWiseFormValue, setDayWiseFormValue] = useState([
    {
      "Day 1": {
        hotels: [],
        monuments: [],
        guide: [],
        activity: [],
        restaurant: [],
        transport: [],
        flight: [],
        train: [],
        additional: [],
      },
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getQuotationDataFromApi(QueryQuotation);
      if (response.length > 0) {
        setQuotationFourData(response);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (quotationFourData?.length > 0) {
      console.log(quotationFourData?.[0]?.Days, "HGFY78");
      const updatedDayWiseFormValue = quotationFourData?.[0]?.Days.map(
        (day) => {
          let hotels = [];
          let monument = [];
          let activity = [];
          let restaurant = [];
          let transport = [];
          let flight = [];
          let train = [];
          let additional = [];

          if (day.DayServices?.length > 0) {
            hotels = day.DayServices.filter(
              (service) => service.ServiceType === "Hotel"
            ).map(
              (service) =>
                `${service.ServiceId}-${service.ServiceDetails[0].ItemName}`
            );

            monument = day.DayServices.filter(
              (service) => service.ServiceType === "Monument"
            ).map((service) => `${service.ServiceId}-${service.ServiceName}`);

            activity = day.DayServices.filter(
              (service) => service.ServiceType === "Activity"
            ).map(
              (service) =>
                `${service.ServiceId}-${service.ServiceDetails[0].ItemName}`
            );

            restaurant = day.DayServices.filter(
              (service) => service.ServiceType === "Restaurant"
            ).map(
              (service) =>
                `${service.ServiceId}-${service.ServiceDetails[0].ItemName}`
            );

            // Transport
            transport = day.DayServices.filter(
              (service) => service.ServiceType === "Transport"
            ).map(
              (service) =>
                `${service.ServiceId}-${service.ServiceDetails[0].ItemName}`
            );

            // Flight
            flight = day.DayServices.filter(
              (service) => service.ServiceType === "Flight"
            ).map(
              (service) =>
                `${service.ServiceId}-${service.ServiceDetails[0].ItemName}`
            );

            // Train
            train = day.DayServices.filter(
              (service) => service.ServiceType === "Train"
            ).map(
              (service) =>
                `${service.ServiceId}-${service.ServiceDetails[0].ItemName}`
            );

            // Additional
            additional = day.DayServices.filter(
              (service) => service.ServiceType === "Additional"
            ).map(
              (service) =>
                `${service.ServiceId}-${service.ServiceDetails[0].ItemName}`
            );
          }

          return {
            [day.DayUniqueId]: {
              hotels: hotels,
              monuments: monument,
              guide: [],
              activity: activity,
              restaurant: restaurant,
              transport: transport,
              flight: flight,
              train: train,
              additional: additional,
              Day: day?.Day,
              DayUniqueId: day?.DayUniqueId,
              DestinationName: day?.DestinationName,
              DestinationId: day?.DestinationId,
              DestinationUniqueId: day?.DestinationUniqueId,
            },
          };
        }
      );
      setDayWiseFormValue(updatedDayWiseFormValue);
    }
  }, [quotationFourData]);

  console.log(dayWiseFormValue, "queryQuotationData");

  const settings = {
    dots: false,
    infinite: false,
    arrows: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,

    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 2, arrows: false },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, arrows: false },
      },
    ],
  };

  return (
    <>
      <Card>
        <Card.Body className="py-0 px-0 mt-3 d-flex align-items-center justify-content-between border-bottom">
          <h3>Day Planning</h3>
          <div className="d-flex gap-3 pb-1" style={{ overflowX: "auto" }}>
            <div className="pax-info">
              <span>Total Nights</span>
              <span>2</span>
            </div>
            <div className="pax-info">
              <span>Adult</span>
              <span>2</span>
            </div>
            <div className="pax-info">
              <span>Child</span>
              <span>2</span>
            </div>
          </div>
        </Card.Body>
      </Card>
      <div className="container py-3 position-relative mt-5 EditSlider">
        <Slider {...settings}>
          {dayWiseFormValue.length > 0 &&
            dayWiseFormValue?.map((item) => {
              const dayData = Object.values(item)[0];
              return (
                <div key={dayData.DayUniqueId} className="p-2 custom-card">
                  <div
                    className="sliderCard"
                    style={{
                      border: "2px solid rgb(221, 221, 221)",
                      borderRadius: "10px",
                      minWidth: "200px",
                    }}
                  >
                    <div className="sliderCard-head text-center px-2 py-3">
                      <h4 className="mb-0">
                        Day {dayData.Day} | {dayData.DestinationName}
                      </h4>
                    </div>

                    {dayData.hotels.length > 0 && (
                      <div className="border-bottom">
                        <h6 className="mb-2 border-bottom px-3 d-flex align-items-center gap-2"><img src={HotelIcon} alt="HotelIcon" style={{ width: "14px" }} />{" "}Hotels </h6>
                        {dayData.hotels.map((hotel, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-start gap-2 mb-2 px-3"
                          >
                            <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                              <span className="d-block ps-4">{hotel}</span>
                              <img src={M} alt="close" className="mt-1" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {dayData.monuments.length > 0 && (
                      <div>
                        <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2"><img src={MonumentIcon} alt="MonumentIcon" style={{ width: "14px" }} />{" "} Monuments</h6>
                        {dayData.monuments.map((monument, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-start gap-2 mb-2 px-3"
                          >
                            <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                              <span className="d-block ps-4">{monument}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {dayData.guide.length > 0 && (
                      <div>
                        <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2"><img src={GuideIcon} alt="GuideIcon" style={{ width: "14px" }} />{" "} Activities</h6>
                        {dayData.guide.map((guide, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-start gap-2 mb-2 px-3"
                          >
                            <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                              <span className="d-block ps-4">{guide}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {dayData.activity.length > 0 && (
                      <div>
                        <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2"><img src={ActivityIcon} alt="ActivityIcon" style={{ width: "14px" }} />{" "} Activities</h6>
                        {dayData.activity.map((activity, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-start gap-2 mb-2 px-3"
                          >
                            <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                              <span className="d-block ps-4">{activity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}


                    {dayData.restaurant.length > 0 && (
                      <div>
                        <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2"><img src={RestaurantIcon} alt="RestaurantIcon" style={{ width: "14px" }} />{" "} Restaurant</h6>
                        {dayData.restaurant.map((restaurant, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-start gap-2 mb-2 px-3"
                          >
                            <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                              <span className="d-block ps-4">{restaurant}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {dayData.transport.length > 0 && (
                      <div>
                        <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2"> <img src={TransportIcon} alt="TransportIcon" style={{ width: "14px" }} />{" "} Transport</h6>
                        {dayData.transport.map((transport, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-start gap-2 mb-2 px-3"
                          >
                            <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                              <span className="d-block ps-4">{transport}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {dayData.flight.length > 0 && (
                      <div>
                        <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2"><img src={FlightIcon} alt="FlightIcon" style={{ width: "14px" }} />{" "}Flights</h6>
                        {dayData.flight.map((flight, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-start gap-2 mb-2 px-3"
                          >
                            <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                              <span className="d-block ps-4">{flight}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {dayData.train.length > 0 && (
                      <div>
                        <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2"><img src={TrainIcon} alt="TrainIcon" style={{ width: "14px" }} />{" "}Trains</h6>
                        {dayData.train.map((train, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-start gap-2 mb-2 px-3"
                          >
                            <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                              <span className="d-block ps-4">{train}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {dayData.additional.length > 0 && (
                      <div>
                        <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2"><img src={AdditionalIcon} alt="AdditionalIcon" style={{ width: "14px" }} />{" "}Additional</h6>
                        {dayData.additional.map((additional, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-start gap-2 mb-2 px-3"
                          >
                            <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                              <span className="d-block ps-4">{additional}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </Slider>
      </div>
      <div className="d-flex align-items-center justify-content-end gap-2 mt-3">
        <button
          className="btn btn-dark btn-custom-size"
          onClick={() => {
            navigate("/query/quotation-four");
          }}
        >
          Back
        </button>
        <button className="btn btn-primary btn-custom-size d-flex flex-shrink-0 flex-grow-0" onClick={() => navigate("/query/quotation-four/costsheet")}>
          Next
          <i
            className="fa-solid fa-backward text-red bg-white p-1 rounded ms-1"
            style={{ transform: "rotate(180deg)" }}
          ></i>
        </button>
      </div>
    </>
  );
};

export default FinalQoutation;
