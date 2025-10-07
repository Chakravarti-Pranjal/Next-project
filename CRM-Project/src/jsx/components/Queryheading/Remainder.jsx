import React, { useEffect, useState, useRef } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import remainder from "../../../images/svg/remainder.svg";
import bell from "../../../images/svg/bell.svg";
import Modal from "react-bootstrap/Modal";
import { reminderIntialValue } from "../../pages/query-dashboard/query_intial_value";
import { axiosOther } from "../../../http/axios_base_url";
import { notifySuccess, notifyError } from "../../../helper/notify";
import { ToastContainer } from "react-toastify";
import { LuClock9 } from "react-icons/lu";
import { reminderValidation } from "../../pages/query-dashboard/query_validation";
import * as yup from "yup";
import { BorderAllRounded } from "@mui/icons-material";

function Remainder(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState("");
  const [reminderFormValue, setReminderFormValue] =
    useState(reminderIntialValue);
  const [remarks, setRemarks] = useState([]);
  const [activeButton, setActiveButton] = useState(null);
  const dropdownRef = useRef(null);

  const StatusId = {
    "Option sent": 6,
    "Query lost": 8,
    "Internal note": 3,
    "Not reachable": 3,
    "Talk in progress": 3,
    "Finalizing soon": 3,
    Cancel: 7,
  };

  const handleShow = (modalName) => {
    setModalState(modalName);
    setActiveButton(modalName);
  };
  const handleClose = () => {
    setModalState("");
    setReminderFormValue(reminderIntialValue);
    setActiveButton(null);
  };

  // const handleToggle = () => {
  //   setIsOpen(!isOpen);
  // };
  const handleToggle = (isOpen, event, metadata) => {
    // Close dropdown when clicking outside
    const source = metadata?.source;
    if (source === "rootClose" || event?.type === "mousedown") {
      setIsOpen(false);
    } else {
      setIsOpen(isOpen);
    }
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [first, second] = name.split(".");
      setReminderFormValue({
        ...reminderFormValue,
        [first]: { ...reminderFormValue[first], [second]: value },
      });
    } else {
      setReminderFormValue({ ...reminderFormValue, [name]: value });
    }
  };

  const handleNoteType = (e) => {
    const { name, value } = e.target;
    const labelText = e.target.nextSibling.textContent;

    if (name.includes(".")) {
      const [first, second] = name.split(".");
      setReminderFormValue({
        ...reminderFormValue,
        [first]: {
          ...reminderFormValue[first],
          [second]: labelText,
        },
      });
    } else {
      setReminderFormValue({
        ...reminderFormValue,
        [name]: labelText,
      });
    }
  };

  const sendRemarks = async () => {
    try {
      let payload = {
        QueryID: props.queryId,
        StatusId: StatusId[modalState],
        Type: modalState,
        RemarkJson: {
          ...reminderFormValue.RemarkJson,
          StatusId: StatusId[modalState],
        },
      };
      if (
        modalState === "Cancel" ||
        modalState === "Query lost" ||
        modalState === "Option sent" ||
        modalState === "Internal note"
      ) {
        const response = await axiosOther.post("store-query-status", payload);
        if (response?.data?.Status == 1) {
          notifySuccess(response?.data?.Message);
          handleClose();
        }
      } else {
        await reminderValidation.validate(payload, { abortEarly: false });
        const response = await axiosOther.post("store-query-status", payload);
        if (response?.data?.Status == 1) {
          notifySuccess(response?.data?.Message);
          handleClose();
        }
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((e) => {
          notifyError(e.message);
        });
      } else {
        notifyError("Something went wrong");
      }
    }
  };

  const getRemarks = async () => {
    try {
      const response = await axiosOther.post("list-query-status");
      const filteredRemarks = response?.data?.DataList.filter(
        (remark) => remark.QueryId === props.queryId
      );
      setRemarks(filteredRemarks.length > 0 ? filteredRemarks : []);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getRemarks();
    return () => {
      setRemarks([]);
    };
  }, [props.queryId]);

  const handlesave = async () => {
    await sendRemarks();
    getRemarks();
  };

  //  console.log(reminderFormValue)
  // remarks&&console.log(remarks)

  return (
    <div ref={dropdownRef}>
      <ToastContainer />
      <div
        className="d-flex justify-content-start align-items-center"
        style={{ height: "25px" }}
      >
        <Dropdown show={isOpen}>
          <Dropdown.Toggle
            id="dropdown-basic"
            className="bg-transparent border-0 text-light"
            onClick={handleToggle}
          >
            <img src={remainder} alt="" />
          </Dropdown.Toggle>

          <Dropdown.Menu
            style={{ width: "20rem", height: "32rem" }}
            className="overflow-auto custom-dropdown-remainder hover"
          >
            {/* <Dropdown.Item>
              <div className="d-flex gap-3 justify-content-start allign-items-center ">
                <h6>Current Status:</h6>
                <h6 className="">{props.currentStatus}</h6>
              </div>
            </Dropdown.Item>

            <Dropdown.Item>
              <div className="d-flex gap-3 justify-content-start flex-wrap reminderBtn">
                <Button
                  className={`custom-button-style rounded-4 custom-green  ${
                    activeButton === "Query Confirmed" ? "active" : ""
                  }`}
                  size="sm"
                >
                  Query Confirmed
                </Button>
                <Button
                  className={`custom-button-style rounded-4 custom-blue ${
                    activeButton === "Option sent" ? "active" : ""
                  }`}
                  size="sm"
                  onClick={() => {
                    handleShow("Option sent");
                  }}
                >
                  Option Sent
                </Button>
                <Button
                  className={`custom-button-style rounded-4 custom-purple ${
                    activeButton === "Quotation" ? "active" : ""
                  }`}
                  size="sm"
                >
                  Quotation <br /> Generated
                </Button>
                <Button
                  className={`custom-button-style rounded-4 custom-brown ${
                    activeButton === "Query lost" ? "active" : ""
                  }`}
                  size="sm"
                  onClick={() => {
                    handleShow("Query lost");
                  }}
                >
                  Query Lost
                </Button>
              </div>
            </Dropdown.Item> */}

            <Dropdown.Item>
              <div className="d-flex gap-3 justify-content-start">
                <h6>Notes & Remainder</h6>
              </div>
            </Dropdown.Item>

            <Dropdown.Item>
              <div className="d-flex gap-3 justify-content-start flex-wrap reminderBtn">
                <Button
                  className={`custom-button-style  rounded-4 custom-sky  ${
                    activeButton === "Internal note" ? "active" : ""
                  }`}
                  size="sm"
                  onClick={() => {
                    handleShow("Internal note");
                  }}
                >
                  Internal Notes
                </Button>
                <Button
                  className={`custom-button-style rounded-4 custom-red  ${
                    activeButton === "Not reachable" ? "active" : ""
                  }`}
                  size="sm"
                  onClick={() => {
                    handleShow("Not reachable");
                  }}
                >
                  Not Reachable
                </Button>
                <Button
                  className={`custom-button-style  rounded-4 custom-green-light  ${
                    activeButton === "Talk in progress" ? "active" : ""
                  }`}
                  size="sm"
                  onClick={() => {
                    handleShow("Talk in progress");
                  }}
                >
                  Talk in Progress
                </Button>
                <Button
                  className={`custom-button-style  rounded-4 custom-green-dark  ${
                    activeButton === "Finalizing soon" ? "active" : ""
                  }`}
                  size="sm"
                  onClick={() => {
                    handleShow("Finalizing soon");
                  }}
                >
                  Finalizing Soon
                </Button>
                <Button
                  className={`custom-button-style rounded-4 custom-red  ${
                    activeButton === "Cancel" ? "active" : ""
                  }`}
                  size="sm"
                  onClick={() => {
                    handleShow("Cancel");
                  }}
                >
                  Query Cancel
                </Button>
              </div>
            </Dropdown.Item>

            <Dropdown.Item>
              <h6>Remarks</h6>
            </Dropdown.Item>
            <Dropdown.Item>
              <div className="">
                {remarks.length > 0 ? (
                  remarks.map((remark) => (
                    <div key={remark.id}>
                      <div className="d-flex flex-column gap-1 fs-5 text-light">
                        <span>Type: {remark.Type}</span>
                        {remark.RemarkJson?.NoteTypeName && (
                          <span
                            style={{
                              wordWrap: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            Note: {remark.RemarkJson?.NoteTypeName}
                          </span>
                        )}
                        <span
                          style={{
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                          }}
                        >
                          Remarks:{" "}
                          {remark.RemarkJson?.Remark
                            ? remark.RemarkJson?.Remark
                            : ""}
                        </span>
                        {remark.RemarkJson?.ReminderTime && (
                          <div className="d-flex gap-1 align-items-center">
                            <LuClock9 size={"11px"} />
                            <span>
                              Reminder: {remark.RemarkJson?.ReminderTime}{" "}
                              {remark.RemarkJson?.ReminderDate}
                            </span>{" "}
                          </div>
                        )}
                      </div>
                      <hr />
                    </div>
                  ))
                ) : (
                  <span className="fs-6 text-light">No remarks available</span>
                )}
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <Modal show={modalState === "Option sent"} onHide={handleClose}>
        <div style={{ border: "2px solid #2aa2cd", borderRadius: "5px" }}>
          <Modal.Header closeButton>
            <Modal.Title>Change Status Query Options Sent</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="">
              <div className="d-flex flex-column gap-3 ">
                <label htmlFor="Remark" className="fs-6">
                  Remarks:
                </label>
                <textarea
                  className="form-control form-control-sm"
                  placeholder=""
                  name="RemarkJson.Remark"
                  value={reminderFormValue?.RemarkJson?.Remark}
                  onChange={handleChange}
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-dark btn-custom-size ms-2"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="btn btn-primary btn-custom-size fs-10"
              onClick={handlesave}
            >
              Save
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      <Modal show={modalState === "Query lost"} onHide={handleClose}>
        <div style={{ border: "2px solid #c65857", borderRadius: "5px" }}>
          <Modal.Header closeButton>
            <Modal.Title>Change Status Query Lost</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="">
              <div className="d-flex flex-column gap-3 ">
                <label htmlFor="Remark" className="fs-6">
                  Remarks:
                </label>
                <textarea
                  className="form-control form-control-sm"
                  placeholder=""
                  name="RemarkJson.Remark"
                  value={reminderFormValue?.RemarkJson?.Remark}
                  onChange={handleChange}
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-dark btn-custom-size ms-2"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="btn btn-primary btn-custom-size fs-10"
              onClick={handlesave}
            >
              Save
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      <Modal show={modalState === "Internal note"} onHide={handleClose}>
        <div style={{ border: "2px solid #28b8db", borderRadius: "5px" }}>
          <Modal.Header closeButton>
            <Modal.Title>Add Note-Query ID</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="d-flex flex-column gap-3">
              <div>
                <label htmlFor="internal note" className="fs-6">
                  Internal Note
                </label>
              </div>
              <hr />
              <div className="d-flex flex-column gap-3 ">
                <label htmlFor="Remark" className="fs-6">
                  Your Note
                </label>
                <textarea
                  className="form-control form-control-sm"
                  placeholder=""
                  name="RemarkJson.Remark"
                  value={reminderFormValue?.RemarkJson?.Remark}
                  onChange={handleChange}
                />
              </div>
              <hr />
              <div className="d-flex flex-column gap-3">
                <label htmlFor="Remainder" className="fs-6">
                  Remainder
                </label>
                <div className="d-flex gap-3">
                  <input
                    type="date"
                    className="w-50 form-control form-control-sm"
                    name="RemarkJson.ReminderDate"
                    value={reminderFormValue?.RemarkJson?.ReminderDate}
                    onChange={handleChange}
                  />
                  <input
                    type="time"
                    className="w-50 form-control form-control-sm"
                    name="RemarkJson.ReminderTime"
                    value={reminderFormValue?.RemarkJson?.ReminderTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-dark btn-custom-size ms-2"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="btn btn-primary btn-custom-size fs-10"
              onClick={handlesave}
            >
              Save
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      <Modal show={modalState === "Not reachable"} onHide={handleClose}>
        <div style={{ border: "2px solid #ee1212", borderRadius: "5px" }}>
          <Modal.Header closeButton>
            <Modal.Title>Add Note - Query ID</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="d-flex flex-column gap-3">
              <div className="d-flex flex-column gap-4">
                <label
                  htmlFor="traveler-not-reachable"
                  className="fs-6"
                >
                  Traveler not reachable
                </label>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex gap-2">
                    <input
                      type="radio"
                      id="option1"
                      name="RemarkJson.NoteTypeName"
                      value={reminderFormValue?.RemarkJson?.NoteTypeName}
                      onChange={handleNoteType}
                    />
                    <label htmlFor="option1" className="fs-6">
                      Phone number doesn't work
                    </label>
                  </div>
                  <div className="d-flex gap-2">
                    <input
                      type="radio"
                      id="option2"
                      name="RemarkJson.NoteTypeName"
                      value={reminderFormValue?.RemarkJson?.NoteTypeName}
                      onChange={handleNoteType}
                    />
                    <label htmlFor="option2" className="fs-6">
                      User is not responding
                    </label>
                  </div>
                  <div className="d-flex gap-2">
                    <input
                      type="radio"
                      id="option3"
                      name="RemarkJson.NoteTypeName"
                      value={reminderFormValue?.RemarkJson?.NoteTypeName}
                      onChange={handleNoteType}
                    />
                    <label htmlFor="option3" className="fs-6">
                      Call disconnected
                    </label>
                  </div>
                </div>
              </div>

              <hr />

              <div className="d-flex flex-column gap-3">
                <label htmlFor="remark" className="fs-6">
                  Your Note
                </label>
                <textarea
                  className="form-control form-control-sm"
                  placeholder=""
                  name="RemarkJson.Remark"
                  value={reminderFormValue?.RemarkJson?.Remark}
                  onChange={handleChange}
                />
              </div>

              <hr />

              <div className="d-flex flex-column gap-3">
                <label htmlFor="remainder" className="fs-6">
                  Reminder
                </label>
                <div className="d-flex gap-3">
                  <input
                    type="date"
                    className="w-50 form-control form-control-sm"
                    name="RemarkJson.ReminderDate"
                    value={reminderFormValue?.RemarkJson?.ReminderDate}
                    onChange={handleChange}
                  />
                  <input
                    type="time"
                    className="w-50 form-control form-control-sm"
                    name="RemarkJson.ReminderTime"
                    value={reminderFormValue?.RemarkJson?.ReminderTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-dark btn-custom-size ms-2"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="btn btn-primary btn-custom-size fs-10"
              onClick={handlesave}
            >
              Save
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      <Modal show={modalState === "Talk in progress"} onHide={handleClose}>
        <div style={{ border: "2px solid #11b76d", borderRadius: "5px" }}>
          <Modal.Header closeButton>
            <Modal.Title>Add Note - Query ID</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="d-flex flex-column gap-3">
              <div className="d-flex flex-column gap-4">
                <label
                  htmlFor="traveler-not-reachable"
                  className="fs-6"
                >
                  Talk in progress with traveler
                </label>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex gap-2">
                    <input
                      type="radio"
                      id="option1"
                      name="RemarkJson.NoteTypeName"
                      value={reminderFormValue?.RemarkJson?.NoteTypeName}
                      onChange={handleNoteType}
                    />
                    <label htmlFor="option1" className="fs-6">
                      Initial stage only-quote not seen
                    </label>
                  </div>
                  <div className="d-flex gap-2">
                    <input
                      type="radio"
                      id="option2"
                      name="RemarkJson.NoteTypeName"
                      value={reminderFormValue?.RemarkJson?.NoteTypeName}
                      onChange={handleNoteType}
                    />
                    <label htmlFor="option2" className="fs-6">
                      Getting Quote/package customized
                    </label>
                  </div>
                  <div className="d-flex gap-2">
                    <input
                      type="radio"
                      id="option3"
                      name="RemarkJson.NoteTypeName"
                      value={reminderFormValue?.RemarkJson?.NoteTypeName}
                      onChange={handleNoteType}
                    />
                    <label htmlFor="option3" className="fs-6">
                      Traveler interested, but will book after few weeks
                    </label>
                  </div>
                </div>
              </div>

              <hr />

              <div className="d-flex flex-column gap-3">
                <label htmlFor="remark" className="fs-6">
                  Your Note
                </label>
                <textarea
                  className="form-control form-control-sm"
                  placeholder=""
                  name="RemarkJson.Remark"
                  value={reminderFormValue?.RemarkJson?.Remark}
                  onChange={handleChange}
                />
              </div>

              <hr />

              <div className="d-flex flex-column gap-3">
                <label htmlFor="remainder" className="fs-6">
                  Reminder
                </label>
                <div className="d-flex gap-3">
                  <input
                    type="date"
                    className="w-50 form-control form-control-sm"
                    name="RemarkJson.ReminderDate"
                    value={reminderFormValue?.RemarkJson?.ReminderDate}
                    onChange={handleChange}
                  />
                  <input
                    type="time"
                    className="w-50 form-control form-control-sm"
                    name="RemarkJson.ReminderTime"
                    value={reminderFormValue?.RemarkJson?.ReminderTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-dark btn-custom-size ms-2"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="btn btn-primary btn-custom-size fs-10"
              onClick={handlesave}
            >
              Save
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      <Modal show={modalState === "Finalizing soon"} onHide={handleClose}>
        <div style={{ border: "2px solid #078c03", borderRadius: "5px" }}>
          <Modal.Header closeButton>
            <Modal.Title>Add Note - Query ID</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="d-flex flex-column gap-3">
              <div className="d-flex flex-column gap-4">
                <label
                  htmlFor="traveler-not-reachable"
                  className="fs-6"
                >
                  Traveler will finalize and is 'My Hot'
                </label>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex gap-2">
                    <input
                      type="radio"
                      id="option1"
                      name="RemarkJson.NoteTypeName"
                      value={reminderFormValue?.RemarkJson?.NoteTypeName}
                      onChange={handleNoteType}
                    />
                    <label htmlFor="option1" className="fs-6">
                      Negotiating / Will finalize in 2 to 3 days
                    </label>
                  </div>
                  <div className="d-flex gap-2">
                    <input
                      type="radio"
                      id="option2"
                      name="RemarkJson.NoteTypeName"
                      value={reminderFormValue?.RemarkJson?.NoteTypeName}
                      onChange={handleNoteType}
                    />
                    <label htmlFor="option2" className="fs-6">
                      Invoice sent to traveler
                    </label>
                  </div>
                </div>
              </div>

              <hr />

              <div className="d-flex flex-column gap-3">
                <label htmlFor="remark" className="fs-6">
                  Your Note
                </label>
                <textarea
                  className="form-control form-control-sm"
                  name="RemarkJson.Remark"
                  value={reminderFormValue?.RemarkJson?.Remark}
                  onChange={handleChange}
                />
              </div>

              <hr />

              <div className="d-flex flex-column gap-3">
                <label htmlFor="remainder" className="fs-6">
                  Reminder
                </label>
                <div className="d-flex gap-3">
                  <input
                    type="date"
                    className="w-50 form-control form-control-sm"
                    name="RemarkJson.ReminderDate"
                    value={reminderFormValue?.RemarkJson?.ReminderDate}
                    onChange={handleChange}
                  />
                  <input
                    type="time"
                    className="w-50 form-control form-control-sm"
                    name="RemarkJson.ReminderTime"
                    value={reminderFormValue?.RemarkJson?.ReminderTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-dark btn-custom-size ms-2"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="btn btn-primary btn-custom-size fs-10"
              onClick={handlesave}
            >
              Save
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      <Modal show={modalState === "Cancel"} onHide={handleClose}>
        <div style={{ border: "2px solid #ee1212", borderRadius: "5px" }}>
          <Modal.Header closeButton>
            <Modal.Title>Query cancellation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="d-flex flex-column gap-3">
              <div className="d-flex flex-column gap-4">
                <label
                  htmlFor="traveler-not-reachable"
                  className="fs-6"
                >
                  Query Cancel
                </label>
              </div>

              <hr />

              <div className="d-flex flex-column gap-3">
                <label htmlFor="remark" className="fs-6">
                  Cancel Note:
                </label>
                <textarea
                  className="form-control form-control-sm"
                  placeholder=""
                  name="RemarkJson.Remark"
                  value={reminderFormValue?.RemarkJson?.Remark}
                  onChange={handleChange}
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-dark btn-custom-size ms-2"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              className="btn btn-primary btn-custom-size fs-10"
              onClick={handlesave}
            >
              Yes, cancel it
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
}

export default Remainder;
