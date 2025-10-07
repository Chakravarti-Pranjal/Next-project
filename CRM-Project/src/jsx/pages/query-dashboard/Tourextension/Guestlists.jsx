import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Guestlist from "./Guestlist";
import Employee from "./Employee";
import B2c from "./B2c";
import {
  Row,
  Card,
  Col,
  Button,
  Nav,
  Container,
  Dropdown,
  CardHeader,
  CardBody,
} from "react-bootstrap";
const Guestlists = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({
    ContactType: "GuestList",
  });
  const navigate = useNavigate();

  const handleFormChangeData = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <CardHeader className="my-0 border-0">
        <div className="col-md-12 col-sm-12 border-bottom pb-2 d-flex align-items-center justify-content-between">
          <div className="align-items-center">
            <h5 className="mb-0">{formData?.ContactType}</h5>

            {/* <div className="col">
              {" "}
              <input
                type="text"
                placeholder="Enter Name, Contact, Email"
                className={`form-control form-control-sm   `}
              />
            </div>
            <div className="col">
              <select name="Payment" className="form-control form-control-sm  ">
                {" "}
                <option value="1">All</option>
              </select>
            </div> */}

          </div>
          <div className="d-flex align-content-center justify-content-end gap-2 flex-wrap">
            {/* <div className="text-center">
              <div className=" btn-custom-size btn btn-warning ">
                <i className="fa-solid fa-download pe-1"></i> Download Format
              </div>
            </div> */}
            {/* <div className="col p-0">
              <div className="btn btn-primary px-2 py-1  fs-7 fw-400 ">
                <i className="fa-duotone fa-solid fa-file-import "></i> Import
                Excel
              </div>
            </div> */}
            {/* <div className=" text-center">
              <div className=" btn-custom-size btn btn-warning  ">
                <i className="fa-sharp fa-solid fa-file-arrow-up pe-1 fs-6 fw-500"></i>
                View Logs
              </div>
            </div> */}
            {/* <div className="">
              <NavLink to="/query/tour-execution/guest-list/add-guest">
                <div className=" btn btn-primary btn-custom-size">
                  {" "}
                  <i className="fa-solid fa-plus pe-1"></i>Add Guest
                </div>
              </NavLink>
            </div> */}
            <div className=" ">
              <div className=" d-flex">
                <button
                  className="btn btn-dark btn-custom-size me-2"
                  onClick={() => navigate("/query/invoices")}
                >
                  <span className="me-1">Back</span>
                  <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                </button>
                <button
                  className="btn btn-primary btn-custom-size "
                  name="SaveButton"
                  // onClick={() => navigate("/query/payments")}
                  onClick={() => setActiveTab("RoomingList")}
                >
                  <span className="me-1">Next</span>
                  <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      {/* <div className="col-lg-12 col-sm-12 ms-3">
        <div className="row align-items-center mt-1">
          <div className="col-lg-2 col-md-6 mb-3">
            <label>Contact Type</label>
            <select
              name="ContactType"
              id="contactType"
              className="form-control form-control-sm"
              value={formData.ContactType}
              onChange={handleFormChangeData}
            >
              <option value="GuestList">Guest List</option>
            </select>
          </div>
          <div className="col-lg-2 col-md-6 mb-3">
            <label>Tour Id</label>
            <input
              type="text"
              placeholder="24/04/0024/001"
              className={`form-control form-control-sm   `}
            />
          </div>
          <div className="col-lg-2 col-md-6 mb-3">
            <label>Agent Name</label>
            <input
              type="text"
              placeholder="Shubham Travel"
              className={`form-control form-control-sm   `}
            />
          </div>
        </div>
      </div> */}

      {/* managing guest , employe and b2c component*/}
      {formData.ContactType == "GuestList" && <Guestlist />}
      {formData.ContactType == "Employee" && <Employee />}
      {formData.ContactType == "B2C" && <B2c />}
    </>
  );
};

export default Guestlists;
