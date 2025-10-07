import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { addQueryContext } from "..";
import Select from "react-select";
import { ThemeContext } from "../../../../../context/ThemeContext";
import { select_customStyles } from "../../../../../css/custom_style";
import { axiosOther } from "../../../../../http/axios_base_url";
import Addperference from "../addperference";
import { ToastContainer, Modal, Row, Col, Button } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";

// const customStyles = {
//   control: (provided) => ({
//     width: "auto", // Set to 'auto' for responsive width
//     minHeight: "25px", // Minimum height
//     height: "25px", // Fixed height
//     padding: "0px", // Remove default padding
//     border: "0.0625rem solid black", // Border to define control
//     borderRadius: "0.5rem",
//     "&:hover": {
//       border: "1px solid #aaa",
//     },
//   }),
//   valueContainer: (provided) => ({
//     // ...provided,
//     padding: "0px", // Remove padding
//     paddingLeft: "4px",
//     height: "25px", // Match height
//     display: "flex",
//     alignItems: "center", // Center content vertically
//     justifyContent: "center", // Center content horizontally
//   }),
//   placeholder: (provided) => ({
//     // ...provided,
//     margin: "0", // Adjust placeholder margin
//     fontSize: "0.76562rem", // Adjust font size as needed
//     textAlign: "center", // Center text horizontally
//     flex: 1, // Allow placeholder to take available space
//   }),
//   singleValue: (provided) => ({
//     // ...provided,
//     margin: "0", // Adjust single value margin
//     fontSize: "0.76562rem", // Adjust font size as needed
//   }),
//   dropdownIndicator: (provided) => ({
//     // ...provided,
//     display: "none", // Hide the dropdown indicator (icon)
//   }),
//   option: (provided) => ({
//     ...provided,
//     padding: "4px 1px", // Padding for options
//     fontSize: "0.76562rem", // Adjust font size as needed
//     overflow: "hidden", // Prevent overflow
//     paddingLeft: "4px",
//   }),
//   menu: (provided) => ({
//     ...provided,
//     zIndex: 9999, // Ensure the dropdown appears above other elements
//     overflowY: "hidden", // Hide vertical scrollbar
//     overflowX: "hidden", // Hide horizontal scrollbar
//   }),
//   menuList: (provided) => ({
//     ...provided,
//     maxHeight: "150px", // Set maximum height for list
//     overflowY: "auto",
//     "&::-webkit-scrollbar": {
//       display: "none", // Hide scrollbar for Chrome/Safari
//       width: "2px",
//     },
//   }),
// };

const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#2e2e40",
    color: "white",
    border: state.isFocused ? "1px solid #888" : "1px solid #444",
    boxShadow: "none",
    borderRadius: "6px",
    width: "100%",
    minWidth: "10rem",
    height: "2rem", // reduced height
    fontSize: "0.85em", // smaller font size
    cursor: "pointer",
    zIndex: 0,
    minHeight: "2rem", // to avoid extra height from defaults
  }),
  singleValue: (base) => ({
    ...base,
    color: "white",
    fontSize: "0.85em", // smaller font size
  }),
  input: (base) => ({
    ...base,
    color: "white",
    margin: 0,
    padding: 0,
    fontSize: "0.85em", // smaller font size
  }),
  placeholder: (base) => ({
    ...base,
    color: "#a0a0b0",
    fontSize: "0.85em",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#ccc",
    padding: "0 6px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#2e2e40",
    zIndex: 9999,
    fontSize: "0.85em", // match dropdown font size
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#444" : "#2e2e40",
    color: "white",
    cursor: "pointer",
    padding: "6px 10px",
    fontSize: "0.85em",
  }),
};

const SetPreference = ({ validationErorrs, queryType }) => {
  const { background } = useContext(ThemeContext);
  const { dropdownObject, queryObjects, preferenceObject } =
    useContext(addQueryContext);
  const error = validationErorrs;
  const heightAutoAdjust = queryType;
  const { dropdownState } = dropdownObject;

  const { formValue, setFormValue } = queryObjects;
  const { preferences, setPreferences } = preferenceObject;
  const leadSourceOption = dropdownState?.leadList?.map((lead) => ({
    value: lead?.id,
    label: lead.Name,
  }));

  const vehiclePrefOption = dropdownState?.vehicleType?.map((vehicl) => ({
    value: vehicl?.id,
    label: vehicl.Name,
  }));
  const tourTypeOption = dropdownState?.tourType?.map((tour) => ({
    value: tour?.id,
    label: tour.Name,
  }));
  const hotelTypeOption = dropdownState?.hotelType?.map((hotel) => ({
    value: hotel?.id,
    label: hotel.Name,
  }));

  const [salesPersonOption, setSalesPersonOption] = useState([]);
  const [assignUserOption, setAssignUserOption] = useState([]);
  const [contractPersonOption, setContractPersonOption] = useState([]);
  const [modalCentered, setModalCentered] = useState(false);
  const [businessType, setBusinessType] = useState([]);
  const [pereferenceList, setPereferenceList] = useState([]);

  const compId = JSON.parse(localStorage.getItem("token"))?.companyKey;

  // console.log(preferences, "preferences");

  const getAPIToServer = async () => {
    try {
      const { data } = await axiosOther.post("businesstypelist", {
        Search: "",
        Status: "1",
      });
      setBusinessType(data?.DataList);
      //   dropdownDispatch({
      //     type: "BUSINESS-TYPE",
      //     payload: data?.DataList,
      //   });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("querypreflist", {
        CompanyId: JSON.parse(localStorage.getItem("token"))?.companyKey,
        UserId: JSON.parse(localStorage.getItem("token"))?.UserID,
      });
      setPereferenceList(data?.DataList?.[0]);
    } catch (err) {
      console.log(err);
    }
    // API calling for sales Person
    try {
      const { data } = await axiosOther.post("users/by-role", {
        role: "Pre Sales",
        company_id: compId,
      });
      // console.log(data?.data, "presalesdata");
      setSalesPersonOption(data?.data);
    } catch (error) {
      console.log(error);
    }
    // API calling for Assign User
    try {
      const { data } = await axiosOther.post("users/by-role", {
        role: "Pre Sales",
        company_id: compId,
      });
      // console.log(data?.data, "presalesdata");
      setAssignUserOption(data?.data);
    } catch (error) {
      console.log(error);
    }
    // API calling for Contracting Person
    try {
      const { data } = await axiosOther.post("users/by-role", {
        role: "Pre Sales",
        company_id: compId,
      });
      // console.log(data?.data, "presalesdata");
      setContractPersonOption(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(preferences?.SalesPerson, "preferences");

  useEffect(() => {
    if (!pereferenceList) return;
    setPreferences((pre) => ({
      ...pre,
      ContractingPerson: pereferenceList?.Preferences?.ContractingPersonId,
      Priority: pereferenceList?.SetPreference,
      HotelType: pereferenceList?.Preferences?.HotelTypeId,
      ConsortiaId: pereferenceList?.Preferences?.ConsortiaId,
      SalesPerson: pereferenceList?.Preferences?.SalesPersonId,
      VehiclePreference: pereferenceList?.VehiclePreferenceId,
      ...(pereferenceList?.Preferences?.BusinessTypeName === "Agent"
        ? {
            ISOId: pereferenceList?.Preferences?.IsoId,
          }
        : {}),
    }));
  }, [pereferenceList]);
  useEffect(() => {
    getAPIToServer();
  }, []);
  const handleSelectChange = (input, actionMeta) => {
    const { name, type } = actionMeta || input.target;
    // console.log(name, type, "name, type");

    if (name === "ISOId") {
      setFormValue((prev) => ({
        ...prev,
        [name]: input.target.value,
      }));
      setPreferences((prev) => ({
        ...prev,
        [name]: input.target.value,
      }));
      return; // exit early to avoid falling into other ifs
    }

    if (name === "LeadSource") {
      setFormValue((prev) => ({
        ...prev,
        [name]: input ? input.value : "",
      }));
    }

    if (type === undefined) {
      setPreferences((prev) => ({
        ...prev,
        [name]: input ? input.value : "",
      }));
    } else {
      // For native <select> and <input> elements
      setPreferences((prev) => ({
        ...prev,
        [name]: input.target.value,
      }));
    }
  };
  // console.log(preferences, "formValue11");

  const handleSuccess = () => {
    setModalCentered(false); // Close modal on API success
  };

  useEffect(() => {
    if (
      !preferences?.VehiclePreference &&
      dropdownState?.vehicleType?.length > 0
    ) {
      setPreferences((prev) => ({
        ...prev,
        VehiclePreference: 16,
      }));
    }
  }, [dropdownState?.vehicleType]);

  useEffect(() => {
    if (salesPersonOption?.length > 0 && !preferences?.SalesPerson) {
      setPreferences((prev) => ({
        ...prev,
        SalesPerson: salesPersonOption[0]?.id,
      }));
    }
    if (assignUserOption?.length > 0 && !preferences?.OperationPerson) {
      setPreferences((prev) => ({
        ...prev,
        OperationPerson: assignUserOption[0]?.id,
      }));
    }
    if (contractPersonOption?.length > 0 && !preferences?.ContractingPerson) {
      setPreferences((prev) => ({
        ...prev,
        ContractingPerson: contractPersonOption[0]?.id,
      }));
    }
  }, [
    salesPersonOption,
    preferences,
    setPreferences,
    assignUserOption,
    contractPersonOption,
  ]);

  return (
    <div className="row">
      <Modal className="fade preferenceList" show={modalCentered}>
        <Modal.Header>
          <ToastContainer />
          {/* <Modal.Title>Make Final/ Select Supplement</Modal.Title> */}
          <Button
            onClick={() => setModalCentered(false)}
            variant=""
            className="btn-close"
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Addperference
              onSuccess={handleSuccess}
              preference={pereferenceList}
            />
          </Row>
        </Modal.Body>
        {/* <Modal.Footer>
                <Button
                  onClick={() => setModalCentered(false)}
                  variant="danger light"
                  className="btn-custom-size"
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  className="btn-custom-size"
                >
                  Save & Make Final
                </Button>
              </Modal.Footer> */}
      </Modal>

      <div className="col-lg-12 " style={{ height: "40rem" }}>
        <div
          className="card m-0 query-big-box-height"
          // className="card m-0 query-big-box-height destinationScroll"
          // style={{ height: "40rem", overflow: "hidden auto" }}
        >
          <div className="card-header px-2 py-3 " style={{ height: "50px" }}>
            <h4
              className="card-title query-title cursor-pointer"
              onClick={() => (getAPIToServer(), setModalCentered(true))}
            >
              Set Preferences{" "}
              <span className="fs-5 ms-2">
                <i class="fa-solid  fa-eye"></i>
              </span>{" "}
            </h4>
          </div>
          <PerfectScrollbar
            className="card-body p-2"
            style={{ height: "40rem", overflow: "auto" }}
          >
            <div className="row">
              {/* <div className="col-12"> */}
              <div className="col-12">
                <label className="m-0 setPreference-font-10 ">
                  Sales Person
                </label>

                <select
                  name="SalesPerson"
                  className="form-control form-control-sm form-query "
                  // classNamePrefix="custom"
                  // styles={customStyles}
                  id=""
                  // options={salesPersonOption}
                  onChange={handleSelectChange}
                  value={preferences?.SalesPerson}
                  // styles={select_customStyles(background)}
                  placeholder="Select"
                  autoComplete="off"
                >
                  <option value="">Select</option>
                  {salesPersonOption?.map((person, index) => {
                    return (
                      <option value={person?.id} key={index}>
                        {person?.FirstName} {person?.LastName}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-12 mt-2">
                <label className="m-0 setPreference-font-10">Assign User</label>

                <select
                  name="OperationPerson"
                  id=""
                  className="form-control form-control-sm form-query "
                  // options={assignUserOption}
                  onChange={handleSelectChange}
                  value={preferences?.OperationPerson}
                  // className="customSelectLightTheame"
                  // classNamePrefix="custom"
                  // styles={customStyles}
                  placeholder="Select"
                  autoComplete="off"
                >
                  <option value="">Select</option>
                  {assignUserOption?.map((person, index) => {
                    return (
                      <option value={person?.id} key={index}>
                        {person?.FirstName} {person?.LastName}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-12 mt-2">
                <label className="m-0 setPreference-font-10">
                  Contracting Person
                </label>

                <select
                  name="ContractingPerson"
                  id=""
                  // options={contractPersonOption}
                  className="form-control form-control-sm form-query "
                  onChange={handleSelectChange}
                  value={preferences?.ContractingPerson}
                  // className="customSelectLightTheame"
                  // classNamePrefix="custom"
                  // styles={customStyles}
                  placeholder="Select"
                  autoComplete="off"
                >
                  <option value="">Select</option>
                  {contractPersonOption?.map((person, index) => {
                    return (
                      <option value={person?.id} key={index}>
                        {person?.FirstName} {person?.LastName}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-12 mt-2">
                <label className="m-0" style={{ fontSize: "10px" }}>
                  Priority
                </label>
                {/* <span className="text-danger">*</span> */}

                <select
                  name="Priority"
                  id=""
                  className="form-control form-control-sm form-query "
                  value={
                    preferences?.Priority == null ? "" : preferences?.Priority
                  }
                  onChange={handleSelectChange}
                  style={{ height: "2rem" }}
                  autoComplete="off"
                >
                  <option value="">Select</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                </select>
                {/* {error?.Priority && (
                  <div
                    id="val-username1-error"
                    className="invalid-feedback animated fadeInUp"
                    style={{ display: "block",fontSize: "0.8rem" }}
                  >
                    {error?.Priority}
                  </div>
                )} */}
              </div>
              <div className="col-12 mt-2">
                <label className="m-0 setPreference-font-10"> Hotel Type</label>

                <select
                  name="HotelType"
                  id=""
                  // options={hotelTypeOption}
                  onChange={handleSelectChange}
                  value={preferences?.HotelType}
                  className="form-control form-control-sm form-query "
                  // className="customSelectLightTheame"
                  // classNamePrefix="custom"
                  // styles={customStyles}
                  // placeholder="Select"
                  autoComplete="off"
                >
                  <option value="">Select</option>
                  {dropdownState?.hotelType?.map((tour, index) => {
                    return (
                      <option key={index} value={tour?.id}>
                        {tour.Name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-12 mt-2">
                <label className="m-0 setPreference-font-10"> Tour Type</label>

                <select
                  name="TourType"
                  id=""
                  // options={tourTypeOption}
                  onChange={handleSelectChange}
                  value={preferences?.TourType}
                  className="form-control form-control-sm form-query "
                  // className="customSelectLightTheame"
                  // classNamePrefix="custom"
                  // styles={customStyles}
                  placeholder="Select"
                  autoComplete="off"
                >
                  <option value="">Select</option>
                  {dropdownState?.tourType?.map((tour, index) => {
                    return (
                      <option key={index} value={tour?.id}>
                        {tour.Name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-12 mt-2">
                <label className="m-0" style={{ fontSize: ".7rem" }}>
                  ISO
                </label>

                {/* {console.log(formValue, "formValue?.BussinessTypeName")} */}

                <select
                  name="ISOId"
                  id=""
                  className="form-control form-control-sm form-query "
                  // value={(formValue?.BussinessTypeName === "Agent" && formValue?.ISOId) || ""}
                  value={formValue?.ISOId || ""}
                  onChange={handleSelectChange}
                  style={{ height: "2rem" }}
                  autoComplete="off"
                >
                  <option value="">Select</option>
                  {dropdownState?.isoList?.length > 0 &&
                    dropdownState?.isoList.map((data, index) => {
                      return (
                        <option key={index} value={data?.id}>
                          {data?.Name}
                        </option>
                      );
                    })}
                </select>
                {/* {error?.Priority && (
                                    <div
                                        id="val-username1-error"
                                        className="invalid-feedback animated fadeInUp"
                                        style={{ display: "block", fontSize: '0.8rem' }}
                                    >
                                        {error?.Priority}
                                    </div>
                                )} */}
              </div>
              <div className="col-12 mt-2">
                <label className="m-0" style={{ fontSize: ".7rem" }}>
                  Consortia
                </label>

                <select
                  name="ConsortiaId"
                  id=""
                  className="form-control form-control-sm form-query "
                  value={
                    preferences?.ConsortiaId == null
                      ? ""
                      : preferences?.ConsortiaId
                  }
                  onChange={handleSelectChange}
                  style={{ height: "2rem" }}
                  autoComplete="off"
                >
                  <option value="">Select</option>
                  {dropdownState?.consortiaList?.length > 0 &&
                    dropdownState?.consortiaList.map((data, index) => {
                      return (
                        <option value={data?.id} key={index}>
                          {data?.Name}
                        </option>
                      );
                    })}
                </select>
                {/* {error?.Priority && (
                                    <div
                                        id="val-username1-error"
                                        className="invalid-feedback animated fadeInUp"
                                        style={{ display: "block", fontSize: '0.8rem' }}
                                    >
                                        {error?.Priority}
                                    </div>
                                )} */}
              </div>
              <div className="col-12 mt-2">
                <label className="m-0 setPreference-font-10">
                  Vehicle Preference
                </label>

                <select
                  name="VehiclePreference"
                  id=""
                  // options={vehiclePrefOption}
                  className="form-control form-control-sm form-query "
                  onChange={handleSelectChange}
                  value={preferences?.VehiclePreference}
                  // className="customSelectLightTheame"
                  // classNamePrefix="custom"
                  // styles={customStyles}
                  placeholder="Select"
                  autoComplete="off"
                  // menuPlacement="top" // Set dropdown to open upwards
                >
                  {/* {console.log(dropdownState?.vehicleType, "VEHI753")} */}
                  <option value="">Select</option>
                  {dropdownState?.vehicleType?.length > 0 &&
                    dropdownState?.vehicleType.map((data, index) => {
                      return (
                        <option value={data?.id} key={index}>
                          {data?.Name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-12 mt-2">
                <label className="m-0 setPreference-font-10">
                  {" "}
                  Lead Source
                </label>

                <select
                  name="LeadSource"
                  id=""
                  // options={leadSourceOption}
                  className="form-control form-control-sm form-query "
                  onChange={handleSelectChange}
                  value={leadSourceOption?.find(
                    (option) => option.value == formValue?.LeadSource
                  )}
                  // className="customSelectLightTheame"
                  // classNamePrefix="custom"
                  // styles={customStyles}
                  placeholder="Select"
                  autoComplete="off"
                >
                  <option value="">Select</option>
                  {dropdownState?.leadList?.length > 0 &&
                    dropdownState?.leadList.map((data, index) => {
                      return (
                        <option value={data?.id} key={index}>
                          {data?.Name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-12 mt-2">
                <label className="m-0 setPreference-font-10">
                  Lead Reference Id{" "}
                </label>

                <input
                  type="text"
                  id="LeadReferencedId"
                  className="form-control form-control-sm text-white  w-100"
                  placeholder="#87738727667"
                  name="LeadReferencedId"
                  autoComplete="off"
                  onChange={handleSelectChange}
                  value={preferences?.LeadReferencedId}
                />
              </div>

              {/* </div> */}
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
};

export default SetPreference;
