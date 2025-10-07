import { toast as toastifyToast } from "react-toastify";
import { toast as hotToast } from "react-hot-toast";

export const notifyHotSuccess = (message) => {
  hotToast.success(message);
};

export const notifyHotError = (message) => {
  hotToast.error(message);
};

export const notifySuccess = (message) => {
  // console.log(message);
  hotToast.success(message);
};

export const notifyError = (message) => {
  hotToast.error(message);
};

export const notifyErrorCustom = (errors) => {
  Object.values(errors).forEach((errorArray) => {
    if (Array.isArray(errorArray)) {
      errorArray.forEach((errorMessage) => {
        toastifyToast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          pauseOnFocusLoss: true,
        }); // Show each error message in Toastify
      });
    }
  });
};
