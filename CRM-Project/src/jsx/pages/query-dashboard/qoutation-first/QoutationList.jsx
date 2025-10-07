import React, { useContext, useEffect, useRef, useState } from "react";
import { currentQueryGlobalContext } from "../QueryDashboard";
import { useNavigate } from "react-router-dom";
import { quotationContext } from "./Quotation";
import { formatDate } from "../../../../helper/formatDate";
import { axiosOther } from "../../../../http/axios_base_url";
import { useSelector } from "react-redux";

const QoutationList = () => {
  const { currentQuery } = useContext(currentQueryGlobalContext);
  const { currentQueryData } = currentQuery;

  const { quotationGlobalData, setQuotationGlobalData } =
    useContext(quotationContext);

  const popupRef = useRef();
  
  // quotation form state
  const [quotationFormValue, setQuotationFormValue] = useState({
    QueryId: currentQueryData?.QueryID,
    Subject: generateSubject(
      currentQueryData?.ServiceDetail?.ServiceCompanyName
    ),
    HotelCategory: "Single Hotel Category",
    PaxSlabType: "Single Slab",
    HotelMarkupType: "Service Wise Markup",
    HotelStarCategory: [],
    PackageID: "",
  });
  const [hotelCategoryList, setHotelCategoryList] = useState([]);
  const [quotatinoList, setQuotationList] = useState([]);
  const [queryList, setQueryList] = useState([]);
  const navigate = useNavigate();

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("listqueryquotation", {
        QueryId: currentQueryData?.QueryID,
      });

      setQuotationList(data?.data);
    } catch (error) {
      console.log("error", error);
    }

    try {
      const { data } = await axiosOther.post("querymasterlist", {
        id: currentQueryData?.id,
      });
      setQueryList(data?.DataList[0]);
    } catch (error) {
      console.log("error", error);
    }

    try {
      const { data } = await axiosOther.post("hotelcategorylist");
      setHotelCategoryList(data?.DataList);
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(() => {
    postDataToServer();
  }, []);

  // generating quotation subject
  function generateSubject(name) {
    if (!name) {
      return "";
    }

    const currentDate = new Date().toISOString().split("T")[0];
    const subject = name + " " + currentDate;
    return subject;
  }

  const handleQuotationFormChange = (e) => {
    const { name, value, checked } = e.target;

    if (checked == undefined) {
      setQuotationFormValue({ ...quotationFormValue, [name]: value });
    }

    if (checked && checked != undefined) {
      setQuotationFormValue({
        ...quotationFormValue,
        HotelStarCategory: [...quotationFormValue?.HotelStarCategory, value],
      });
    }

    if (!checked && checked != undefined) {
      const checkedCategory = quotationFormValue?.HotelStarCategory?.filter(
        (category) => category != value
      );
      setQuotationFormValue({
        ...quotationFormValue,
        HotelStarCategory: checkedCategory,
      });
    }
  };

  const handleQuotationAdd = async () => {
    try {
      const { data } = await axiosOther.post(
        "addquerywithjson",
        quotationFormValue
      );

      if (data?.status == 1) {
        popupRef.current.click();
        toast.success(data?.message);
        setQuotationGlobalData(data?.Response[0]);
        localStorage.setItem(
          "quotation-data",
          JSON.stringify(data?.Response[0])
        );
      }
      if (data?.status != 1) {
        toast.error(data?.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error?.response?.data?.message || error?.response?.statusText
        );
      }
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row border quotatation-shadow padding-around">
          <div className="col-12">
            {/* <Toaster /> */}
            <div className="row justify-content-between">
              <div className="col-2 p-0">
                <p className="m-0 font-size-12 font-weight-medium">
                  Query Date:
                </p>
                <p className="m-0">1 August 2024 | 12:46 PM</p>
              </div>
              <div className="col-2 p-0">
                <p className="m-0 font-size-12 font-weight-medium">Status:</p>
                <p className="m-0 text-primary font-weight-bold">
                  Query Confirmed
                </p>
              </div>
              <div className="col-2 p-0">
                <p className="m-0 font-size-12 font-weight-medium">End Date:</p>
                <p className="m-0 ">2 August 2024 | 12:46</p>
              </div>
              <div className="col-3 p-0 d-flex gap-3 align-items-center">
                <div className="d-flex gap-3">
                  <div className="d-flex align-items-center">
                    <i className="fa-solid fa-circle-user fs-4 text-secondary"></i>
                  </div>
                  <div>
                    <p className="m-0 font-size-12 font-weight-bold">
                      Pawan Travel India
                    </p>
                    <p className="m-0 font-weight-bold font-size-10">
                      876636556
                    </p>
                  </div>
                </div>
                <div className="whatsapp-icon">
                  <img src="/assets/icons/whatsapp.svg" alt="" />
                </div>
              </div>
              <div className="col-2 d-flex justify-content-between align-items-center">
               
              <button
                className="btn btn-dark btn-custom-size"
                name="BackButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
                <button
                                 className="btn btn-dark btn-custom-size"
                name="AddButton"
                >
                  Add Quotation
                </button>

                {/* add quotation model */}
                <div
                  className="modal fade"
                  id="modal_form_vertical1"
                  data-bs-backdrop="static"
                  data-bs-keyboard="false"
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header  blue-background text-light">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Select Quotation
                        </h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="row row-gap-2">
                          <div className="col-6">
                            <label htmlFor="" className="m-0 font-size-12">
                              Subject
                            </label>
                            <input
                              type="text"
                              className="form-input-6"
                              name="Subject"
                              placeholder="Subject"
                              value={quotationFormValue?.Subject}
                              onChange={handleQuotationFormChange}
                            />
                          </div>
                          <div className="col-6">
                            <label htmlFor="" className="m-0 font-size-12">
                              Hotel Category Type
                            </label>
                            <select
                              name="HotelCategory"
                              id=""
                              className="form-input-6"
                              value={quotationFormValue?.HotelCategory}
                              onChange={handleQuotationFormChange}
                            >
                              <option value="Single Hotel Category">
                                Single Hotel Category
                              </option>
                              <option value="Multiple Hotel Category">
                                Multiple Hotel Category
                              </option>
                            </select>
                          </div>
                          <div className="col-6">
                            <label htmlFor="" className="m-0 font-size-12">
                              Pax Slab Type
                            </label>
                            <select
                              name="PaxSlabType"
                              id=""
                              className="form-input-6"
                              value={quotationFormValue?.PaxSlabType}
                              onChange={handleQuotationFormChange}
                            >
                              <option value="Single Slab">Single Slab</option>
                              <option value="Multiple Slab">
                                Multiple Slab
                              </option>
                            </select>
                          </div>
                          <div className="col-6">
                            <label htmlFor="" className="m-0 font-size-12">
                              Hotel Markup Type
                            </label>
                            <select
                              name="HotelMarkupType"
                              id=""
                              className="form-input-6"
                              value={quotationFormValue?.HotelMarkupType}
                              onChange={handleQuotationFormChange}
                            >
                              <option value="Service wise Markeup">
                                Service Wise Markup
                              </option>
                              <option value="Hotel wise Markeup">
                                Hotel Wise Markup
                              </option>
                            </select>
                          </div>
                          {quotationFormValue?.HotelCategory ==
                            "Multiple Hotel Category" && (
                            <div className="col-6">
                              <label htmlFor="" className="m-0 font-size-12">
                                Multiple Hotel Star Category
                              </label>
                              <div className="d-flex gap-2 flex-wrap border px-1 min-heihgt-25">
                                {hotelCategoryList?.map((category, index) => {
                                  return (
                                    <div
                                      className="d-flex align-items-center gap-1"
                                      key={index}
                                    >
                                      <input
                                        type="checkbox"
                                        className="m-0"
                                        name=""
                                        id={`star${index}`}
                                        value={category?.id}
                                        checked={quotationFormValue?.HotelStarCategory.some(
                                          (value) => value == category?.id
                                        )}
                                        onChange={handleQuotationFormChange}
                                      />
                                      <label
                                        htmlFor={`star${index}`}
                                        className="m-0"
                                      >
                                        {category?.UploadKeyword}
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          <div className="col-6">
                            <label htmlFor="" className="m-0 font-size-12">
                              Select Inbuilt Packages
                            </label>
                            <select
                              name="PackageID"
                              id=""
                              className="form-input-6"
                              value={quotationFormValue?.PackageID}
                              onChange={handleQuotationFormChange}
                            >
                              <option value="">Select</option>
                            </select>
                          </div>
                        </div>
                        <div className="modal-footer pt-3 px-0">
                          <div className="m-0 d-flex gap-3">
                            <button
                              className="modal-save-button m-0"
                              onClick={handleQuotationAdd}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              id="cancel"
                              className="modal-close-button m-0"
                              data-dismiss="modal"
                              ref={popupRef}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-2 border quotatation-shadow py-2 px-1">
            <p className="text-center fs-6">Destination</p>
            <div className="d-flex justify-content-between">
              <div>
                <p className="m-0">From</p>
                <p className="font-weight-bold m-0">Delhi</p>
              </div>
              <div>
                <p className=""></p>
                <p>
                  <i className="fa-solid fa-right-long"></i>
                </p>
              </div>
              <div>
                <p className="m-0">To</p>
                <p className="font-weight-bold m-0">Agra</p>
              </div>
            </div>
            <div className="mt-3">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="p-0 font-weight-normal font-size-12 text-center">
                      Duration
                    </th>
                    <th className="p-0 font-weight-normal font-size-12 text-center">
                      Destination
                    </th>
                    <th className="p-0 font-weight-normal font-size-12 text-center">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {queryList?.TravelDateInfo?.TravelData?.map((data, index) => {
                    return (
                      <tr key={index + 1}>
                        <td className="p-0 font-size-12 text-center padding-y-5">
                          Day {index + 1}
                        </td>
                        <td className="p-0 font-size-12 text-center padding-y-5 TotalNights">
                          {data?.DestinationName}
                        </td>
                        <td className="p-0 font-size-12 text-center padding-y-5">
                          {formatDate(data?.Date)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <div className="d-flex flex-column border width-30-percent">
                <span className="m-0 text-center font-size-11">NIGHTS</span>
                <span className="font-weight-bold text-center font-size-12">
                  {queryList?.TravelDateInfo?.TotalNights != ""
                    ? queryList?.TravelDateInfo?.TotalNights
                    : 0}
                </span>
              </div>
              <div className="d-flex flex-column border width-30-percent">
                <span className="m-0 text-center font-size-11">ADULTS</span>
                <span className="font-weight-bold text-center font-size-12">
                  {queryList?.PaxInfo?.Adult}
                </span>
              </div>
              <div className="d-flex flex-column border width-30-percent">
                <span className="m-0 text-center font-size-11">CHILDS</span>
                <span className="font-weight-bold text-center font-size-12">
                  {queryList?.PaxInfo?.Child}
                </span>
              </div>
            </div>
            <div className="d-flex gap-1 mt-3 flex-wrap row-gap-1">
              {queryList?.Hotel?.RoomInfo?.map((room, index) => {
                return (
                  <div
                    className="d-flex flex-column border width-30-percent"
                    key={index}
                  >
                    <span className="m-0 text-center font-size-11">
                      {room?.RoomType != null
                        ? room?.RoomType?.split(" ")[0]
                        : "null"}
                    </span>
                    <span className="font-weight-bold text-center font-size-12">
                      {room?.NoOfPax != null ? room?.NoOfPax : 0}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2">
              <div className="w-50 border d-flex flex-column p-0">
                <span className="text-center m-0 font-size-10">BUDGET</span>
                <span className="text-center m-0 font-siz-11">
                  {queryList?.Budget}
                </span>
              </div>
            </div>
            <div className="border p-0 py-2 mt-2 border-right-0 border-left-0">
              <p className="m-0 font-size-10">ROOM PREFERENCE :</p>
            </div>
            <div className="mt-2">
              <div className="d-flex flex-column">
                <span className="font-size-10">OPERATION PERSON</span>
                <span className="font-size-11 font-weight-bold">
                  {queryList?.Prefrences?.ContractingPersonName}
                </span>
              </div>
            </div>
          </div>
          <div className="col-10  mt-3 overflow main-content-table">
            <table className="table">
              <thead className="w-100">
                <tr className="w-100 light-gray-text table-th-font">
                  <th className="p-0 py-2 px-1 border-0">QUOTATION ID</th>
                  <th className="p-0 py-2 px-1 border-0">FROM DATE</th>
                  <th className="p-0 py-2 px-1 border-0">TO DATE</th>
                  <th className="p-0 py-2 px-1 border-0">DURATION</th>
                  <th className="p-0 py-2 px-1 border-0">TOTAL PAX</th>
                  <th className="p-0 py-2 px-1 border-0">ACTION</th>
                </tr>
              </thead>
              <tbody className="w-100 ">
                {quotatinoList?.map((quotation, index) => {
                  return (
                    <tr className="w-100 border table-td-font" key={index}>
                      <td className="text-primary p-0 py-1 px-1 border-0">
                        {quotation?.QuotationNumber}
                      </td>
                      <td className="p-0 py-1 px-1 border-0">
                        {quotation?.TourSummary?.FromDate}
                      </td>
                      <td className="p-0 py-1 px-1 border-0">
                        {quotation?.TourSummary?.ToDate}
                      </td>
                      <td className="p-0 py-1 px-1 border-0">
                        {quotation?.TourSummary?.NumberOfNights}N/
                        {quotation?.TourSummary?.NumberOfDays}D
                      </td>
                      <td className="p-0 py-1 px-1 border-0">
                        {quotation?.TourSummary?.PaxCount} Pax
                      </td>
                      <td className="p-0 py-1 px-1 border-0">
                        <div className="d-flex gap-3">
                          <button className="border px-1">Costsheet</button>
                          <button className="border px-1">Proposal</button>
                          <button className="border px-1">Duplicate</button>
                          <button className="border px-1">
                            Payment Request
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {quotatinoList.length < 1 && (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default QoutationList;
