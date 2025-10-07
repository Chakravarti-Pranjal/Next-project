import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { axiosOther } from "../../../../http/axios_base_url";
import Select from "react-select";
import { useSelector } from "react-redux";
import { quotationIntialValue } from "./qoutation_initial_value";
import { Row, Card, Col, Button, Modal, Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../../../context/ThemeContext";
import { select_customStyles } from "../../../../css/custom_style";
import { color } from "highcharts";
import { notifyError, notifySuccess } from "../../../../helper/notify";

const notifyTopCenter = (message) => {
  toast.success(`${message}`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const customStyles = {
  control: (provided) => ({
    width: "auto", // Set to 'auto' for responsive width
    minHeight: "20px", // Minimum height
    height: "20px", // Fixed height
    padding: "0px", // Remove default padding
    border: "none", // Border to define control
    background: "#2e2e40",
    color: "",
    textalign: "center",
    borderRadius: "0.5rem",
    "&:hover": {
      border: "1px solid #aaa",
      background: "#2e2e40",
    },
  }),
  valueContainer: (provided) => ({
    // ...provided,
    padding: "0px", // Remove padding
    paddingLeft: "4px",
    height: "20px", // Match height
    display: "flex",
    alignItems: "center", // Center content vertically
    justifyContent: "center", // Center content horizontally
    textAlign: "center",
  }),
  placeholder: (provided) => ({
    // ...provided,
    margin: "0", // Adjust placeholder margin
    fontSize: "0.76562rem", // Adjust font size as needed
    textAlign: "center", // Center text horizontally
    flex: 1, // Allow placeholder to take available space
    color: "#6e6e6e",
  }),
  singleValue: (provided) => ({
    // ...provided,
    margin: "0", // Adjust single value margin
    fontSize: "0.76562rem", // Adjust font size as needed
    textAlign: "center",
  }),
  dropdownIndicator: (provided) => ({
    // ...provided,
    display: "none", // Hide the dropdown indicator (icon)
  }),
  option: (provided) => ({
    ...provided,
    padding: "0px", // Padding for options
    fontSize: "0.76562rem", // Adjust font size as needed
    overflow: "hidden", // Prevent overflow
    paddingLeft: "4px",
    color: "black",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999, // Ensure the dropdown appears above other elements
    overflowY: "hidden", // Hide vertical scrollbar
    overflowX: "hidden", // Hide horizontal scrollbar
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "150px", // Set maximum height for list
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      display: "none", // Hide scrollbar for Chrome/Safari
      width: "2px",
    },
  }),
};

const Commission = ({ onNext, onBack }) => {
  // const { background } = useContext(ThemeContext);
  const [formValue, setFormValue] = useState(quotationIntialValue);
  const [mealList, setMealList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [meal, setMeal] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currencyId, setCurrencyId] = useState("");

  const serviceMarkupArray = [
    { id: 1, name: "Hotel" },
    { id: 2, name: "Guide" },
    { id: 3, name: "Activity" },
    { id: 4, name: "Entrance" },
    { id: 5, name: "Transfer" },
    { id: 6, name: "Train" },
    { id: 7, name: "Flight" },
    { id: 8, name: "Restaurant" },
    { id: 9, name: "Visa" },
    { id: 10, name: "Insurance" },
    { id: 11, name: "Other" },
  ];

  const dropdownArray = [
    { id: "Percentage", name: "%" },
    { id: "Flat", name: "Flat" },
  ];

  const dropdownMarkupArray = [
    { id: "Percentage", name: "%" },
    { id: "Flat", name: "FlatPP" },
  ];

  const dropdownFlight = [
    { id: "1", name: "Supplement Cost" },
    { id: "2", name: "Package Cost" },
  ];

  const dropdownTCS = [
    { id: "1", name: "Inclusive (0)" },
    { id: "2", name: "GST5 (7)" },
  ];

  const dropdownGSTType = [
    { id: "1", name: "Same State" },
    { id: "2", name: "Other State" },
  ];

  const dropdownGST = [
    { id: "1", name: "GST Inclusi. (0)" },
    { id: "2", name: "TAX-5 (5)" },
    { id: "3", name: "GST Tax (15)" },
    { id: "4", name: "TAX-18 (18)" },
  ];

  const dropdownSRS = [
    { id: "1", name: "None" },
    { id: "2", name: "Both" },
    { id: "3", name: "SRS" },
    { id: "4", name: "TRR" },
  ];

  const { qoutationData, queryData, policyData } = useSelector(
    (data) => data?.queryReducer
  );

  const { summaryIncAndExc, summaryVisa } = useSelector(
    (data) => data?.queryReducer
  );

  useEffect(() => {
    if (policyData?.length > 0) {
      setFormValue((prevFormValue) => ({
        ...prevFormValue,
        FitId: policyData?.fit[0]?.id,
        OverviewId: policyData?.overviewId,
        OverviewIncExcTc: {
          TourHeighligts: policyData?.overView[0]?.Highlights,
          Overview: policyData?.overView[0]?.OverviewName,
          ItineraryIntroduction: policyData?.overView[0]?.ItineraryIntroduction,
          ItinerarySummary: policyData?.overView[0]?.ItinerarySummary,
        },
        FitIncExc: {
          Inclusion: policyData?.fit[0]?.Exclusion,
          Exclusion: policyData?.fit[0]?.Inclusion,
          TermsNCondition: policyData?.fit[0]?.TermsCondition,
          CancellationPolicy: policyData?.fit[0]?.Cancelation,
          "Payment Policy": policyData?.fit[0]?.PaymentPolicy,
          Remarks: policyData?.fit[0]?.Remarks,
        },
      }));
    }
  }, []);

  const mealOptions = mealList?.map((item) => ({
    value: item.id,
    label: item.Name,
  }));
  const currencyOptions = currencyList.map((item) => ({
    value: item.CountryId,
    label: item.CountryCode,
  }));

  const handleSelectChange = (selectedOption, name) => {
    switch (name) {
      case "meal":
        setMeal(selectedOption.value);
        setModalOpen(true);
        break;
      case "currency":
        setFormValue({
          ...formValue,
          OthersInfo: {
            ...formValue.OthersInfo,
            CurrencyId: selectedOption.value,
            CurrencyName: selectedOption.label,
          },
        });
        break;
      default:
        console.log("nothing");
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, name, type } = e.target;
    setMarkupArray([]);
    setFormValue({
      ...formValue,
      Markup: {
        MarkupType: value,
      },
    });
  };

  const [markupArray, setMarkupArray] = useState([]);

  const handleChange = (e, index) => {
    const { name, value, type } = e.target;
    let data = [...markupArray];
    if (formValue?.Markup?.MarkupType === "Universal") {
      if (type === "select-one") {
        const newObj = {
          Type: name,
          Markup: value,
          Value: 0,
        };
        const existingIndex = data.findIndex((item) => item.Type === name);
        if (existingIndex === -1) {
          data.push(newObj);
        } else {
          data[existingIndex] = newObj;
        }
      } else if (type === "text") {
        const existingIndex = data.findIndex((item) => item.Type === name);
        if (existingIndex !== -1) {
          data[existingIndex].Value = value;
        } else {
          data.push({ Type: name, Markup: "", Value: value });
        }
      }
    } else if (formValue?.Markup?.MarkupType === "Service Wise") {
      if (type === "select-one") {
        const newObj = {
          Type: name,
          Markup: value,
          Value: 0,
        };
        const existingIndex = data.findIndex((item) => item.Type === name);
        if (existingIndex === -1) {
          data.push(newObj);
        } else {
          data[existingIndex] = newObj;
        }
      } else if (type === "text") {
        const existingIndex = data.findIndex((item) => item.Type === name);
        if (existingIndex !== -1) {
          data[existingIndex].Value = value;
        } else {
          data.push({ Type: name, Markup: "", Value: value });
        }
      }
    }
    setMarkupArray(data);
  };

  const hanldeSupplimentSelectionChange = (e) => {
    const { name, value } = e.target;
    if (name == "ClientCommision") {
      setFormValue({
        ...formValue,
        Commision: {
          ...formValue.Commision,
          [name]: value,
        },
      });
    }
    setFormValue({
      ...formValue,
      SupplimentSelection: {
        ...formValue.SupplimentSelection,
        [name]: value,
      },
    });
  };
  const hanldeOtherInfo = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      OthersInfo: {
        ...formValue.OthersInfo,
        [name]: value,
      },
    });
  };

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("hotelmealplanlist");
      setMealList(data?.DataList);
    } catch (error) {
      console.log("meal-error", error);
    }
    try {
      const { data } = await axiosOther.post("currencymasterlist");
      setCurrencyList(data?.DataList);
    } catch (error) {
      console.log("meal-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  const handleMealSubmit = async () => {
    try {
      const { data } = await axiosOther.post("updateHotelMealQuatation", {
        id: 40,
        QuatationNo: qoutationData?.QuotationNumber,
        Type: "Local",
        DayNo: "3",
        DayUniqueId: "0b1b7738-d3a5-4c2f-9906-b013f55f4cce",
        ServiceId: 2,
        ServiceType: "Hotel",
        HotelMealType: [1, 2, 3],
      });
      toast.error(data?.Error || data?.Error);
      if (
        data?.Status == 1 ||
        data?.status == 1 ||
        data?.result ||
        data?.Status === 200
      ) {
        notifyTopCenter(data?.Message || data?.message || data?.result);

        setModalOpen(false);
        getListDataToServer();
      }
    } catch (error) {
      toast.error(error || error);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data } = await axiosOther.post("submit_quotation", {
        ...formValue,
        QueryId: queryData?.QueryAlphaNumId,
        QuotationNumber: qoutationData?.QuotationNumber,
        Markup: {
          ...formValue.Markup,
          Data: markupArray,
        },
        VisaSummary: summaryVisa,
        Inclusion: summaryIncAndExc?.Inclusion,
        Exclusion: summaryIncAndExc?.Exclusion,
      });
      if (data?.status == 1 || data?.Status == 1) {
        notifySuccess(data?.message || data?.Message);
      }
      onNext();
    } catch (error) {
      if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        notifyError(data[0][1]);
      }
      console.log("submit-error", error);
    }
  };
  return (
    <>
      <Modal className="fade" show={modalOpen}>
        <Modal.Header>
          <Modal.Title>Update Hotel Meal Supplement Cost</Modal.Title>
          <Button
            onClick={() => setModalOpen(false)}
            variant=""
            className="btn-close"
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <Table responsive striped bordered>
              <thead>
                <tr>
                  <th scope="col" className="font-size-12 ">
                    <strong>S.No</strong>
                  </th>
                  <th scope="col" className="font-size-12 ">
                    <strong>Hotel</strong>
                  </th>
                  <th scope="col" className="font-size-12">
                    <strong>Destination</strong>
                  </th>
                  <th scope="col" className="font-size-12">
                    <strong>Meal</strong>
                  </th>
                  <th scope="col" className="font-size-12">
                    <strong>Currency</strong>
                  </th>
                  <th scope="col" className="font-size-12">
                    <strong>Single</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* {modalTableList?.length>0 ? modalTableList?.map((data,index)=>{
                    return (
                        <tr key={index}>
                        <td className="font-size10">{index+1}</td>
                        <td className="font-size10">{moment(data?.Restriction?.FromDate).format('DD-MM-YYYY')}-{moment(data?.Restriction?.FromDate).format('DD-MM-YYYY')}</td>
                        <td className="font-size10">{data?.Restriction?.Reason}</td>
                        <td className="font-size10"><span className="d-flex gap-1">
                                <i
                                  className="fa-solid fa-pencil cursor-pointer action-icon text-success"
                                  data-toggle="modal"
                                  data-target="#modal_form_vertical"
                                  onClick={() =>
                                    handleTableEdit(data)
                                  }
                                ></i>
                                <i
                                  className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
                                  onClick={() =>
                                    handleDelete(
                                      data?.Id
                                    )
                                  }
                                ></i>
                              </span></td>
                    </tr>
                    )
                   
                })
                :(
                    <div className="text-center mt-3 d-flex justify-content-center">No record found</div>
                )} */}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="dark light"
            className="btn-custom-size"
            onClick={handleMealSubmit}
          >
            Save
          </Button>
          <Button
            onClick={() => setModalOpen(false)}
            variant="danger light"
            className="btn-custom-size"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="container-fluid mt-3  m-0 p-0 commission">
        <ToastContainer />
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
            onClick={handleSubmit}
          >
            <span className="me-1">Submit</span>
            <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
          </button>
        </div>
        {/* add-markup */}
        <div
          className="row  text-black  py-1 mt-2 m-0"
          style={{ background: " var(--rgba-primary-1) !important" }}
        >
          <div className="col-12 ms-5  d-flex gap-2 font-size-12">
            <span>
              <i class="fa-solid fa-circle" style={{ color: "red" }}></i>
            </span>
            <span className="font-size-12 font-weight-bold">Add Markup</span>
          </div>
        </div>
        <div className="px-5 mt-1">
          <div className="row">
            <div className="col-12 d-flex gap-4 py-2 p-0">
              <div className="d-flex gap-2 my-2  align-items-end font-size10">
                <input
                  type="radio"
                  id="universel"
                  name="MarkupType"
                  className="form-check-input"
                  onChange={handleCheckboxChange}
                  style={{ height: "0.9rem", width: "0.9rem" }}
                  value="Universal"
                  checked={formValue?.Markup?.MarkupType == "Universal"}
                />
                <label htmlFor="universel" className="m-0">
                  Universel
                </label>
              </div>
              <div className="d-flex gap-2  my-2 align-items-end">
                <input
                  type="radio"
                  id="service"
                  name="MarkupType"
                  value="Service Wise"
                  className="form-check-input"
                  style={{ height: "0.9rem", width: "0.9rem" }}
                  onChange={handleCheckboxChange}
                  checked={formValue?.Markup?.MarkupType == "Service Wise"}
                />
                <label htmlFor="service" className="m-0">
                  Service Wise
                </label>
              </div>
            </div>
          </div>
          <div className="row row-gap-2">
            {formValue?.Markup?.MarkupType == "Universal" && (
              <div className="col-lg-3 p-xs-0 ">
                <div className="row">
                  <div className="col-12 ">
                    <table className="border table-responsive">
                      <thead>
                        <tr>
                          <th className="px-3 border-bottom text-center py-1 border-right ">
                            Mark Up Type
                          </th>
                          <th className="px-1  border-bottom text-center py-1 border-right">
                            Mark Up
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-1 text-center py-2 border-right">
                            <select
                              name="Markup"
                              id=""
                              className="px-2 w-75 formControl1"
                              style={{ fontSize: "0.6rem" }}
                              onChange={handleChange}
                            >
                              {dropdownMarkupArray?.length > 0 &&
                                dropdownMarkupArray.map((data, index) => {
                                  return (
                                    <option
                                      value={data?.id}
                                      className="font-size10"
                                    >
                                      {data?.name}
                                    </option>
                                  );
                                })}
                            </select>
                          </td>
                          <td className="p-0 d-flex justify-content-center align-item-center py-2 ">
                            <input
                              type="text"
                              name="Markup"
                              className="table-input w-50 form-control form-control-sm"
                              placeholder="0"
                              onChange={handleChange}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {formValue?.Markup?.MarkupType == "Service Wise" && (
              <div className="col-lg-12">
                <div className="row m-1">
                  {serviceMarkupArray.map((item, index) => {
                    return (
                      <div className="col-4 col-sm-2 col-md-1 p-0">
                        <table className="border table-responsive">
                          <thead>
                            <tr>
                              <th className="p-0 text-center border-bottom">
                                {item?.name}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="p-0 text-center py-2">
                                <div className="col-12 d-flex flex-column gap-1">
                                  <div className="">
                                    <select
                                      name={item?.name}
                                      id=""
                                      className="px-2 w-75 formControl1"
                                      onChange={(e) => handleChange(e, index)}
                                      style={{ fontSize: "0.6rem" }}
                                    >
                                      {dropdownArray?.length > 0 &&
                                        dropdownArray.map((data) => {
                                          return (
                                            <option value={data?.id}>
                                              {data?.name}
                                            </option>
                                          );
                                        })}
                                    </select>
                                  </div>
                                  <div className=" d-flex justify-content-center">
                                    <input
                                      type="text"
                                      name={item?.name}
                                      className="table-input w-75 form-control form-control-sm"
                                      placeholder="0"
                                      onChange={(e) => handleChange(e, index)}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* add-commision */}
        <div
          className="py-2 mt-2"
          style={{ background: " var(--rgba-primary-1) !important" }}
        >
          <div className="row  ms-5 text-black  m-0 flex-wrap">
            <div className="col-md-4 col-lg-4  d-flex gap-2">
              <span>
                <i class="fa-solid fa-circle" style={{ color: "red" }}></i>
              </span>
              <span>Add Commision</span>
            </div>
            <div className="col-md-4 col-lg-4  d-flex gap-2">
              <span>
                <i class="fa-solid fa-circle" style={{ color: "red" }}></i>
              </span>
              <span>Supplement Selection</span>
            </div>
            <div className="col-md-4 col-lg-4  d-flex gap-2">
              <span>
                <i class="fa-solid fa-circle" style={{ color: "red" }}></i>
              </span>
              <span>Meal Supplement</span>
            </div>
          </div>
        </div>
        <div className=" ms-0 mt-1">
          <div className="row mt-3 ms-5 m-0 justify-content-between">
            <div className="col-md-4 col-lg-2 p-0">
              <table className="border table-responsive ">
                <thead>
                  <tr>
                    <th className="font-size-10  border-bottom text-center py-1 px-2">
                      Client Commision
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="d-flex justify-content-center py-1 px-2 ">
                      <input
                        type="text"
                        className="form-control form-control-sm w-75"
                        placeholder="0"
                        name="ClientCommision"
                        onChange={hanldeSupplimentSelectionChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-4 col-lg-4">
              <table className=" border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom border-right py-1 px-2">
                      Flight Cost
                    </th>
                    <th className="font-size-10 p-0 text-center border-bottom py-1 px-2">
                      Tour Escort
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-1 px-2 border-right">
                      <select
                        name="FlightCost"
                        id=""
                        className="w-75 font-size10 text-center text-truncate formControl1"
                        onChange={hanldeSupplimentSelectionChange}
                      >
                        {dropdownFlight.map((data, index) => {
                          return (
                            <option key={index} value={data?.name}>
                              {data?.name}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td className="text-center py-1 px-2">
                      <select
                        name="TourEscort"
                        id=""
                        className="w-75  font-size10 text-center text-truncate formControl1"
                        onChange={hanldeSupplimentSelectionChange}
                      >
                        {dropdownFlight.map((data, index) => {
                          return (
                            <option key={index} value={data?.name}>
                              {data?.name}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-4 col-lg-4">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom  py-1 px-4">
                      Current Meal Plan()
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-1 p1-2 ">
                      <Select
                        name="meal"
                        id=""
                        options={mealOptions}
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, "meal")
                        }
                        value={mealList?.find(
                          (option) => option.value === meal
                        )}
                        styles={customStyles}
                        autocomplete="off"
                        className="w-50 m-auto"
                      ></Select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* other-information */}
        <div
          className="py-2 mt-2"
          style={{ background: " var(--rgba-primary-1) !important" }}
        >
          <div className="row ms-5  text-black    m-0">
            <div className="col-4 d-flex gap-2">
              <span>
                <i class="fa-solid fa-circle" style={{ color: "red" }}></i>
              </span>
              <span>Other Information</span>
            </div>
          </div>
        </div>
        <div className="px-5 mt-1">
          <div className="row mt-3 ml-1 row-gap-2 m-0">
            <div className="col-6 col-sm-3 col-lg-2 p-0">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom">
                      GST Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-2 px-3">
                      <select
                        name="GstType"
                        id=""
                        className="px-1 table-select-1 w-75 text-truncate font-size10 formControl1"
                        onChange={hanldeOtherInfo}
                      >
                        {dropdownGSTType.map((data, index) => {
                          return (
                            <option value={data?.name} key={data?.name}>
                              {data?.name}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-6 col-sm-3 col-lg-1 p-0">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom px-2 ">
                      GST(%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-2">
                      <select
                        name="Gst"
                        id=""
                        className="px-2 table-select-1 w-75 text-truncate font-size10 formControl1"
                        onChange={hanldeOtherInfo}
                      >
                        {dropdownGST.map((data, index) => {
                          return (
                            <option value={data?.name} key={index}>
                              {data?.name}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-6 col-sm-3 col-lg-1 p-0">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom">
                      TCS(%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-2">
                      <select
                        name="TCS"
                        id=""
                        className="px-2 table-select-1 w-75 text-truncate font-size10 formControl1"
                        onChange={hanldeOtherInfo}
                      >
                        {dropdownTCS.map((data, index) => {
                          return (
                            <option value={data?.name} key={index}>
                              {data?.name}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-6 col-sm-3 col-lg-2 col-xl-1 p-0">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom px-2">
                      Discount Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-2 px-2">
                      <select
                        name="DiscountType"
                        id=""
                        className="px-2 table-select-1 text-truncate font-size10 formControl1"
                        onChange={hanldeOtherInfo}
                      >
                        {dropdownArray &&
                          dropdownArray?.length > 0 &&
                          dropdownArray.map((data, index) => {
                            return (
                              <option value={data?.name} key={index}>
                                {data?.name}
                              </option>
                            );
                          })}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-6 col-sm-3 col-lg-1 p-0">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center px-1 border-bottom  ">
                      Discount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-1 pb-2 pt-1 d-flex justify-content-between align-items-center ps-3 ">
                      <input
                        type="text"
                        name="Discount"
                        className="table-input-1 w-75 form-control form-control-sm"
                        style={{ height: "20px" }}
                        onChange={hanldeOtherInfo}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-6 col-sm-3 col-lg-1 p-0">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom px-4">
                      SRS & TRR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-2 px-2 ">
                      <select
                        name="SrsandTrr"
                        id=""
                        className="px-2 table-select-1 w-75 text-truncate font-size10 formControl1"
                        onChange={hanldeOtherInfo}
                      >
                        {dropdownSRS.map((data, index) => {
                          return (
                            <option value={data?.name} key={index}>
                              {data?.name}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-6 col-sm-3 col-lg-1 p-0">
              <table className="border table-responsive ">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom  px-4">
                      Currency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-2 ">
                      <Select
                        name="meal"
                        id=""
                        options={currencyOptions}
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, "currency")
                        }
                        value={currencyList?.find(
                          (option) => option.value === currencyId
                        )}
                        styles={customStyles}
                        autocomplete="off"
                        className="w-75 m-auto text-black"
                      ></Select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-6 col-sm-3 col-lg-2  ">
              <table className="border table-responsive me-4">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom pt-1 ">
                      ROE (For 1INR)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-1 pb-1   d-flex justify-content-center">
                      <input
                        type="text"
                        name="ROE"
                        className="table-input-1 w-75 form-control form-control-sm"
                        placeholder="0"
                        style={{ height: "20px" }}
                        onChange={hanldeOtherInfo}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="row mt-3 float-end">
            <div className="col d-flex gap-3">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={onBack}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-custom-size"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Commission;
