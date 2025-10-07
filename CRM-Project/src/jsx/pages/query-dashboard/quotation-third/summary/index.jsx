import React, { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import landingImage from "../../../../../images/quotation/landing1.svg";
import icons2 from "../../../../../images/quotation/icons2.svg";
import vector from "../../../../../images/quotation/vector.svg";
import pic4 from "../../../../../images/quotation/pic4.svg";
import pic5 from "../../../../../images/quotation/pic5.svg";
import pic6 from "../../../../../images/quotation/pic6.svg";
import pic7 from "../../../../../images/quotation/pic7.svg";
import { axiosOther } from "../../../../../http/axios_base_url";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "./style.css";
import {
  resetGuideServiceForm,
  resetRestaurantServiceForm,
  resetTransportServiceForm,
} from "../../../../../store/actions/ItineraryServiceAction";
import {
  resetCreateQueryData,
  resetItineraryHeaderDropdown,
  resetItineraryHotelFormValue,
  resetLocalHotelFormValue,
  resetMonumentDayType,
  resetPayloadQueryData,
  resetPolicyData,
  resetQoutationData,
  resetQoutationResponseData,
  resetQoutationSubject,
  resetQueryTravelData,
  resetQueryUpdateData,
  resetQuotationDataOperation,
  setItineraryEditingFalse,
} from "../../../../../store/actions/queryAction";
import {
  resetForeignItineraryActivityData,
  resetForeignItineraryAdditionalData,
  resetForeignItineraryMonumentData,
  resetLocalItineraryActivityData,
  resetLocalItineraryAdditionalData,
  resetLocalItineraryAirData,
  resetLocalItineraryHotelData,
  resetLocalItineraryMealData,
  resetLocalItineraryMonumentData,
  resetLocalItineraryResturantData,
  resetLocalItineraryTrainData,
} from "../../../../../store/actions/itineraryDataAction";

const resetFunctions = [
  resetLocalItineraryMonumentData,
  resetLocalItineraryActivityData,
  resetLocalItineraryAdditionalData,
  resetLocalItineraryTrainData,
  resetLocalItineraryAirData,
  resetLocalItineraryHotelData,
  resetLocalItineraryMealData,
  resetLocalItineraryResturantData,
  resetForeignItineraryMonumentData,
  resetForeignItineraryActivityData,
  resetForeignItineraryAdditionalData,
  resetQoutationData,
  resetPolicyData,
  resetMonumentDayType,
  setItineraryEditingFalse,
  resetItineraryHotelFormValue,
  resetLocalHotelFormValue,
  resetQueryTravelData,
  resetQuotationDataOperation,
  resetCreateQueryData,
  resetPayloadQueryData,
  resetTransportServiceForm,
  resetGuideServiceForm,
  resetRestaurantServiceForm,
  resetQoutationResponseData,
];

const Summary = ({ onBack, onNext }) => {
  const {
    qoutationData,
    queryData,
    qoutationResponseData,
    isItineraryEditing,
  } = useSelector((data) => data?.queryReducer);

  const [summaryList, setSummaryList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getServiceData = async () => {
    if (isItineraryEditing) {
      try {
        const response = await axiosOther.post("listqueryquotation", {
          QueryId: queryData?.QueryAlphaNumId || "",
          QuotationNo: qoutationData?.QuotationNumber || "",
        });
        setSummaryList(response?.data?.data);
      } catch (error) {
        console.log("error-summary");
      }
    } else {
      setSummaryList([qoutationResponseData]);
    }
  };

  useEffect(() => {
    getServiceData();
  }, [qoutationResponseData]);

  const handleNextNavigate = () => {
    resetFunctions.forEach((resetFunction) => {
      dispatch(resetFunction());
    });
    navigate("/query/quotation-list");
  };

  return (
    <div className="row summary p-0 m-0 summary mt-4 ms-1">
      <div className="col-12 container p-0">
        {summaryList &&
          summaryList?.length > 0 &&
          summaryList.map((data, index) => {
            return (
              data?.Days &&
              data?.Days?.length > 0 &&
              data?.Days.map((days, innerIndex) => {
                return (
                  <div className="row" key={`${index}-${innerIndex}`}>
                    <div className="col-md-2 col-4 border-top border-bottom border d-flex justify-content-center align-items-center">
                      <div className="time text-center">
                        <p className="font-w600">
                          DAY {days?.Day} | {days?.DestinationName} <br />
                          <p>
                            {moment(days?.Date).format("DD")}{" "}
                            <span className="font-w500">
                              {moment(days?.Date).format("MMM'YY | ddd")}
                            </span>
                          </p>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-10 col-8   border border p-4">
                      <div className="row">
                        {days?.DayServices?.length > 0 &&
                          days?.DayServices.map((services, serviceIndex) => {
                            return (
                              <>
                                {services?.ServiceType == "Flight" && (
                                  <div className="col-lg-4 col-md-6">
                                    <div className="head">
                                      <span className="font-w500">
                                        Arrival Flight
                                      </span>
                                    </div>
                                    <div className="content row">
                                      <div className="img mr-1 col-1">
                                        <img
                                          src={landingImage}
                                          alt="Airplane Landing"
                                        />
                                      </div>
                                      <div className="col-11">
                                        <p className="border-md-end summary-para">
                                          Arrival Flight
                                          <span className="font-w500">
                                            {services?.FlightNumber}
                                          </span>
                                          (Air India), Flight Class
                                          <span className="font-w500">
                                            {services?.FlightClassName}
                                          </span>
                                          , Destination{" "}
                                          <span className="font-w500">
                                            {services?.FromDestination}
                                          </span>{" "}
                                          to{" "}
                                          <span className="font-w500">
                                            {services?.ToDestination}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {services?.ServiceType == "Monument" && (
                                  <div className="col-lg-4 col-md-6">
                                    <div className="head">
                                      <span className="font-w500">
                                        {services?.ServiceType}
                                      </span>
                                    </div>
                                    <div className="content row">
                                      <div className="img col-1">
                                        <img src={icons2} alt="" />
                                      </div>
                                      {services?.ServiceDetails &&
                                        services?.ServiceDetails.map(
                                          (details, detailsIndex) => {
                                            return (
                                              <div className="col-11">
                                                <p
                                                  className="border-md-end summary-para"
                                                  style={{ fontSize: "0.8rem" }}
                                                >
                                                  Monument Name{" "}
                                                  <span className="font-w500">
                                                    {details?.ItemName}
                                                  </span>{" "}
                                                  <span className="font-w500">
                                                    Laxmi Narayan Temple
                                                  </span>
                                                  , Time{" "}
                                                  <span className="font-w500">
                                                    {
                                                      details?.TimingDetails
                                                        ?.ItemFromTime
                                                    }
                                                  </span>{" "}
                                                  -{" "}
                                                  <span className="font-w500">
                                                    {
                                                      details?.TimingDetails
                                                        ?.ItemToTime
                                                    }
                                                  </span>
                                                </p>
                                              </div>
                                            );
                                          }
                                        )}
                                    </div>
                                  </div>
                                )}
                                {services?.ServiceType == "Hotel" && (
                                  <div className="col-lg-4 col-md-6">
                                    <div className="head">
                                      <span className="font-w500">
                                        {services?.ServiceType}
                                      </span>
                                    </div>
                                    <div className="content row">
                                      <div className="col-1">
                                        <img src={vector} alt="" />
                                      </div>
                                      {services?.ServiceDetails &&
                                        services?.ServiceDetails.map(
                                          (details, detailsIndex) => {
                                            return (
                                              <div className="col-11">
                                                <p className="summary-para">
                                                  <span className="font-w500 summary-para">
                                                    {services?.DestinationName}
                                                  </span>{" "}
                                                  | {details?.ItemCategory}{" "}
                                                  <span className="font-w500 summary-para">
                                                    Star, Meal Plan:{" "}
                                                  </span>
                                                  <span className="font-w500 summary-para">
                                                    {services?.MealPlanName}
                                                  </span>
                                                </p>
                                              </div>
                                            );
                                          }
                                        )}
                                    </div>
                                  </div>
                                )}
                                {services?.ServiceType == "Flight" && (
                                  <div className="col-lg-4 col-md-6">
                                    <div className="head">
                                      <span className="font-w500">
                                        Departure Flight
                                      </span>
                                    </div>
                                    <div className="content row">
                                      <div className="img mr-1 col-1">
                                        <img src={pic4} alt="" />
                                      </div>
                                      <div className="col-11">
                                        <p className="border-md-end summary-para">
                                          Departure Flight{" "}
                                          <span className="font-w500">
                                            {services?.FlightNumber}
                                          </span>{" "}
                                          (Air India), Flight Class{" "}
                                          <span className="font-w500">
                                            {services?.FlightClassName}
                                          </span>
                                          , Destination{" "}
                                          <span className="font-w500">
                                            {services?.FromDestination}
                                          </span>{" "}
                                          to{" "}
                                          <span className="font-w500">
                                            {services?.ToDestination}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {services?.ServiceType == "Activity" && (
                                  <div className="col-lg-4 col-md-6">
                                    <div className="head">
                                      <span className="font-w500">
                                        Activity
                                      </span>
                                    </div>
                                    <div className="content row">
                                      <div className="img col-1">
                                        <img src={pic5} alt="" />
                                      </div>
                                      {services?.ServiceDetails &&
                                        services?.ServiceDetails.map(
                                          (details, detailsIndex) => {
                                            return (
                                              <div className="col-11">
                                                <p className="border-end summary-para">
                                                  <span className="font-w500">
                                                    *{" "}
                                                    {services?.TimingDetails
                                                      ?.ItemFromTime -
                                                      services?.TimingDetails
                                                        ?.ItemToTime}{" "}
                                                    hour - {details?.ItemName}
                                                  </span>
                                                  , {services?.DestinationName},
                                                  Pax Slab:{" "}
                                                  <span className="font-w500">
                                                    {
                                                      services?.PaxDetails
                                                        ?.TotalNoOfPax
                                                    }{" "}
                                                    Pax
                                                  </span>
                                                </p>
                                              </div>
                                            );
                                          }
                                        )}
                                    </div>
                                  </div>
                                )}
                                {services?.ServiceType == "Restaurant" && (
                                  <div className="col-lg-4 col-md-6">
                                    <div className="head">
                                      <span className="font-w500">
                                        Restaurant
                                      </span>
                                    </div>
                                    <div className="content row">
                                      <div className="col-1">
                                        <img src={pic6} alt="" />
                                      </div>
                                      <div className="col-11">
                                        <p className="summary-para">
                                          Restaurant:{" "}
                                          <span className="font-w500">
                                            Indian Accent
                                          </span>
                                          , Meal Type:
                                          <span className="font-w500">
                                            Lunch
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {services?.ServiceType == "Guide" && (
                                  <div className="col-lg-4 col-md-6">
                                    <div className="head">
                                      <span className="font-w500">
                                        {services?.ServiceType}
                                      </span>
                                    </div>
                                    <div className="content row">
                                      <div className="img col-1">
                                        <img src={pic7} alt="" />
                                      </div>
                                      <div className="col-11">
                                        <p className="summary-para">
                                          <span className="font-w500">
                                            German & English Speaking
                                          </span>
                                          <span>, Cost: </span>
                                          <span className="font-w500">
                                            {services?.ServicePrice}
                                          </span>{" "}
                                          for{" "}
                                          <span className="font-w500">
                                            All Pax
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {services?.ServiceType == "Transport" && (
                                  <div className="col-lg-4 col-md-6">
                                    <div className="head">
                                      <span className="font-w500">
                                        {services?.ServiceType}
                                      </span>
                                    </div>
                                    <div className="content row">
                                      <div className="img col-1">
                                        <img src={pic7} alt="" />
                                      </div>
                                      <div className="col-11">
                                        <p className="summary-para">
                                          <span className="font-w500">
                                            German & English Speaking
                                          </span>
                                          <span>, Cost: </span>
                                          <span className="font-w500">
                                            {services?.ServicePrice}
                                          </span>{" "}
                                          for{" "}
                                          <span className="font-w500">
                                            {services?.PaxDetails?.TotalNoOfPax}{" "}
                                            Pax
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                );
              })
            );
          })}
      </div>
      <div className="d-flex justify-content-end m-1 my-2 gap-1">
        <button
          className="btn btn-dark btn-custom-size"
          name="SaveButton"
          onClick={onBack}
        >
          <span className="me-1">Back</span>
          <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
        </button>
        <button
          className="btn btn-primary btn-custom-size"
          name="SaveButton"
          // onClick={handleNextNavigate}
          onClick={onNext}
        >
          <span className="me-1">Next</span>
          <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
        </button>
      </div>
    </div>
  );
};

export default Summary;
