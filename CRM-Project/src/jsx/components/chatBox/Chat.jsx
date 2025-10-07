import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/// Images
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import avatar3 from "../../../images/avatar/3.jpg";
import avatar4 from "../../../images/avatar/4.jpg";
import avatar5 from "../../../images/avatar/5.jpg";
import MsgBox from "./MsgBox";
import { axiosOther } from "../../../http/axios_base_url";

const Chat = ({ PerfectScrollbar, toggleChatBox, toggleTab }) => {
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [chatUserData, setChatUserData] = useState([]);

  // Redux state access
  const openMsg2 = useSelector((state) => state.activeTab.items);

  const dispatch = useDispatch();

  // To open
  const handleOpen = () => dispatch({ type: "OPEN_MSG" });

  // To close
  const handleClose = () => dispatch({ type: "CLOSE_MSG" });

  const [openMsg, setOpenMsg] = useState(false);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("listusers");
      setInitialList(data?.Datalist);
      setFilterValue(data?.Datalist);
    } catch (error) {
      console.log("user-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  const groupedUsers = filterValue?.reduce((acc, user) => {
    const firstLetter = user.Name?.[0]?.toUpperCase() || "#";
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(user);
    return acc;
  }, {});

  return (
    <div
      className={`tab-pane fade  ${toggleTab === "chat" ? "active show" : ""}`}
      id="chat"
      role="tabpanel"
    >
      <div
        className={`card mb-sm-3 mb-md-0 contacts_card dlab-chat-user-box ${
          openMsg2 ? "d-none" : ""
        }`}
      >
        <div className="card-header chat-list-header text-center">
          <Link to="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="18px"
              height="18px"
              viewBox="0 0 24 24"
              version="1.1"
            >
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <rect
                  fill="#000000"
                  x="4"
                  y="11"
                  width="16"
                  height="2"
                  rx="1"
                />
                <rect
                  fill="#000000"
                  opacity="0.3"
                  transform="translate(12.000000, 12.000000) rotate(-270.000000) translate(-12.000000, -12.000000) "
                  x="4"
                  y="11"
                  width="16"
                  height="2"
                  rx="1"
                />
              </g>
            </svg>
          </Link>
          <div>
            <h6 className="mb-1">Chat List</h6>
            <p className="mb-0">Show All</p>
          </div>
          <Link to="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="18px"
              height="18px"
              viewBox="0 0 24 24"
              version="1.1"
            >
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <rect x="0" y="0" width="24" height="24" />
                <circle fill="#000000" cx="5" cy="12" r="2" />
                <circle fill="#000000" cx="12" cy="12" r="2" />
                <circle fill="#000000" cx="19" cy="12" r="2" />
              </g>
            </svg>
          </Link>
        </div>
        <PerfectScrollbar
          className={`card-body contacts_body p-0 dlab-scroll  ${
            toggleChatBox ? "ps ps--active-y" : ""
          }`}
          id="DZ_W_Contacts_Body"
        >
          <ul className="contacts">
            {Object.keys(groupedUsers)
              .sort()
              .map((letter) => (
                <React.Fragment key={letter}>
                  <li className="name-first-letter" key={letter}>
                    {letter}
                  </li>
                  {groupedUsers[letter].map((user) => (
                    <li
                      className="active dlab-chat-user"
                      onClick={() => {
                        // setOpenMsg(true);
                        handleOpen(true);
                        setChatUserData(user);
                      }}
                      key={user.id}
                    >
                      <div className="d-flex bd-highlight">
                        <div className="img_cont">
                          {user.ProfileLogoImageData == null ? (
                            user.Name?.substring(0, 2).toUpperCase()
                          ) : (
                            <img
                              src={user.ProfileLogoImageData}
                              className="rounded-circle user_img"
                              alt=""
                            />
                          )}
                          <span className="online_icon"></span>
                        </div>
                        <div className="user_info">
                          <span>{user.Name}</span>
                          <p>{user.Name} is online</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </React.Fragment>
              ))}
          </ul>
        </PerfectScrollbar>
      </div>
      <MsgBox
        avatar1={avatar1}
        avatar2={avatar2}
        openMsg={openMsg}
        PerfectScrollbar={PerfectScrollbar}
        // offMsg={() => setOpenMsg(false)}
        offMsg={() => handleClose(false)}
        chatUserData={chatUserData}
      />
    </div>
  );
};

export default Chat;
