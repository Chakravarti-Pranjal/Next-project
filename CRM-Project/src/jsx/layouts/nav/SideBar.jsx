import React, { Fragment, useContext, useEffect, useReducer, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Collapse } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MenuList } from "./Menu";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
// import logo from "../../../images/logo/NEXGENO8 Logo-03.svg";
import deboxLogo from "../../../images/logo/deboxlogo.png";
// import NEXGENVO8White from "/assets/favicon-logo/logo-title.svg";
// import darkLogo from "../../../images/logo/logo-white.svg";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useDispatch, useSelector } from "react-redux";
import { SET_FALSE, SET_TRUE } from "../../../store/actions/queryAction";
import { MyContext } from '../../components/Dashboard/ReportDashboard/ReportDashboardContext';
import { useSubdomain } from "../../../context/SubdomainContext";

const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active: "",
  activeSubmenu: "",
};

const SideBar = () => {

  // checking for subdomain
  const { hideMenus, theme, logo, darkLogo } = useSubdomain();

  var d = new Date();
  const {
    navigationHader,
    iconHover,
    sidebarposition,
    headerposition,
    sidebarLayout,
    ChangeIconSidebar,
    background,
    menuToggle,
  } = useContext(ThemeContext);

  const [state, setState] = useReducer(reducer, initialState);
  //For scroll
  let handleheartBlast = document.querySelector(".heart");
  function heartBlast() {
    return handleheartBlast.classList.toggle("heart-blast");
  }

  const [hideOnScroll, setHideOnScroll] = useState(true);

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll]
  );

  const handleMenuActive = (status) => {
    setState({ active: status });
    if (state.active === status) {
      setState({ active: "" });
    }
  };

  const handleSubmenuActive = (status) => {
    setState({ activeSubmenu: status });
    if (state.activeSubmenu === status) {
      setState({ activeSubmenu: "" });
    }
  };
  let path = window.location.pathname;

  const showTooltip = useSelector((data) => data?.queryReducer?.ToolTipShow);

  // console.log(showTooltip, "toltip");

  // Report-DashBoard
  const { reportShow, setReportShow } = useContext(MyContext);

  function handleReportShow() {
    setReportShow(!reportShow)
  }


  return (
    <div
      onMouseEnter={() => ChangeIconSidebar(true)}
      onMouseLeave={() => ChangeIconSidebar(false)}
      className={`dlabnav ${iconHover} ${sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
        ? hideOnScroll > 120
          ? "fixed"
          : ""
        : ""
        }`}
    >

      <PerfectScrollbar className="dlabnav-scroll d-flex flex-column justify-content-between">
        <ul className="metismenu" id="menu">
          {MenuList.map((data, index) => {

            let menuClass = data.classsChange;

            // Titles to hide when subdomain is abc
            if (hideMenus.includes(data.title)) {
              return null; // Skip this menu item
            }

            if (menuClass === "menu-title") {
              return (
                <li
                  className={menuClass}
                  key={index}
                  data-tip="Hello, I am a tooltip!"
                >
                  {data.title}
                </li>
              );
            } else {
              return (
                <li
                  className={` ${state.active === data.title ? "mm-active" : ""
                    }`}
                  key={index}
                >
                  {data.content && data.content.length > 0 ? (
                    <>
                      <Link
                        to={"#"}
                        className="has-arrow"
                        data-tooltip-content={data.title}
                        data-tooltip-id="my-tooltip"
                        onClick={() => {
                          handleMenuActive(data.title);
                        }}
                        data-tip="Hello, I am a tooltip!"
                      >
                        {data.iconStyle}
                        <Tooltip
                          id="my-tooltip"
                          place="bottom"
                          effect="solid"
                          isOpen={showTooltip}
                        />
                        <span className="nav-text">{data.title}</span>
                      </Link>
                      <Collapse in={state.active === data.title ? true : false}>
                        <ul
                          className={`${menuClass === "mm-collapse" ? "mm-show" : ""
                            }`}
                        >
                          {data.content &&
                            data.content.map((data, index) => {

                              return (
                                <li
                                  key={index}
                                  className={`${state.activeSubmenu === data.title
                                    ? "mm-active"
                                    : ""
                                    }`}
                                >
                                  {data.content && data.content.length > 0 ? (
                                    <>
                                      <Link
                                        to={data.to}
                                        className={
                                          data.hasMenu ? "has-arrow" : ""
                                        }
                                        onClick={() => {
                                          handleSubmenuActive(data.title);
                                        }}
                                      >
                                        {data.title}
                                      </Link>
                                      <Collapse
                                        in={
                                          state.activeSubmenu === data.title
                                            ? true
                                            : false
                                        }
                                      >
                                        <ul
                                          className={`${menuClass === "mm-collapse"
                                            ? "mm-show"
                                            : ""
                                            }`}
                                        >
                                          {data.content &&
                                            data.content.map((data, index) => {
                                              console.log(data, "data1")
                                              return (
                                                <>
                                                  <li key={index}>
                                                    <Link
                                                      className={`${path === data.to
                                                        ? "mm-active"
                                                        : ""
                                                        }`}
                                                      to={data.to}
                                                      style={{ fontSize: '0.8rem' }}
                                                    >
                                                      {data.title}
                                                    </Link>
                                                  </li>
                                                </>
                                              );
                                            })}
                                        </ul>
                                      </Collapse>
                                    </>
                                  ) : (
                                    <Link to={data.to} style={{ fontSize: '0.8rem' }}>{data.title}</Link>
                                  )}
                                </li>
                              );
                            })}
                        </ul>
                      </Collapse>
                    </>
                  ) : (
                    <Link
                      to={data.to}
                      data-tooltip-content={data.title}
                      data-tooltip-id="my-tooltip" onClick={() => (handleReportShow(), handleMenuActive(data.title))}
                    >
                      {data.iconStyle}

                      <Tooltip
                        id="my-tooltip"
                        place="bottom"
                        effect="solid"
                        isOpen={showTooltip}
                      />

                      <span className="nav-text">{data.title} </span>
                    </Link>
                  )}
                </li>
              );
            }
          })}
        </ul>
        <div className="copyright">
          <div className="d-flex justify-content-center mb-1">
            {/* <img
              src={logo}
              alt=""
              style={{
                height: "30px",
                width: "auto",
                backgroundSize: "contain",
              }}
            /> */}
            {background.value === "dark" || navigationHader !== "color_1" ? (
              <img
                src={logo}
                alt="logo"
                style={{
                  height: "30px",
                  width: "auto",
                  backgroundSize: "contain",
                }}
              />
            ) : (
              <img
                src={darkLogo}
                alt="logo"
                style={{
                  height: "30px",
                  width: "auto",
                  backgroundSize: "contain",
                }}
              />
            )}
          </div>
          <p className="text-center m-0 mb-1">
            © {d.getFullYear()} All Rights Reserved
          </p>
          <p className="fs-12 text-center m-0">
            Powered by{" "}
            <a href="https://www.deboxglobal.com" target="_blank">
              <img
                src={deboxLogo}
                alt=""
                style={{
                  height: "25px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </a>
          </p>
        </div>
      </PerfectScrollbar>
    </div>
  );
};

export default SideBar;
