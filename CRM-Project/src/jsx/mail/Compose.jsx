import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import DropFile from "./DropFile";
import { Dropdown } from "react-bootstrap";
import { axiosOther } from "../../http/axios_base_url";

const Compose = () => {
  const [emailData, setEmailData] = useState({
    ConfigId: 8,
    MailType: "3",
    To: "",
    Subject: "",
    Body: "",
    Attachment: ""
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendEmail = async () => {
    try {
      const response = await axiosOther.post("send-email", emailData);
      console.log('Email sent successfully:', response.data);
      console.log(emailData, "emailData print")
      // You can add a success notification here
    } catch (error) {
      console.error('Error sending email:', error);
      // You can add an error notification here
    }
  };

  const handleDiscard = () => {
    setEmailData({
      ConfigId: 8,
      MailType: "3",
      To: "",
      Subject: "",
      Body: "",
      Attachment: ""
    });
  };

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
                  <div className="email-right-box ms-0 ms-sm-4 ms-sm-0">
                    <div className="toolbar mb-4" role="toolbar">
                      <div className="btn-group mb-1">
                        <button
                          type="button"
                          className="btn btn-primary light px-3"
                        >
                          <i className="fa fa-archive"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary light px-3"
                        >
                          <i className="fa fa-exclamation-circle"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary light px-3"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                      <Dropdown className="btn-group mb-1">
                        <Dropdown.Toggle
                          type="button"
                          className="btn btn-primary light dropdown-toggle px-3 ms-1"
                          data-toggle="dropdown"
                        >
                          <i className="fa fa-folder"></i>
                          <b className="caret m-l-5"></b>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu">
                          <Dropdown.Item
                            as="a"
                            className="dropdown-item"
                            to="/email-compose"
                          >
                            Social
                          </Dropdown.Item>
                          <Dropdown.Item
                            as="a"
                            className="dropdown-item"
                            to="/email-compose"
                          >
                            Promotions
                          </Dropdown.Item>
                          <Dropdown.Item
                            as="a"
                            className="dropdown-item"
                            to="/email-compose"
                          >
                            Updates
                          </Dropdown.Item>
                          <Dropdown.Item
                            as="a"
                            className="dropdown-item"
                            to="/email-compose"
                          >
                            Forums
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      <Dropdown className="btn-group mb-1">
                        <Dropdown.Toggle
                          className="btn btn-primary light dropdown-toggle px-3 ms-1"
                          data-toggle="dropdown"
                        >
                          <i className="fa fa-tag"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item as="a">Updates</Dropdown.Item>
                          <Dropdown.Item as="a">Social</Dropdown.Item>
                          <Dropdown.Item as="a">Promotions</Dropdown.Item>
                          <Dropdown.Item as="a">Forums</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      <Dropdown className="btn-group mb-1">
                        <Dropdown.Toggle
                          type="button"
                          className="btn btn-primary light dropdown-toggle v ms-1"
                          data-toggle="dropdown"
                        >
                          More <span className="caret m-l-5"></span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu">
                          <Dropdown.Item
                            className="dropdown-item"
                            to="/email-compose"
                          >
                            Mark as Unread
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="dropdown-item"
                            to="/email-compose"
                          >
                            Add to Tasks
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="dropdown-item"
                            to="/email-compose"
                          >
                            Add Star
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="dropdown-item"
                            to="/email-compose"
                          >
                            Mute
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className="compose-content">
                      <form action="#">
                        <div className="form-group mb-3">
                          <input
                            type="text"
                            name="To"
                            className="form-control bg-transparent"
                            placeholder=" To:"
                            value={emailData.To}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group mb-3">
                          <input
                            type="text"
                            name="Subject"
                            className="form-control bg-transparent"
                            placeholder=" Subject:"
                            value={emailData.Subject}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group mb-3">
                          <textarea
                            id="email-compose-editor"
                            name="Body"
                            className="textarea_editor form-control bg-transparent"
                            rows="8"
                            placeholder="Enter text ..."
                            value={emailData.Body}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </form>
                      <h5 className="mb-4">
                        <i className="fa fa-paperclip"></i> Attatchment
                      </h5>
                      <DropFile
                        onFileUpload={(file) => setEmailData(prev => ({
                          ...prev,
                          Attachment: file?.name
                        }))}
                      />
                      {/* <DropFile /> */}
                    </div>
                    <div className="text-left mt-4 mb-5">
                      <button
                        className="btn btn-primary btn-sl-sm me-2"
                        type="button"
                        onClick={handleSendEmail}
                      >
                        <span className="me-2">
                          <i className="fa fa-paper-plane"></i>
                        </span>
                        Send
                      </button>
                      <button
                        className="btn btn-danger light btn-sl-sm"
                        type="button"
                        onClick={handleDiscard}
                      >
                        <span className="me-2">
                          <i className="fa fa-times" aria-hidden="true"></i>
                        </span>
                        Discard
                      </button>
                    </div>
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

export default Compose;

