import React, { useContext, useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addQueryContext } from "..";
import { insert } from 'formik';
const serviceInitial = {
  ServiceType: "Insurance",
  ServiceFromDate: new Date().toISOString().split("T")[0],
  ServiceToDate: new Date().toISOString().split("T")[0],
  ServiceCountry: "",
  ServiceId: "",
  ClassPreference: "",
  MealChoice: "",
  SeatPreference: "",
  FromDestination: "",
  ToDestination: "",
  ViaDestination: "",
};

const InsuranceServices = ({ queryType }) => {

  const heightAutoAdjust = queryType
  const context = useContext(addQueryContext);
  const { dropdownObject, serviceObject, insuranceObject } =
    useContext(addQueryContext);
  const [services, setServices] = serviceObject;
  const { insurance, setInsurance } = insuranceObject
  const { dropdownState } = dropdownObject;


  // useEffect(()=>{
  //   setServices(
  //     [{ Type: 'Insurance', ServiceDetails: [serviceInitial] }],
  //   );
  // },[])


  useEffect(() => {
    setInsurance({
      Type: 'Insurance',
      ServiceDetails: [serviceInitial]
    });
  }, []);


  const handleAddForm = () => {
    setInsurance((prevFormValue) => {

      const updatedServiceDetails = [...prevFormValue.ServiceDetails];
      updatedServiceDetails.push(serviceInitial);
      return {
        ...prevFormValue,
        ServiceDetails: updatedServiceDetails,
      };
    });
  };

  const handleRemoveForm = (index) => {
    setInsurance((prevFormValue) => {
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

    setInsurance((prevFormValue) => {

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
  const handleToCalender = (date, index) => {
    const formattedDate = date.toISOString().split("T")[0];

    setInsurance((prevFormValue) => {

      const updatedServiceDetails = [...prevFormValue.ServiceDetails];

      // Update the object at the specified index
      updatedServiceDetails[index] = {
        ...updatedServiceDetails[index],
        ServiceToDate: formattedDate,
      };
      return {
        ...prevFormValue,
        ServiceDetails: updatedServiceDetails,
      };

    });

  }
  const handleChange = (e, index) => {
    const { name, value } = e.target;

    setInsurance((prevInsurance) => {
      // Copy the existing ServiceDetails array
      const updatedServiceDetails = [...prevInsurance.ServiceDetails];

      // Update the specific ServiceDetails object at the given index
      updatedServiceDetails[index] = {
        ...updatedServiceDetails[index],  // Keep other properties intact
        [name]: value, // Dynamically update the property based on the name attribute
      };

      // Return the updated insurance object with the modified ServiceDetails
      return {
        ...prevInsurance,
        ServiceDetails: updatedServiceDetails, // Ensure only ServiceDetails is updated
      };
    });
  };



  return (
    <div className="row mt-2">
      <div className="col-lg-12">
        <div className="card m-0 query-box-height" style={{ minHeight: !heightAutoAdjust.includes(1) && '23rem' }}>
          <div className="card-header px-2 py-3 d-flex justify-content-between align-items-center gap-1">
            <h4 className="card-title query-title">Insurance Services</h4>

          </div>
          <div className="card-body px-2 pb-3 pt-3">
            {insurance?.ServiceDetails
              && insurance?.ServiceDetails?.length > 0 && insurance?.ServiceDetails.map((data, index) => {
                return (


                  <div className={`row row-gap-3  ${index > 0 ? 'border-row my-2' : ''}`}>

                    <div className="col-lg-4 col-md-6 py-1">
                      <label className="m-0" style={{ fontSize: '10px' }}>From Date</label>
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
                      <label className="m-0" style={{ fontSize: '10px' }}>To Date</label>
                      <DatePicker
                        className="form-control form-control-sm form-query p-1"
                        selected={data?.ServiceToDate ? new Date(data?.ServiceToDate) : new Date()}
                        name="TravelDateInfo.FromDate"
                        onChange={(e) => handleToCalender(e, index)}
                        dateFormat="dd-MM-yyyy"
                        style={{
                          transform: " translate3d(7px, 80px, 0px)",
                        }}
                        isClearable todayButton="Today"
                      />
                    </div>
                    <div className="col-lg-4 col-md-6 py-1">
                      <label className="m-0" style={{ fontSize: '10px' }}>Insurance Type</label>
                      <select
                        name="ServiceId"
                        id=""
                        className="form-control form-control-sm form-query "
                        value={data?.ServiceId}
                        style={{ height: '2rem' }}
                        onChange={(e) => handleChange(e, index)}
                      >
                        <option value="">Select</option>
                        {dropdownState?.insuranceTypeList && dropdownState?.insuranceTypeList?.length > 0 && dropdownState?.insuranceTypeList.map((insurance, index) => (
                          <option value={insurance?.id}>{insurance?.InsuranceType}</option>
                        ))}
                      </select>
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

export default InsuranceServices;