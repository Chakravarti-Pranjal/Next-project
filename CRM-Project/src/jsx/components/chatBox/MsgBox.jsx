import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosOther } from "../../../http/axios_base_url";
import { useSubdomain } from "../../../context/SubdomainContext";
import echo from "../../../echo";
import { useSelector } from "react-redux";

const MsgBox = ({
  avatar1,
  avatar2,
  openMsg,
  PerfectScrollbar,
  offMsg,
  chatUserData,
}) => {
  const baseUrl = import.meta.env.VITE_CHATNOTIFICATION_URI;
  const [toggle, setToggle] = useState(false);
  const [messages, setMessages] = useState([]);

  const { faviconIcon, title } = useSubdomain();
  const tokenString = localStorage.getItem("token");
  let tokenData = null;
  let token = null;
  let userId = null;
  let sender_id = null;

  if (tokenString) {
    try {
      tokenData = JSON.parse(tokenString);
      token = tokenData?.token;
      userId = tokenData?.UserID;
      sender_id = tokenData?.UserID;
    } catch (err) {
      console.error("Invalid token format", err);
    }
  }
  const [input, setInput] = useState("");
  const receiverId = chatUserData.id;

  const openMsg2 = useSelector((state) => state.activeTab.items);

  const fetchMessages = async () => {
    try {
      const res = await axiosOther.post(
        `${baseUrl}chat-history`,
        {
          sender_id: tokenData.UserID,
          receiver_id: receiverId,
        }
      );

      if (res.data.Status == 1) {
        setMessages(res.data.Data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };
  
  

  useEffect(() => {
    fetchMessages();
  }, [receiverId]);

  // Setup Echo listener for real-time messages
  useEffect(() => {
    if (!userId) return;
    console.log("✅ Echo listener useEffect running for user:", userId);

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Setup public channel
    echo.channel(`chat.${userId}`).listen("chat-message", (e) => {
      console.log("New message event:", e); // Log the entire event data to check its structure
      // Show browser notification
      // if (Notification.permission === "granted") {
      //    new Notification(`🔔 ${title} Notification`, {
      //       body: e.message,
      //       icon: faviconIcon,
      //    });
      // }

      // Push message to state
      // setMessages(prev => [...prev, {
      //    message: e.message,
      //    sender_id: e.sender_id,
      //    receiver_id: e.receiver_id,
      //    created_at: e.created_at
      // }]);
    });
    // Cleanup on unmount
    return () => {
      //channel.stopListening('.chat.message');
      echo.leave(`chat.${userId}`);
    };
  }, [userId, receiverId]);

  const sendMessage = async () => {
    if (!input || !receiverId) return;

    try {
      const response = await fetch(`${baseUrl}chat-send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_id: receiverId,
          sender_id: sender_id,
          companyId: tokenData.companyKey,
          message: input,
        }),
      });

      const res = await response.json();
      //console.log(res);

      if (res.Status === true) {
        const { sender_id, receiver_id, message, created_at } = res.Data;
        setMessages((prev) => [
          ...prev,
          { sender_id, receiver_id, message, created_at },
        ]);
        setInput("");
        // Send a browser notification when the message is successfully sent
        if (Notification.permission === "granted") {
          new Notification(`🔔 ${title} Notification`, {
            body: message, // Use res.data.message or any other property from your response
            icon: faviconIcon, // Optional icon for the notification
          });
        }
      } else {
        console.log("Failed to send message:", res.Message);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    const chatBox = document.getElementById("DZ_W_Contacts_Body3");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={`card chat dlab-chat-history-box ${openMsg2 ? "" : "d-none"}`}
    >
      <div className="card-header chat-list-header text-center">
        <Link
          to={"#"}
          className="dlab-chat-history-back"
          onClick={() => offMsg()}
          // onClick={() => handleClose()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="18px"
            height="18px"
            viewBox="0 0 24 24"
            version="1.1"
          >
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <polygon points="0 0 24 0 24 24 0 24" />
              <rect
                fill="#000000"
                opacity="0.3"
                transform="translate(15.000000, 12.000000) scale(-1, 1) rotate(-90.000000) translate(-15.000000, -12.000000) "
                x="14"
                y="7"
                width="2"
                height="10"
                rx="1"
              />
              <path
                d="M3.7071045,15.7071045 C3.3165802,16.0976288 2.68341522,16.0976288 2.29289093,15.7071045 C1.90236664,15.3165802 1.90236664,14.6834152 2.29289093,14.2928909 L8.29289093,8.29289093 C8.67146987,7.914312 9.28105631,7.90106637 9.67572234,8.26284357 L15.6757223,13.7628436 C16.0828413,14.136036 16.1103443,14.7686034 15.7371519,15.1757223 C15.3639594,15.5828413 14.7313921,15.6103443 14.3242731,15.2371519 L9.03007346,10.3841355 L3.7071045,15.7071045 Z"
                fill="#000000"
                fillRule="nonzero"
                transform="translate(9.000001, 11.999997) scale(-1, -1) rotate(90.000000) translate(-9.000001, -11.999997) "
              />
            </g>
          </svg>
        </Link>
        <div>
          <h6 className="mb-1">Chat with {chatUserData.Name}</h6>
          <p className="mb-0 text-success">Online</p>
        </div>
        <div className="dropdown">
          <Link
            to={"#"}
            data-toggle="dropdown"
            aria-expanded="false"
            onClick={() => setToggle(!toggle)}
          >
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
          <ul
            className={`dropdown-menu dropdown-menu-right ${
              toggle ? "show" : ""
            }`}
          >
            <li className="dropdown-item" onClick={() => setToggle(false)}>
              <i className="fa fa-user-circle text-primary me-2"></i> View
              profile
            </li>
            <li className="dropdown-item" onClick={() => setToggle(false)}>
              <i className="fa fa-users text-primary me-2"></i> Add to close
              friends
            </li>
            <li className="dropdown-item" onClick={() => setToggle(false)}>
              <i className="fa fa-plus text-primary me-2"></i> Add to group
            </li>
            <li className="dropdown-item" onClick={() => setToggle(false)}>
              <i className="fa fa-ban text-primary me-2"></i> Block
            </li>
          </ul>
        </div>
      </div>
      <PerfectScrollbar
        className={`pt-2 card-body msg_card_body dlab-scroll ${
          openMsg ? "ps ps--active-y" : ""
        } `}
        id="DZ_W_Contacts_Body3"
      >
        {messages.map((msg, index) => (
          <div key={msg.id || index}>
            {/* Your message bubble based on sender_id */}
            <div
              className={`d-flex ${
                msg.sender_id === sender_id
                  ? "justify-content-end"
                  : "justify-content-start"
              } mb-4`}
            >
              {msg.sender_id !== sender_id && (
                <div className="img_cont_msg">
                  {chatUserData.ProfileLogoImageData == null ? (
                    chatUserData.Name?.substring(0, 2).toUpperCase()
                  ) : (
                    <img
                      src={chatUserData.ProfileLogoImageData}
                      className="rounded-circle user_img_msg"
                      alt=""
                    />
                  )}
                </div>
              )}
              <div
                className={
                  msg.sender_id === sender_id
                    ? "msg_cotainer_send"
                    : "msg_cotainer"
                }
              >
                {msg.message}
                <span
                  className={
                    msg.sender_id === sender_id ? "msg_time_send" : "msg_time"
                  }
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {msg.sender_id === sender_id && (
                <div className="img_cont_msg">
                  {/* <img src={avatar2} className="rounded-circle user_img_msg" alt="" /> */}
                  SA
                </div>
              )}
            </div>
          </div>
        ))}
      </PerfectScrollbar>
      <div className="card-footer type_msg">
        <div className="input-group d-flex align-items-center gap-2">
          {/* <textarea
                  className="form-control customHeight"
                  placeholder="Type your message..."
               ></textarea> */}
          <input
            type="text"
            className="form-control"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="input-group-append">
            <button
              type="button"
              className="btn btn-primary"
              onClick={sendMessage}
            >
              <i className="fa fa-location-arrow"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MsgBox;
