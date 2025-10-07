import * as yup from "yup";

export const userAddValidation = yup.object().shape({
  email: yup.string().required("Please enter Email"),
  password: yup.string().required("Please enter Password"),
  password_confirmation: yup.string().required("Please enter Confirm password"),
  UserCode: yup.string().required("Please enter UserCode"),
  Status: yup.string().required("Please enter Status"),
  Role: yup.array().min(1, "Please select Role").required("Please select Role"),
});
export const companyAddValidation = yup.object().shape({
  COMPANYNAME: yup.string().required("Please enter company Name"),
  REGISTEREDEMAIL: yup.string().required("Please enter Email"),
  PHONE: yup.string().required("Please enter Phone"),
  LICENSEKEY: yup.string().required("Please enter License"),
  PAN: yup.string().required("Please enter PAN"),
  TAN: yup.string().required("Please enter TAN"),
  CIN: yup.string().required("Please enter CIN"),
  LUT: yup.string().required("Please enter LUT"),
  COUNTRY: yup.string().required("Please select Country"),
  STATE: yup.string().required("Please select State"),
  GST: yup
    .array()
    .of(
      yup.object().shape({
        StateId: yup.number().required("StateId is required"), // Ensure StateId is a number
        GSTNo: yup
          .string()
          .matches(
            /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[A-Z]{1}\d{1}$/,
            "Invalid GST number format"
          ) // Example regex for GST number
          .required("GST number is required"),
      })
    )
    .min(1, "At least one GST number is required")
    .required("Please enter GST numbers"),
});
export const permissionAddValidation = yup.object().shape({
  Modules: yup
    .array()
    .min(1, "Please select modules")
    .required("Please select modules"),
});
export const roleAddValidation = yup.object().shape({
  name: yup.string().required("Please enter name"),
});
export const moduleAddValidation = yup.object().shape({
  Name: yup.string().required("Please enter name"),
  DisplayName: yup.string().required("Please enter DisplayName"),
 Status: yup.string().required("Status is required"),
});
export const departmentAddValidation = yup.object().shape({
  Name: yup.string().required("Please enter name"),
  Status: yup.string().required("Please enter status"),
  Code: yup.string().required("Please enter code"),

});
