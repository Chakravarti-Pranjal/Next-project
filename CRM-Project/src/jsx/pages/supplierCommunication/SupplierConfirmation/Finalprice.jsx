import React, { useEffect, useState } from "react";
import "../../../../css/new-style.css";
import { Row, Card, Col, CardHeader } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import { axiosOther } from "../../../../http/axios_base_url";
import styles from "./custom.module.css";
import { notifyError, notifySuccess } from "../../../../helper/notify";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { customStyles } from "./customStyle";

const Finalprice = () => {
  const quotationDataOperation = useSelector(
    (state) => state.queryReducer?.quotationDataOperation
  );
  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const navigate = useNavigate();

  const [finalQuotationList, setFinalQuotationList] = useState({});
  const [formValue, setFormValue] = useState({});
  const [roomInfo, setRoomInfo] = useState([]);
  const [finalPriceData, setFinalPriceData] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const getServerApi = async () => {
    try {
      const { data } = await axiosOther.post("lisFinalQuotation", {
        QueryId: quotationDataOperation?.QueryId ?? queryQuotation.QueryID,
        QuotationNo:
          quotationDataOperation?.QuotationNumber ??
          queryQuotation.QoutationNum,
        ServiceType: selectedService?.label || ""
      });

      setFinalQuotationList(data?.FilteredQuotations?.[0]);
      // console.log(data?.FilteredQuotations?.[0], "RI12");
      setRoomInfo(data?.FilteredQuotations?.[0]?.RoomInfo);

      // Initialize quotaton service Cost
      const initialFormValues = {};
      data?.FilteredQuotations?.[0]?.Days?.forEach((day) => {
        day?.DayServices?.forEach((service) => {
          if (service?.ServiceType === "Monument" && service?.ServiceUniqueId) {
            initialFormValues[service.ServiceUniqueId] = {
              OldAdultCost:
                service?.ServiceDetails?.[0]?.ItemUnitCost?.FAdultCost ?? 0,
              OldChildCost:
                service?.ServiceDetails?.[0]?.ItemUnitCost?.FChildCost ?? 0,
              ApprovedBy: "",
              ApprovedDate: null,
            };
          }
          if (service?.ServiceType === "Train" && service?.ServiceUniqueId) {
            initialFormValues[service.ServiceUniqueId] = {
              OldAdultCost:
                service?.ServiceDetails[0]?.ItemUnitCost?.Adult ?? 0,
              FinalAdultCost:
                service?.ServiceDetails[0]?.ItemUnitCost?.Adult ?? 0,
              OldChildCost:
                service?.ServiceDetails[0]?.ItemUnitCost?.Child ?? 0,
              FinalChildCost:
                service?.ServiceDetails[0]?.ItemUnitCost?.Child ?? 0,
              ApprovedBy: "",
              ApprovedDate: null,
            };
          }
          if (service?.ServiceType === "Flight" && service?.ServiceUniqueId) {
            initialFormValues[service.ServiceUniqueId] = {
              OldAdultCost:
                service?.ServiceDetails[0]?.ItemUnitCost?.Adult ?? 0,
              FinalAdultCost:
                service?.ServiceDetails[0]?.ItemUnitCost?.Adult ?? 0,
              OldChildCost:
                service?.ServiceDetails[0]?.ItemUnitCost?.Child ?? 0,
              FinalChildCost:
                service?.ServiceDetails[0]?.ItemUnitCost?.Child ?? 0,
              ApprovedBy: "",
              ApprovedDate: null,
            };
          }
          if (service?.ServiceType === "Activity" && service?.ServiceUniqueId) {
            initialFormValues[service.ServiceUniqueId] = {
              OldTotalActivityCost: service?.TotalCosting?.ActivityCost ?? 0,
              FinalActivityTotalCost: service?.TotalCosting?.ActivityCost,
              OldPax: service?.AdditionalCost[0]?.UpToPax,
              FinalPax: service?.AdditionalCost[0]?.UpToPax,
              OldPerPaxCost: service?.AdditionalCost[0]?.Amount,
              FinalPerPaxCost: service?.AdditionalCost[0]?.Amount,
              ApprovedBy: "",
              ApprovedDate: null,
            };
          }
          if (
            service?.ServiceType === "Additional" &&
            service?.ServiceUniqueId
          ) {
            initialFormValues[service.ServiceUniqueId] = {
              OldTotalActivityCost: service?.TotalCosting?.AdditionalCost ?? 0,
              FinalActivityTotalCost: service?.TotalCosting?.AdditionalCost,
              OldPax: service?.AdditionalCost[0]?.UpToPax,
              FinalPax: service?.AdditionalCost[0]?.UpToPax,
              OldPerPaxCost: service?.AdditionalCost[0]?.Amount,
              FinalPerPaxCost: service?.AdditionalCost[0]?.Amount,
              ApprovedBy: "",
              ApprovedDate: null,
            };
          }
          if (
            service?.ServiceType === "Transport" &&
            service?.ServiceUniqueId
          ) {
            initialFormValues[service.ServiceUniqueId] = {
              OldVehicleCost: service?.VehicleType[0]?.Cost ?? 0,
              FinalVehicleCost: service?.VehicleType[0]?.Cost,
              ApprovedBy: "",
              ApprovedDate: null,
            };
          }
          if (service?.ServiceType === "Hotel" && service?.ServiceUniqueId) {
            // console.log(service, "CHECK12");

            initialFormValues[service.ServiceUniqueId] = {
              RoomBedType:
                service?.ServiceDetails[0]?.ItemUnitCost?.RoomBedType?.map(
                  (room) => {
                    // console.log(room?.RoomBedTypeId, "ROOMBED767");
                    return {
                      RoomBedTypeId: String(room?.RoomBedTypeId),
                      RoomOldPrice: room.RoomCost ?? 0,
                      FinalPrice: room.RoomCost ?? 0,
                      NoOfOldRoom:
                        getRoomQuantity(
                          room?.RoomBedTypeId,
                          data?.FilteredQuotations?.[0]?.RoomInfo
                        ) || 0,
                      FinalRoom:
                        getRoomQuantity(
                          room?.RoomBedTypeId,
                          data?.FilteredQuotations?.[0]?.RoomInfo
                        ) || 0,
                    };
                  }
                ) ?? [],

              ApprovedBy: "",
              ApprovedDate: null,
            };

            // console.log(
            //   initialFormValues[service.ServiceUniqueId],
            //   "ROOMBED767"
            // );
          }
          if (
            service?.ServiceType === "Guide" &&
            service?.ServiceUniqueId &&
            service?.Rates?.length > 0
          ) {
            const pax = service?.PaxDetails?.TotalNoOfPax;

            const matchedPax = service?.Rates?.find(
              (item) =>
                pax >= parseInt(item.StartPax) && pax <= parseInt(item.EndPax)
            );

            const guideFee = parseFloat(matchedPax.GuideFee || 0);
            const laFee = parseFloat(matchedPax.LAFee || 0);
            const othersFee = parseFloat(matchedPax.OthersFee || 0);

            const totalFee = guideFee + laFee + othersFee;

            initialFormValues[service.ServiceUniqueId] = {
              OldPerPaxCost: totalFee,
              FinalPerPaxCost: totalFee,
              ApprovedBy: "",
              ApprovedDate: null,
            };

            // console.log(initialFormValues[service.ServiceUniqueId], "GI8");
          }
          if (
            service?.ServiceType === "Restaurant" &&
            service?.ServiceUniqueId
          ) {
            initialFormValues[service.ServiceUniqueId] = {
              MealType:
                service?.MealPlan?.map((meal) => ({
                  MealName: meal.MealType,
                  MealOldCost: meal.Amount ?? 0,
                  MealFinalCost: meal.Amount ?? 0,
                })) ?? [],
              ApprovedBy: "",
              ApprovedDate: "",
            };

            // console.log(initialFormValues, "JJH8");
          }
        });
      });
      setFormValue(initialFormValues);
    } catch (err) {
      console.log(err);
    }

    try {
      const { data } = await axiosOther.post("listFinalPrice", {
        QueryId: quotationDataOperation?.QueryId ?? queryQuotation.QueryID,
        QuotationNo:
          quotationDataOperation?.QuotationNumber ??
          queryQuotation.QoutationNum,
      });

      setFinalPriceData(data?.Data);
      // console.log(data?.Data, "FPD6");
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("listproduct");
      const options = data?.Datalist?.map((item) => ({
        value: item?.id,
        label: item?.name,
      }));
      setServiceList(options);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getServerApi();
  }, []);

  // console.log(selectedService?.label, "selectedService")
  const handleFilterSearch = () => {
    getServerApi()
  };
  const handleClearFilters = () => {
    setSelectedService(null); // sirf state clear
  };

  useEffect(() => {
    if (selectedService === null) {
      getServerApi(); // null hone par API chale
    }
  }, [selectedService]);


  useEffect(() => {
    if (finalPriceData.length > 0) {
      const updatedFormValue = {};
      finalPriceData.forEach((item) => {
        if (item.ServiceType === "Restaurant") {
          updatedFormValue[item.ServiceUniqueId] = {
            ...item,
            MealType: item.Mealtype,
          };
        } else if (item.ServiceType === "Hotel") {
          const roomBedTypes =
            item?.RoomBedType?.map((room) => ({
              RoomBedTypeId: room.RoomBedTypeId ?? room?.id,
              RoomOldPrice: Number(room.RoomOldPrice),
              FinalPrice: Number(room.FinalPrice),
              NoOfOldRoom: room.NoOfOldRoom || 0,
              FinalRoom: room.FinalRoom || 0,
            })) || [];

          updatedFormValue[item.ServiceUniqueId] = {
            ...item,
            RoomBedType: roomBedTypes,
          };

          // console.log(finalPriceData, "HOTELT76");
        } else {
          updatedFormValue[item.ServiceUniqueId] = {
            ...item,
          };
        }
      });
      setFormValue((prev) => ({
        ...prev,
        ...updatedFormValue,
      }));
    }
  }, [finalPriceData]);

  // console.log(formValue, "formValue36644");

  const getRoomQuantity = (roomId, roomList) => {
    const list = roomInfo.length > 0 ? roomInfo : roomList;

    const roomQuantity = list?.find((rId) => rId.id == roomId);
    return roomQuantity?.NoOfPax || 0;
  };

  const handleSave = async (service, dayNo) => {
    const payload = {
      ...formValue[service.ServiceUniqueId],
      QueryId: quotationDataOperation?.QueryId ?? queryQuotation?.QueryID,
      QuotationNumber:
        quotationDataOperation?.QuotationNumber ?? queryQuotation?.QoutationNum,
      ServiceUniqueId: service?.ServiceUniqueId,
      DayNo: dayNo?.Day,
      ServiceID: service?.ServiceId ? String(service?.ServiceId) : "",
      ServiceType:
        service?.ServiceType === "Monument" ? "Entrance" : service?.ServiceType,
      ApprovedDate: formatDateForValue(
        formValue[service.ServiceUniqueId].ApprovedDate
      ),
    };

    // console.log(payload, "PAYLOAD");

    try {
      const { data } = await axiosOther.post("add-final-price-change", payload);
      if (data?.Success) {
        notifySuccess(data?.Message || "Final Price Change Successfully");
      }
    } catch (error) {
      notifyError(error?.message || "Something went wrong!");
      console.log("Error: ", error);
    }
  };

  const handleChangeFormValue = (ServiceUniqueId, field, value) => {
    setFormValue((prev) => ({
      ...prev,
      [ServiceUniqueId]: {
        ...prev[ServiceUniqueId],
        [field]: value,
      },
    }));
  };

  const handleChangeHotelFormValue = (ServiceUniqueId, index, field, value) => {
    setFormValue((prev) => {
      const updatedRooms = [...(prev[ServiceUniqueId]?.RoomBedType || [])];
      updatedRooms[index] = {
        ...updatedRooms[index],
        [field]: value,
      };

      return {
        ...prev,
        [ServiceUniqueId]: {
          ...prev[ServiceUniqueId],
          RoomBedType: updatedRooms,
        },
      };
    });
  };

  const handleChangeRestaurantFormValue = (
    ServiceUniqueId,
    index,
    field,
    value
  ) => {
    setFormValue((prev) => {
      const updatedMeals = [...(prev[ServiceUniqueId]?.MealType || [])];
      updatedMeals[index] = {
        ...updatedMeals[index],
        [field]: value,
      };

      return {
        ...prev,
        [ServiceUniqueId]: {
          ...prev[ServiceUniqueId],
          MealType: updatedMeals,
        },
      };
    });
  };

  const formatDateForValue = (dateObj) => {
    if (!dateObj) return "";
    const date = new Date(dateObj);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // console.log(formValue, "FORM");

  return (
    <div className="Finalprice m-0 p-0">
      <Row>
        <Col sm={12}>
          <Card>
            <CardHeader className="my-1 border-0 p-0 m-0">
              <div className="col-md-12 d-flex justify-content-end align-item-center gap-1 col-sm-12 pe-3">
                <div className="row align-items-center w-100">
                  <div className="col-lg-3 col-md-6 mb-3">
                    <label className="querydetails text-grey">Service Type</label>
                    <Select
                      name="service"
                      value={selectedService}
                      placeholder="Select Service"
                      onChange={(selectedOption) => setSelectedService(selectedOption)}
                      options={serviceList}
                      isSearchable
                      isClearable
                      styles={customStyles}
                      className="customSelectLightTheame"
                      classNamePrefix="custom"
                    />
                  </div>
                  <div className="col-lg-4 d-flex align-items-end ">
                    <button
                      onClick={handleFilterSearch}
                      className="btn btn-primary btn-custom-size mt-2 me-2"
                    >
                      Search
                    </button>
                    <button
                      onClick={handleClearFilters}
                      className="btn btn-dark btn-custom-size me-2 mt-2"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                {/* <div className="col-lg-2 options col-md-6">
                  <select
                    name=""
                    id=""
                    className="form-control form-control-sm"
                  >
                    <option value="">
                      {quotationDataOperation?.QuotationNumber} | Main
                    </option>
                  </select>
                </div> */}
                <div className="col-lg-3 col-md-6">
                  <div className="d-flex justify-content-end align-content-center gap-1">
                    {/* <div className="d-flex">
                      <button
                        className="btn btn-dark btn-custom-size me-2"
                        onClick={() => navigate(-1)}
                      >
                        <span className="me-1">Back</span>
                        <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                      </button>
                      <button
                        className="btn btn-primary btn-custom-size "
                        name="SaveButton"
                        onClick={() => navigate("/query/payments")}
                      >
                        <span className="me-1">Next</span>
                        <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
                      </button>
                    </div> */}
                    {/* <div className="ApplyFilter">
                      <button className="btn btn-primary btn-custom-size">
                        Apply Filter
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            </CardHeader>
            <Card.Body className="pt-1 px-0 mx-0">
              {finalQuotationList?.Days &&
                finalQuotationList?.Days?.length > 0 &&
                finalQuotationList?.Days?.map((data) => {
                  return (
                    data?.DayServices?.length > 0 &&
                    data?.DayServices?.map((data2, idx) => {
                      return (
                        <div key={idx}>
                          <div className="tablebody">
                            {/* Restaurant */}
                            {data2?.ServiceType === "Restaurant" && (
                              <div className={styles.card}>
                                {/* {console.log(data2, "RES67")} */}
                                <div className={styles.header}>
                                  <div className={styles.serviceType}>
                                    <span className={styles.label}>
                                      Service Type :
                                    </span>
                                    <span className={styles.value}>
                                      RESTAURENT
                                    </span>
                                  </div>
                                </div>

                                <div className={styles.details}>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Restaurant Name
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.ServiceDetails[0]?.ItemName}
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Supplier Name
                                    </span>
                                    <span className={styles.detailValue}>
                                      {
                                        data2?.ServiceDetails[0]
                                          ?.ItemSupplierDetail?.ItemSupplierName
                                      }
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Time
                                    </span>
                                    <span className={styles.detailValue}>
                                      {
                                        data2?.ServiceDetails?.[0]
                                          ?.TimingDetails?.ItemFromTime
                                      }{" "}
                                      -{" "}
                                      {
                                        data2?.ServiceDetails?.[0]
                                          ?.TimingDetails?.ItemToTime
                                      }
                                    </span>
                                  </div>
                                </div>
                                <table className={styles.quoteTable}>
                                  <thead>
                                    <tr>
                                      <th className={styles.tableHeader}></th>

                                      {formValue[
                                        data2.ServiceUniqueId
                                      ]?.MealType?.map((meal, index) => (
                                        <th
                                          key={index}
                                          className={styles.tableHeader}
                                        >
                                          {meal.MealName} Cost
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Quote Price
                                        </span>
                                      </td>

                                      {formValue[
                                        data2.ServiceUniqueId
                                      ]?.MealType?.map((meal, index) => (
                                        <td
                                          key={index}
                                          className={styles.tableCell}
                                        >
                                          <div
                                            style={{
                                              width: "50%",
                                              margin: "0 auto",
                                            }}
                                          >
                                            <input
                                              type="text"
                                              name="MealOldCost"
                                              className={`${styles.input} form-control form-control-sm  height-25`}
                                              value={meal.MealOldCost}
                                              disabled
                                            />
                                          </div>
                                        </td>
                                      ))}
                                    </tr>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Final Price
                                        </span>
                                      </td>

                                      {formValue[
                                        data2.ServiceUniqueId
                                      ]?.MealType?.map((meal, index) => (
                                        <td
                                          key={index}
                                          className={styles.tableCell}
                                        >
                                          <div
                                            style={{
                                              width: "50%",
                                              margin: "0 auto",
                                            }}
                                          >
                                            <input
                                              type="text"
                                              name="MealFinalCost"
                                              className={`${styles.footerInput} form-control form-control-sm `}
                                              value={meal.MealFinalCost}
                                              onChange={(e) =>
                                                handleChangeRestaurantFormValue(
                                                  data2.ServiceUniqueId,
                                                  index,
                                                  "MealFinalCost",
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                      ))}
                                    </tr>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Approved By / Date
                                        </span>
                                      </td>

                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="ApprovedBy"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            placeholder="Full Name"
                                            value={
                                              formValue[data2.ServiceUniqueId]
                                                ?.ApprovedBy
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedBy",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <DatePicker
                                            dateFormat="dd-MM-yyyy"
                                            placeholderText="dd-mm-yyyy"
                                            className={`${styles.footerInput} form-control form-control-sm`}
                                            selected={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.ApprovedDate
                                                ? new Date(
                                                  formValue[
                                                    data2?.ServiceUniqueId
                                                  ]?.ApprovedDate
                                                )
                                                : null
                                            }
                                            onChange={(date) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedDate",
                                                date
                                              )
                                            }
                                            isClearable
                                            todayButton="Today"
                                          />
                                        </div>
                                      </td>
                                      <td></td>
                                    </tr>
                                  </tbody>
                                </table>

                                <div className="text-right mt-2">
                                  <button
                                    onClick={() => handleSave(data2, data)}
                                    className={`${styles.saveButton} btn btn-primary btn-custom-size ms-auto d-block`}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Guide */}
                            {data2?.ServiceType == "Guide" &&
                              data2?.Rates?.length > 0 && (
                                <div className={styles.card}>
                                  <div className={styles.header}>
                                    <div className={styles.serviceType}>
                                      <span className={styles.label}>
                                        Service Type :
                                      </span>
                                      <span className={styles.value}>
                                        GUIDE
                                      </span>
                                    </div>
                                  </div>

                                  <div className={styles.details}>
                                    <div className={styles.detailItem}>
                                      <span className={styles.detailLabel}>
                                        Guide Service
                                      </span>
                                      <span className={styles.detailValue}>
                                        {data2?.ServiceDetails[0]?.ItemName}
                                      </span>
                                    </div>
                                    <div className={styles.detailItem}>
                                      <span className={styles.detailLabel}>
                                        Supplier Name
                                      </span>
                                      <span className={styles.detailValue}>
                                        {
                                          data2?.ServiceDetails[0]
                                            ?.ItemSupplierDetail
                                            ?.ItemSupplierName
                                        }
                                      </span>
                                    </div>
                                    <div className={styles.detailItem}>
                                      <span className={styles.detailLabel}>
                                        Date
                                      </span>
                                      <span className={styles.detailValue}>
                                        {data2?.ServiceDetails?.[0]?.TimingDetails?.ItemFromDate?.split(
                                          "-"
                                        )
                                          .reverse()
                                          .join("-")}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Item Cost Price */}

                                  <table className={styles.quoteTable}>
                                    <thead>
                                      <tr>
                                        <th className={styles.tableHeader}></th>
                                        <th
                                          className={styles.tableHeader}
                                          colSpan={3}
                                        >
                                          Per Pax Cost
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className={styles.tableCell}>
                                          <span className={styles.detailLabel}>
                                            Quote Price
                                          </span>
                                        </td>
                                        <td
                                          className={styles.tableCell}
                                          colSpan={3}
                                        >
                                          <div
                                            style={{
                                              width: "25%",
                                              margin: "0 auto",
                                            }}
                                          >
                                            <input
                                              type="text"
                                              name="OldPerPaxCost"
                                              className={`${styles.input} form-control form-control-sm  height-25`}
                                              value={
                                                formValue[data2.ServiceUniqueId]
                                                  ?.OldPerPaxCost
                                              }
                                              disabled
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className={styles.tableCell}>
                                          <span className={styles.detailLabel}>
                                            Final Price
                                          </span>
                                        </td>
                                        <td
                                          className={styles.tableCell}
                                          colSpan={3}
                                        >
                                          <div
                                            style={{
                                              width: "25%",
                                              margin: "0 auto",
                                            }}
                                          >
                                            <input
                                              type="text"
                                              name="FinalPerPaxCost"
                                              className={`${styles.footerInput} form-control form-control-sm `}
                                              value={
                                                formValue[data2.ServiceUniqueId]
                                                  ?.FinalPerPaxCost
                                              }
                                              onChange={(e) =>
                                                handleChangeFormValue(
                                                  data2?.ServiceUniqueId,
                                                  "FinalPerPaxCost",
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className={styles.tableCell}>
                                          <span className={styles.detailLabel}>
                                            Approved By / Date
                                          </span>
                                        </td>

                                        <td className={styles.tableCell}>
                                          <div
                                            style={{
                                              width: "50%",
                                              margin: "0 auto",
                                            }}
                                          >
                                            <input
                                              type="text"
                                              className={`${styles.footerInput} form-control form-control-sm `}
                                              placeholder="Full Name"
                                              value={
                                                formValue[data2.ServiceUniqueId]
                                                  ?.ApprovedBy
                                              }
                                              onChange={(e) =>
                                                handleChangeFormValue(
                                                  data2?.ServiceUniqueId,
                                                  "ApprovedBy",
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                        <td className={styles.tableCell}>
                                          <span className={styles.detailLabel}>
                                            Approved By / Date
                                          </span>
                                        </td>
                                        <td className={styles.tableCell}>
                                          <div
                                            style={{
                                              width: "50%",
                                              margin: "0 auto",
                                            }}
                                          >
                                            <DatePicker
                                              dateFormat="dd-MM-yyyy"
                                              placeholderText="dd-mm-yyyy"
                                              className={`${styles.footerInput} form-control form-control-sm`}
                                              selected={
                                                formValue[
                                                  data2?.ServiceUniqueId
                                                ]?.ApprovedDate
                                                  ? new Date(
                                                    formValue[
                                                      data2?.ServiceUniqueId
                                                    ]?.ApprovedDate
                                                  )
                                                  : null
                                              }
                                              onChange={(date) =>
                                                handleChangeFormValue(
                                                  data2?.ServiceUniqueId,
                                                  "ApprovedDate",
                                                  date
                                                )
                                              }
                                              isClearable
                                              todayButton="Today"
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  <div className="text-right mt-2">
                                    <button
                                      className={`${styles.saveButton} btn btn-primary btn-custom-size ms-auto d-block`}
                                      onClick={() => handleSave(data2, data)}
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              )}

                            {data2?.ServiceType === "Hotel" && (
                              <div className={styles.card}>
                                <div className={styles.header}>
                                  <div className={styles.serviceType}>
                                    <span className={styles.label}>
                                      Service Type :
                                    </span>
                                    <span className={styles.value}>HOTEL</span>
                                  </div>
                                </div>

                                <div className={styles.details}>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Hotel:
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.ServiceDetails?.[0]?.ItemName} (
                                      {data2?.DestinationName}) |{" "}
                                      {data2?.HotelCategoryName} Star
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Room Type:
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.RoomCategoryName} Room
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Meal Plan:
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.MealPlanName}
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Supplier:
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.ServiceDetails?.[0]?.ItemName}
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Date:
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.ServiceDetails?.[0]?.TimingDetails?.ItemFromDate?.split(
                                        "-"
                                      )
                                        .reverse()
                                        .join("-")}
                                    </span>
                                  </div>
                                </div>
                                <table className={styles.quoteTable}>
                                  <thead>
                                    <tr>
                                      <th className={styles.tableHeader}></th>
                                      {data2?.ServiceDetails?.[0]?.ItemUnitCost?.RoomBedType?.map(
                                        (room, index) => (
                                          <th
                                            key={index}
                                            className={styles.tableHeader}
                                          >
                                            {room?.RoomBedTypeName}
                                          </th>
                                        )
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span
                                          className={styles.detailLabel}
                                        ></span>
                                      </td>
                                      {data2?.ServiceDetails?.[0]?.ItemUnitCost?.RoomBedType?.map(
                                        (room, index) => (
                                          <td
                                            key={index}
                                            className={styles.tableCell}
                                          >
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-evenly",
                                                gap: "6px",
                                                alignItems: "center",
                                              }}
                                            >
                                              <span>Price</span>
                                              <span>Rooms</span>
                                            </div>
                                          </td>
                                        )
                                      )}
                                    </tr>
                                    {/* {console.log(
                                      formValue[data2.ServiceUniqueId],
                                      "KJH89"
                                    )} */}
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Quote Price
                                        </span>
                                      </td>
                                      {formValue[
                                        data2.ServiceUniqueId
                                      ]?.RoomBedType?.map((room, index) => (
                                        <td
                                          key={index}
                                          className={styles.tableCell}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-evenly",
                                              gap: "6px",
                                              alignItems: "center",
                                            }}
                                          >
                                            <input
                                              type="number"
                                              name="RoomOldPrice"
                                              className={`${styles.footerInput} form-control form-control-sm  height-25`}
                                              value={room?.RoomOldPrice}
                                              disabled
                                            />
                                            <input
                                              type="number"
                                              name="NoOfOldRoom"
                                              className={`${styles.footerInput} form-control form-control-sm  height-25`}
                                              value={room?.NoOfOldRoom}
                                              disabled
                                            />
                                          </div>
                                        </td>
                                      ))}
                                    </tr>

                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Final Price
                                        </span>
                                      </td>
                                      {formValue[
                                        data2.ServiceUniqueId
                                      ]?.RoomBedType?.map((room, roomIdx) => (
                                        <td
                                          key={roomIdx}
                                          className={styles.tableCell}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-evenly",
                                              gap: "6px",
                                              alignItems: "center",
                                            }}
                                          >
                                            <input
                                              type="number"
                                              name="FinalPrice"
                                              className={`${styles.footerInput} form-control form-control-sm  height-25`}
                                              value={room?.FinalPrice}
                                              onChange={(e) =>
                                                handleChangeHotelFormValue(
                                                  data2?.ServiceUniqueId,
                                                  roomIdx,
                                                  "FinalPrice",
                                                  e.target.value
                                                )
                                              }
                                            />
                                            <input
                                              type="number"
                                              name="FinalRoom"
                                              className={`${styles.footerInput} form-control form-control-sm  height-25 font-second-rem`}
                                              value={room.FinalRoom}
                                              onChange={(e) =>
                                                handleChangeHotelFormValue(
                                                  data2?.ServiceUniqueId,
                                                  roomIdx,
                                                  "FinalRoom",
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                      ))}
                                    </tr>

                                    <tr>
                                      <td
                                        colSpan={2}
                                        className={styles.tableCell}
                                      >
                                        <span className={styles.detailLabel}>
                                          Approved By / Date
                                        </span>
                                      </td>
                                      <td
                                        colSpan={2}
                                        className={styles.tableCell}
                                      >
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="ApprovedBy"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            placeholder="Full Name"
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.ApprovedBy
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedBy",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td
                                        colSpan={2}
                                        className={styles.tableCell}
                                      >
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <DatePicker
                                            dateFormat="dd-MM-yyyy"
                                            placeholderText="dd-mm-yyyy"
                                            className={`${styles.footerInput} form-control form-control-sm`}
                                            selected={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.ApprovedDate
                                                ? new Date(
                                                  formValue[
                                                    data2?.ServiceUniqueId
                                                  ]?.ApprovedDate
                                                )
                                                : null
                                            }
                                            onChange={(date) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedDate",
                                                date
                                              )
                                            }
                                            isClearable
                                            todayButton="Today"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <div className="text-right mt-2">
                                  <button
                                    className={`${styles.saveButton} btn btn-primary btn-custom-size ms-auto d-block`}
                                    onClick={() => handleSave(data2, data)}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Additional */}
                            {data2?.ServiceType == "Additional" && (
                              <div className={styles.card}>
                                <div className={styles.header}>
                                  <div className={styles.serviceType}>
                                    <span className={styles.label}>
                                      Service Type :
                                    </span>
                                    <span className={styles.value}>
                                      ADDITIONAL
                                    </span>
                                  </div>
                                </div>

                                <div className={styles.details}>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Additional
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.ServiceDetails[0]?.ItemName}
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Supplier Name
                                    </span>
                                    <span className={styles.detailValue}>
                                      {
                                        data2?.ServiceDetails[0]
                                          ?.ItemSupplierDetail?.ItemSupplierName
                                      }
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Activity Time
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.ActivityTime}
                                    </span>
                                  </div>
                                </div>

                                <table className={styles.quoteTable}>
                                  <thead>
                                    <tr>
                                      <th className={styles.tableHeader}></th>
                                      <th className={styles.tableHeader}>
                                        Total Additional Cost
                                      </th>
                                      <th className={styles.tableHeader}>
                                        Max pax
                                      </th>
                                      <th className={styles.tableHeader}>
                                        Per Pax Cost
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Quote Price
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="OldTotalActivityCost"
                                            className={`${styles.input} form-control form-control-sm  height-25`}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldTotalActivityCost
                                            }
                                            disabled
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="OldPax"
                                            className={`${styles.input} form-control form-control-sm  height-25`}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldPax
                                            }
                                            disabled
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="OldPerPaxCost"
                                            className={`${styles.input} form-control form-control-sm  height-25`}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldPerPaxCost
                                            }
                                            disabled
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Final Price
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="FinalActivityTotalCost"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.FinalActivityTotalCost
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "FinalActivityTotalCost",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="FinalPax"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.FinalPax
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "FinalPax",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="FinalPerPaxCost"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.FinalPerPaxCost
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "FinalPerPaxCost",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Approved By
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            placeholder="Full Name"
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.ApprovedBy
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedBy",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Approved Date
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <DatePicker
                                            dateFormat="dd-MM-yyyy"
                                            placeholderText="dd-mm-yyyy"
                                            className={`${styles.footerInput} form-control form-control-sm`}
                                            selected={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.ApprovedDate
                                                ? new Date(
                                                  formValue[
                                                    data2?.ServiceUniqueId
                                                  ]?.ApprovedDate
                                                )
                                                : null
                                            }
                                            onChange={(date) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedDate",
                                                date
                                              )
                                            }
                                            isClearable
                                            todayButton="Today"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <div className="text-right mt-2">
                                  <button
                                    className={`${styles.saveButton} btn btn-primary btn-custom-size ms-auto d-block`}
                                    onClick={() => handleSave(data2, data)}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Activity */}
                            {data2?.ServiceType == "Activity" && (
                              <div className={styles.card}>
                                <div className={styles.header}>
                                  <div className={styles.serviceType}>
                                    <span className={styles.label}>
                                      Service Type :
                                    </span>
                                    <span className={styles.value}>
                                      ACTIVITY
                                    </span>
                                  </div>
                                </div>

                                <div className={styles.details}>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Activity
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.ServiceDetails[0]?.ItemName}
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Supplier Name
                                    </span>
                                    <span className={styles.detailValue}>
                                      {
                                        data2?.ServiceDetails[0]
                                          ?.ItemSupplierDetail?.ItemSupplierName
                                      }
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Activity Time
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.ActivityTime}
                                    </span>
                                  </div>
                                </div>

                                <table className={styles.quoteTable}>
                                  <thead>
                                    <tr>
                                      <th className={styles.tableHeader}></th>
                                      <th className={styles.tableHeader}>
                                        Total Activity Cost
                                      </th>
                                      <th className={styles.tableHeader}>
                                        Max pax
                                      </th>
                                      <th className={styles.tableHeader}>
                                        Per Pax Cost
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Quote Price
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="OldTotalActivityCost"
                                            className={`${styles.input} form-control form-control-sm  height-25`}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldTotalActivityCost
                                            }
                                            disabled
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="OldPax"
                                            className={`${styles.input} form-control form-control-sm  height-25`}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldPax
                                            }
                                            disabled
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="OldPerPaxCost"
                                            className={`${styles.input} form-control form-control-sm  height-25`}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldPerPaxCost
                                            }
                                            disabled
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Final Price
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="FinalActivityTotalCost"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.FinalActivityTotalCost
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "FinalActivityTotalCost",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="FinalPax"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.FinalPax
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "FinalPax",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="FinalPerPaxCost"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.FinalPerPaxCost
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "FinalPerPaxCost",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Approved By
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            placeholder="Full Name"
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.ApprovedBy
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedBy",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Approved Date
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <DatePicker
                                            dateFormat="dd-MM-yyyy"
                                            placeholderText="dd-mm-yyyy"
                                            className={`${styles.footerInput} form-control form-control-sm`}
                                            selected={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.ApprovedDate
                                                ? new Date(
                                                  formValue[
                                                    data2?.ServiceUniqueId
                                                  ]?.ApprovedDate
                                                )
                                                : null
                                            }
                                            onChange={(date) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedDate",
                                                date
                                              )
                                            }
                                            isClearable
                                            todayButton="Today"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <div className="text-right mt-2">
                                  <button
                                    className={`${styles.saveButton} btn btn-primary btn-custom-size ms-auto d-block`}
                                    onClick={() => handleSave(data2, data)}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Fligth */}
                            {data2?.ServiceType === "Flight" && (
                              <div className={styles.card}>
                                <div className={styles.header}>
                                  <div className={styles.serviceType}>
                                    <span className={styles.label}>
                                      Service Type :
                                    </span>
                                    <span className={styles.value}>FLIGHT</span>
                                  </div>
                                </div>

                                <div className={styles.details}>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Flight Name
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.ServiceDetails[0]?.ItemName}
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Supplier Name
                                    </span>
                                    <span className={styles.detailValue}>
                                      {
                                        data2?.ServiceDetails[0]
                                          ?.ItemSupplierDetail?.ItemSupplierName
                                      }
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Departure Time
                                    </span>
                                    <span className={styles.detailValue}>
                                      {
                                        data2?.ServiceDetails[0]?.TimingDetails
                                          ?.ItemFromTime
                                      }
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Arrival Time
                                    </span>
                                    <span className={styles.detailValue}>
                                      {
                                        data2?.ServiceDetails[0]?.TimingDetails
                                          ?.ItemToTime
                                      }
                                    </span>
                                  </div>
                                </div>

                                <table className={styles.quoteTable}>
                                  <thead>
                                    <tr>
                                      <th className={styles.tableHeader}></th>
                                      <th className={styles.tableHeader}>
                                        Adult Cost
                                      </th>
                                      <th className={styles.tableHeader}>
                                        Child Cost
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Quote Price
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="OldAdultCost"
                                            className={`${styles.input} form-control form-control-sm  height-25`}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldAdultCost ?? ""
                                            }
                                            disabled
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="OldChildCost"
                                            className={`${styles.input} form-control form-control-sm  height-25`}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldChildCost ?? ""
                                            }
                                            disabled
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Final Price
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="number"
                                            name="FinalAdultCost"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.FinalAdultCost ??
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldAdultCost
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "FinalAdultCost",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="number"
                                            name="FinalChildCost"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.FinalChildCost ??
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldChildCost
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "FinalChildCost",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Approved By / Date
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="ApprovedBy"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            placeholder="Full Name"
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.ApprovedBy
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedBy",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <DatePicker
                                            dateFormat="dd-MM-yyyy"
                                            placeholderText="dd-mm-yyyy"
                                            className={`${styles.footerInput} form-control form-control-sm`}
                                            selected={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.ApprovedDate
                                                ? new Date(
                                                  formValue[
                                                    data2?.ServiceUniqueId
                                                  ]?.ApprovedDate
                                                )
                                                : null
                                            }
                                            onChange={(date) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedDate",
                                                date
                                              )
                                            }
                                            isClearable
                                            todayButton="Today"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <div className="text-right mt-2">
                                  <button
                                    onClick={() => handleSave(data2, data)}
                                    className={`${styles.saveButton} btn btn-primary btn-custom-size ms-auto d-block`}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            )}

                            {data2?.ServiceType === "Train" && (
                              <div className={styles.card}>
                                <div className={styles.header}>
                                  <div className={styles.serviceType}>
                                    <span className={styles.label}>
                                      Service Type :
                                    </span>
                                    <span className={styles.value}>TRAIN</span>
                                  </div>
                                  {/* <div className={styles.mainQuotation}>Main Quotation</div> */}
                                </div>
                                <div className={styles.details}>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Train Name
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.ServiceDetails[0]?.ItemName}
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Supplier Name
                                    </span>
                                    <span className={styles.detailValue}>
                                      {
                                        data2?.ServiceDetails[0]
                                          ?.ItemSupplierDetail?.ItemSupplierName
                                      }
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Departure Time
                                    </span>
                                    <span className={styles.detailValue}>
                                      {
                                        data2?.ServiceDetails[0]?.TimingDetails
                                          ?.ItemFromTime
                                      }
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Arrival Time
                                    </span>
                                    <span className={styles.detailValue}>
                                      {
                                        data2?.ServiceDetails[0]?.TimingDetails
                                          ?.ItemToTime
                                      }
                                    </span>
                                  </div>
                                </div>

                                <table className={styles.quoteTable}>
                                  <thead>
                                    <tr>
                                      <th className={styles.tableHeader}></th>
                                      <th className={styles.tableHeader}>
                                        Adult Cost
                                      </th>
                                      <th className={styles.tableHeader}>
                                        Child Cost
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Quote Price
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="OldAdultCost"
                                            className={`${styles.input} form-control form-control-sm  height-25`}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldAdultCost ?? ""
                                            }
                                            disabled
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="OldChildCost"
                                            className={`${styles.input} form-control form-control-sm  height-25`}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldChildCost ?? ""
                                            }
                                            disabled
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Final Price
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="number"
                                            name="FinalAdultCost"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.FinalAdultCost ??
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldAdultCost
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "FinalAdultCost",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="number"
                                            name="FinalChildCost"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.FinalChildCost ??
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldChildCost
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "FinalChildCost",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Approved By / Date
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="ApprovedBy"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            placeholder="Full Name"
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.ApprovedBy
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedBy",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <DatePicker
                                            dateFormat="dd-MM-yyyy"
                                            placeholderText="dd-mm-yyyy"
                                            className={`${styles.footerInput} form-control form-control-sm`}
                                            selected={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.ApprovedDate
                                                ? new Date(
                                                  formValue[
                                                    data2?.ServiceUniqueId
                                                  ]?.ApprovedDate
                                                )
                                                : null
                                            }
                                            onChange={(date) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedDate",
                                                date
                                              )
                                            }
                                            isClearable
                                            todayButton="Today"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <div className="text-right mt-2">
                                  <button
                                    onClick={() => handleSave(data2, data)}
                                    className={`${styles.saveButton} btn btn-primary btn-custom-size ms-auto d-block`}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            )}

                            {data2?.ServiceType === "Monument" && (
                              <div className={styles.card}>
                                <div className={styles.header}>
                                  <div className={styles.serviceType}>
                                    <span className={styles.label}>
                                      Service Type :
                                    </span>
                                    <span className={styles.value}>
                                      MONUMENT
                                    </span>
                                  </div>
                                </div>

                                <div className={styles.details}>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Monument Name
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.ServiceName} (
                                      {data2?.DestinationName})
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Supplier Name
                                    </span>
                                    <span className={styles.detailValue}>
                                      {
                                        data2?.ServiceDetails[0]
                                          ?.ItemSupplierDetail?.ItemSupplierName
                                      }
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Date
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.ServiceDetails[0]?.TimingDetails?.ItemFromDate?.split(
                                        "-"
                                      )
                                        .reverse()
                                        .join("-")}
                                    </span>
                                  </div>
                                </div>

                                <table className={styles.quoteTable}>
                                  <thead>
                                    <tr>
                                      <th className={styles.tableHeader}></th>
                                      <th className={styles.tableHeader}>
                                        Adult Cost
                                      </th>
                                      <th className={styles.tableHeader}>
                                        Child Cost
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Quote Price
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="OldAdultCost"
                                            className={`${styles.input} form-control form-control-sm height-25`}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldAdultCost ?? ""
                                            }
                                            disabled
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="OldChildCost"
                                            className={`${styles.input} form-control form-control-sm height-25`}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldChildCost ?? ""
                                            }
                                            disabled
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Final Price
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="number"
                                            name="FinalAdultCost"
                                            className={`${styles.footerInput} form-control form-control-sm`}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.FinalAdultCost ?? ""
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "FinalAdultCost",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="number"
                                            name="FinalChildCost"
                                            className={`${styles.footerInput} form-control form-control-sm`}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.FinalChildCost ?? ""
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "FinalChildCost",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Approved By / Date
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="ApprovedBy"
                                            className={`${styles.footerInput} form-control form-control-sm`}
                                            placeholder="Full Name"
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.ApprovedBy ?? ""
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedBy",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <DatePicker
                                            dateFormat="dd-MM-yyyy"
                                            placeholderText="dd-mm-yyyy"
                                            className={`${styles.footerInput} form-control form-control-sm`}
                                            selected={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.ApprovedDate
                                                ? new Date(
                                                  formValue[
                                                    data2?.ServiceUniqueId
                                                  ]?.ApprovedDate
                                                )
                                                : null
                                            }
                                            onChange={(date) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedDate",
                                                date
                                              )
                                            }
                                            isClearable
                                            todayButton="Today"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <div className="text-right mt-2">
                                  <button
                                    className={`${styles.saveButton} btn btn-primary btn-custom-size ms-auto d-block`}
                                    onClick={() => handleSave(data2, data)}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Transport */}
                            {data2?.ServiceType === "Transport" && (
                              <div className={styles.card}>
                                <div className={styles.header}>
                                  <div className={styles.serviceType}>
                                    <span className={styles.label}>
                                      Service Type :
                                    </span>
                                    <span className={styles.value}>
                                      TRANSPORT
                                    </span>
                                  </div>
                                </div>
                                <div className={styles.details}>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Transport Name
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.ServiceDetails[0]?.ItemName}
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Supplier Name
                                    </span>
                                    <span className={styles.detailValue}>
                                      {
                                        data2?.ServiceDetails[0]
                                          ?.ItemSupplierDetail?.ItemSupplierName
                                      }
                                    </span>
                                  </div>
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                      Date
                                    </span>
                                    <span className={styles.detailValue}>
                                      {data2?.ServiceDetails?.[0]?.TimingDetails?.ItemFromDate?.split(
                                        "-"
                                      )
                                        .reverse()
                                        .join("-")}
                                    </span>
                                  </div>
                                </div>

                                <table className={styles.quoteTable}>
                                  <thead>
                                    <tr>
                                      <th className={styles.tableHeader}></th>
                                      <th
                                        colSpan={3}
                                        className={styles.tableHeader}
                                      >
                                        Vehicle Name / Cost
                                      </th>
                                    </tr>
                                  </thead>
                                  {/* {console.log(data2, "HHG7")} */}
                                  <tbody>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        Vehicle Type
                                      </td>

                                      <td
                                        colSpan={3}
                                        className={styles.tableCell}
                                      >
                                        <div
                                          style={{
                                            width: "25%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            className={`${styles.input} form-control form-control-sm  height-25`}
                                            value={
                                              data2?.VehicleType?.[0]
                                                ?.VehicleTypeName
                                            }
                                            disabled
                                          />
                                        </div>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Quote Price
                                        </span>
                                      </td>
                                      <td
                                        colSpan={3}
                                        className={styles.tableCell}
                                      >
                                        <div
                                          style={{
                                            width: "25%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="number"
                                            name="OldVehicleCost"
                                            className={`${styles.input} form-control form-control-sm  height-25`}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.OldVehicleCost ?? 0
                                            }
                                            disabled
                                          />
                                        </div>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Final Price
                                        </span>
                                      </td>
                                      {/* {console.log(
                                        formValue[data2?.ServiceUniqueId],
                                        "TRANSP98"
                                      )} */}
                                      <td
                                        colSpan={3}
                                        className={styles.tableCell}
                                      >
                                        <div
                                          style={{
                                            width: "25%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="number"
                                            name="FinalVehicleCost"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.FinalVehicleCost ?? 0
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "FinalVehicleCost",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Approved By
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="ApprovedBy"
                                            className={`${styles.footerInput} form-control form-control-sm `}
                                            placeholder="Full Name"
                                            value={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.ApprovedBy ?? ""
                                            }
                                            onChange={(e) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedBy",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <span className={styles.detailLabel}>
                                          Approved Date
                                        </span>
                                      </td>
                                      <td className={styles.tableCell}>
                                        <div
                                          style={{
                                            width: "50%",
                                            margin: "0 auto",
                                          }}
                                        >
                                          <DatePicker
                                            dateFormat="dd-MM-yyyy"
                                            placeholderText="dd-mm-yyyy"
                                            className={`${styles.footerInput} form-control form-control-sm`}
                                            selected={
                                              formValue[data2?.ServiceUniqueId]
                                                ?.ApprovedDate
                                                ? new Date(
                                                  formValue[
                                                    data2?.ServiceUniqueId
                                                  ]?.ApprovedDate
                                                )
                                                : null
                                            }
                                            onChange={(date) =>
                                              handleChangeFormValue(
                                                data2?.ServiceUniqueId,
                                                "ApprovedDate",
                                                date
                                              )
                                            }
                                            isClearable
                                            todayButton="Today"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <div className="text-right mt-2">
                                  <button
                                    className={`${styles.saveButton} btn btn-primary btn-custom-size ms-auto d-block`}
                                    onClick={() => handleSave(data2, data)}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  );
                })}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Finalprice;
