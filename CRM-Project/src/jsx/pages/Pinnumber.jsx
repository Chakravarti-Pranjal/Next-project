import React, { useState, useEffect, useContext } from "react";
import { connect, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { axiosLogin } from "../../http/axios_base_url";
import {
  loadingToggleAction,
  loginAction,
} from "../../store/actions/AuthActions";
import DashboardImage from "../../images/dashboard-img.svg";

import DashboardImage1 from "../../images/loging/login-image1.jpg";
import logo from "../../images/logo/NEXGENO8 Logo-03.svg";
import { notifyError } from "../../helper/notify";
import { ToastContainer } from "react-toastify";
import deboxLogo from "../../images/logo/deboxlogo.png";
import darkLogo from "../../images/logo/logo-white.svg";
import { ThemeContext } from "../../context/ThemeContext";

function Pinnumber() {
      const { background } = useContext(ThemeContext);


  return (
    <div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
      <div className="login-aside text-center d-flex flex-column flex-row-auto">
        <ToastContainer />
        {/* <div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
          <div className="text-center mb-4 pt-5">
            <img src={logo} alt="" />
          </div>
          <h3 className="mb-2">Welcome back!</h3>
          <p>
            User Experience & Interface Design <br />
            Strategy SaaS Solutions
          </p>
        </div> */}
        <div
          className="aside-image"
          style={{ backgroundImage: "url(" + DashboardImage1 + ")" }}
        ></div>
      </div>
      <div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
        <div className="d-flex justify-content-center h-100 align-items-center">
          <div className="authincation-content style-2">
            <div className="row no-gutters">
              <div className="col-xl-12 tab-content">
                <div className="logo-img mx-auto">
                  <img
                    src={background?.value == "dark" ? darkLogo : logo}
                    alt="logo"
                    className="h-100 w-100"
                  />
                </div>
                <div id="sign-in" className="auth-form   form-validation">
                  <form  className="form-validate">
                    <h3 className="text-center mb-2 text-black">
                    PIN NUMBER
                    </h3>
                    <div className="form-group mb-2">
                      <label className="mb-1" htmlFor="val-email">
                        <strong>Enter 6 Digit PIN</strong>
                      </label>
                      <div>
                        <input
                          type="number"
                          name="pinnumber"
                          className="form-control"
                          placeholder="Enter 6 Digit PIN"
                        />
                      </div>
                    </div>
                    <div className="form-row d-flex justify-content-between ">
                      <div className="form-group mb-3">
                        <div className="custom-control custom-checkbox ml-1">
                         
                          <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                          >
                            Forget Pin
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="text-center form-group mb-3">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        Login
                      </button>
                    </div>

                    <div className="product-info d-flex align-items-center justify-content-center gap-3">
                      <div className="product-logo">
                        <img
                          src={background?.value == "dark" ? darkLogo : logo}
                          alt=""
                          style={{
                            height: "30px",
                            width: "auto",
                            backgroundSize: "contain",
                          }}
                        />
                      </div>

                      <div className="product-info">
                        <p className="text-center m-0">
                          Powered by{" "}
                          <a href="https://www.deboxglobal.com" target="_blank">
                            <img
                              src={deboxLogo}
                              alt=""
                              style={{
                                height: "30px",
                                width: "auto",
                                objectFit: "contain",
                              }}
                            />
                          </a>
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pinnumber;
