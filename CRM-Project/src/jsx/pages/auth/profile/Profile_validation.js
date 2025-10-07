import * as yup from "yup";
export const changepasswordvalidationschema = yup.object().shape({
    old_password: yup.string().required("Please enter old password"),
    password: yup.string().required("Please enter  New password").notOneOf([yup.ref("old_password")], "New password must be different from old password"),
    password_confirmation: yup.string().required("Please confirm password").oneOf([yup.ref("password"), null], "Passwords must match with confirm password"),
});
export const profileinfovalidationschema =yup.object().shape({
    FirstName:yup.string().required("Please enter first name"),
    // LastName:yup.string().required("Please enter Last Name"),
    // Phone:yup.string().required("Required")

})