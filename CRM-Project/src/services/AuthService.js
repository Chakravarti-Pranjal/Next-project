import axios from "axios";
import swal from "sweetalert";
import { loginConfirmedAction, Logout } from "../store/actions/AuthActions";

export function signUp(email, password) {
  //axios call
  const postData = {
    email,
    password,
    returnSecureToken: true,
  };
  return axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`,
    postData
  );
}

export function login(email, password) {
  const postData = {
    email,
    password,
    returnSecureToken: true,
  };
  return axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`,
    postData
  );
}

export function formatError(status, message) {
  switch (status) {
    case -1:
      //return 'Email already exists';
      swal("Oops", message, "error", { button: "Try Again!" });
      break;
    case "EMAIL_NOT_FOUND":
      //return 'Email not found';
      swal("Oops", "Email not found", "error", { button: "Try Again!" });
      break;
    case "INVALID_PASSWORD":
      //return 'Invalid Password';
      swal("Oops", "Invalid Password", "error", { button: "Try Again!" });
      break;
    case "USER_DISABLED":
      return "User Disabled";

    default:
      return "";
  }
}

export function saveTokenInLocalStorage(tokenDetails) {
  const credentials = {
    expirationTime: tokenDetails?.expiry_at,
    userCode: tokenDetails?.UserCode,
    companyKey: tokenDetails?.CompanyKey,
    token: tokenDetails?.token,
    expireDate: tokenDetails?.expireDate,
    UserDepartmentId: tokenDetails?.UserDepartmentId,
  };
  localStorage.setItem("token", JSON.stringify(credentials));
}

// export function runLogoutTimer(dispatch, timer, navigate) {
//     setTimeout(() => {
//         //dispatch(Logout(history));
//         dispatch(Logout(navigate));
//     }, timer);
// }

export function checkAutoLogin(dispatch, navigate) {
  const tokenDetailsString = localStorage.getItem("userDetails");
  let tokenDetails = "";
  if (!tokenDetailsString) {
    dispatch(Logout(navigate));
    return;
  }
  tokenDetails = JSON.parse(tokenDetailsString);
  //   let expireDate = new Date(tokenDetails.expireDate);
  //   let todaysDate = new Date();

  const convertedTime = new Date(tokenDetails?.expirationTime * 1000).getTime();
  const timeChecking = convertedTime > new Date().getTime();

  if (!timeChecking) {
    dispatch(Logout(navigate));
    return;
  }

  dispatch(loginConfirmedAction(tokenDetails));

  //   const timer = expireDate.getTime() - todaysDate.getTime();
  //   runLogoutTimer(dispatch, timer, navigate);
}
