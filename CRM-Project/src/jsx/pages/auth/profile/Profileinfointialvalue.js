const credential = localStorage.getItem("token");
// console.log(credential+"mansn");

const authData = JSON.parse(credential);
export const userlistInitialValue = {
  id: "",
  CompanyKey: "",
  OrganizationId: "",
  FirstName: "",
  LastName: "",
  Profile: 1,
  email: "",
  password: "",
  password_confirmation: "",
  UserCode: "",
  Role: [],
  Phone: "",
  Mobile: "",
  Pin: "",
  Street: "",
  LanguageKnown: [],
  TimeFormat: "",
  Designation: "",
  UsersDepartment: "",
  UserType: "",
  UserLoginType: "",
  UserKey: "",
  remember_token: "",
  email_verified_at: "",
  SettingJson: "",
  Status: 1,
  AddedBy: authData?.UserID != null ? authData?.UserID?.toString() : "0",
  UpdatedBy: authData?.UserID != null ? authData?.UserID?.toString() : "0",
};
export const Changepasswordintialvalue = {
  email: "",
  old_password: "",
  password: "",
  password_confirmation: "",
};

export const uploadlogo = {
  id: "",
  ProfileLogo: "",
  ProfileLogoImageData: "", 
};
