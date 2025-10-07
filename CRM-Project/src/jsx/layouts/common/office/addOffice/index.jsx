import React, { useState, useEffect } from "react";
import { addOfficeInitialValue } from "../../../../pages/masters/masters_initial_value.js";
import { addAddressValidationSchema } from "../../../../pages/masters/master_validation.js";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useMultipleSelect from "../../../../../hooks/custom_hooks/useMultipleSelect";
import useDestinationSelect from "../../../../../hooks/custom_hooks/useDestinationSelect";
import { axiosOther } from "../../../../../http/axios_base_url";
import "../../../../../scss/main.css";
import {
  notifyHotError,
  notifyHotSuccess,
} from "../../../../../helper/notify.jsx";


const AddOffice = () => {
  const [formValue, setFormValue] = useState(addOfficeInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [DestinationList, setDestinationList] = useState([]);
  const [stateList, setStatelist] = useState([]);
  const [cityList, setCitylist] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();
  const param = useParams();

  console.log("addOfficeInitialValue", state);
  // console.log("addOfficeInitialValue2", formValue);

  const getDataToServer = async () => {
    try {
      const response = await axiosOther.post("destinationlist", {
        Search: "",
        Status: 1,
      });
      setDestinationList(response.data.DataList);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
    try {
      // Fetch country list
      const countryResponse = await axiosOther.post("countrylist", {
        Search: "",
        Status: 1,
      });

      const countryListData = countryResponse.data.DataList;
      setCountryList(countryListData);
      // console.log(countryList, "countrylist")
      // console.log(countryListData,"countryListData");

      // if (!countryListData || countryListData.length === 0) return;

      // // Select first country
      // const selectedCountryId = countryListData[0].CountryId;

      // // Fetch cities for the selected country
      // const cityResponse = await axiosOther.post("citybycountry", {
      //     CountryId: selectedCountryId,
      //     Search: "",
      //     Status: 1,
      // });
      // console.log(cityResponse.data.DataList,"cityResponse")

      // const cityListData = cityResponse.data.DataList;
      // setCitylist(cityListData);

      // if (!cityListData || cityListData.length === 0) return;

      // // Select first city
      // const selectedCityId = cityResponse.data.DataList.StateId;

      // // Fetch states for the selected city
      // const stateResponse = await axiosOther.post("citystatebyid", {
      //     CityId: selectedCityId,
      //     Search: "",
      //     Status: 1,
      // });
      // console.log(stateResponse,"stateResponse")

      // setStatelist(stateResponse.data.DataList);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  useEffect(() => {
    getDataToServer();
  }, []);
  useEffect(() => {
    const dependentStateAndCity = async () => {
      try {
        const { data } = await axiosOther.post("citybycountry", {
          CountryId: formValue?.Country,
        });
        setCitylist(data.DataList);
      } catch (err) {
        console.log(err);
      }
      try {
        const { data } = await axiosOther.post("citystatebyid", {
          CityId: formValue?.City || state?.City,
        });

        setStatelist([{ id: data.StateId, Name: data.StateName }]);
      } catch (err) {
        console.log("Error fetching state list:", err);
      }
    };
    dependentStateAndCity();
  }, [formValue?.Country, formValue?.City]);

  //   useEffect(() => {
  //     console.log("Updated stateList:", stateList);
  // }, [stateList]);

  // console.log(state?.partner_payload?.Type, "statess");

  // submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAddressValidationSchema.validate(
        {
          ...formValue,
        },
        { abortEarly: false }
      );

      setValidationErrors({});
      const { data } = await axiosOther.post("addupdateoffice", {
        ...formValue,
        Type: state?.partner_payload?.Type || state?.Type,
        Fk_partnerid:
          state?.partner_payload?.Fk_partnerid || state?.Fk_partnerid,
      });

      if (data?.Status == 1) {
        notifyHotSuccess(data?.Message || data?.message);
        // if (data?.SupplireId) {
        navigate(
          `/view/${state?.partner_payload?.Type || state?.Type}/${param?.id}`
        );
        // }
        // else {
        //     navigate(/view/supplier/${formValue?.id});
        // }
      }
    } catch (error) {
      // alert("catch")
      if (error.inner) {
        const errorMessages = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(errorMessages);
      }

      if (error?.response?.data?.Status == 0) {
        // alert(error?.response?.data?.Status)

        notifyHotError(error?.response?.data?.Message || error?.response?.data?.Errors?.Country[0]);
      }

      // if (error.response?.data?.Errors) {
      //   const data = Object.entries(error.response?.data?.Errors);
      //   // alert(data[0][1]);
      //   // notifyHotError(data[0][1])

      // }

      console.log("error", error);
    }
  };
  useEffect(() => {
    if (!formValue?.Country && state?.partner_payload?.CompanyNmae?.[0]?.CountryId) {

      setFormValue((prev) => ({
        ...prev,

        Country
          : state.partner_payload.CompanyNmae[0].CountryId.toString(), // int mein bhejna hai toh
      }));
    }
  }, [state, formValue]);

  // const handleFormChange = (e) => {
  //   const { name, value, file, type } = e.target;
  //   setFormValue((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleFormChange = (e) => {
    const { name, value, files, type } = e.target;

    setFormValue((prev) => {
      const updatedForm = {
        ...prev,
        [name]: value,
      };

      // Add conditional logic without breaking existing behavior
      if (name === "Name") {
        if (value === "Head Office") {
          updatedForm.PrimaryAddress = "Yes";
        } else if (value === "Branch office") {
          updatedForm.PrimaryAddress = "No";
        }
      }

      return updatedForm;
    });
  };


  useEffect(() => {
    console.log(state);

    if (state && Object.keys(state).length > 0) {
      setFormValue((prev) => ({
        ...prev,
        id: state.id || "",
        Name: state.Name || "Head Office",
        Pan: state.Pan || "",
        PinCode: state.PinCode || "",
        Address: state.Address || "",
        Fk_partnerid: state.Fk_partnerid || "",
        Gstn: state.Gstn || "",
        Country: state.Country || "",
        City: state.City || "",
        PlaceOfDeliveryInvoice: state.PlaceOfDeliveryInvoice || "",
        PrimaryAddress: state.PrimaryAddress || "",
        State: state.State || "",
        Type: state.Type || "",
        AddedBy: "0",
        UpdatedBy: "1",
      }));

      // Uncomment and modify these if City and State are being updated elsewhere
      // setCitylist(state.City);
      // setStatelist(state.State);
    }
  }, [state]); // Dependency array ensures effect runs when state changes
  useEffect(() => {
    if (stateList?.length > 0) {
      setFormValue((prev) => ({ ...prev, State: stateList[0]?.id }));
    }
  }, [stateList]);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Add Office : {state?.
              partner_payload?.CompanyNmae[0]?.CompanyName
            }
            </h4>
            <div className="d-flex gap-3">
              <button
                className="btn btn-dark btn-custom-size"
                // name="SaveButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary btn-custom-size"
              >
                Submit
              </button>
            </div>
          </div>
          <div className="card-body mt-1">
            <div className="form-validation">
              <form
                className="form-valide"
                action="#"
                method="post"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="row">
                  <div className="col-12">
                    <div className="row form-row-gap">
                      <div className="col-md-6 col-lg-2">
                        <div className="">
                          <label className="" htmlFor="name">
                            Office Type
                          </label>
                        </div>
                        <select
                          name="Name"
                          id="Name"
                          className="form-control form-control-sm"
                          value={formValue?.Name || "Head Office"}
                          onChange={handleFormChange}
                        >
                          <option value="Head Office">Head Office</option>
                          <option value="Branch office">Branch office</option>
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label className="" htmlFor="status">
                          Country
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          name="Country"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.Country}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {countryList &&
                            countryList?.length > 0 &&
                            countryList.map((data, index) => (
                              <option value={data?.id}>{data?.Name}</option>
                            ))}
                        </select>
                        {validationErrors?.Country && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.Country}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label className="" htmlFor="status">
                          City
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          name="City"
                          id="City"
                          className="form-control form-control-sm"
                          value={formValue?.City}
                          onChange={handleFormChange}
                        >
                          <option value=""></option>

                          {cityList &&
                            cityList?.length > 0 &&
                            cityList.map((data, index) => (
                              <option value={data?.id} key={index}>
                                {data?.Name}
                              </option>
                            ))}
                        </select>
                        {validationErrors?.City && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.City}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="State">State</label>
                        <select
                          name="State"
                          id="State"
                          className="form-control form-control-sm"
                          value={
                            formValue?.State ||
                            (stateList?.length > 0 ? stateList[0]?.id : "")
                          }
                          onChange={handleFormChange}
                        >
                          {stateList?.length > 0 ? (
                            stateList.map(({ id, Name }) => (
                              <option key={id} value={id}>
                                {Name}
                              </option>
                            ))
                          ) : (
                            <option value="">Select</option>
                          )}
                        </select>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="">
                          <label className="" htmlFor="name">
                            Address
                          </label>
                        </div>
                        <textarea
                          id="name"
                          className="form-control form-control-sm"
                          name="Address"
                          value={formValue?.Address}
                          onChange={handleFormChange}
                          placeholder="Address"
                        ></textarea>
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <div className="">
                          <label className="" htmlFor="name">
                            ZiP Code
                            <span className="text-danger">*</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="PinCode"
                          value={formValue?.PinCode}
                          onChange={handleFormChange}
                          placeholder="ZiP Code"
                        />
                        {validationErrors?.PinCode && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.PinCode}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label className="" htmlFor="status">
                          Primary Address
                        </label>
                        <select
                          name="PrimaryAddress"
                          id="PrimaryAddress"
                          className="form-control form-control-sm"
                          value={formValue?.PrimaryAddress || "Yes"}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label className="" htmlFor="status">
                          Place of delivery for invoice
                        </label>
                        <select
                          name="PlaceOfDeliveryInvoice"
                          id="PlaceOfDeliveryInvoice"
                          className="form-control form-control-sm"
                          value={
                            formValue?.PlaceOfDeliveryInvoice ||
                            DestinationList.find(
                              (dest) => dest.Name === "Gurugram"
                            )?.id ||
                            DestinationList[0]?.id
                          }
                          onChange={handleFormChange}
                        >
                          {DestinationList.map((dest) => (
                            <option key={dest.id} value={dest.id}>
                              {dest.Name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label className="" htmlFor="name">
                          GSTN
                        </label>

                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="Gstn"
                          name="Gstn"
                          value={formValue?.Gstn}
                          onChange={handleFormChange}
                          placeholder="GSTN"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label className="" htmlFor="name">
                          PAN
                        </label>

                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="Pan"
                          name="Pan"
                          value={formValue?.Pan}
                          onChange={handleFormChange}
                          placeholder="PAN"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOffice;