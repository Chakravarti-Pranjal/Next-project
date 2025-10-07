import React, { Fragment, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import axios from "axios";

const Sent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sort = 10;
  const activePag = useRef(0);
  const [test, settest] = useState(0);
  const [data, setData] = useState([]);

  // Static data for sent emails only
  const staticSentData = [
    {
      id: 101,
      subject: "Meeting Tomorrow",
      date: "2023-05-15T10:30:00",
      to: "john@example.com",
      read: false
    },
    {
      id: 102,
      subject: "Project Update",
      date: "2023-05-14T15:45:00",
      to: "team@example.com",
      read: true
    },
    {
      id: 103,
      subject: "Vacation Approval",
      date: "2023-05-12T09:15:00",
      to: "hr@example.com",
      read: false
    },
  ];

  // Initialize data with sent emails
  useEffect(() => {
    setData(staticSentData);
    setLoading(false);
    // Initialize pagination with first page
    if (staticSentData.length > 0 && activePag.current === 0) {
      chageData(0, sort);
    }
  }, []);

  // Active data for pagination
  const chageData = (frist, sec) => {
    const emailElements = document.querySelectorAll(".email-right-box .email-list .message");
    for (var i = 0; i < emailElements.length; ++i) {
      if (i >= frist && i < sec) {
        emailElements[i].classList.remove("d-none");
      } else {
        emailElements[i].classList.add("d-none");
      }
    }
  };

  // Pagination
  let paggination = Array(Math.ceil(data.length / sort))
    .fill()
    .map((_, i) => i + 1);

  // Active pagination & change data
  const onClick = (i) => {
    activePag.current = i;
    chageData(activePag.current * sort, (activePag.current + 1) * sort);
    settest(i);
  };

  // Checkbox functions
  const chackboxFun = (type) => {
    const chackbox = document.querySelectorAll(".message input");
    const motherChackBox = document.querySelector("#checkbox1");

    for (let i = 0; i < chackbox.length; i++) {
      const element = chackbox[i];
      if (type === "all") {
        if (motherChackBox.checked) {
          element.checked = true;
        } else {
          element.checked = false;
        }
      } else {
        if (!element.checked) {
          motherChackBox.checked = false;
          break;
        } else {
          motherChackBox.checked = true;
        }
      }
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading emails...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger">Error: {error}</div>;
  }

  return (
    <Fragment>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-xl-3 col-lg-4">
                  <div className="email-left-box">
                    <div className="p-0">
                      <Link
                        to="/mails/compose"
                        className="btn btn-primary btn-block"
                      >
                        Compose
                      </Link>
                    </div>
                    <div className="mail-list rounded  mt-4">
                      <Link to="/mails" className="list-group-item active">
                        <i className="fa fa-inbox font-18 align-middle me-2"></i>
                        Inbox
                        <span className="badge badge-primary badge-sm float-end">
                          75
                        </span>
                      </Link>
                      <Link to="/mails/compose/sent" className="list-group-item">
                        <i className="fa fa-paper-plane font-18 align-middle me-2"></i>
                        Sent
                        <span className="badge badge-primary badge-sm float-end">
                          {staticSentData.length}
                        </span>
                      </Link>
                      <Link to="/mails/compose/important" className="list-group-item">
                        <i className="fas fa-star font-18 align-middle me-2"></i>
                        Important
                        <span className="badge badge-primary badge-sm float-end">
                          {staticSentData.length}
                        </span>
                      </Link>
                      <Link to="/mails/compose/draft" className="list-group-item">
                        <i className="mdi mdi-file-document-box font-18 align-middle me-2"></i>
                        Draft
                        <span className="badge badge-primary badge-sm float-end">
                          {staticSentData.length}
                        </span>
                      </Link>
                      <Link to="/mails/compose/trash" className="list-group-item">
                        <i className="fa fa-trash font-18 align-middle me-2"></i>
                        Trash
                        <span className="badge badge-primary badge-sm float-end">
                          {staticSentData.length}
                        </span>
                      </Link>
                    </div>
                    <div className="mail-list rounded overflow-hidden mt-4 ">
                      <div className="intro-title d-flex justify-content-between my-0">
                        <h5>Categories</h5>
                        <i
                          className="fa fa-chevron-down"
                          aria-hidden="true"
                        ></i>
                      </div>
                      <Link to="/mails/compose/work" className="list-group-item">
                        <span className="icon-warning">
                          <i className="fa fa-circle" aria-hidden="true"></i>
                        </span>
                        Work
                        <span className="badge badge-primary badge-sm float-end">
                          {staticSentData.length}
                        </span>
                      </Link>
                      <Link to="/mails/compose/private" className="list-group-item">
                        <span className="icon-primary">
                          <i className="fa fa-circle" aria-hidden="true"></i>
                        </span>
                        Private
                        <span className="badge badge-primary badge-sm float-end">
                          {staticSentData.length}
                        </span>
                      </Link>
                      <Link to="/mails/compose/support" className="list-group-item">
                        <span className="icon-success">
                          <i className="fa fa-circle" aria-hidden="true"></i>
                        </span>
                        Support
                        <span className="badge badge-primary badge-sm float-end">
                          {staticSentData.length}
                        </span>
                      </Link>
                      <Link to="/mails/compose/social" className="list-group-item">
                        <span className="icon-dpink">
                          <i className="fa fa-circle" aria-hidden="true"></i>
                        </span>
                        Social
                        <span className="badge badge-primary badge-sm float-end">
                          {staticSentData.length}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-xl-9 col-lg-8">
                  <div className="email-right-box">
                    <div role="toolbar" className="toolbar ms-1 ms-sm-0">
                      <div className="btn-group mb-1 me-1 ms-1">
                        <div className="form-check custom-checkbox">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="checkbox1"
                            onClick={() => chackboxFun("all")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="checkbox1"
                          ></label>
                        </div>
                      </div>
                      <div className="btn-group mb-1">
                        <button
                          className="btn btn-primary light px-3"
                          type="button"
                        >
                          <i className="ti-reload"></i>
                        </button>
                      </div>
                      <Dropdown className="btn-group mb-1">
                        <Dropdown.Toggle
                          aria-expanded="false"
                          data-toggle="dropdown"
                          className="btn btn-primary px-3 light dropdown-toggle ms-1"
                          type="button"
                        >
                          More <span className="caret"></span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu">
                          <Dropdown.Item className="dropdown-item">
                            Mark as Unread
                          </Dropdown.Item>
                          <Dropdown.Item className="dropdown-item">
                            Add to Tasks
                          </Dropdown.Item>
                          <Dropdown.Item className="dropdown-item">
                            Add Star
                          </Dropdown.Item>
                          <Dropdown.Item className="dropdown-item">
                            Mute
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                    <div className="email-list mt-3">
                      {data.length > 0 ? (
                        data.map((email, index) => (
                          <div className="message" key={email.id || index}>
                            <div>
                              <div className="d-flex message-single">
                                <div className="ps-1 align-self-center">
                                  <div className="form-check custom-checkbox">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      onClick={() => chackboxFun()}
                                      id={`checkbox${index + 2}`}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`checkbox${index + 2}`}
                                    />
                                  </div>
                                </div>
                                <div className="ms-2">
                                  <button className="border-0 bg-transparent align-middle p-0">
                                    <i className="fa fa-star" aria-hidden="true" />
                                  </button>
                                </div>
                              </div>
                              <Link to="" className="col-mail col-mail-2">
                                <div className="subject">
                                  {email.subject || "No subject"}
                                </div>
                                <div className="date">
                                  {new Date(email.date).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-5">
                          No sent emails found
                        </div>
                      )}
                    </div>

                    {data.length > 0 && (
                      <div className="row mt-4">
                        <div className="col-12 ps-3">
                          <nav>
                            <ul className="pagination pagination-gutter pagination-primary pagination-sm no-bg">
                              <li className="page-item page-indicator">
                                <Link
                                  className="page-link"
                                  to="/mails"
                                  onClick={() =>
                                    activePag.current > 0 &&
                                    onClick(activePag.current - 1)
                                  }
                                >
                                  <i className="la la-angle-left"></i>
                                </Link>
                              </li>
                              {paggination.map((number, i) => (
                                <li
                                  key={i}
                                  className={`page-item  ${activePag.current === i ? "active" : ""
                                    } `}
                                  onClick={() => onClick(i)}
                                >
                                  <Link className="page-link" to="/mails">
                                    {number}
                                  </Link>
                                </li>
                              ))}

                              <li className="page-item page-indicator">
                                <Link
                                  className="page-link"
                                  to="/mails"
                                  onClick={() =>
                                    activePag.current + 1 < paggination.length &&
                                    onClick(activePag.current + 1)
                                  }
                                >
                                  <i className="la la-angle-right"></i>
                                </Link>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Sent;