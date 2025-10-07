import React, { useEffect, useState } from "react";

/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";

/// Components
// import Notes from "../components/chatBox/Notes";
import Alerts from "../components/chatBox/Alerts";
import Chat from "../components/chatBox/Chat";
import { Link } from "react-router-dom";

const NotificationBox = ({ onClick, toggle }) => {
  return (
    <div className={`chatbox ${toggle === "notificationbox" ? "active" : ""}`}>
      <div className="chatbox-close" onClick={() => onClick()}></div>
      <div className="custom-tab-1">
        <ul className="nav nav-tabs justify-content-start gap-3">
          <li className="nav-item">
            <Link className={`nav-link active`}>Notifications</Link>
          </li>
        </ul>
        <div className="tab-content">
          {/* <Chat
            PerfectScrollbar={PerfectScrollbar}
            toggle={toggle}
            toggleTab={toggleTab}
          /> */}
          {/* <Notes
            PerfectScrollbar={PerfectScrollbar}
            toggle={toggle}
            toggleTab={toggleTab}
          /> */}
          <Alerts />
        </div>
      </div>
    </div>
  );
};

export default NotificationBox;
