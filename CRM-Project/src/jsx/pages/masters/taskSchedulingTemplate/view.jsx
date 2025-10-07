import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { ThemeContext } from "../../../../context/ThemeContext";
import { table_custom_style } from "../../../../css/custom_style";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";

const ViewTaskSchedulingDetail = () => {
  const { background } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const template = location.state;

  const serviceTableColumns = [
    {
      name: "Service Name",
      selector: (service) => service?.ServiceName || "",
      sortable: true,

    },
    {
      name: "Travel Start Days",
      selector: (service) => service?.TravleStartDaysType || "",
      sortable: true,

    },
    {
      name: "Travel Complete Days",
      selector: (service) => service?.TravelCompeleteDaysType || "",
      sortable: true,

    },
    {
      name: "Booking Start Days",
      selector: (service) => service?.BookingStartDaysType || "",
      sortable: true,

    },
    {
      name: "Booking Complete Days",
      selector: (service) => service?.BookingCompeleteDaysType || "",
      sortable: true,

    },
  ];


  return (
    <div className="card">
      <div className="card-body">
        <div className="card-header mb-2">
          <h3 className="mb-0">Service Details for {template?.Name || "Unknown Template"}</h3>
          <div className="d-flex gap-3">
            <Button
              className="btn btn-dark btn-custom-size"
              onClick={() => navigate(-1)}
            >
              <span className="me-1">Back</span>
              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
            </Button>
          </div>
        </div>
        <ToastContainer />
        <DataTable
          columns={serviceTableColumns}
          data={template?.ServiceDetails || []}
          sortIcon={<i className="fa-solid fa-sort fs-4"></i>}
          striped
          highlightOnHover
          customStyles={table_custom_style(background)}
          className="custom-scrollbar"
        />
      </div>
    </div>
  );
};

export default ViewTaskSchedulingDetail;