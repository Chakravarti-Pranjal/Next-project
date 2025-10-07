import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";
import {
  FaPlus,
  FaCalendarAlt,
  FaUsers,
  FaRoad,
  FaUndo,
  FaGripVertical,
} from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { axiosOther } from "../../../../http/axios_base_url";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { notifyError, notifySuccess } from "../../../../helper/notify";
import { setQoutationData } from "../../../../store/actions/queryAction";
import { useDispatch } from "react-redux";
import { ThemeContext } from "../../../../context/ThemeContext";

const ChangeDate = ({ qoutationData }) => {
  const [open, setOpen] = useState(false);
  const [showModals, setShowModals] = useState(false);
  const [modalType, setModalType] = useState("");
  const [travelData, setTravelData] = useState([]);
  const [showNewCreate, setShowNewCreate] = useState(false);
  const { background } = useContext(ThemeContext);
  const [arrivalData, setArrivalData] = useState({
    newDate: "",
    type: "",
  });
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [accommodationData, setAccommodationData] = useState({
    adultCount: 0,
    childCount: 0,
    roomInfo: [
      { type: "Single", NoOfPax: 0 },
      { type: "Double", NoOfPax: 0 },
      { type: "Triple", NoOfPax: 0 },
      { type: "Twin", NoOfPax: 0 },
      { type: "CWBed", NoOfPax: 0 },
      { type: "CNBed", NoOfPax: 0 },
      { type: "ExtraBed", NoOfPax: 0 },
    ],
  });
  const dispatch = useDispatch();
  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    padding: "4px 10px",
    fontSize: "12px",
    cursor: "pointer",
    borderBottom:
      background.value === "dark"
        ? "1px solid rgba(255,255,255,0.2)"
        : "1px solid rgba(0,0,0,0.1)",
    color: background.value === "dark" ? "#ffffff" : "#6e6e7e",
    background: "transparent",
  };

  const iconStyle = { marginRight: "8px" };
  const [destinationList, setDestinationList] = useState([]);

  const getQoutationList = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist", {
        CountryId: "",
        StateId: "",
        Name: "",
        Default: "",
        Status: "",
      });
      setDestinationList(data?.DataList || []);
    } catch (error) {
      console.log(error);
    }
  };
  // helper function
  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return ""; // invalid date protection
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // Initialize travelData and accommodationData from qoutationData
  useEffect(() => {
    if (qoutationData?.TravelDateInfo?.TravelData) {
      console.log("TravelData", qoutationData.TravelDateInfo.TravelData);
      setTravelData(
        qoutationData.TravelDateInfo.TravelData.map((item, index) => ({
          destination: item.Destination || "",
          DestinationName: item.DestinationName || "",
          DayNo: item.DayNo || index + 1,
          // Date: item.Date || getDateByDay(index),
          Date:
            qoutationData.TravelDateInfo.ScheduleType === "Date Wise"
              ? formatDateToDDMMYYYY(item.Date || getDateByDay(index))
              : "",
          DestinationUniqueId: item.DestinationUniqueId || "",
          Enroute: item.Enroute || "",
          EnrouteName: item.EnrouteName || "",
          IsEnroute: item.IsEnroute || false,
          Mode: item.Mode || "",
        }))
      );
    } else {
      setTravelData([]);
    }
    if (
      qoutationData?.Pax &&
      qoutationData?.QueryInfo?.Accomondation?.RoomInfo
    ) {
      setAccommodationData({
        adultCount: qoutationData.Pax.AdultCount || 0,
        childCount: qoutationData.Pax.ChildCount || 0,
        roomInfo: [
          {
            type: "Single",
            NoOfPax:
              qoutationData.QueryInfo.Accomondation.RoomInfo[0]?.NoOfPax || "",
            id: 3,
            RoomType: "SGL Room",
            HotelMealPlanId: null,
            HotelMealPlan: "",
          },
          {
            type: "Double",
            NoOfPax:
              qoutationData.QueryInfo.Accomondation.RoomInfo[1]?.NoOfPax || "",
            id: 4,
            RoomType: "DBL Room",
            HotelMealPlanId: null,
            HotelMealPlan: "",
          },
          {
            type: "Triple",
            NoOfPax:
              qoutationData.QueryInfo.Accomondation.RoomInfo[3]?.NoOfPax || "",
            id: 6,
            RoomType: "TPL Room",
            HotelMealPlanId: null,
            HotelMealPlan: "",
          },
          {
            type: "Twin",
            NoOfPax:
              qoutationData.QueryInfo.Accomondation.RoomInfo[2]?.NoOfPax || "",
            id: 5,
            RoomType: "TWIN Room",
            HotelMealPlanId: null,
            HotelMealPlan: "",
          },
          {
            type: "CWBed",
            NoOfPax:
              qoutationData.QueryInfo.Accomondation.RoomInfo[4]?.NoOfPax || "",
            id: 7,
            RoomType: "ExtraBed(A)",
            HotelMealPlanId: null,
            HotelMealPlan: "",
          },
          {
            type: "CNBed",
            NoOfPax:
              qoutationData.QueryInfo.Accomondation.RoomInfo[5]?.NoOfPax || "",
            id: 8,
            RoomType: "ExtraBed(C)",
            HotelMealPlanId: null,
            HotelMealPlan: "",
          },
          {
            type: "ExtraBed",
            NoOfPax:
              qoutationData.QueryInfo.Accomondation.RoomInfo[6]?.NoOfPax || "",
            id: 7,
            RoomType: "ExtraBed(A)",
            HotelMealPlanId: null,
            HotelMealPlan: "",
          },
        ],
      });
    }
    if (qoutationData?.TravelDateInfo) {
      setArrivalData({
        newDate: qoutationData.TravelDateInfo.FromDateDateWise || "",
        type: qoutationData.TravelDateInfo.ScheduleType || "",
      });
    }
  }, [qoutationData]);

  // Handle menu click
  const handleMenuClick = (type) => {
    setModalType(type);
    setShowModals(true);
    setOpen(false);
  };
  const addRow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setTravelData((prev) => {
      const lastDayNo = prev.length > 0 ? prev[prev.length - 1].DayNo : 0;

      const updated = [
        ...prev,
        {
          destination: "",
          DestinationName: "",
          DayNo: lastDayNo + 1, // Always continue sequence
          Date: getDateByDay(lastDayNo), // DayNo ke hisaab se date
          DestinationUniqueId: "",
          Enroute: "",
          EnrouteName: "",
          IsEnroute: false,
          Mode: "surface",
        },
      ];
      setEditRowIndex(updated.length - 1);

      return updated;
    });
  };

  // Delete a row from travelData
  const deleteRow = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setTravelData((prev) => prev.filter((_, i) => i !== index));
  };

  const [editRowIndex, setEditRowIndex] = useState(null);

  const handleDestinationChange = (index, field, value) => {
    if (field === "destination") {
      const selectedDest = destinationList.find(
        (dest) => dest.id === Number(value)
      );
      setTravelData((prev) =>
        prev.map((row, i) =>
          i === index
            ? {
              ...row,
              destination: value,
              DestinationName: selectedDest?.Name || "",
              DestinationUniqueId: selectedDest?.UniqueID || "",
            }
            : row
        )
      );
    } else if (field === "Enroute") {
      const selectedEnroute = destinationList.find(
        (dest) => dest.id === Number(value)
      );
      setTravelData((prev) =>
        prev.map((row, i) =>
          i === index
            ? {
              ...row,
              Enroute: value,
              EnrouteName: selectedEnroute?.Name || "",
              IsEnroute: true,
            }
            : row
        )
      );
    }
    setEditRowIndex(null);
  };

  const getDateByDay = (dayIndex) => {
    const startDate = new Date(
      arrivalData.newDate?.replace(/\//g, "-") ||
      qoutationData?.TravelDateInfo?.FromDateDateWise?.replace(/\//g, "-") ||
      new Date()
    );

    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + dayIndex);

    // ✅ Will always give dd/mm/yyyy
    return newDate.toLocaleDateString("en-GB");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split(/[\/-]/); // split by "/" or "-"
    if (parts.length !== 3) return "";

    const [yyyy, mm, dd] = parts;
    return `${dd.padStart(2, "0")}/${mm.padStart(2, "0")}/${yyyy}`;
  };

  // Handle changes in arrivalData
  const handleArrivalChange = (field, value) => {
    setArrivalData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle changes in accommodationData
  const handleAccommodationChange = (field, value, index = null) => {
    if (index !== null) {
      setAccommodationData((prev) => ({
        ...prev,
        roomInfo: prev.roomInfo.map((room, i) =>
          // i === index ? { ...room, NoOfPax: parseInt(value) || 0 } : room
          i === index
            ? { ...room, NoOfPax: value === "" ? "" : parseInt(value) }
            : room
        ),
      }));
    } else {
      setAccommodationData((prev) => ({
        ...prev,
        // [field]: parseInt(value) || 0,
        [field]: value === "" ? "" : parseInt(value),
      }));
    }
  };

  const storedData = localStorage.getItem("Query_Qoutation");
  const parsedData = JSON.parse(storedData);

  const getQoutationLists = async () => {
    const payload = {
      QueryId: parsedData?.QueryID,
      QuotationNo: parsedData?.QoutationNum,
    };
    try {
      const { data } = await axiosOther.post("listqueryquotation", payload);
      if (data?.success) {
        dispatch(setQoutationData(data?.data[0]));
        const escorts = data.data[0].ExcortDays[0].Days[0].DayServices;
        if (escorts.length > 0) {
          // checkedArr.push("escorts");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getQoutationList();
  }, []);
  const handleSave = async () => {
    try {
      setLoadingBtn(true);
      const payload = {
        QueryId: qoutationData?.QueryId || parsedData?.QueryID,
        QuotationNumber:
          qoutationData?.QuotationNumber || parsedData?.QoutationNum,
        Pax: {
          AdultCount: accommodationData.adultCount,
          ChildCount: accommodationData.childCount,
          Child: qoutationData?.Pax?.Child || {
            PaxType: { ChildNumber: 5, ChildAge: "" },
            PaxTypeName: { ChildNumber: 5, ChildAge: "" },
            TotalPax: { ChildNumber: 5, ChildAge: "" },
            Adult: { ChildNumber: 5, ChildAge: "" },
            Child: { ChildNumber: 5, ChildAge: "" },
            Infant: { ChildNumber: 5, ChildAge: "" },
          },
        },
        QueryInfo: {
          ContactInfo: qoutationData?.QueryInfo?.ContactInfo || {
            ContactId: qoutationData?.QueryInfo?.ContactInfo?.ContactId,
            ContactPersonName:
              qoutationData?.QueryInfo?.ContactInfo?.ContactPersonName,
            ContactNumber: qoutationData?.QueryInfo?.ContactInfo?.ContactNumber,
            ContactEmail: qoutationData?.QueryInfo?.ContactInfo?.ContactEmail,
            ContactAddress:
              qoutationData?.QueryInfo?.ContactInfo?.ContactAddress,
          },
          Accomondation: {
            HotelCategory:
              qoutationData?.QueryInfo?.Accomondation?.HotelCategory,
            HotelCategoryName:
              qoutationData?.QueryInfo?.Accomondation?.HotelCategoryName,
            RoomInfo: accommodationData.roomInfo.map((room, index) => ({
              id: room.id || index + 3,
              RoomType: room.RoomType || room.type,
              NoOfPax: room.NoOfPax,
              HotelMealPlanId: room.HotelMealPlanId || null,
              HotelMealPlan: room.HotelMealPlan || "",
            })),
          },
        },
        TravelDateInfo: {
          ScheduleType:
            arrivalData.type || qoutationData?.TravelDateInfo?.ScheduleType,
          SeasonType: qoutationData?.TravelDateInfo?.SeasonType,
          SeasonTypeName: qoutationData?.TravelDateInfo?.SeasonTypeName,
          SeasonYear: qoutationData?.TravelDateInfo?.SeasonYear,
          TotalNights: travelData.length,
          FromDate: qoutationData?.TravelDateInfo?.FromDate,
          FromDateDateWise:
            arrivalData.newDate ||
            qoutationData?.TravelDateInfo?.FromDateDateWise,
          ToDate: qoutationData?.TravelDateInfo?.ToDate,
          TravelData: travelData.map((item, index) => ({
            // Date:
            //   (arrivalData.type === "Date Wise" ||
            //     qoutationData?.TravelDateInfo?.ScheduleType === "Date Wise")
            //     ? formatDate(getDateByDay(index))
            //     : "",
            // Date: arrivalData.type === "Date Wise" ? formatDate(getDateByDay(index)) : "",
            Date:
              arrivalData.type === "Date Wise"
                ? item.Date || formatDate(getDateByDay(index))
                : item.Date || "",

            DayNo: item.DayNo || index + 1,
            Destination: parseInt(item.destination) || 0,
            DestinationUniqueId: item.DestinationUniqueId || "",
            DestinationName: item.DestinationName || "",
            Enroute: item.Enroute || "",
            EnrouteName: item.EnrouteName || "",
            IsEnroute: item.IsEnroute || false,
            Mode: item.Mode || "",
          })),
        },
      };
      console.log(payload, "payload");
      const { data } = await axiosOther.post(
        "updateGeneratedQuotationJson",
        payload
      );
      if (data?.status === 1) {
        console.log("Data saved successfully:", data);
        await getQoutationLists();
        setShowModals(false);
        notifySuccess(data?.Message || data?.message);
      } else {
        notifyError(data?.Message || data?.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setLoadingBtn(false);
    }
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );
  console.log(travelData, "travelData");
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTravelData((prev) => {
        // Step 1: Move items in the array
        const movedData = arrayMove(prev, active.id, over.id);

        // Step 2: Create a new array with updated DayNo and Date
        const newData = movedData.map((item, index) => {
          // Update the item at active.id's new position (over.id) with over's original DayNo
          if (index === over.id) {
            return {
              ...item,
              DayNo: prev[over.id].DayNo,
              Date: getDateByDay(prev[over.id].DayNo - 1),
            };
          }
          // Update the item at over.id's new position (active.id) with active's original DayNo
          if (index === active.id) {
            return {
              ...item,
              DayNo: prev[active.id].DayNo,
              Date: getDateByDay(prev[active.id].DayNo - 1),
            };
          }
          // Return unchanged item for all other indices
          return item;
        });

        console.log(newData, "newData");
        return newData;
      });
    }
  };
  const SortableRow = ({ item, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: index });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    console.log(item.DayNo, "asaasasxa");
    return (
      <tr ref={setNodeRef} style={style} {...attributes}>
        <td>{`Day ${item?.DayNo}`}</td>
        <td>{item?.Date}</td>
        <td>{item?.DestinationName || item?.destination}</td>
        <td style={{ textAlign: "center", cursor: "grab" }} {...listeners}>
          <i className="fa-solid fa-arrows-up-down-left-right" />
        </td>
      </tr>
    );
  };
  const copyParticularRow = (item, index) => {
    const newRow = { ...item };
    console.log(newRow, "newRow");
    setTravelData((prev) => {
      const updated = [...prev];
      updated.splice(index + 1, 0, newRow);
      return updated;
    });
  };
  const SortableRows = ({
    item,
    index,
    handleDestinationChange,
    addRow,
    deleteRow,
    destinationList,
    getDateByDay,
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: index });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    console.log(item, editRowIndex, "editRowIndex");
    return (
      <tr ref={setNodeRef} style={style} {...attributes}>
        <td style={{ whiteSpace: "nowrap" }}> Day {item?.DayNo}</td>
        {console.log(item, index, "itemenroutes")}
        <td>{item.Date}</td>
        <td>
          {editRowIndex === index ? (
            <select
              className="form-control form-control-sm"
              name="destination"
              value={item?.destination || item?.DestinationName}
              onChange={(e) =>
                handleDestinationChange(index, "destination", e.target.value)
              }
              onBlur={() => setEditRowIndex(null)}
            >
              <option value="">Select</option>
              {destinationList.map((dest, i) => (
                <option key={i} value={dest?.id}>
                  {dest?.Name}
                </option>
              ))}
            </select>
          ) : (
            <span onClick={() => setEditRowIndex(index)}>
              {item?.DestinationName}
            </span>
          )}
        </td>
        {console.log(editRowIndex, index, "editRowIndex")}
        <td>
          <div className="">
            {editRowIndex === index ? (
              <select
                className="form-control form-control-sm"
                name="Enroute"
                value={item?.Enroute || ""}
                onChange={(e) =>
                  handleDestinationChange(index, "Enroute", e.target.value)
                }
                onBlur={() => setEditRowIndex(null)}
              >
                <option value="">Select</option>
                {destinationList.map((dest, i) => (
                  <option key={i} value={dest?.id}>
                    {dest?.Name}
                  </option>
                ))}
              </select>
            ) : (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  // console.log(Setting editRowIndex to `${index}`);
                  setEditRowIndex(index);
                }}
                style={{
                  cursor: "pointer",
                  minWidth: "100px",
                  display: "inline-block",
                }}
              >
                {item?.EnrouteName || "Select"}
              </span>
            )}
          </div>
        </td>
        <td style={{ whiteSpace: "nowrap" }}>
          <i
            className="fa-solid fa-arrows-up-down-left-right"
            style={{ cursor: "grab", marginRight: "1rem" }}
            {...listeners}
          ></i>
          <i
            className="bi bi-plus-circle text-success me-3"
            role="button"
            onClick={addRow}
          ></i>
          <i
            className="bi bi-trash text-danger"
            role="button"
            onClick={(e) => deleteRow(e, index)}
          ></i>
          <span
            className="cursor-pointer text-red-500 hover:text-red-700"
            onClick={() => copyParticularRow(item, index)}
          >
            <i
              style={{
                fontSize: "0.62rem",
                marginLeft: "5px",
              }}
              className="fa-solid fa-copy"
            ></i>
          </span>
        </td>
      </tr>
    );
  };
  const handleUpdateClick = () => {
    setShowNewCreate(true);
  };
  const handleNewCreateClick = async () => {
    try {
      await handleSave();
      setShowNewCreate(false);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };
  return (
    <>
      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          className="form-control form-control-sm"
          onClick={() => setOpen(!open)}
          style={{ whiteSpace: "nowrap" }}
        >
          <FaPlus style={iconStyle} /> Tour Change
        </button>
        {open && (
          <div
            style={{
              position: "absolute",
              background: background.value === "dark" ? "#2e2e40" : "#ffffff",
              minWidth: "200px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 100,
            }}
          >
            <div
              style={menuItemStyle}
              onClick={() => handleMenuClick("Change Arrival Date")}
            >
              <FaCalendarAlt style={iconStyle} /> Change Arrival Date
            </div>
            <div
              style={menuItemStyle}
              onClick={() => handleMenuClick("Amend Accommondation")}
            >
              <FaUsers style={iconStyle} /> Update Pax/Room
            </div>
            <div
              style={menuItemStyle}
              onClick={() => handleMenuClick("Modify Route")}
            >
              <FaRoad style={iconStyle} /> Modify Route
            </div>
            <div
              style={menuItemStyle}
              onClick={() => handleMenuClick("Amend City/Day")}
            >
              <FaUndo style={iconStyle} /> Amend City/Day
            </div>
          </div>
        )}
      </div>
      <Modal
        show={showModals}
        onHide={() => setShowModals(false)}
        centered
        dialogClassName={modalType === "Amend City/Day" ? "wide-modal" : ""}
      >
        <Modal.Header
          closeButton
          onClick={() => {
            setShowModals(false);
            setShowNewCreate(false);
          }}
        >
          <Modal.Title>{modalType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "Change Arrival Date" && (
            <>
              <p>Name: {qoutationData?.Header?.Subject}</p>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Current Arrival Date</Form.Label>
                    <Form.Control
                      className="form-control form-control-sm"
                      type="text"
                      value={formatDateToDDMMYYYY(qoutationData?.TravelDateInfo?.FromDateDateWise)}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>New Arrival Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={arrivalData.newDate}
                      onChange={(e) =>
                        handleArrivalChange("newDate", e.target.value)
                      }
                      className="form-control form-control-sm"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Day/Date Wise</Form.Label>
                    <Form.Control
                      type="text"
                      value={qoutationData?.TravelDateInfo?.ScheduleType}
                      readOnly
                      className="form-control form-control-sm"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Day/Date Wise</Form.Label>
                    <Form.Select
                      value={arrivalData.type}
                      onChange={(e) =>
                        handleArrivalChange("type", e.target.value)
                      }
                      className="form-control form-control-sm"
                    >
                      <option>Day Wise</option>
                      <option>Date Wise</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
          {modalType === "Amend Accommondation" && (
            <>
              <p>Name: {qoutationData?.Header?.Subject}</p>
              <div className="row">
                <div className="col-md-6">
                  <h6>Current Accommodation</h6>
                  <div className="mb-2 d-flex gap-2">
                    <div>
                      <label>Adult</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={qoutationData?.Pax?.AdultCount}
                        readOnly
                      />
                    </div>
                    <div>
                      <label>Child</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={qoutationData?.Pax?.ChildCount}
                        readOnly
                      />
                    </div>
                  </div>
                  <Table
                    bordered
                    size="sm"
                    className="table table-bordered itinerary-table"
                  >
                    <thead>
                      <tr>
                        <th>Single</th>
                        <th>Double</th>
                        <th>Triple</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {
                            qoutationData?.QueryInfo?.Accomondation?.RoomInfo[0]
                              ?.NoOfPax
                          }
                        </td>
                        <td>
                          {
                            qoutationData?.QueryInfo?.Accomondation?.RoomInfo[1]
                              ?.NoOfPax
                          }
                        </td>
                        <td>
                          {
                            qoutationData?.QueryInfo?.Accomondation?.RoomInfo[3]
                              ?.NoOfPax
                          }
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table
                    bordered
                    size="sm"
                    className="table table-bordered itinerary-table"
                  >
                    <thead>
                      <tr>
                        <th>Twin</th>
                        <th>CWBed</th>
                        <th>CNBed</th>
                        <th>ExtraBed</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {qoutationData?.QueryInfo?.Accomondation?.RoomInfo[2]
                            ?.NoOfPax || 0}
                        </td>
                        <td>
                          {qoutationData?.QueryInfo?.Accomondation?.RoomInfo[4]
                            ?.NoOfPax || 0}
                        </td>
                        <td>
                          {qoutationData?.QueryInfo?.Accomondation?.RoomInfo[5]
                            ?.NoOfPax || 0}
                        </td>
                        <td>
                          {qoutationData?.QueryInfo?.Accomondation?.RoomInfo[6]
                            ?.NoOfPax || 0}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
                <div className="col-md-6">
                  <h6>New Accommodation</h6>
                  <div className="mb-2 d-flex gap-2">
                    <div>
                      <label>Adult</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={accommodationData.adultCount}
                        placeholder="0"
                        onChange={(e) =>
                          handleAccommodationChange(
                            "adultCount",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label>Child</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={accommodationData.childCount}
                        placeholder="0"
                        onChange={(e) =>
                          handleAccommodationChange(
                            "childCount",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <Table
                    bordered
                    size="sm"
                    className="table table-bordered itinerary-table"
                  >
                    <thead>
                      <tr>
                        <th>Single</th>
                        <th>Double</th>
                        <th>Triple</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={accommodationData.roomInfo[0].NoOfPax}
                            onChange={(e) =>
                              handleAccommodationChange(
                                "NoOfPax",
                                e.target.value,
                                0
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={accommodationData.roomInfo[1].NoOfPax}
                            onChange={(e) =>
                              handleAccommodationChange(
                                "NoOfPax",
                                e.target.value,
                                1
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={accommodationData.roomInfo[2].NoOfPax}
                            onChange={(e) =>
                              handleAccommodationChange(
                                "NoOfPax",
                                e.target.value,
                                2
                              )
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table
                    bordered
                    size="sm"
                    className="table table-bordered itinerary-table"
                  >
                    <thead>
                      <tr>
                        <th>Twin</th>
                        <th>CWBed</th>
                        <th>CNBed</th>
                        <th>ExtraBed</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={accommodationData.roomInfo[3].NoOfPax}
                            onChange={(e) =>
                              handleAccommodationChange(
                                "NoOfPax",
                                e.target.value,
                                3
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={accommodationData.roomInfo[4].NoOfPax}
                            onChange={(e) =>
                              handleAccommodationChange(
                                "NoOfPax",
                                e.target.value,
                                4
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={accommodationData.roomInfo[5].NoOfPax}
                            onChange={(e) =>
                              handleAccommodationChange(
                                "NoOfPax",
                                e.target.value,
                                5
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={accommodationData.roomInfo[6].NoOfPax}
                            onChange={(e) =>
                              handleAccommodationChange(
                                "NoOfPax",
                                e.target.value,
                                6
                              )
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </>
          )}
          {modalType === "Modify Route" && (
            <>
              <div>
                <strong>Name:</strong> {qoutationData?.Header?.Subject}
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={travelData.map((_, i) => i)}
                  strategy={verticalListSortingStrategy}
                >
                  <Table
                    bordered
                    hover
                    className="table table-bordered itinerary-table"
                  >
                    <thead>
                      <tr>
                        <th>Sr.No.</th>
                        <th>Date/Day</th>
                        <th>Destination</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {travelData.map((item, index) => (
                        <SortableRow key={index} item={item} index={index} />
                      ))}
                    </tbody>
                  </Table>
                </SortableContext>
              </DndContext>
            </>
          )}

          {modalType === "Amend City/Day" && (
            <>
              <div>Name: {qoutationData?.Header?.Subject}</div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={travelData.map((_, i) => i)}
                  strategy={verticalListSortingStrategy}
                >
                  <Table
                    bordered
                    hover
                    className="table table-bordered itinerary-table"
                  >
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Date</th>
                        <th>Destination</th>
                        <th>Enroute</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {travelData.map((item, index) => (
                        <SortableRows
                          key={index}
                          item={item}
                          index={index}
                          handleDestinationChange={handleDestinationChange}
                          addRow={addRow}
                          deleteRow={deleteRow}
                          destinationList={destinationList}
                          getDateByDay={getDateByDay}
                        />
                      ))}
                    </tbody>
                  </Table>
                </SortableContext>
              </DndContext>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {modalType === "Change Arrival Date" && (
            <>
              <button
                type="button"
                className="btn btn-primary py-1 font-size-10 rounded-1 d-flex align-items-center gap-1"
                style={{
                  cursor: loadingBtn ? "no-drop" : "pointer",
                  opacity: loadingBtn ? 0.7 : 1,
                }}
                disabled={loadingBtn}
                onClick={handleSave}
              >
                {loadingBtn && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Save
              </button>
              <Button
                className="btn btn-dark btn-custom-size ms-2"
                onClick={() => setShowModals(false)}
              >
                Cancel
              </Button>
            </>
          )}
          {modalType === "Amend Accommondation" && (
            <>
              <button
                type="button"
                className="btn btn-primary py-1 font-size-10 rounded-1 d-flex align-items-center gap-1"
                style={{
                  cursor: loadingBtn ? "no-drop" : "pointer",
                  opacity: loadingBtn ? 0.7 : 1,
                }}
                disabled={loadingBtn}
                onClick={handleSave}
              >
                {loadingBtn && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Save
              </button>
              <Button
                className="btn btn-dark btn-custom-size ms-2"
                onClick={() => setShowModals(false)}
              >
                Cancel
              </Button>
            </>
          )}
          {modalType === "Modify Route" && (
            <>
              {showNewCreate && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary py-1 font-size-10 rounded-1 d-flex align-items-center gap-1"
                    style={{
                      cursor: loadingBtn ? "no-drop" : "pointer",
                      opacity: loadingBtn ? 0.7 : 1,
                    }}
                    disabled={loadingBtn}
                    onClick={handleNewCreateClick}
                  >
                    {loadingBtn && (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    )}
                    Regenerate Now
                  </button>
                </>
              )}
              <Button
                className="btn btn-primary btn-custom-size"
                onClick={handleUpdateClick}
              >
                Update Change
              </Button>
              <Button
                className="btn btn-dark btn-custom-size ms-2"
                onClick={() => {
                  setShowModals(false);
                  setShowNewCreate(false);
                }}
              >
                Cancel
              </Button>
            </>
          )}
          {modalType === "Amend City/Day" && (
            <>
              {showNewCreate && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary py-1 font-size-10 rounded-1 d-flex align-items-center gap-1"
                    style={{
                      cursor: loadingBtn ? "no-drop" : "pointer",
                      opacity: loadingBtn ? 0.7 : 1,
                    }}
                    disabled={loadingBtn}
                    onClick={handleNewCreateClick}
                  >
                    {loadingBtn && (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    )}
                    Regenerate Now
                  </button>
                </>
              )}
              <Button
                className="btn btn-primary btn-custom-size"
                onClick={handleUpdateClick}
              >
                Update Change
              </Button>
              <Button
                className="btn btn-dark btn-custom-size ms-2"
                onClick={() => {
                  setShowModals(false);
                  setShowNewCreate(false);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChangeDate;
