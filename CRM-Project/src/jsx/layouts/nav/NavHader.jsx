import React, { Fragment, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
// import NEXGENVO8LOGO from "/assets/favicon-logo/logo-icon.svg";
// import NEXGENVOLOGOWHITE from "../../../images/logo/logo-white.svg";
// import NEXGENVO8TITLE from "/assets/favicon-logo/logo-title.svg";
import { useDispatch, useSelector } from "react-redux";
import { SET_FALSE, SET_TRUE } from "../../../store/actions/queryAction";
import { useSubdomain } from "../../../context/SubdomainContext";

export function NavMenuToggle() {




  setTimeout(() => {
    let mainwrapper = document.querySelector("#main-wrapper");
    if (mainwrapper.classList.contains("menu-toggle")) {
      mainwrapper.classList.remove("menu-toggle");


    }
    else {
      mainwrapper.classList.add("menu-toggle");

    }
  }, 200);

}

const NavHader = () => {

  const dispatch =useDispatch();
  const handleTooltip=()=>{
    dispatch(SET_TRUE(toggle));

  }
    // handleTooltip(() => {

    // });
    // useEffect(() => {
    //   let mainwrapper = document.querySelector("#main-wrapper");
    //   if (mainwrapper?.classList.contains("menu-toggle")) {
    //     dispatch(SET_TRUE());

    //   } else {
    //     dispatch(SET_FALSE());
    //   }
    // },[]);


  const [toggle, setToggle] = useState(false);


  const { navigationHader, openMenuToggle, background,menuToggle } =
    useContext(ThemeContext);
    // console.log( openMenuToggle ,menuToggle,"openMenuToggle")

  // checking for subdomain
  const {theme, faviconIcon, logo, darkLogo } = useSubdomain();

  return (
    <div className="nav-header">
      <Link to="/admin-dashboard" className="brand-logo">
        {background.value === "dark" || navigationHader !== "color_1" ? (
          <Fragment>
            <img
              src={faviconIcon}
              alt={"NEXGENO8LOGO"}
              className="logo-abbr"
            />
            <img
              src={logo}
              alt={"NEXGENO8LOGO"}
              className="brand-title"
            />
          </Fragment>
        ) : (
          <Fragment>
            <img
              src={faviconIcon}
              alt={"NEXGENO8LOGO"}
              className="logo-abbr"
            />
            <img
              src={darkLogo}
              alt={"NEXGENO8LOGO"}
              className="brand-title"
            />
          </Fragment>
        )}
      </Link>

      <div
        className="nav-control"
        onClick={() => {
          setToggle(!toggle);
          handleTooltip()
          NavMenuToggle();
        }}
      >
        <div className={`hamburger ${toggle ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
