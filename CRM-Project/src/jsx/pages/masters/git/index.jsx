import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tab, Nav, Button } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url.js";
import { Modal, Row, Table } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import swal from "sweetalert";
import extractTextFromHTML from "../../../../helper/htmlParser.js";
import { color } from "highcharts";
import { Padding } from "@mui/icons-material";
import UseTable from "../../../../helper/UseTable.jsx";

const Git = () => {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [open, setopen] = useState(false);
  const [dataview, setdataview] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("fit-or-gitmasterlist");
      // console.log("API Response:", data);
      setInitialList(data?.Data);
      setFilterValue(data?.Data);
      // console.log("API Responsess:", data?.Data);
    } catch (error) {
      console.log("Error fetching monument data:", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [filterInput, setFilterInput] = useState("");

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.DestinationName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput, initialList]);

  // useEffect(() => {
  //   const filteredList = initialList?.filter(
  //     (data) =>

  //       data?.DestinationName?.toLowerCase()?.includes(
  //         filterInput?.toLowerCase()
  //       ) ||
  //       data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
  //   );
  //   setFilterValue(filteredList);
  // },[filterInput]);

  // const handleDelete = async (Id) => {
  //   // console.log("id Response:", id);
  //   const confirmation = await swal({
  //     title: "Are you sure want to Delete?",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   });
  //   try {
  //     const { data } = await axiosOther.post("fit-or-gitdelete", { Id });
  //     // console.log("API Response:", data);
  //     if (data?.Status == 1 || data?.status == 1) {
  //       notifySuccess(data?.Message || data?.message || data?.result);
  //       getListDataToServer();
  //     }
  //   } catch (err) {
  //     if (err) {
  //       alert(err?.message || err?.Message);
  //     }
  //   }
  // };


  const handleDelete = async (Id) => {
    // const confirmed = window.confirm("Are you sure you want to delete?");
    const confirmation = await swal({
      title: "Are you sure want to Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (!confirmation) return;
    if (confirmation) {
      try {
        const { data } = await axiosOther.post("fit-or-gitdelete", { Id });
        if (data?.Status === 1 || data?.Status === 200) {
          notifySuccess(data?.Message || "Deleted successfully");
          getListDataToServer();
        } else {
          notifyError(data?.Message || "Failed to delete");
        }
      } catch (error) {
        notifyError("Failed to delete. Please try again.");
        console.error("Delete error:", error);
      }
    }
  };


  useEffect(() => {
    const getMessage = localStorage.getItem("success-message");
    if (getMessage != null) {
      notifySuccess(getMessage);
      localStorage.removeItem("success-message");
    }
  }, []);

  // const handleEdit = (data) => {
  //   // console.log(data, "data");
  //   setInitialList({
  //     id: data?.id,
  //     Type: data?.Type === "GIT" ? "GIT" : "FIT",
  //     Name: data?.Name,
  //     ServiceUpgradation: data?.ServiceUpgradation,
  //     OptionalTour: data?.OptionalTour,
  //     LanguageData: data?.LanguageData,
  //     LanguageId: data?.LanguageId,
  //     OverviewName: data?.OverviewName,
  //     LanguageName: data?.LanguageName,
  //     Highlights: data?.Highlights,
  //     ItineraryIntroduction: data?.ItineraryIntroduction,
  //     ItinerarySummary: data?.ItinerarySummary,
  //     Inclusion: data?.Inclusion,
  //     Exclusion: data?.Exclusion,
  //     TermsCondition: data?.TermsCondition,
  //     Cancelation: data?.Cancelation,
  //     PaymentTerm: data?.PaymentTerm,
  //     BookingPolicy: data?.BookingPolicy,
  //     Remarks: data?.Remarks,
  //     DestinationId: data?.Remarks,
  //     SetDefault: data.SetDefault === "Yes" ? 1 : 0,
  //     Status: data.Status === "Active" ? 1 : 0,
  //   });
  //   navigate("/git/add", { state: data });
  // };
  // console.log();

  const handleEdit = (data) => {
    navigate("/git/add", {
      state: {
        id: data?.id,
        Type: data?.Type,
        Name: data?.Name,
        ServiceUpgradation: data?.ServiceUpgradation,
        OptionalTour: data?.OptionalTour,
        Destinations: data?.Destinations || [], // Ensure correct field
        LanguageData: data?.LanguageData || [],
        SetDefault: data?.SetDefault,
        Status: data?.Status,
      },
    });
  };

  // const view = (row) => {
  //   setopen(true);
  //   setdataview(row.LanguageData);
  // };

  const view = (row) => {
    setopen(true);
    setdataview(Array.isArray(row.LanguageData) ? row.LanguageData : []);
  };

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
      width: "8rem",
      // style: {
      //   display: "flex",
      //   justifyContent: "center",
      // },
    },
    {
      name: "Name ",
      selector: (row) => row.Name,
      cell: (row) => <span>{row.Name}{" "}
        {row?.SetDefault == "Yes" && (
          <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
        )}
      </span>,
      sortable: true,
      width: "12rem",
      wrap: true,
    },

    // {
    //   name: "Destination ",
    //   selector: (row) => row.Destinations?.map((dest) => dest.DestinationName).join(", ") || [],
    //   cell: (row) => (
    //     <span>
    //       {row.Destinations?.map((dest) => dest.DestinationName).join(", ")}{" "}
    //     </span>
    //   ),
    //   sortable: true,
    //   width: "12rem",
    //   wrap: true,
    // },
    {
      name: "Type ",
      selector: (row) => row.Type,
      cell: (row) => <span>{row.Type} </span>,
      sortable: true,
      width: "20rem",
      wrap: true,
    },
    // {
    //   name: "SetDefault",
    //   selector: (row) => row.SetDefault,
    //   cell: (row) => <span>{row.SetDefault}</span>,
    //   sortable: true,
    //   width: "4.5rem",
    // },
    // {
    //   name: "View dd",
    //   selector: (row) => (
    //     <Button
    //       variant="dark light py-1 rounded-pill fontSize11px px-3"
    //       onClick={() => view(row)}
    //     >
    //       View
    //     </Button>
    //   ),
      //     <Modal.Header>
      //         <Modal.Title>Make Final/ Select Supplement</Modal.Title>
      //         <Button
      //             variant="close"
      //             className="btn-close"// Ensure handleClose exists
      //         ></Button>
      //     </Modal.Header>
      //     <Modal.Body>
      //         <Row>
      //             <Table className="rate-table mt-2">
      //                 <thead>
      //                     <tr>
      //                         <th scope="col" className="py-2 align-middle ">
      //                             Day
      //                         </th>
      //                         <th scope="col" className="py-2 align-middle fs-4">
      //                             Service Type
      //                         </th>
      //                         <th scope="col" className="py-2 align-middle fs-4">
      //                             Select Hotel
      //                         </th>
      //                         <th scope="col" className="py-2 align-middle fs-4">
      //                             Price
      //                         </th>
      //                         <th scope="col" className="py-2 align-middle fs-4">
      //                             Action
      //                         </th>
      //                     </tr>
      //                 </thead>
      //                 <tbody>
      //                     <tr>
      //                         <td className="text-center text-nowrap py-2 fs-5"></td>
      //                         <td className="text-center text-nowrap py-2 fs-5"></td>
      //                         <td className="text-center text-nowrap py-2 fs-5">
      //                             <select
      //                                 name="Status"
      //                                 id="status"
      //                                 className="form-control form-control-sm"
      //                             >
      //                                 <option value="">Select</option>
      //                             </select>
      //                         </td>
      //                         <td className="text-center text-nowrap py-2 fs-5"></td>
      //                         <td className="text-center text-nowrap py-2 fs-5">
      //                             <button
      //                                 className="btn btn-primary btn-custom-size fs-14"
      //                             ></button>
      //                         </td>
      //                     </tr>
      //                 </tbody>
      //             </Table>
      //         </Row>
      //     </Modal.Body>
      // </Modal> </>,

      // width: "12rem",
    //   wrap: true,
    // },

    {
      name: "Status",
      selector: (row) => row.Status,
      cell: (row) => (
        <span
          className={`badge ${row.Status === "Active"
            ? "badge-success light badge"
            : "badge-danger light badge"
            }`}
        >
          {row.Status}
          {/* {console.log(row.Status, "row.Status")} */}
        </span>
      ),
      sortable: true,
      width: "18rem"
    },
    {
      name: "Action",
      cell: (row) => (
        <span className="d-flex gap-1">
          <i
            className="fa fa-pencil cursor-pointer action-icon text-success"
            onClick={() => handleEdit(row)}
          ></i>
          <i
            className="fa fa-trash cursor-pointer action-icon text-danger"
            onClick={() => handleDelete(row?.id)}
          ></i>
        </span>
      ),
      // width: "9rem",
    },
  ];

  return (
    <>
      <Modal show={open} onHide={() => setopen(false)} centered >
        <Modal.Header closeButton>
          <Modal.Title>GIT/FIT Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {dataview.length > 0 ? (
            <Table striped bordered responsive>
              <thead>
                <tr>
                  {/* <th>Language Name</th> */}
                  {/* <th>Overview Name</th> */}
                  {/* <th>Highlights</th> */}
                  {/* <th>Itinerary Introduction</th> */}
                  {/* <th>Itinerary Summary</th> */}
                  <th>Inclusion</th>
                  <th>Exclusion</th>
                  <th>Terms & Conditions</th>
                  <th>Cancellation</th>
                  {/* <th>Payment Terms</th> */}
                  <th>Booking Policy</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {dataview.map((data, index) => (
                  <tr key={index}>
                    {/* <td>{data.LanguageName || "-"}</td> */}
                    {/* <td>{data.OverviewName || "-"}</td> */}
                    {/* <td>{data.Highlights || "-"}</td> */}
                    {/* <td>{data.ItineraryIntroduction || "-"}</td> */}
                    {/* <td>{data.ItinerarySummary || "-"}</td> */}
                    <td>{data.Inclusion || "-"}</td>
                    <td>{data.Exclusion || "-"}</td>
                    <td>{data.TermsCondition || "-"}</td>
                    <td>{data.Cancelation || "-"}</td>
                    {/* <td>{data.PaymentTerm || "-"}</td> */}
                    <td>{data.BookingPolicy || "-"}</td>
                    <td>{data.Remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">No records found!</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setopen(false)}
            variant="danger light"
            className="btn-custom-size"
          >
            Close
          </Button>
          {/* <Button variant="primary" className="btn-custom-size">
                Save
              </Button> */}
        </Modal.Footer>
      </Modal>
      <Tab.Container defaultActiveKey="All">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="card-action coin-tabs mb-2">
            <Nav as="ul" className="nav nav-tabs">
              <Nav.Item as="li" className="nav-item">
                <Nav.Link className="nav-link" eventKey="All">
                  All List
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <div className="col-md-4">
            <div className="nav-item d-flex align-items-center">
              <div className="input-group search-area">
                <input
                  type="text"
                  className="form-control border"
                  placeholder="Search.."
                  // onChange={(e) => setFiterInput(e.target.value)}
                  onChange={(e) => setFilterInput(e.target.value)}
                />
                <span className="input-group-text border">
                  <i className="flaticon-381-search-2 cursor-pointer"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex gap-3">
            <button
              className="btn btn-dark btn-custom-size"
              name="SaveButton"
              onClick={() => navigate(-1)}
            >
              <span className="me-1">Back</span>
              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
            </button>
            <Link to="/git/add" className="btn btn-primary btn-custom-size">
              Add Git
            </Link>
          </div>
        </div>
        <ToastContainer />
        <UseTable
          table_columns={table_columns}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          rowsPerPage={rowsPerPage}
          handlePage={handlePageChange}
          handleRowsPerPage={handleRowsPerPageChange}
        />
      </Tab.Container>
    </>
  );
};

export default Git;
