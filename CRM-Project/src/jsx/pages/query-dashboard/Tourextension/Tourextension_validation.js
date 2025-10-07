import * as yup from "yup";

export const AddGuestValidation = yup.object().shape({
  Nationality: yup.string().required("The nationality field is required"),
  Title: yup.string().required("The title field is required"),
  FirstName: yup.string().required("The first name field is required"),
  LastName: yup.string().required("The last name field is required"),
  Gender: yup.string().required("The gender field is required"),
  DOB: yup.string().required("The d o b field is required."),
});
