import React from "react";
import styles from "./chatNotification.module.css";
import './custom.css'
import { Link } from "react-router-dom";

const notificationsData = [
  {
    section: "SEVER STATUS",
    items: [
      {
        initials: "KK",
        name: "David Nester Birthday",
        message: "Today",
        color: "red",
      },
      {
        initials: "RU",
        name: "Perfection Simplified",
        message: "Jame Smith commented...",
        color: "green",
      },
      {
        initials: "KK",
        name: "David Nester Birthday",
        message: "Today",
        color: "red",
      },
    ],
  },
  {
    section: "SOCIAL",
    items: [
      {
        initials: "RU",
        name: "Perfection Simplified",
        message: "Jame Smith commented...",
        color: "green",
      },
      {
        initials: "KK",
        name: "David Nester Birthday",
        message: "Today",
        color: "red",
      },
      {
        initials: "RU",
        name: "Perfection Simplified",
        message: "Jame Smith commented...",
        color: "green",
      },
      {
        initials: "KK",
        name: "David Nester Birthday",
        message: "Today",
        color: "red",
      },
    ],
  },
  {
    section: "SEVER STATUS",
    items: [
      {
        initials: "AU",
        name: "AharliKane",
        message: "Sami is online",
        color: "red",
      },
      {
        initials: "MO",
        name: "Athan Jacoby",
        message: "Narqis left 30 mins ago",
        color: "pink",
      },
    ],
  },
];

const Notifications = () => {
  return (
    <div>
      <div className="chatbox chatboxNotification">
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
                     <g
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                     >
                        <rect x="0" y="0" width="24" height="24" />
                        <circle fill="#000000" cx="5" cy="12" r="2" />
                        <circle fill="#000000" cx="12" cy="12" r="2" />
                        <circle fill="#000000" cx="19" cy="12" r="2" />
                     </g>
                  </svg>
               </Link>
               <div>
                  <h6 className="mb-1">Notications</h6>
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
                     <g
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                     >
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
            <div
               className={`card-body contacts_body p-0 dlab-scroll`}
            >
               <ul className="contacts">
                  <li className="name-first-letter">SEVER STATUS</li>
                  <li>
                     <div className="d-flex bd-highlight">
                        <div className="img_cont primary">
                           AU<i className="icon fa fa-user-plus"></i>
                        </div>
                        <div className="user_info">
                           <span>AharlieKane</span>
                           <p>Sami is online</p>
                        </div>
                     </div>
                  </li>
                  <li>
                     <div className="d-flex bd-highlight">
                        <div className="img_cont info">
                           MO<i className="icon fa fa-user-plus"></i>
                        </div>
                        <div className="user_info">
                           <span>Athan Jacoby</span>
                           <p>Nargis left 30 mins ago</p>
                        </div>
                     </div>
                  </li>
                  <li>
                     <div className="d-flex bd-highlight">
                        <div className="img_cont primary">
                           AU<i className="icon fa fa-user-plus"></i>
                        </div>
                        <div className="user_info">
                           <span>AharlieKane</span>
                           <p>Sami is online</p>
                        </div>
                     </div>
                  </li>
                  <li>
                     <div className="d-flex bd-highlight">
                        <div className="img_cont info">
                           MO<i className="icon fa fa-user-plus"></i>
                        </div>
                        <div className="user_info">
                           <span>Athan Jacoby</span>
                           <p>Nargis left 30 mins ago</p>
                        </div>
                     </div>
                  </li>
                  <li className="active">
                     <div className="d-flex bd-highlight">
                        <div className="img_cont primary">KK</div>
                        <div className="user_info">
                           <span>David Nester Birthday</span>
                           <p className="text-primary">Today</p>
                        </div>
                     </div>
                  </li>
                  <li className="name-first-letter">SOCIAL</li>
                  <li>
                     <div className="d-flex bd-highlight">
                        <div className="img_cont primary">
                           AU<i className="icon fa fa-user-plus"></i>
                        </div>
                        <div className="user_info">
                           <span>AharlieKane</span>
                           <p>Sami is online</p>
                        </div>
                     </div>
                  </li>
                  <li>
                     <div className="d-flex bd-highlight">
                        <div className="img_cont info">
                           MO<i className="icon fa fa-user-plus"></i>
                        </div>
                        <div className="user_info">
                           <span>Athan Jacoby</span>
                           <p>Nargis left 30 mins ago</p>
                        </div>
                     </div>
                  </li>
                  <li>
                     <div className="d-flex bd-highlight">
                        <div className="img_cont success">
                           RU<i className="icon fa-birthday-cake"></i>
                        </div>
                        <div className="user_info">
                           <span>Perfection Simplified</span>
                           <p>Jame Smith commented on your status</p>
                        </div>
                     </div>
                  </li>
                  <li className="name-first-letter">SEVER STATUS</li>
                  <li>
                     <div className="d-flex bd-highlight">
                        <div className="img_cont primary">
                           AU<i className="icon fa fa-user-plus"></i>
                        </div>
                        <div className="user_info">
                           <span>AharlieKane</span>
                           <p>Sami is online</p>
                        </div>
                     </div>
                  </li>
                  <li>
                     <div className="d-flex bd-highlight">
                        <div className="img_cont info">
                           MO<i className="icon fa fa-user-plus"></i>
                        </div>
                        <div className="user_info">
                           <span>Athan Jacoby</span>
                           <p>Nargis left 30 mins ago</p>
                        </div>
                     </div>
                  </li>
               </ul>
            </div>
            {/* <div className="card-footer"></div> */}
         </div>
      </div>
      {/* <div className={styles.notificationContainer}>
        <div className={styles.notificationHeaderWrap}>
          <span className={styles.notificationIcons}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="18px"
              height="18px"
              viewBox="0 0 24 24"
              version="1.1"
              color="#fff"
            >
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <rect x="0" y="0" width="24" height="24"></rect>
                <circle fill="#ffffff" cx="5" cy="12" r="2"></circle>
                <circle fill="#ffffff" cx="12" cy="12" r="2"></circle>
                <circle fill="#ffffff" cx="19" cy="12" r="2"></circle>
              </g>
            </svg>
          </span>
          <div className={styles.notificationHeader}>
            <h2>Notifications</h2>
            <button className={styles.notificationShowAll}>Show All</button>
          </div>
          <span className={styles.notificationIcons}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="18px"
              height="18px"
              viewBox="0 0 24 24"
              version="1.1"
            >
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <rect x="0" y="0" width="24" height="24"></rect>
                <path
                  d="M14.2928932,16.7071068 C13.9023689,16.3165825 13.9023689,15.6834175 14.2928932,15.2928932 C14.6834175,14.9023689 15.3165825,14.9023689 15.7071068,15.2928932 L19.7071068,19.2928932 C20.0976311,19.6834175 20.0976311,20.3165825 19.7071068,20.7071068 C19.3165825,21.0976311 18.6834175,21.0976311 18.2928932,20.7071068 L14.2928932,16.7071068 Z"
                  fill="#ffffff"
                  fill-rule="nonzero"
                  opacity="0.3"
                ></path>
                <path
                  d="M11,16 C13.7614237,16 16,13.7614237 16,11 C16,8.23857625 13.7614237,6 11,6 C8.23857625,6 6,8.23857625 6,11 C6,13.7614237 8.23857625,16 11,16 Z M11,18 C7.13400675,18 4,14.8659932 4,11 C4,7.13400675 7.13400675,4 11,4 C14.8659932,4 18,7.13400675 18,11 C18,14.8659932 14.8659932,18 11,18 Z"
                  fill="#ffffff"
                  fill-rule="nonzero"
                ></path>
              </g>
            </svg>
          </span>
        </div>
        {notificationsData.map((section, index) => (
          <div key={index} className={styles.notificationSection}>
            <h4 className={styles.notificationSectionTitle}>
              {section.section}
            </h4>
            {section.items.map((item, idx) => (
              <div key={idx} className={styles.notification}>
                <div
                  className={styles.notificationAvatar}
                  style={{ backgroundColor: item.color }}
                >
                  {item.initials}
                </div>
                <div className={styles.notificationContent}>
                  <div className={styles.notificationName}>{item.name}</div>
                  <div className={styles.notificationMessage}>
                    {item.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Notifications;
