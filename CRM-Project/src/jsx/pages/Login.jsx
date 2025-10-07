import React, { useState, useEffect, useContext } from "react";
import { connect, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { axiosLogin } from "../../http/axios_base_url";
import {
  loadingToggleAction,
  loginAction,
} from "../../store/actions/AuthActions";
import DashboardImage from "../../images/dashboard-img.svg";
// import DashboardImage1 from "../../images/login/login-image1.png"
import DashboardImage1 from "../../images/loging/login-image1.jpg";
import DashboardImage2 from "../../images/loging/loginimage.jpg";
// import logo from "../../images/logo/NEXGENO8 Logo-03.svg";
import { notifyError } from "../../helper/notify";
import { ToastContainer } from "react-toastify";
import deboxLogo from "../../images/logo/deboxlogo.png";
// import darkLogo from "../../images/logo/logo-white.svg";
import { ThemeContext } from "../../context/ThemeContext";
import subdomainConfig from "../../config/subdomainConfig";

// import NEXGENVO8White from "/assets/favicon-logo/logo-title.svg";
import { useSubdomain } from "../../context/SubdomainContext";

function Login(props) {
  const { background, navigationHader } = useContext(ThemeContext);
  const storedData = localStorage.getItem("token");
  const credential = JSON?.parse(storedData);

  const hostname = window.location.hostname;
  const subdomain = hostname.split(".")[0];
  const currentConfig = subdomainConfig[subdomain] || subdomainConfig.default;

  const loginImage =
    currentConfig.theme == "dark" ? DashboardImage1 : DashboardImage2;

  const convertedTime = new Date(credential?.expirationTime * 1000).getTime();
  const timeChecking = convertedTime > new Date().getTime();

  const { theme, faviconIcon, logo, darkLogo } = useSubdomain();

  useEffect(() => {
    if (credential?.token && timeChecking) {
      navigate("/admin-dashboard");
    }
  }, []);

  let errorsObj = { email: "", password: "" };
  const [errors, setErrors] = useState(errorsObj);

  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
    remember_me: false,
  });
  const [toggleEye, setToggleEye] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormValue({
      ...formValue,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleToggleEye = () => {
    setToggleEye(!toggleEye);
  };

  async function onLogin(e) {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (formValue?.email === "") {
      errorObj.email = "Email is Required";
      error = true;
    }
    if (formValue?.password === "") {
      errorObj.password = "Password is Required";
      error = true;
    }
    setErrors(errorObj);
    if (error) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await axiosLogin.post("/login", formValue);

      console.log("loging-response", data);

      if (data?.status == 1) {
        const credentials = {
          expirationTime: data?.expiry_at,
          userCode: data?.UserCode,
          UserID: data?.UserID,
          UserName: data?.Name,
          companyKey: data?.CompanyKey,
          CompanyUniqueId: data?.CompanyUniqueId,
          token: data?.token,
          expireDate: data?.expireDate,
          UserEmail: data?.UserEmail,
          UserMobile: data?.UserMobile,
          Role: data?.Role,
          UserDepartmentId: data?.UserDepartmentId,
        };
        localStorage.setItem("token", JSON.stringify(credentials));
        const queryQuotation = { QoutationNum: "", QueryID: "" };
        localStorage.setItem("Query_Qoutation", JSON.stringify(queryQuotation));
        navigate("/admin-dashboard");
        // window.location.reload();
      }

      if (data?.status != 1) {
        notifyError(data?.status || data?.error);
      }
    } catch (err) {
      console.log("login-error-01", err);
      const { data } = err?.response;
      console.log("error-data", data);
      notifyError(`Sorry ${data?.message || data?.error}`);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = () => {
    if (event.key == "Enter") {
      onLogin();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [formValue]);

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
          style={{ backgroundImage: "url(" + loginImage + ")" }}
        ></div>
      </div>
      <div className="container flex-row-fluid d-flex flex-column justify-content-center position-lg-relative overflow-hidden p-7 mx-auto before-laptopScreen">
        <div className="d-flex justify-content-center h-100 align-items-center">
          <div className="authincation-content style-2">
            <div className="row no-gutters">
              <div className="col-xl-12 tab-content">
                <div className="logo-img mx-auto">
                  {/* <img
                    src={
                      currentConfig.title == "dark"
                        ? currentConfig.darkLogo
                        : currentConfig.logo
                    }
                    alt="logo"
                    className="h-100 w-100"
                  /> */}
                  {background.value === "dark" ||
                  navigationHader !== "color_1" ? (
                    <img src={logo} alt="logo" className="h-100 w-100" />
                  ) : (
                    <img src={darkLogo} alt="logo" className="h-100 w-100" />
                  )}
                </div>
                <div id="sign-in" className="auth-form   form-validation">
                  <form onSubmit={onLogin} className="form-validate">
                    <h3 className="text-center mb-2 mb-md-4 text-black">
                      Login your account
                    </h3>
                    <div className="form-group mb-2 mb-md-3">
                      <label className="mb-1" htmlFor="val-email">
                        <strong>Email</strong>
                      </label>
                      <div>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formValue?.email}
                          onChange={handleChange}
                          placeholder="Type Your Email Address"
                        />
                      </div>
                      {errors.email && (
                        <div className="text-danger fs-12">{errors.email}</div>
                      )}
                    </div>
                    <div className="form-group mb-3 position-relative">
                      <label className="mb-1">
                        <strong>Password</strong>
                      </label>
                      <input
                        type={!toggleEye ? "password" : "text"}
                        name="password"
                        className="form-control"
                        value={formValue?.password}
                        placeholder="Type Your Password"
                        onChange={handleChange}
                      />
                      {toggleEye ? (
                        <i
                          className="fa-solid fa-eye  position-absolute fs-5 cursor-pointer eye-login"
                          onClick={handleToggleEye}
                        ></i>
                      ) : (
                        <i
                          className="fa-solid fa-eye-slash  position-absolute fs-5 cursor-pointer eye-login"
                          onClick={handleToggleEye}
                        ></i>
                      )}

                      {errors.password && (
                        <div className="text-danger fs-12">
                          {errors.password}
                        </div>
                      )}
                    </div>
                    <div className="form-row d-flex justify-content-between mt-2 mt-md-4 mb-2">
                      <div className="form-group mb-3">
                        <div className="custom-control custom-checkbox ml-1">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="basic_checkbox_1"
                            name="remember_me"
                            value={formValue?.remember_me}
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                          >
                            Remember my preference
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="text-center form-group mb-3 mb-md-3">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block "
                      >
                        {loading ? (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center", // ✅ center horizontally
                              gap: "6px",
                              width: "100%", // ✅ fill button width
                            }}
                          >
                            <span
                              style={{
                                border: "2px solid #f3f3f3",
                                borderTop: "2px solid #3498db",
                                borderRadius: "50%",
                                width: "14px",
                                height: "14px",
                                animation: "spin 0.8s linear infinite",
                              }}
                            />
                            Loading...
                            <style>
                              {`
                                @keyframes spin {
                                  0% { transform: rotate(0deg); }
                                  100% { transform: rotate(360deg); }
                                }
                              `}
                            </style>
                          </span>
                        ) : (
                          "Login"
                        )}
                      </button>
                    </div>

                    <div className="product-info d-flex align-items-center justify-content-center gap-3">
                      <div className="product-logo">
                        {/* <img
                          src={
                            currentConfig.title == "dark"
                              ? currentConfig.darkLogo
                              : currentConfig.logo
                          }
                          alt=""
                          style={{
                            height: "30px",
                            width: "auto",
                            backgroundSize: "contain",
                          }}
                        /> */}
                        {background.value === "dark" ||
                        navigationHader !== "color_1" ? (
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

const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  };
};
export default connect(mapStateToProps)(Login);
