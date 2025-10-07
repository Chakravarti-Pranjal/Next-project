import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
const Alerts = () => {
  const baseUrl = import.meta.env.VITE_CHATNOTIFICATION_URI;
  
  const [notififcationList, setNotififcationList] = useState([]);
  const tokenString = localStorage.getItem("token");
  let tokenData = null;
  let token = null;
  let UserID = null;

  if (tokenString) {
    try {
      tokenData = JSON.parse(tokenString);
      token = tokenData?.token;
      UserID = tokenData?.UserID;
    } catch (err) {
      console.error("Invalid token JSON", err);
    }
  }

  if (!token || !UserID) {
    console.warn("User not logged in or token invalid");
    // Optionally redirect or stop here
    // return; or navigate('/login');
  }

  const colorClasses = [
    "primary",
    "info",
    "success",
    "danger",
    "warning",
    "dark",
  ]; // your predefined classes
  // Function to shuffle the array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  const getRandomClass = (index) => {
    // Shuffle colorClasses every time the data is loaded
    const shuffledClasses = shuffleArray([...colorClasses]);
    return shuffledClasses[index % shuffledClasses.length];
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${baseUrl}notifications-list`,
          {
            method: "POST", // important
            headers: {
              "Content-Type": "application/json",
              // Add token if required:
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: UserID,
              companyId: tokenData.companyKey,
              per_page: 50,
            }),
          }
        );
        const result = await response.json();
        console.log("Notification data is: ", result);
        if (result.status) {
          setNotififcationList(result.Data);
        }
      } catch (error) {
        console.error("Failed to fetch chat users", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className={`tab-pane fade active show`}>
      <div className="card mb-sm-3 mb-md-0 contacts_card">
        <div className="card-header chat-list-header text-center">
          <Link to={"#"}>
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
          <div>
            <h6 className="mb-1">Notifications</h6>
            <p className="mb-0">Show All</p>
          </div>
          <Link to={"#"}>
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
                <path
                  d="M14.2928932,16.7071068 C13.9023689,16.3165825 13.9023689,15.6834175 14.2928932,15.2928932 C14.6834175,14.9023689 15.3165825,14.9023689 15.7071068,15.2928932 L19.7071068,19.2928932 C20.0976311,19.6834175 20.0976311,20.3165825 19.7071068,20.7071068 C19.3165825,21.0976311 18.6834175,21.0976311 18.2928932,20.7071068 L14.2928932,16.7071068 Z"
                  fill="#000000"
                  fillRule="nonzero"
                  opacity="0.3"
                />
                <path
                  d="M11,16 C13.7614237,16 16,13.7614237 16,11 C16,8.23857625 13.7614237,6 11,6 C8.23857625,6 6,8.23857625 6,11 C6,13.7614237 8.23857625,16 11,16 Z M11,18 C7.13400675,18 4,14.8659932 4,11 C4,7.13400675 7.13400675,4 11,4 C14.8659932,4 18,7.13400675 18,11 C18,14.8659932 14.8659932,18 11,18 Z"
                  fill="#000000"
                  fillRule="nonzero"
                />
              </g>
            </svg>
          </Link>
        </div>
        <PerfectScrollbar
          className={`card-body contacts_body p-0 dlab-scroll ps ps--active-y`}
          id="DZ_W_Contacts_Body1"
        >
          <ul className="contacts">
            <li className="name-first-letter">Notifications</li>
            {notififcationList.map((notification, index) => (
              <li className="active" key={index}>
                <div className="d-flex justify-content-between bd-highlight">
                  <div className="d-flex">
                    <div className={`img_cont  ${getRandomClass(index)}`}>
                      KK
                    </div>
                    <div className="user_info">
                      <span>{notification.title}</span>
                      <p className="text-primary">{notification.time_ago}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <i className="far fa-check-circle text-success fs-4"></i>
                    <i className="far fa-times-circle text-danger fs-4"></i>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </PerfectScrollbar>
        <div className="card-footer"></div>
      </div>
    </div>
  );
};

export default Alerts;
