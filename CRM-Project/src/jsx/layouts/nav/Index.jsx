import React, { Fragment, useState } from "react";
import SideBar from "./SideBar.jsx";
import NavHader from "./NavHader.jsx";
import Header from "./Header.jsx";
import ChatBox from "../ChatBox.jsx";
import NotificationBox from "../NotificationBox.jsx";

const JobieNav = ({ title, onClick: ClickToAddEvent, onClick2, onClick3 }) => {
  const [toggle, setToggle] = useState("");
  const onClick = (name) => setToggle(toggle === name ? "" : name);
  return (
    <Fragment>
      <NavHader />
      <ChatBox onClick={() => onClick("chatbox")} toggle={toggle} />
      <NotificationBox
        onClick={() => onClick("notificationbox")}
        toggle={toggle}
      />
      <Header
        onNote={() => onClick("chatbox")}
        onNote2={() => onClick("notificationbox")}
        onNotification={() => onClick("notification")}
        onProfile={() => onClick("profile")}
        toggle={toggle}
        title={title}
        onBox={() => onClick("box")}
        onClick={() => ClickToAddEvent()}
      />
      <SideBar />
    </Fragment>
  );
};

export default JobieNav;
