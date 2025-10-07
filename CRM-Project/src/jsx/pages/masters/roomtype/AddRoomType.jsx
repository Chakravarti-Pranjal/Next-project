import React, { useState, useEffect } from "react";
import { roomTypeValidationSchema } from "../master_validation";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { roomTypeInitialValue } from "../masters_initial_value";

const AddRoomType = () => {
  const [formValue, setFormValue] = useState(roomTypeInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [languageList, setLanguageList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [hotelChainList, setHotelChainList] = useState([]);
  const [hotelCategoryList, setHotelCategoryList] = useState([]);
  const [hotelTypeList, setHotelTypeList] = useState([]);
  const [roomTypeList, setRoomTypeList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [weekendList, setWeekendList] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [errorFileMessage, setErrorFileMessage] = useState("");

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
    try {
      const { data } = await axiosOther.post("divisionlist");
      setDivisionList(data?.DataList);
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axiosOther.post("hotelchainlist", {
        Search: "",
        Status: "",
      });
      setHotelChainList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("hotelcategorylist", {
        Search: "",
        Status: "",
      });
      setHotelCategoryList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("hoteltypelist", {
        Search: "",
        Status: "",
      });
      setHotelTypeList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("roomtypelist", {
        Search: "",
        Status: "",
      });
      setRoomTypeList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("citylist", {
        Search: "",
        Status: "",
      });
      setCityList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("countrylist", {
        Search: "",
        Status: "",
      });
      setCountryList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("statelist", {
        Search: "",
        Status: "",
      });
      setStateList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("weekendlist", {
        Search: "",
        Status: "",
      });
      setWeekendList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("amenitieslist");

      setAmenitiesList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    postDataToServer();
  }, []);
  console.log("ss", formValue)

  // submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await roomTypeValidationSchema.validate(
        {
          ...formValue,
        },
        { abortEarly: false }
      );

      console.log("value-2", {
        ...formValue,
      });

      setValidationErrors({});
      const { data } = await axiosOther.post("addupdateroomtype", formValue);

      console.log("response-data", data);

      if (data?.Status == 1) {
        navigate("/roomtype");
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

  // setting data to form for update
  useEffect(() => {
    if (state) {
      setFormValue({
        id: state?.id,
        Name: state?.Name,
        MaximumOccupancy: state?.MaximumOccupancy,
        Bedding: state?.Bedding,
        Size: state?.Size,
        Status:
          state?.Status == null || state?.Status == ""
            ? "Active"
            : state?.Status,
        AddedBy: state?.AddedBy,
        UpdatedBy: state?.UpdatedBy,
      });
    }
  }, [state]);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Add Room Type</h4>
            <div className="d-flex gap-3">
              <Link to={"/roomtype"} className="btn btn-dark">
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
                    <div className="d-flex justify-content-between">
                      <label className="m-0">
                        Room Name <span className="text-danger">*</span>
                      </label>
                      {validationErrors?.Name && (
                        <span className="text-danger font-size-11">
                          {validationErrors?.Name}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Room Name"
                      className="form-control form-control-sm"
                      name="Name"
                      value={formValue?.Name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <div className="d-flex justify-content-between">
                      <label className="m-0">
                        Maximum Occupancy <span className="text-danger">*</span>
                      </label>
                      {validationErrors?.MaximumOccupancy && (
                        <span className="text-danger font-size-11">
                          {validationErrors?.MaximumOccupancy}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Room Name"
                      className="form-control form-control-sm"
                      name="MaximumOccupancy"
                      value={formValue?.MaximumOccupancy}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <div className="d-flex justify-content-between">
                      <label className="m-0">
                        Bedding <span className="text-danger">*</span>
                      </label>
                      {validationErrors?.Bedding && (
                        <span className="text-danger font-size-11">
                          {validationErrors?.Bedding}
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      placeholder="Bedding"
                      className="form-control form-control-sm"
                      name="Bedding"
                      value={formValue?.Bedding}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <div className="d-flex justify-content-between">
                      <label className="m-0">
                        Size <span className="text-danger">*</span>
                      </label>
                      {validationErrors?.Size && (
                        <span className="text-danger font-size-11">
                          {validationErrors?.Size}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Bedding"
                      className="form-control form-control-sm"
                      name="Size"
                      value={formValue?.Size}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="" htmlFor="status">
                      Status
                    </label>
                    <select
                      name="Status"
                      id="status"
                      className="form-control form-control-sm"
                      value={formValue?.Status}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
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

export default AddRoomType;
