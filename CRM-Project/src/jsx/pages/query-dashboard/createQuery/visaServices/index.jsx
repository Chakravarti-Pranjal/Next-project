import React, { useContext, useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addQueryContext } from "..";

const serviceInitial = {
  ServiceType: "Visa",
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
  VisaName: ""
};

const VisaServices = ({ queryType }) => {
  const { dropdownObject, serviceObject, visaObject } =
    useContext(addQueryContext);
  const { dropdownState } = dropdownObject;
  const [services, setServices] = serviceObject;
  const { visa, setVisa } = visaObject
  useEffect(() => {
    setVisa({
      Type: 'Visa',
      ServiceDetails: [serviceInitial]
    });
  }, []);
  const heightAutoAdjust = queryType

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    setVisa((prevInsurance) => {

      const updatedServiceDetails = [...prevInsurance.ServiceDetails];
      updatedServiceDetails[index] = {
        ...updatedServiceDetails[index],
        [name]: value,
      };
      return {
        ...prevInsurance,
        ServiceDetails: updatedServiceDetails,
      };
    });
  };

  const handleAddForm = () => {
    setVisa((prevFormValue) => {
      const updatedServiceDetails = [...prevFormValue.ServiceDetails];
      updatedServiceDetails.push(serviceInitial);
      return {
        ...prevFormValue,
        ServiceDetails: updatedServiceDetails,
      };
    });
  };

  const handleRemoveForm = (index) => {
    setVisa((prevFormValue) => {
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
    setVisa((prevFormValue) => {

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
  return (
    <div className="row mt-2">
      <div className="col-lg-12">
        <div className="card m-0 query-box-height" style={{ minHeight: !heightAutoAdjust.includes(1) && '23rem' }}>
          <div className="card-header px-2 py-3 d-flex justify-content-between align-items-center gap-1">
            <h4 className="card-title query-title"> Visa Services</h4>

          </div>
          <div className="card-body px-2 pb-3 pt-3">
            {visa?.ServiceDetails
              && visa?.ServiceDetails?.length > 0 && visa?.ServiceDetails.map((data, index) => {
                return (

                  <div className={`row row-gap-3  ${index > 0 ? 'border-row my-2' : ''}`}>

                    <div className="col-lg-4 col-md-6 py-1">
                      <label className="m-0" style={{ fontSize: '10px' }}>Date</label>
                      <DatePicker
                        className="form-control form-control-sm form-query p-1"
                        selected={data?.ServiceFromDate ? new Date(data?.ServiceFromDate) : new Date()}
                        name="TravelDateInfo.FromDate"
                        onChange={(e) => handleFromCalender(e, index)}
                        dateFormat="dd-MM-yyyy"
                        style={{
                          transform: " translate3d(7px, 80px, 0px)",
                        }}
                        isClearable todayButton="Today"
                      />
                    </div>
                    <div className="col-lg-4 col-md-6 py-1">
                      <label className="m-0" style={{ fontSize: '10px' }}>Country</label>
                      <select
                        name="ServiceCountry"
                        id=""
                        className="form-control form-control-sm form-query p-1 text-truncate"
                        value={data?.ServiceCountry}
                        style={{ height: '2rem' }}
                        onChange={(e) => handleChange(e, index)}
                      >
                        <option value="">Select</option>
                        {dropdownState?.countryList && dropdownState?.countryList?.length > 0 && dropdownState?.countryList.map((data, index) => (
                          <option value={data?.id}>{data?.Name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-lg-4 col-md-6 py-1">
                      <label className="m-0" style={{ fontSize: '10px' }}>Visa Name</label>
                      <select
                        name="VisaName"
                        id=""
                        className="form-control form-control-sm form-query "
                        value={data?.VisaName}
                        style={{ height: '2rem' }}
                        onChange={(e) => handleChange(e, index)}
                      >
                        <option value="">Select</option>
                        {dropdownState?.visaList && dropdownState?.visaList?.length > 0 && dropdownState?.visaList.map((data, index) => (
                          <option value={data?.id}>{data?.Name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-lg-4 col-md-6 py-1">
                      <label className="m-0" style={{ fontSize: '10px' }}>Visa Type</label>
                      <select
                        name="ServiceId"
                        id=""
                        className="form-control form-control-sm form-query "
                        value={data?.ServiceId}
                        style={{ height: '2rem' }}
                        onChange={(e) => handleChange(e, index)}
                      >
                        <option value="">Select</option>
                        {dropdownState?.visatypeList && dropdownState?.visatypeList?.length > 0 && dropdownState?.visatypeList.map((data, index) => (
                          <option value={data?.id}>{data?.Name}</option>
                        ))}
                      </select>

                    </div>
                    <div className="col-lg-4 col-md-6 py-1">
                      <label className="m-0 fw-normal" style={{ fontSize: '10px' }}>Validity</label>
                      <input
                        type="number"
                        className="form-control form-control-sm form-query font-size-10 text-start"
                        id="val-username"
                        name="Validity"
                        value={data?.Validity}
                        placeholder="Validity"
                        onChange={(e) => handleChange(e, index)}
                      />


                    </div>
                    <div className="col-lg-4 col-md-6 py-1">
                      <label className="m-0" style={{ fontSize: '10px' }}>Entry Type</label>
                      <select
                        name="EntryType"
                        id=""
                        className="form-control form-control-sm form-query "
                        value={data?.EntryType}
                        style={{ height: '2rem' }}
                        onChange={(e) => handleChange(e, index)}
                      >
                        <option value="">Select</option>
                        <option value="Single Entry">Single Entry</option>
                        <option value="Multiple Entry">Multiple Entry</option>

                      </select>
                    </div>
                    <div className='col-2 py-1 mt-3'>
                      {index === 0 &&
                        <button
                          className="btn btn-primary py-1 px-2 d-flex justify-content-center align-items-center"
                          style={{ borderRadius: "5px", height: '2rem' }}
                          onClick={handleAddForm}
                        >
                          <i
                            class="fa-solid fa-plus"
                            style={{ fontSize: "10px" }}
                          ></i>
                        </button>
                      }

                      {index > 0 && (
                        <button
                          className="btn btn-primary py-1 px-2 d-flex justify-content-center align-items-center"
                          style={{ borderRadius: "5px", height: '2rem' }}
                          onClick={() => handleRemoveForm(index)}
                        >
                          <i className="fa-solid fa-minus" style={{ fontSize: "10px" }}></i>
                        </button>
                      )}
                    </div>

                  </div>
                )
              })}

          </div>


        </div>
      </div>
    </div>
  )
}

export default VisaServices;