// import React from 'react';
// import { useNavigate } from "react-router-dom";
import { axiosLogin } from "../../http/axios_base_url";

import {
  formatError,
  login,
  //   runLogoutTimer,
  saveTokenInLocalStorage,
  signUp,
} from "../../services/AuthService";

export const SIGNUP_CONFIRMED_ACTION = "[signup action] confirmed signup";
export const SIGNUP_FAILED_ACTION = "[signup action] failed signup";
export const LOGIN_CONFIRMED_ACTION = "[login action] confirmed login";
export const LOGIN_FAILED_ACTION = "[login action] failed login";
export const LOADING_TOGGLE_ACTION = "[Loading action] toggle loading";
export const LOGOUT_ACTION = "[Logout action] logout action";

export function signupAction(email, password, navigate) {
  return (dispatch) => {
    signUp(email, password)
      .then((response) => {
        saveTokenInLocalStorage(response.data);
        // runLogoutTimer(
        //   dispatch,
        //   response.data.expiresIn * 1000
        //   history,
        // );
        dispatch(confirmedSignupAction(response.data));
        navigate("/dashboard");
        //history.push('/dashboard');
      })
      .catch((error) => {
        const errorMessage = formatError(error.response.data);
        dispatch(signupFailedAction(errorMessage));
      });
  };
}

export function Logout(navigate) {
  localStorage.removeItem("Query_Qoutation");
  localStorage.removeItem("quotationList");
  localStorage.removeItem("query-data");
  localStorage.removeItem("token");
  navigate("/login");
  //history.push('/login');

  return {
    type: LOGOUT_ACTION,
  };
}

export async function loginAction(credentials, navigate) {
  try {
    const { data } = await axiosLogin.post("/login", credentials);
    console.log("login-response", data);

    if (data?.status == 1) {
      saveTokenInLocalStorage(data);
      // runLogoutTimer(dispatch, data.expiry_at * 1000, navigate);
      dispatch(loginConfirmedAction(data));
      console.log("here-am-working");
      navigate("/dashboard");
      console.log("navigate-to-dashboard");
      //console.log('kk------1');
      //console.log(kk);
      //console.log(response.data);
      //console.log('kk------2');
      //return response.data;
      //return 'success';
      //history.push('/dashboard');
    }

    if (data?.status != 1) {
      formatError(data?.status, data?.error);
    }
  } catch (err) {
    const { status, error } = err.response?.data;

    if (status == -1) {
      const errorMessage = formatError(status, error);
      dispatch(loginFailedAction(errorMessage));
    }

    // login(email, password)
    //   .then((response) => {
    //     saveTokenInLocalStorage(response.data);
    //     runLogoutTimer(dispatch, response.data.expiresIn * 1000, navigate);
    //     dispatch(loginConfirmedAction(response.data));
    //     //console.log('kk------1');
    //     //console.log(kk);
    //     //console.log(response.data);
    //     //console.log('kk------2');
    //     //return response.data;
    //     //return 'success';
    //     //history.push('/dashboard');
    //     navigate("/dashboard");
    //   })
    //   .catch((error) => {
    //     //console.log('error');
    //     //console.log(error);
    //     const errorMessage = formatError(error.response.data);
    //     dispatch(loginFailedAction(errorMessage));
    //   });
  }
}

export function loginFailedAction(data) {
  return {
    type: LOGIN_FAILED_ACTION,
    payload: data,
  };
}

export function loginConfirmedAction(data) {
  return {
    type: LOGIN_CONFIRMED_ACTION,
    payload: data,
  };
}

export function confirmedSignupAction(payload) {
  return {
    type: SIGNUP_CONFIRMED_ACTION,
    payload,
  };
}

export function signupFailedAction(message) {
  return {
    type: SIGNUP_FAILED_ACTION,
    payload: message,
  };
}

export function loadingToggleAction(status) {
  return {
    type: LOADING_TOGGLE_ACTION,
    payload: status,
  };
}
