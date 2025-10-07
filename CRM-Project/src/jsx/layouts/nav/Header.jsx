import React, { useEffect, useRef, useState } from "react";

import { Link, NavLink, useLocation, useParams } from "react-router-dom";
/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";

/// Image
import profile from "../../../images/user.jpg";
import avatar from "../../../images/avatar/1.jpg";
import { Dropdown } from "react-bootstrap";
import LogoutPage from "./Logout";
import { useNavigate } from "react-router-dom";
import { setHeadingShowFalse } from "../../../store/actions/queryAction";
import { useDispatch, useSelector } from "react-redux";
import { useSubdomain } from "../../../context/SubdomainContext";
import ChatTimeline from "./ChatTimeline";
import NotificationTimeline from "./NotificationTimeline";

import { axiosOther } from "../../../http/axios_base_url";
import { setHideSendBtn } from "../../../store/actions/createExcortLocalForeignerAction";
import GoogleTranslate from "../../components/googleTranslate/GoogleTranslate";

const Header = ({ onNote, onNote2 }) => {
  const locationG = useLocation();
  const pathG = locationG.pathname;
  const allowedRoutes = ["/", "/queries", "/admin-dashboard"];
  const dispatch = useDispatch();

  // To open
  const handleOpen = () => dispatch({ type: "OPEN_MSG" });

  // To close
  const handleClose = () => dispatch({ type: "CLOSE_MSG" });

  const handleChatClick = () => {
    dispatch({ type: "ADD_CHAT" });
  };

  const handleNotificationClick = () => {
    dispatch({ type: "ADD_NOTIFICATION" });
  };

  const [data, setdata] = useState([]);
  const [userId, setUserId] = useState(null);

  // for notification popup
  const [show, setShow] = useState(false);

  const handleToggle = (isOpen) => {
    setShow(isOpen);
  };

  const handleLinkClick = () => {
    setShow(false); // Close the dropdown
  };
  const [showChat, setShowChat] = useState(false);

  const handleToggleChat = (isOpen) => {
    setShowChat(isOpen);
  };

  const handleLinkClickChat = () => {
    setShowChat(false); // Close the dropdown
  };

  // for profile popup
  const [showProfile, setShowProfile] = useState(false);

  const handleToggleProfile = (isOpen) => {
    setShowProfile(isOpen);
  };

  const handleLinkClickProfile = () => {
    setShowProfile(false); // Close the dropdown
  };

  const [pageTitle, setPageTitle] = useState("");
  const { pathname } = useLocation();
  const location = pathname?.split("/");
  const pageName = location[location.length - 1];
  const finalPageName = pageName.split("-").join(" ");
  const navigate = useNavigate();
  const locations = useLocation();
  // const dispatch = useDispatch();
  const { theme, logo, darkLogo } = useSubdomain();

  const handleDropdownChange = (e) => {
    const value = e.target.value;
    // Map dropdown value to route paths
    const routes = {
      0: "/admin-dashboard",
      1: "/sales-dashboard",
      2: "/operations-dashboard",
      3: "/finance-dashboard",
    };
    // Navigate to the selected route
    if (routes[value]) {
      navigate(routes[value]);
    }
  };
  const showDropdown = [
    "/admin-dashboard",
    "/sales-dashboard",
    "/operations-dashboard",
  ].includes(locations.pathname);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const inlineStyle = {
    width: "4.5rem",
    height: "1.5rem",
    right: "-3.3rem",
    top: "-0.3rem",
    display: isMobile ? "none" : "flex",
  };

  useEffect(() => {
    if (isNaN(parseInt(pageName))) {
      setPageTitle(finalPageName);
      // console.log("finalPageName", finalPageName);
    }

    if (!isNaN(parseInt(pageName))) {
      const secondPageName = location[location.length - 2];
      const secondFinalPageName = secondPageName.split("-").join(" ");
      setPageTitle(secondFinalPageName);
      // console.log("secondFinalPageName", secondFinalPageName);
    }
  }, [pathname]);

  const [searchBut, setSearchBut] = useState(false);

  const notificationCount = useSelector(
    (state) => state.count.notificationCount
  );
  const chatCount = useSelector((state) => state.count.chatCount);

  var path = window.location.pathname.split("/");
  var name = path[path.length - 1].split("-");
  var filterName = name.length >= 3 ? name.filter((n, i) => i > 0) : name;
  var finalName = filterName.includes("app")
    ? filterName.filter((f) => f !== "app")
    : filterName.includes("ui")
    ? filterName.filter((f) => f !== "ui")
    : filterName.includes("uc")
    ? filterName.filter((f) => f !== "uc")
    : filterName.includes("basic")
    ? filterName.filter((f) => f !== "basic")
    : filterName.includes("jquery")
    ? filterName.filter((f) => f !== "jquery")
    : filterName.includes("table")
    ? filterName.filter((f) => f !== "table")
    : filterName.includes("page")
    ? filterName.filter((f) => f !== "page")
    : filterName.includes("email")
    ? filterName.filter((f) => f !== "email")
    : filterName.includes("ecom")
    ? filterName.filter((f) => f !== "ecom")
    : filterName.includes("chart")
    ? filterName.filter((f) => f !== "chart")
    : filterName.includes("editor")
    ? filterName.filter((f) => f !== "editor")
    : filterName;

  const getprofilelist = async () => {
    let Id = null;

    try {
      const token = localStorage.getItem("token");
      const persed = JSON.parse(token);
      // console.log(persed, "persed");
      Id = persed?.UserID;

      setUserId(Id);

      // console.log(Id, "id1");
    } catch (error) {
      console.log(error, "error");
    }

    try {
      // console.log(Id, "Id11");
      const data = await axiosOther.post("listusers", { id: Id });
      setdata(data?.data?.Datalist);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getprofilelist();
  }, []);

  return (
    <div className="header border-bottom">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between ">
            <div className="header-left d-flex justify-content-between align-items-center gap-4">
              <div
                className="dashboard_bar"
                style={{ textTransform: "capitalize" }}
              >
                {pageTitle}
              </div>
              <div className="select_dashboard  ">
                {showDropdown && (
                  <div className="DropDown text-center mt-auto mb-auto">
                    <select
                      name="dropdown"
                      className="form-control form-control-sm"
                      onChange={handleDropdownChange}
                    >
                      <option value="0">Admin Dashboard</option>
                      <option value="1">Sales Dashboard</option>
                      <option value="2">Operations Dashboard</option>
                      <option value="3">Finance Dashboard</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            <ul className="navbar-nav header-right ">
              {/* <div className="newquery d-flex justify-content-between align-items-center gap-1">
                <div className="icon">
                  <i className="fa-solid fa-plus fs-1 fw-bold"></i>
                </div>
                <div className="fs-3 fw-bold">
                  New query
                </div>
              </div> */}
              {allowedRoutes.includes(pathG) ? (
                <Dropdown
                  as="li"
                  className="nav-item dropdown notification_dropdown d-none d-md-flex ms-2"
                >
                  <GoogleTranslate />
                </Dropdown>
              ) : (
                ""
              )}

              <Dropdown
                as="li"
                className="nav-item dropdown notification_dropdown"
              >
                <Dropdown.Toggle
                  variant=""
                  as="a"
                  className="nav-link bell bell-link i-false c-pointer me-md-4 me-xs-0"
                  // onClick={() => onNote()}
                >
                  <NavLink
                    onClick={() => dispatch(setHideSendBtn(true))}
                    to="/query"
                  >
                    <i
                      className={`fa-solid fa-plus fs-3 fs-md-3 fs-lg-2 me-xs-0 me-md-auto navLink_icon `}
                    ></i>
                    <span
                      className="d-xs-none newQuery badge light text-white bg-primary rounded-circle fontSize7rem d-md-flex justify-content-center align-items-center "
                      style={inlineStyle}
                    >
                      New Query
                    </span>
                  </NavLink>
                </Dropdown.Toggle>
              </Dropdown>
              {theme == "dark" ? (
                <Dropdown
                  as="li"
                  className="nav-item dropdown notification_dropdown "
                >
                  <Dropdown.Toggle
                    variant=""
                    as="a"
                    className="nav-link bell bell-link i-false c-pointer"
                    // onClick={() => onNote()}
                    onClick={() => navigate("/mails")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26.667"
                      height="24"
                      viewBox="0 0 26.667 24"
                    >
                      <g
                        id="_014-mail"
                        data-name="014-mail"
                        transform="translate(0 -21.833)"
                      >
                        <path
                          id="Path_1962"
                          data-name="Path 1962"
                          d="M26.373,26.526A6.667,6.667,0,0,0,20,21.833H6.667A6.667,6.667,0,0,0,.293,26.526,6.931,6.931,0,0,0,0,28.5V39.166a6.669,6.669,0,0,0,6.667,6.667H20a6.669,6.669,0,0,0,6.667-6.667V28.5A6.928,6.928,0,0,0,26.373,26.526ZM6.667,24.5H20a4.011,4.011,0,0,1,3.947,3.36L13.333,33.646,2.72,27.86A4.011,4.011,0,0,1,6.667,24.5ZM24,39.166a4.012,4.012,0,0,1-4,4H6.667a4.012,4.012,0,0,1-4-4V30.873L12.693,36.34a1.357,1.357,0,0,0,1.28,0L24,30.873Z"
                          transform="translate(0 0)"
                          fill="#135846"
                        />
                      </g>
                    </svg>
                    <span
                      className="badge light text-white bg-primary rounded-circle d-flex justify-content-center align-items-center fontSize7rem"
                      style={{ height: "1.5rem", width: "1.5rem" }}
                    >
                      76
                    </span>
                  </Dropdown.Toggle>
                </Dropdown>
              ) : (
                ""
              )}
              <Dropdown
                as="li"
                className="nav-item dropdown notification_dropdown"
                // ref={liParentRef}
                show={show}
                onToggle={handleToggle}
              >
                <Dropdown.Toggle
                  className="nav-link i-false c-pointer"
                  variant=""
                  as="a"
                  // ref={aParentRef}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19.375"
                    height="24"
                    viewBox="0 0 19.375 24"
                  >
                    <g
                      id="_006-notification"
                      data-name="006-notification"
                      transform="translate(-341.252 -61.547)"
                    >
                      <path
                        id="Path_1954"
                        data-name="Path 1954"
                        d="M349.741,65.233V62.747a1.2,1.2,0,1,1,2.4,0v2.486a8.4,8.4,0,0,1,7.2,8.314v4.517l.971,1.942a3,3,0,0,1-2.683,4.342h-5.488a1.2,1.2,0,1,1-2.4,0h-5.488a3,3,0,0,1-2.683-4.342l.971-1.942V73.547a8.4,8.4,0,0,1,7.2-8.314Zm1.2,2.314a6,6,0,0,0-6,6v4.8a1.208,1.208,0,0,1-.127.536l-1.1,2.195a.6.6,0,0,0,.538.869h13.375a.6.6,0,0,0,.536-.869l-1.1-2.195a1.206,1.206,0,0,1-.126-.536v-4.8a6,6,0,0,0-6-6Z"
                        transform="translate(0 0)"
                        fill="#135846"
                        fillRule="evenodd"
                      />
                    </g>
                  </svg>

                  <span
                    className="badge light text-white bg-primary rounded-circle d-flex justify-content-center align-items-center fontSize7rem"
                    style={{ height: "1.5rem", width: "1.5rem" }}
                  >
                    {notificationCount}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  align="right"
                  className="mt-2 dropdown-menu dropdown-menu-end"
                  // ref={divParentRef}
                >
                  {" "}
                  <PerfectScrollbar
                    className="widget-timeline dlab-scroll style-1 ps p-3 height370"
                    style={{ height: "23.125rem" }}
                  >
                    <ul className="timeline">
                      <li>
                        <div className="timeline-badge primary" />
                        <Link
                          className="timeline-panel c-pointer text-muted"
                          to="#"
                        >
                          <span>10 minutes ago</span>
                          <h6 className="mb-0">
                            Youtube, a video-sharing website, goes live{" "}
                            <strong className="text-primary">$500</strong>.
                          </h6>
                        </Link>
                      </li>
                      <li>
                        <div className="timeline-badge info"></div>
                        <Link
                          className="timeline-panel c-pointer text-muted"
                          to="#"
                        >
                          <span>20 minutes ago</span>
                          <h6 className="mb-0">
                            New order placed{" "}
                            <strong className="text-info">#XF-2356.</strong>
                          </h6>
                          <p className="mb-0">
                            Quisque a consequat ante Sit amet magna at
                            volutapt...
                          </p>
                        </Link>
                      </li>
                      <li>
                        <div className="timeline-badge danger"></div>
                        <Link
                          className="timeline-panel c-pointer text-muted"
                          to="#"
                        >
                          <span>30 minutes ago</span>
                          <h6 className="mb-0">
                            john just buy your product{" "}
                            <strong className="text-warning">Sell $250</strong>
                          </h6>
                        </Link>
                      </li>
                      <li>
                        <div className="timeline-badge success"></div>
                        <Link
                          className="timeline-panel c-pointer text-muted"
                          to="#"
                        >
                          <span>15 minutes ago</span>
                          <h6 className="mb-0">
                            StumbleUpon is acquired by eBay.{" "}
                          </h6>
                        </Link>
                      </li>
                      <li>
                        <div className="timeline-badge warning"></div>
                        <Link
                          className="timeline-panel c-pointer text-muted"
                          to="#"
                        >
                          <span>20 minutes ago</span>
                          <h6 className="mb-0">
                            Mashable, a news website and blog, goes live.
                          </h6>
                        </Link>
                      </li>
                      <li>
                        <div className="timeline-badge dark"></div>
                        <Link
                          className="timeline-panel c-pointer text-muted"
                          to="#"
                        >
                          <span>20 minutes ago</span>
                          <h6 className="mb-0">
                            Mashable, a news website and blog, goes live.
                          </h6>
                        </Link>
                      </li>
                    </ul>
                    <div className="ps__rail-x" style={{ left: 0, bottom: 0 }}>
                      <div
                        className="ps__thumb-x"
                        tabIndex={0}
                        style={{ left: 0, width: 0 }}
                      />
                    </div>
                    <div className="ps__rail-y" style={{ top: 0, right: 0 }}>
                      <div
                        className="ps__thumb-y"
                        tabIndex={0}
                        style={{ top: 0, height: 0 }}
                      />
                    </div>
                  </PerfectScrollbar>
                  <Link
                    className="all-notification"
                    data-toggle="dropdown"
                    onClick={() => {
                      onNote2();
                      handleLinkClick();
                      handleNotificationClick();
                    }}
                  >
                    See all notifications <i className="ti-arrow-right" />
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown
                as="li"
                className="nav-item  notification_dropdown "
                show={showChat}
                onToggle={handleToggleChat}
              >
                <Dropdown.Toggle
                  variant=""
                  as="a"
                  className="nav-link  ai-icon i-false c-pointer"
                  role="button"
                  data-toggle="dropdown"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="21.6"
                    viewBox="0 0 24 21.6"
                  >
                    <g
                      id="_008-chat"
                      data-name="008-chat"
                      transform="translate(-250.397 -62.547)"
                    >
                      <path
                        id="Path_1956"
                        data-name="Path 1956"
                        d="M274.4,67.347a4.8,4.8,0,0,0-4.8-4.8H255.2a4.8,4.8,0,0,0-4.8,4.8v15.6a1.2,1.2,0,0,0,2.048.848l3.746-3.745a2.4,2.4,0,0,1,1.7-.7H269.6a4.8,4.8,0,0,0,4.8-4.8Zm-2.4,0a2.4,2.4,0,0,0-2.4-2.4H255.2a2.4,2.4,0,0,0-2.4,2.4v12.7l1.7-1.7a4.8,4.8,0,0,1,3.395-1.406H269.6a2.4,2.4,0,0,0,2.4-2.4Zm-15.6,7.2H266a1.2,1.2,0,1,0,0-2.4h-9.6a1.2,1.2,0,0,0,0,2.4Zm0-4.8h12a1.2,1.2,0,1,0,0-2.4h-12a1.2,1.2,0,0,0,0,2.4Z"
                        fill="#135846"
                        fillRule="evenodd"
                      />
                    </g>
                  </svg>
                  <span
                    className="badge light text-white bg-primary rounded-circle d-flex justify-content-center align-items-center fontSize7rem"
                    style={{ height: "1.5rem", width: "1.5rem" }}
                  >
                    {chatCount}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  align="right"
                  className="mt-4 dropdown-menu dropdown-menu-end"
                >
                  <PerfectScrollbar className="widget-media dlab-scroll p-3 height380">
                    <ChatTimeline onNote={onNote} />
                    <div className="ps__rail-x" style={{ left: 0, bottom: 0 }}>
                      <div
                        className="ps__thumb-x"
                        tabIndex={0}
                        style={{ left: 0, width: 0 }}
                      />
                    </div>
                    <div className="ps__rail-y" style={{ top: 0, right: 0 }}>
                      <div
                        className="ps__thumb-y"
                        tabIndex={0}
                        style={{ top: 0, height: 0 }}
                      />
                    </div>
                  </PerfectScrollbar>
                  <Link
                    className="all-notification"
                    data-toggle="dropdown"
                    onClick={() => {
                      onNote();
                      handleLinkClickChat();
                      handleChatClick();
                    }}
                  >
                    See all chats <i className="ti-arrow-right" />
                  </Link>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown
                as="li"
                className="nav-item dropdown header-profile"
                show={showProfile}
                onToggle={handleToggleProfile}
              >
                <Dropdown.Toggle
                  variant=""
                  as="a"
                  className="nav-link i-false c-pointer"
                >
                  {" "}
                  {data?.length > 0 ? (
                    data?.map((img, ind) => {
                      return (
                        <img
                          key={ind}
                          src={img?.ProfileLogoImageData}
                          width={20}
                          alt=""
                        />
                      );
                    })
                  ) : (
                    <img
                      // key={}
                      src={profile}
                      width={20}
                      alt=""
                    />
                  )}
                  {/* { data.length> 0 ?data?.map((img, ind) => {
                    return (
                      <img
                        key={ind}
                        src={img?.ProfileLogoImageData || profile}
                        width={20}
                        alt=""
                      />
                    );
                  }):  <img
                        key={ind}
                        src={img?.ProfileLogoImageData || profile}
                        width={20}
                        alt=""
                      />} */}
                  {/* <i className="fa-solid fa-circle-user fs-1 text-primary"></i> */}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  align="right"
                  className="mt-3 dropdown-menu dropdown-menu-end"
                >
                  <Link
                    to="/user-profile"
                    className="dropdown-item ai-icon"
                    onClick={handleLinkClickProfile}
                  >
                    <svg
                      id="icon-user1"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-primary me-1"
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx={12} cy={7} r={4} />
                    </svg>
                    <span className="ms-2">Profile </span>
                  </Link>
                  {/* <Link to="/user-profile" className="dropdown-item ai-icon">
                    <svg
                      id="icon-inbox"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-success me-1"
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span className="ms-2">Inbox </span>
                  </Link> */}
                  <LogoutPage />
                </Dropdown.Menu>
              </Dropdown>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
