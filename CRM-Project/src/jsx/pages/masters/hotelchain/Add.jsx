import React, { useState, useEffect } from "react";
import { hotelChainValidationSchema } from "../master_validation";
import { hotelChainInitialValue } from "../masters_initial_value";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMultipleSelect from "../../../../hooks/custom_hooks/useMultipleSelect";
import { axiosOther } from "../../../../http/axios_base_url";
// import { PhoneInput } from "react-international-phone";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const Add = () => {
  const [formValue, setFormValue] = useState(hotelChainInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [destinationList, setDestinationList] = useState([]);
  const [phoneValue, setPhoneValue] = useState("");

  const { state } = useLocation();
  const navigate = useNavigate();

  // get list for dropdown
  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist", {
        CountryId: "",
        StateId: "",
        Name: "",
        Default: "",
        Status: "",
      });
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    postDataToServer();
  }, []);

  // multi select option value
  const destinationOption = destinationList?.map((item) => {
    return {
      value: item?.id,
      label: item?.Name,
    };
  });

  // multi select input
  const {
    SelectInput: DestinatinoInput,
    selectedData: destinationData,
    setSelectedData: setDestinationData,
  } = useMultipleSelect(destinationOption);

  // submitting data to server
  const handleSubmit = async (e) => {
    // console.log("phone-value", phoneValue);
    e.preventDefault();
    try {
      await hotelChainValidationSchema.validate(
        {
          ...formValue,
          Destination: destinationData,
          ContactMobile: phoneValue,
        },
        { abortEarly: false }
      );

      // console.log("form-value", {
      //   ...formValue,
      //   Destination: destinationData,
      //   ContactMobile: phoneValue,
      // });

      setValidationErrors({});
      const { data } = await axiosOther.post("addupdatehotelchain", {
        ...formValue,
        Destination: destinationData,
        ContactMobile: phoneValue,
      });

      if (data?.Status == 1) {
        navigate("/hotelchain");
      }
    } catch (error) {
      if (error.inner) {
        const validationErrorss = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrorss);
      }

      if (error.response?.data?.Errors) {
        const data = Object.entries(error.response?.data?.Errors);
        alert(data[0][1]);
      }

      console.log("error", error);
    }
  };

  // handlign form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  // console.log("state", state);

  // setting data to form for update
  useEffect(() => {
    if (state) {
      setFormValue({
        id: state?.Id,
        Name: state?.Name,
        Destination: state?.Destination?.map(
          (destination) => destination?.DestinationId
        ),
        HotelWebsite: state?.HotelWebsite,
        ContactType: state?.ContactType,
        ContactName: state?.ContactName,
        ContactDesignation: state?.ContactDesignation,
        ContactCountryCode: "+91",
        ContactMobile: state?.ContactMobile,
        ContactEmail: state?.ContactEmail,
        Status: state?.Status,
        AddedBy: state?.AddedBy,
        UpdatedBy: state?.UpdatedBy,
      });
      setDestinationData(
        state?.Destination?.map((destination) => destination?.DestinationId)
      );

      setPhoneValue(
        state?.ContactMobile == null
          ? ""
          : state?.ContactMobile?.toString()
      );
    }
  }, [state]);

  const handlePhoneChange = (phone) => {
    setPhoneValue(phone);
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Add Hotel Chain</h4>
            <div className="d-flex gap-3">
              <Link to={"/hotelchain"} className="btn btn-dark">
                Back
              </Link>
              <button onClick={handleSubmit} className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="form-validation">
              <form
                className="form-valide"
                action="#"
                method="post"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="row form-row-gap">
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Hotel Chain Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Chain Name"
                      className="form-control form-control-sm"
                      name="Name"
                      value={formValue?.Name}
                      onChange={handleInputChange}
                    />

                    {validationErrors?.Name && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.Name}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Hotel Website</label>
                    <input
                      type="text"
                      placeholder="Hotel Name"
                      className="form-control form-control-sm"
                      name="HotelWebsite"
                      value={formValue?.HotelWebsite}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <label className="m-0">Destination</label>
                    <DestinatinoInput />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Status</label>
                    <select
                      name="Status"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.Status}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="row mt-4 form-row-gap">
                  <div className="col-12">
                    <div className="custom-bottom-border">
                      <span>Contact Information</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Contact Person</label>
                    <select
                      name="ContactType"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.ContactType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="1">Account</option>
                      <option value="2">Operation</option>
                      <option value="3">Sales</option>
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      className="form-control form-control-sm"
                      name="ContactName"
                      value={formValue?.ContactName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Designation</label>
                    <input
                      type="text"
                      placeholder="Designation"
                      className="form-control form-control-sm"
                      name="ContactDesignation"
                      value={formValue?.ContactDesignation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Phone</label>
                    <PhoneInput
                      defaultCountry="in"
                      value={phoneValue}
                      onChange={handlePhoneChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Email"
                      className="form-control form-control-sm"
                      name="ContactEmail"
                      value={formValue?.ContactEmail}
                      onChange={handleInputChange}
                    />

                    {validationErrors?.ContactEmail && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.ContactEmail}
                      </div>
                    )}
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

export default Add;
