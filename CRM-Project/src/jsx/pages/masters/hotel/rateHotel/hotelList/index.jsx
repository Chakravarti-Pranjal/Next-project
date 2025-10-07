import React, { useEffect, useState } from "react";
import { Row, Card, Col } from "react-bootstrap";
import { axiosOther } from "../../../../../../http/axios_base_url";
import "../../../../../../scss/main.css";
import Table from "react-bootstrap/Table";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifyError, notifySuccess } from "../../../../../../helper/notify";
import { scrollToTop } from "../../../../../../helper/scrollToTop";

const RateList = ({
  setDataUpdate,
  setIsUpdating,
  rateInitialList,
  rateList,
  state,
}) => {
  const [bedTypeArr, setBedTypeArr] = useState([]);
  const [bedTypeList, setBedTypeList] = useState([]);
  const [roomTypeList, setRoomTypeList] = useState([]);
  const [paxTypeList, setPaxTypeList] = useState([]);
  const [mealPlanList, setMealPlanList] = useState([]);
  const [filters, setFilters] = useState({
    roomtype: "",
    paxType: "",
    mealPlan: "",
  });
  const [rateInitialLists, setRateInitialLists] = useState([]);
  console.log(rateInitialLists, "rateInitialLists")
  // common handler
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFilter = async () => {
    try {
      const { data } = await axiosOther.post("listHotelRatesJson", {
        id: state?.HotelId,
        RoomTypeId: filters?.roomtype,
        PaxTypeId: filters?.paxType,
        MealPlanId: filters?.mealPlan
      });
      setRateInitialLists(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const mealArr = [
    { MealTypeId: "1", Name: "Breakfast" },
    { MealTypeId: "2", Name: "Lunch" },
    { MealTypeId: "3", Name: "Dinner" },
  ];

  const getListToServer = async () => {
    try {
      const { data } = await axiosOther.post("roomsharingmasterlist", {
        Search: "",
        Status: "",
      });
      setBedTypeList(data?.DataList);
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
      const { data } = await axiosOther.post("paxlist", {
        PaxType: "",
      });
      setPaxTypeList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("hotelmealplanlist", {
        Search: "",
        Status: "",
      });
      setMealPlanList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (bedTypeList && bedTypeList?.length > 0) {
      const bedInitial = bedTypeList?.map((bed) => ({
        RoomBedTypeId: bed?.id,
        BedName: bed?.Name,
      }));
      setBedTypeArr(bedInitial);
    }
  }, [bedTypeList]);

  useEffect(() => {
    getListToServer();
  }, []);

  const handleDelete = async (primId, uniquId) => {
    const confirmation = await swal({
      title: "Are you sure want to Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (confirmation) {
      try {
        const { data } = await axiosOther.post("deletehotelratejson", {
          id: primId,
          UniqueId: uniquId,
        });
        if (data?.status == 1 || data?.Status == 1) {
          rateList();
          notifySuccess(data?.Message || data?.message);
        } else {
          notifyError(data?.Message || data?.message);
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
      }
    }
  };

  const handleRateEdit = (value, HotelUUID, DestinationID, hotelId) => {
    scrollToTop();
    setIsUpdating(true);
    setDataUpdate({
      ...value,
      HotelUUID: HotelUUID,
      hotelId: hotelId,
      destinatinId: DestinationID,
    });
  };

  return (
    <>
      <Row className="">
        <Col lg={12}>
          <Card>
            <ToastContainer />
            <Card.Body className="px-3">
              <div className="row align-items-end">
                <div className="col-md-6 col-lg-2 ">
                  <div className="d-flex justify-content-between ">
                    <label className="" htmlFor="name">
                      Room Type
                    </label>
                  </div>
                  <select
                    name="roomtype"
                    id="status"
                    className="form-control form-control-sm"
                    value={filters.roomtype}
                    onChange={handleFormChange}
                  >
                    <option value="">Select</option>
                    {roomTypeList &&
                      roomTypeList?.length > 0 &&
                      roomTypeList.map((data, index) => (
                        <option value={data?.id}>{data?.Name}</option>
                      ))}
                  </select>
                </div>
                <div className="col-md-6 col-lg-2 ">
                  <label className="m-0">Pax Type</label>
                  <select
                    name="paxType"
                    id="status"
                    className="form-control form-control-sm"
                    value={filters.paxType}
                    onChange={handleFormChange}
                  >
                    <option value="">Select</option>
                    {paxTypeList &&
                      paxTypeList?.length > 0 &&
                      paxTypeList.map((data, index) => (
                        <option value={data?.id}>
                          {data?.Paxtype}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="m-0">Meal Plan</label>
                  <select
                    name="mealPlan"
                    id="status"
                    className="form-control form-control-sm"
                    value={filters.mealPlan}
                    onChange={handleFormChange}
                  >
                    <option value="">Select</option>
                    {mealPlanList &&
                      mealPlanList?.length > 0 &&
                      mealPlanList.map((data, index) => (
                        <option value={data?.id}>{data?.Name}</option>
                      ))}
                  </select>
                </div>
                <div className="col-md-1 d-flex justify-content-start align-items-center">
                  <div className="nav-item d-flex align-items-center">
                    <button
                      className="btn btn-primary btn-custom-size"
                      onClick={handleFilter}
                      type="button"
                    >
                      <i className="fa-brands fa-searchengin me-2"></i>Search
                    </button>
                  </div>
                </div>
              </div>
              <div className="stickyTable">
                <Table striped bordered className="rate-table mt-2">
                  <thead
                    className="border-1 stickyThead"
                    style={{ borderTop: "1px solid white" }}
                  >
                    {/* 1st header row */}
                    <tr>
                      <th scope="col" className="py-2 align-middle" rowSpan="2">
                        Season
                      </th>
                      <th scope="col" className="py-2 align-middle" rowSpan="2">
                        Valid To
                      </th>
                      <th scope="col" className="py-2 align-middle" rowSpan="2">
                        Pax Type
                      </th>
                      <th scope="col" className="py-2 align-middle" rowSpan="2">
                        Market Type
                      </th>
                      <th scope="col" className="py-2 align-middle" rowSpan="2">
                        Supplier
                      </th>
                      <th scope="col" className="py-2 align-middle" rowSpan="2">
                        Tarrif Type
                      </th>
                      <th scope="col" className="py-2 align-middle" rowSpan="2">
                        Room Type
                      </th>
                      <th scope="col" className="py-2 align-middle" rowSpan="2">
                        Meal Plan
                      </th>

                      {bedTypeArr?.map((bed) => (
                        <th
                          key={bed.RoomBedTypeId}
                          colSpan="3"
                          className="py-2 text-center"
                        >
                          {bed?.BedName}
                        </th>
                      ))}

                      {mealArr.map((meal, i) => (
                        <th key={i} colSpan="3" className="py-2 text-center">
                          {meal?.Name}
                        </th>
                      ))}

                      <th scope="col" className="py-2 align-middle" rowSpan="2">
                        TAC(%)
                      </th>
                      <th scope="col" className="py-2 align-middle" rowSpan="2">
                        Room Tax Slab
                      </th>
                      <th scope="col" className="py-2 align-middle" rowSpan="2">
                        Meal Tax Slab
                      </th>
                      <th scope="col" className="py-2 align-middle" rowSpan="2">
                        Markup
                      </th>
                      <th scope="col" className="py-2 align-middle" rowSpan="2">
                        Status
                      </th>
                      <th scope="col" className="py-2 align-middle" rowSpan="2">
                        Action
                      </th>
                    </tr>

                    {/* 2nd header row */}
                    <tr className="border-1">
                      {bedTypeArr?.map(() => (
                        <>
                          <th className="border-1">RoomCost</th>
                          <th className="border-1">RoomTaxValue</th>
                          <th className="border-1">RoomTotalCost</th>
                        </>
                      ))}
                      {mealArr.map(() => (
                        <>
                          <th className="border-1">MealCost</th>
                          <th className="border-1">MealTaxSlabName</th>
                          <th className="border-1">MealTotalCost</th>
                        </>
                      ))}
                    </tr>
                  </thead>

                  {/* <tbody>
                    {rateInitialList?.map((item1) =>
                      item1?.Data?.map((item2) =>
                        item2?.RateDetails?.map((item) => (
                          <tr key={item?.UniqueID}>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.SeasonTypeName}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {`${new Date(item?.ValidFrom).toLocaleDateString(
                                "en-GB"
                              )} To ${new Date(
                                item?.ValidTo
                              ).toLocaleDateString("en-GB")}`}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.PaxTypeName}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.MarketTypeName}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.SupplierName}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.TarrifeTypeName}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.RoomTypeName}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.MealPlanName}
                            </td>


                            {bedTypeArr?.map((_, index) => (
                              <>
                                <td className="text-center text-nowrap font-size-10 py-2">
                                  {item?.RoomBedType?.[index]?.RoomCost ?? ""}
                                </td>
                                <td className="text-center text-nowrap font-size-10 py-2">
                                  {item?.RoomBedType?.[index]?.RoomTaxValue ?? ""}
                                </td>
                                <td className="text-center text-nowrap font-size-10 py-2">
                                  {item?.RoomBedType?.[index]?.RoomTotalCost ?? ""}
                                </td>
                              </>
                            ))}


                            {mealArr.map((_, index) => (
                              <>
                                <td className="text-center text-nowrap font-size-10 py-2">
                                  {item?.MealType?.[index]?.MealCost ?? ""}
                                </td>
                                <td className="text-center text-nowrap font-size-10 py-2">
                                  {item?.MealType?.[index]?.MealTaxSlabName ?? ""}
                                </td>
                                <td className="text-center text-nowrap font-size-10 py-2">
                                  {item?.MealType?.[index]?.MealTotalCost ?? ""}
                                </td>
                              </>
                            ))}

                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.TAC?.toFixed(2)}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.RoomTaxValue}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.MealSlabName}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.MarkupType}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.Status}
                            </td>
                            <td className="py-0">
                              <span className="d-flex gap-2 justify-content-center">
                                <i
                                  className="fa-solid fa-pencil cursor-pointer action-icon text-success"
                                  onClick={() =>
                                    handleRateEdit(
                                      item,
                                      item1?.HotelUUID,
                                      item1?.DestinationID,
                                      item1?.hotelId
                                    )
                                  }
                                ></i>
                                <i
                                  className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
                                  onClick={() =>
                                    handleDelete(item1?.HotelId, item?.UniqueID)
                                  }
                                ></i>
                              </span>
                            </td>
                          </tr>
                        ))
                      )
                    )}
                  </tbody> */}
                  <tbody>
                    {(rateInitialLists?.length > 0 ? rateInitialLists : rateInitialList)?.map((item1) =>
                      item1?.Data?.map((item2) =>
                        item2?.RateDetails?.map((item) => (
                          <tr key={item?.UniqueID}>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.SeasonTypeName}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {`${new Date(item?.ValidFrom).toLocaleDateString("en-GB")} To ${new Date(item?.ValidTo).toLocaleDateString("en-GB")}`}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.PaxTypeName}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.MarketTypeName}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.SupplierName}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.TarrifeTypeName}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.RoomTypeName}
                            </td>
                            <td className="text-center text-nowrap font-size-10 py-2">
                              {item?.MealPlanName}
                            </td>

                            {/* Beds */}
                            {bedTypeArr?.map((_, index) => (
                              <>
                                <td>{item?.RoomBedType?.[index]?.RoomCost ?? ""}</td>
                                <td>{item?.RoomBedType?.[index]?.RoomTaxValue ?? ""}</td>
                                <td>{item?.RoomBedType?.[index]?.RoomTotalCost ?? ""}</td>
                              </>
                            ))}

                            {/* Meals */}
                            {mealArr.map((_, index) => (
                              <>
                                <td>{item?.MealType?.[index]?.MealCost ?? ""}</td>
                                <td>{item?.MealType?.[index]?.MealTaxSlabName ?? ""}</td>
                                <td>{item?.MealType?.[index]?.MealTotalCost ?? ""}</td>
                              </>
                            ))}

                            <td>{item?.TAC?.toFixed(2)}</td>
                            <td>{item?.RoomTaxValue}</td>
                            <td>{item?.MealSlabName}</td>
                            <td>{item?.MarkupType}</td>
                            <td>{item?.Status}</td>
                            <td>
                              <span className="d-flex gap-2 justify-content-center">
                                <i
                                  className="fa-solid fa-pencil cursor-pointer action-icon text-success"
                                  onClick={() =>
                                    handleRateEdit(item, item1?.HotelUUID, item1?.DestinationID, item1?.hotelId)
                                  }
                                ></i>
                                <i
                                  className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
                                  onClick={() => handleDelete(item1?.HotelId, item?.UniqueID)}
                                ></i>
                              </span>
                            </td>
                          </tr>
                        ))
                      )
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default React.memo(RateList);

