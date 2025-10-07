import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addQueryContext } from "..";

const serviceInitial = {
  ServiceType: "Flight",
  ServiceFromDate: new Date().toISOString().split("T")[0],
  ServiceToDate: new Date().toISOString().split("T")[0],
  ServiceCountry: "",
  FromDestination: "",
  ToDestination: "",
  ViaDestination: "",
  ServiceId: "",
  ClassPreference: "",
  MealChoice: "",
  SeatPreference: "",
  Validity: "",
  EntryType: "",
  VisaName: "",
};

const FlightServices = ({ queryType }) => {

  const { dropdownObject, serviceObject, flightObject } =
    useContext(addQueryContext);
  const { dropdownState } = dropdownObject;
  const [services, setServices] = serviceObject;
  const { flight, setFlight } = flightObject;
  const heightAutoAdjust = queryType;

  useEffect(() => {
    setFlight({
      Type: "Flight",
      ServiceDetails: [serviceInitial],
    });
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    setFlight((prevInsurance) => {
      // Copy the existing ServiceDetails array
      const updatedServiceDetails = [...prevInsurance.ServiceDetails];

      // Update the specific ServiceDetails object at the given index
      updatedServiceDetails[index] = {
        ...updatedServiceDetails[index], // Keep other properties intact
        [name]: value, // Dynamically update the property based on the name attribute
      };

      // Return the updated insurance object with the modified ServiceDetails
      return {
        ...prevInsurance,
        ServiceDetails: updatedServiceDetails, // Ensure only ServiceDetails is updated
      };
    });
  };

  const handleAddForm = () => {
    setFlight((prevFormValue) => {
      const updatedServiceDetails = [...prevFormValue.ServiceDetails];
      updatedServiceDetails.push(serviceInitial);
      return {
        ...prevFormValue,
        ServiceDetails: updatedServiceDetails,
      };
    });
  };

  const handleRemoveForm = (index) => {
    setFlight((prevFormValue) => {
      // Copy the ServiceDetails array
      const updatedServiceDetails = prevFormValue.ServiceDetails.filter(
        (item, idx) => idx !== index // Remove the item at the specified index
      );

      // Return the updated state with the modified ServiceDetails array
      return {
        ...prevFormValue,
        ServiceDetails: updatedServiceDetails,
      };
    });
  };
  const handleFromCalender = (date, index) => {
    const formattedDate = date.toISOString().split("T")[0];

    setFlight((prevFormValue) => {
      const updatedServiceDetails = [...prevFormValue.ServiceDetails];

      // Update the object at the specified index
      updatedServiceDetails[index] = {
        ...updatedServiceDetails[index],
        ServiceFromDate: formattedDate,
      };
      return {
        ...prevFormValue,
        ServiceDetails: updatedServiceDetails,
      };
    });
  };
  const getFromDate = () => {
    return new Date();
    // return formValue?.TravelDateInfo?.FromDate
    //   ? new Date(formValue?.TravelDateInfo?.FromDate)
    //   : null;
  };

  return (
    <div className="row mt-2">
      <div className="col-lg-12">
        <div
          className="card m-0 query-box-height"
          style={{ minHeight: !heightAutoAdjust.includes(1) && "23rem" }}
        >
          <div className="card-header px-2 py-3 d-flex justify-content-between align-items-center gap-1">
            <h4 className="card-title query-title">Flight Services</h4>
          </div>
          <div className="card-body px-2 pb-3 pt-3">
            {flight?.ServiceDetails &&
              flight?.ServiceDetails?.length > 0 &&
              flight?.ServiceDetails.map((data, index) => {
                return (
                  <div
                    className={`row row-gap-3  ${index > 0 ? "border-row my-2" : ""
                      }`}
                  >
                    <div className="col-lg-4 col-md-6 py-1">
                      <label>From Destination</label>

                      <select
                        name="FromDestination"
                        id=""
                        className="form-control form-control-sm form-query p-1"
                        value={data?.FromDestination}
                        onChange={(e) => handleChange(e, index)}
                        style={{ height: "2rem" }}
                      >
                        <option value="">Select</option>
                        {dropdownState?.destinationList &&
                          dropdownState?.destinationList?.length > 0 &&
                          dropdownState?.destinationList.map((data, index) => (
                            <option value={data?.id} key={index}>
                              {data?.Name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-lg-4 col-md-6 py-1">
                      <label>To Destination</label>
                      <select
                        name="ToDestination"
                        id=""
                        className="form-control form-control-sm form-query p-1"
                        value={data?.ToDestination}
                        onChange={(e) => handleChange(e, index)}
                        style={{ height: "2rem" }}
                      >
                        <option value="">Select</option>
                        {dropdownState?.destinationList &&
                          dropdownState?.destinationList?.length > 0 &&
                          dropdownState?.destinationList.map((data, index) => (
                            <option value={data?.id} key={index}>
                              {data?.Name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-lg-4 col-md-6 py-1">
                      <label>Date</label>
                      <DatePicker
                        className="form-control form-control-sm form-query p-1 flight-datepicker"
                        selected={
                          data?.ServiceFromDate
                            ? new Date(data?.ServiceFromDate)
                            : new Date()
                        }
                        onChange={(e) => handleFromCalender(e, index)}
                        dateFormat="dd-MM-yyyy"
                        style={{
                          transform: " translate3d(7px, 80px, 0px)",
                        }}
                        isClearable todayButton="Today"
                      />
                    </div>
                    <div className="col-lg-4 col-md-6 py-1">
                      <label>Airline</label>
                      <select
                        name="Airline"
                        id=""
                        className="form-control form-control-sm form-query "
                        value={data?.Airline}
                        onChange={(e) => handleChange(e, index)}
                        style={{ height: "2rem" }}
                      >
                        <option value="">Select</option>
                        {dropdownState?.airlineList &&
                          dropdownState?.airlineList?.length > 0 &&
                          dropdownState?.airlineList.map((data, index) => (
                            <option value={data?.id} key={index}>
                              {data?.Name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-lg-4 col-md-6 py-1">
                      <label>Meal Choice</label>
                      <select
                        name="MealChoice"
                        id=""
                        className="form-control form-control-sm form-query "
                        value={data?.MealChoice}
                        onChange={(e) => handleChange(e, index)}
                        style={{ height: "2rem" }}
                      >
                        <option value="">Select</option>
                        {dropdownState?.mealChoiceList &&
                          dropdownState?.mealChoiceList?.length > 0 &&
                          dropdownState?.mealChoiceList.map((data, index) => (
                            <option value={data?.id} key={index}>
                              {data?.Name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-lg-4 col-md-6 py-1">
                      <label>Seat Preference</label>
                      <select
                        name="SeatPreference"
                        id=""
                        className="form-control form-control-sm form-query "
                        value={data?.SeatPreference}
                        onChange={(e) => handleChange(e, index)}
                        style={{ height: "2rem" }}
                      >
                        <option value="">Select</option>
                        {dropdownState?.seatPerferenceList &&
                          dropdownState?.seatPerferenceList?.length > 0 &&
                          dropdownState?.seatPerferenceList.map(
                            (data, index) => (
                              <option value={data?.id} key={index}>
                                {data?.Name}
                              </option>
                            )
                          )}
                      </select>
                    </div>

                    <div className="col-lg-4 col-md-6 py-1">
                      <label>Class Preference</label>
                      <select
                        name="ClassPreference"
                        id=""
                        className="form-control form-control-sm form-query "
                        value={data?.ClassPreference}
                        onChange={(e) => handleChange(e, index)}
                        style={{ height: "2rem" }}
                      >
                        <option value="">Select</option>
                        {dropdownState?.classPerferenceList &&
                          dropdownState?.classPerferenceList?.length > 0 &&
                          dropdownState?.classPerferenceList.map(
                            (data, index) => (
                              <option value={data?.id} key={index}>
                                {data?.Name}
                              </option>
                            )
                          )}
                      </select>
                    </div>
                    <div className="col-2 py-1 mt-3">
                      {index === 0 && (
                        <button
                          className="btn btn-primary py-1 px-2 d-flex justify-content-center align-items-center"
                          style={{ borderRadius: "5px", height: "2rem" }}
                          onClick={handleAddForm}
                        >
                          <i
                            class="fa-solid fa-plus"
                            style={{ fontSize: "10px" }}
                          ></i>
                        </button>
                      )}

                      {index > 0 && (
                        <button
                          className="btn btn-primary py-1 px-2 d-flex justify-content-center align-items-center"
                          style={{ borderRadius: "5px", height: "2rem" }}
                          onClick={() => handleRemoveForm(index)}
                        >
                          <i
                            className="fa-solid fa-minus"
                            style={{ fontSize: "10px" }}
                          ></i>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightServices;
