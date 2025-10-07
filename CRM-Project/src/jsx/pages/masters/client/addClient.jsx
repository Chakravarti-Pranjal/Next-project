import React, { useState, useEffect } from "react";
import {
  directClientContact,
  directClientDocumentation,
  directClientInitialValue,
} from "../masters_initial_value";
import { direcetClientValidationSchema } from "../master_validation";
import useMultipleSelect from "../../../../hooks/custom_hooks/useMultipleSelect";
import { axiosOther } from "../../../../http/axios_base_url";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const AddClient = () => {
  const [formValue, setFormValue] = useState(directClientInitialValue);
  const [addMoreInfo, setAddMoreInfo] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [currenctlist, setCurrencylist] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [stateCity, setStateCity] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [city, setCity] = useState([]);
  const [state, setState] = useState({});
  const [familyList, setFamilyList] = useState([]);
  const [seatList, setSeatList] = useState([]);
  const [mealList, setMealList] = useState([]);
  const [specialassistanc, setspecialassistanceList] = useState([]);
  const [accomodationpreferenceList, setaccomodationpreferenceList] = useState(
    []
  );
  const [salesList, setsalesList] = useState([]);
  const [documenttypemasterlist, setdocumenttypemasterList] = useState([]);

  const [markettypemasterlist, setMarkettypemasterlist] = useState([]);
  const [holidaylist, setHolidaylist] = useState([]);
  const [nationalitylist, setNationalitylist] = useState([]);
  const [tourlist, setTourlist] = useState([]);
  const [contactListArray, setContactListArray] = useState([1]);
  const [contactFormDataArray, setContactFormDataArray] = useState([
    directClientContact,
  ]);
  const [documentationDataArray, setDocumentationDataArray] = useState([
    directClientDocumentation,
  ]);
  const [documentationListArray, setDocumentationListArray] = useState([1]);

  const location = useLocation();
  const navigate = useNavigate();
  // console.log(contactFormDataArray, "contactFormDataArray1");

  const getDataToServer = async () => {
    try {
      const countryData = await axiosOther.post("countrylist", {
        Search: "",
        Status: 1,
      });
      setCountryList(countryData.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const docData = await axiosOther.post("documenttypemasterlist", {
        Search: "",
        Status: 1,
      });
      setdocumenttypemasterList(docData.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const salesData = await axiosOther.post("fetch-sales-person", {
        Name: "Sales",
      });
      setsalesList(salesData.data.SalesPersons);
      // console.log(salesData.data.SalesPersons, "salesdata");
    } catch (err) {
      console.log(err);
    }
    try {
      const accomodationpreferencedata = await axiosOther.post(
        "accomodationpreferenceslist",
        {
          // Search: "",
          // Status: 1,
        }
      );
      setaccomodationpreferenceList(accomodationpreferencedata.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const specialassistanceyData = await axiosOther.post(
        "specialassistancelist",
        {
          // Search: "",
          // Status: 1,
        }
      );
      setspecialassistanceList(specialassistanceyData.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const familyData = await axiosOther.post("familyrelationmasterlist", {
        // Search: "",
        // Status: 1,
      });
      setFamilyList(familyData.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const seatData = await axiosOther.post("seat-preference-list", {
        // Search: "",
        // Status: 1,
      });
      setSeatList(seatData.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const mealData = await axiosOther.post("meal-choice-list", {
        // Search: "",
        // Status: 1,
      });
      setMealList(mealData.data.DataList);
    } catch (err) {
      console.log(err);
    }

    try {
      const Data = await axiosOther.post("holidaypreferencelist", {
        Search: "",
        Status: 1,
      });
      setHolidaylist(Data.data.DataList);
    } catch (err) {
      console.log(err);
    }

    try {
      const Data = await axiosOther.post("markettypemasterlist", {
        Search: "",
        Status: 1,
      });
      setMarkettypemasterlist(Data.data.DataList);
    } catch (err) {
      console.log(err);
    }

    try {
      const Data = await axiosOther.post("nationalitylist", {
        Search: "",
        Status: 1,
      });
      setNationalitylist(Data.data.DataList);
      // console.log(Data.data.DataList, "nationalitylist");
    } catch (err) {
      console.log(err);
    }
    try {
      const Data = await axiosOther.post("currencymasterlist", {
        // Search: "",
        // Status: 1,
      });
      setCurrencylist(Data.data.DataList);
      // console.log(Data.data.DataList, "Datalistss");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getDataToServer();
  }, []);

  useEffect(() => {
    if (location?.state) {
      // console.log("FirstName-ss", location?.state);
      // setFormValue((prevState) =>({
      //     ...prevState,
      //     id: location?.state?.id,
      //     ContactType: location?.state?.ContactType,
      //     Nationality: location?.state?.Nationality?.id,
      //     Title: location?.state?.Title,
      //     FirstName: location?.state?.FirstName,

      //     MiddleName: location?.state?.MiddleName,
      //     LastName: location?.state?.LastName,
      //     Gender: location?.state?.Gender,
      //     DOB: location?.state?.DOB,
      //     AnniversaryDate: location?.state?.AnniversaryDate,
      //     HolidayPreference: location?.state?.HolidayPreference.map((data,index) => {
      //         return (
      //             data?.Name
      //         )
      //     }),
      //     Country: location?.state?.Country?.id,
      //     State: location?.state?.State?.id,
      //     City: location?.state?.City,
      //     Pin_Zip: location?.state?.Pin_Zip,
      //     Address: location?.state?.Address,
      //     Facebook: location?.state?.Facebook,
      //     Twitter: location?.state?.Twitter,
      //     LinkedIn: location?.state?.LinkedIn,
      //     Instagram: location?.state?.Instagram,
      //     Skype: location?.state?.Skype,
      //     MSN_Id: location?.state?.MSN_Id,
      //     Remark1: location?.state?.Remark1,
      //     Remark2: location?.state?.Remark2,
      //     Remark3: location?.state?.Remark3,
      //     SalesPerson: location?.state?.SalesPerson,
      //     Status: location?.state?.Status === "Active" ? "1" : "0",
      //     FamilyCode: location?.state?.FamilyCode,
      //     FamilyRelation: location?.state?.FamilyRelation?.id,
      //     MealPreference: location?.state?.MealPreference,
      //     SpecialAssisteance: location?.state?.SpecialAssisteance?.id,
      //     SeatPreference: location?.state?.SeatPreference,
      //     AccomodationPreference: location?.state?.AccomodationPreference?.id,
      //     MarketType: location?.state?.MarketType?.id,
      //     CovidVaccinated: location?.state?.CovidVaccinated,
      //     NewsLetter: location?.state?.NewsLetter,
      //     EmergencyContactName: location?.state?.EmergencyContactName,
      //     Relation: location?.state?.Relation,
      //     EmergencyContactNumber: location?.state?.EmergencyContactNumber,
      //     AddedBy: "0",
      //     UpdatedBy: "1",
      // }));

      // console.log("checking-144", location?.state);
      setFormValue({
        ...formValue,
        id: location?.state?.id,
        ContactType: location?.state?.ContactType,
        Nationality: location?.state?.Nationality?.id,
        Title: location?.state?.Title,
        FirstName: location?.state?.FirstName,

        MiddleName: location?.state?.MiddleName,
        LastName: location?.state?.LastName,
        Gender: location?.state?.Gender,
        DOB: location?.state?.DOB,
        AnniversaryDate: location?.state?.AnniversaryDate,
        // HolidayPreference: location?.state?.HolidayPreference.map((data,index) => {
        //     return (
        //         data?.id
        //     )
        // }),
        HolidayPreference: location?.state?.HolidayPreference.map((dest) =>
          parseInt(dest?.id)
        ),
        Country: location?.state?.Country?.id,
        State: location?.state?.State?.id,
        City: location?.state?.City?.id,
        Pin_Zip: location?.state?.Pin_Zip,
        Address: location?.state?.Address,
        Facebook: location?.state?.Facebook,
        Twitter: location?.state?.Twitter,
        LinkedIn: location?.state?.LinkedIn,
        Instagram: location?.state?.Instagram,
        Skype: location?.state?.Skype,
        MSN_Id: location?.state?.MSN_Id,
        Remark1: location?.state?.Remark1,
        Remark2: location?.state?.Remark2,
        Remark3: location?.state?.Remark3,
        SalesPerson: location?.state?.SalesPerson,
        Status: location?.state?.Status === "Active" ? "1" : "0",
        FamilyCode: location?.state?.FamilyCode,
        FamilyRelation: location?.state?.FamilyRelation?.id,
        MealPreference: location?.state?.MealPreference,
        SpecialAssisteance: location?.state?.SpecialAssisteance?.id,
        SeatPreference: location?.state?.SeatPreference,
        AccomodationPreference: location?.state?.AccomodationPreference?.id,
        MarketType: location?.state?.MarketType?.id,
        CovidVaccinated: location?.state?.CovidVaccinated,
        NewsLetter: location?.state?.NewsLetter,
        EmergencyContactName: location?.state?.EmergencyContactName,
        Relation: location?.state?.Relation,
        EmergencyContactNumber: location?.state?.EmergencyContactNumber,
        AddedBy: "0",
        UpdatedBy: "1",
      });
      // console.log("checking-12");
      setHolidaySelected(
        location?.state?.HolidayPreference.map((dest) => parseInt(dest?.id))
      );

      if (location?.state?.Contactinfo) {
        location?.state?.Contactinfo.forEach((data, index) => {
          setContactFormDataArray((prevState) => {
            const updatedArray = [...prevState]; // Create a copy of the previous location?.state array
            updatedArray[index] = {
              ...updatedArray[index], // Keep previous values at the current index
              Contact_Type: data?.Contact_Type,
              CountryCode: data?.CountryCode,
              Mobile: data?.Mobile,
              EmailType: data?.EmailType,
              Email: data?.Email,
            };
            return updatedArray; // Return the updated array
          });
        });
        setContactListArray(location?.state?.Contactinfo);
      }

      if (location?.state?.Documentation) {
        location?.state?.Documentation.forEach((data, index) => {
          setDocumentationDataArray((prevState) => {
            const updatedArray = [...prevState];
            updatedArray[index] = {
              ...updatedArray[index],
              DocumentType: data?.DocumentType?.id,
              DocumentRequired: data?.DocumentRequired,
              DocumentNo: data?.DocumentNo,
              IssueDate: data?.IssueDate,
              ExpiryDate: data?.ExpiryDate,
              IssueCountry: data?.IssueCountry?.id,
              DocumentTitle: data?.DocumentTitle,
              ImageData: data?.UploadDocument,
              // ImageName: "",
            };
            return updatedArray;

            console.log(data?.UploadDocument < "dataUploadDocument");
          });
        });
        setDocumentationListArray(location?.state?.Documentation);
      }
    }
  }, [location?.state]);

  // console.log(location?.state, "formvalue--ss");

  const holidayOption = holidaylist?.map((tour) => {
    return {
      value: tour?.id,
      label: tour?.Name,
    };
  });
  const increaseDocumentationList = () => {
    const length = documentationListArray?.length;
    const lastValue = documentationListArray[length - 1];
    setDocumentationListArray([...documentationListArray, lastValue + 1]);

    setDocumentationDataArray((prevArr) => [
      ...prevArr,
      directClientDocumentation,
    ]);
  };
  const increaseContactList = () => {
    const length = contactListArray?.length;
    const lastValue = contactListArray[length - 1];
    setContactListArray([...contactListArray, lastValue + 1]);
    setContactFormDataArray((prevArr) => [...prevArr, directClientContact]);
    // console.log(contactFormDataArray, contactListArray, "135");
  };
  const deleteContactListItem = () => {
    if (contactListArray.length == 1) {
      return null;
    }
    const afterDelete = contactListArray;
    afterDelete.pop();
    setContactListArray([...afterDelete]);
  };

  const deleteDocumentationListArray = () => {
    const afterDelete = documentationListArray;
    afterDelete.pop();
    setDocumentationListArray([...afterDelete]);
  };

  // submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await direcetClientValidationSchema.validate(
        {
          ...formValue,
          Contactinfo: contactFormDataArray,
          Documentation: documentationDataArray,
        },
        { abortEarly: false }
      );

      // console.log("Form Value:",formValue);
      // console.log("Contact Info:",contactFormDataArray);
      // console.log("Documentation:",documentationDataArray);
      // console.log("API Payload:",{
      //     ...formValue,
      //     Contactinfo: contactFormDataArray,
      //     Documentation: documentationDataArray,
      // });

      setValidationErrors({});
      // console.log("Contact Info Before Validation:", contactFormDataArray);

      const { data } = await axiosOther.post("addupdatedirectClient", {
        ...formValue,
        Contactinfo: contactFormDataArray,
        Documentation: documentationDataArray,
      });
      // console.log(contactFormDataArray, "c");

      // console.log("API Response:", data);

      if (data?.Status == 1) {
        // console.log(data?.id,"datacheck")
        setFormValue(formValue);

        if (state) {
          navigate("/direct-client");
        } else {
          navigate(`/view/client/${data?.id}`);
        }
        localStorage.setItem("success-message", data?.Message || data?.message);
      } else {
        notifyError(data?.message || data?.Message);
      }
    } catch (error) {
      if (error.inner) {
        const errorMessages = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(errorMessages);
        // console.error("errorMessages", errorMessages);
      }

      if (error.response?.data?.Errors) {
        const data = Object.entries(error.response?.data?.Errors);
        // console.error("errorMessages", error.response?.data?.Errors);
        alert(data[0][1]);
      }
    }
  };
  const getFromDate = () => {
    return formValue?.DOB ? new Date(formValue?.DOB) : null;
  };
  const handleCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").reverse().join("-")
      : "";
    setFormValue({
      // comment-ansar
      ...formValue,
      DOB: formattedDate,
    });
  };
  const getNextDate = () => {
    return formValue?.AnniversaryDate
      ? new Date(formValue?.AnniversaryDate)
      : null;
    // return formValue?.ExpiryDate ? new Date(formValue?.ExpiryDate) : null;
    // return formValue?.IssueDate ? new Date(formValue?.IssueDate) : null;
    // return formValue?.AnniversaryDate ? new Date(formValue?.AnniversaryDate) : null;
  };
  const handleNextCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").reverse().join("-")
      : "";
    setFormValue({
      // comment-ansar
      ...formValue,
      AnniversaryDate: formattedDate,
    });
  };
  const getIssueDateDate = (index) => {
    return documentationDataArray?.[index]?.IssueDate
      ? new Date(documentationDataArray[index].IssueDate)
      : null;
  };

  const handleIssueDateCalender = (date, index) => {
    if (!date) return; // Prevent errors if date is null

    const formattedDate = date.toISOString().split("T")[0];

    setDocumentationDataArray((prevArray) => {
      const updatedArray = [...prevArray]; // Create a copy of the array
      updatedArray[index] = {
        ...updatedArray[index],
        IssueDate: formattedDate,
      }; // Update only the specific index
      return updatedArray; // Return the updated array
    });
  };

  const getIExpiryDateDate = (index) => {
    // return formValue?.ExpiryDate ? new Date(formValue?.ExpiryDate) : null;
    return documentationDataArray?.[index]?.ExpiryDate
      ? new Date(documentationDataArray[index].ExpiryDate)
      : null;
  };
  // const handleExpiryDateCalender = (date) => {
  //     const formattedDate = date.toISOString().split("T")[0];
  //     setDocumentationDataArray({ // comment-ansar
  //         ...formValue,
  //         ExpiryDate: formattedDate,
  //     });
  // };
  const handleExpiryDateCalender = (date, index) => {
    if (!date) return; // Prevent errors if date is null

    const formattedDate = date.toISOString().split("T")[0];

    setDocumentationDataArray((prevArray) => {
      const updatedArray = [...prevArray]; // Create a copy of the array
      updatedArray[index] = {
        ...updatedArray[index],
        ExpiryDate: formattedDate,
      }; // Update only the specific index
      return updatedArray; // Return the updated array
    });
  };

  const handlePhoneChange = (phone, index, name) => {
    // console.log(phone, index, name, "244");

    setContactFormDataArray((prevArr) => {
      const newArray = [...prevArr];
      newArray[index] = { ...newArray[index], [name]: phone };
      return newArray;
    });
    // console.log(contactFormDataArray, "250");
  };
  const handleContactinfoChangeData = (index, e) => {
    const { name, value } = e.target;
    // console.log(name, value, "1222");
    setContactFormDataArray((prevArr) => {
      const newArray = [...prevArr];
      newArray[index] = { ...newArray[index], [name]: value };
      return newArray;
    });
  };
  const handleDocumentationChangeFormData = (index, e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      const fileData = files[0];
      const reader = new FileReader();

      reader.readAsDataURL(fileData);
      reader.onload = () => {
        const base64String = reader.result;

        // Update only the ImageData for the specific index
        setDocumentationDataArray((prevArr) => {
          const newArray = [...prevArr];
          newArray[index] = {
            ...newArray[index],
            ImageData: base64String,
          };
          return newArray;
        });
      };
    }

    // Update other fields without waiting for file processing
    setDocumentationDataArray((prevArr) => {
      const newArray = [...prevArr];
      newArray[index] = { ...newArray[index], [name]: value };
      return newArray;
    });
  };
  const handleFormChange = (e) => {
    const { name, value, file, type } = e.target;
    // console.log(e.target.name, e.target.value, "etarget");
    // console.log(name, "168");
    if (type == "file") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const base64String = base64.split(",")[1];
        if (name === "AgentHeaderImageName") {
          setFormValue({
            // comment-ansar
            ...formValue,
            AgentHeaderImageData: base64String,
            AgentHeaderImageName: file.name,
          });
        } else if (name === "AgentFooterImageName") {
          setFormValue({
            // comment-ansar
            ...formValue,
            AgentFooterImageData: base64String,
            AgentFooterImageName: file.name,
          });
        } else {
          setFormValue({
            // comment-ansar
            ...formValue,
            CompanyLogoImageData: base64String,
            CompanyLogoImageName: file.name,
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFormValue((prev) => ({
        // comment-ansar
        ...prev,
        [name]: value,
      }));
    }
    // if (e.target.name == "Country") {
    //   handleStateList(e.target.value);
    // }
    if (e.target.name === "State") {
      handleCity(e.target.value);
    }
  };

  useEffect(() => {
    const fetchStateAndCity = async () => {
      try {
        if (formValue?.Country) {
          // console.log("Fetching states for country:", formValue?.Country);
          const stateData = await axiosOther.post("listStateByCountry", {
            countryid: formValue?.Country,
          });
          setCityList([]); // Reset city list when country changes
          setStateList(stateData.data.DataList);
        }

        // console.log(stateData)

        if (formValue?.Country && formValue?.State) {
          // console.log("Fetching cities for state:", formValue?.State);
          const cityData = await axiosOther.post(
            "listCityByStateandCountryName",
            {
              stateid: formValue?.State,
            }
          );
          setCityList(cityData.data.DataList);
          // console.log(cityData.data.DataList,"citylist")
        }
      } catch (err) {
        console.error("Error fetching state or city data:", err);
      }
    };


    fetchStateAndCity();
  }, [formValue?.State, formValue?.Country]);

  const intialTourId = location?.state?.HolidayPreference;

  // console.log(formValue, "236");
  const handleAgentInfo = (data) => {
    const cleanedData = data.replace(/<[^>]*>/g, "");
    setFormValue((prevState) => ({
      // comment-ansar
      ...prevState,
      AgentInfo: cleanedData, // Update Description field in state
    }));
  };
  const handleRemarks = (data, name) => {
    const cleanedData = data.replace(/<[^>]*>/g, "");
    switch (name) {
      case "Remark1":
        setFormValue((prevState) => ({
          // comment-ansar
          ...prevState,
          Remark1: cleanedData, // Update Description field in state
        }));
        break;
      case "Remark2":
        setFormValue((prevState) => ({
          // comment-ansar
          ...prevState,
          Remark2: cleanedData, // Update Description field in state
        }));
        break;
      default:
        setFormValue((prevState) => ({
          // comment-ansar
          ...prevState,
          Remark3: cleanedData, // Update Description field in state
        }));
    }

    setFormValue((prevState) => ({
      // comment-ansar
      ...prevState,
      Remarks: cleanedData, // Update Description field in state
    }));
  };
  const {
    SelectInput: HolidayInput,
    selectedData: holidaySelected,
    setSelectedData: setHolidaySelected,
  } = useMultipleSelect(holidayOption);

  useEffect(() => {
    const nationalityId = formValue?.Nationality;
    const nationalityName = nationalitylist.find(
      (item) => item?.id == nationalityId
    );
    const INRID = currenctlist.find((item) => item?.CurrencyName == "INR");
    const USDID = currenctlist.find((item) => item?.CurrencyName == "USD");

    // console.log("all-value", nationalityId, nationalityName, INRID, USDID);

    if (nationalityName?.Name == "Indian") {
      setFormValue({
        // comment-ansar
        ...formValue,
        Currency: INRID?.id,
      });
    }

    if (nationalityName?.Name !== "Indian" && nationalityId !== undefined) {
      // console.log(formValue, "formValue before update");

      setFormValue((formValue) => ({
        ...formValue,
        Currency: USDID?.id || formValue.Currency, // Preserve existing Currency if USDID?.id is undefined
      }));

      // console.log(formValue, "formValue after update"); // May not reflect the update immediately (React state behavior)
    }
    if (!nationalityId) {
      setFormValue({
        // comment-ansar
        ...formValue,
        Currency: "",
      });
    }
  }, [formValue?.Nationality, nationalitylist, currenctlist]);

  // console.log(formValue,"formValueFirstName");
  // useEffect(() => {

  // console.log("validationErrors", validationErrors?.[`Contactinfo[0].Email`]);
  // }, [formValue?.FirstName]);
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Add Direct Client</h4>
            <div className="d-flex gap-3 ">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary btn-custom-size"
              >
                Submit
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="form-validation">
              <form
                className="form-valide"
                action="#"
                method="post"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="row">
                  <div className="col-12">
                    <div className="row form-row-gap">
                      <div className="col-md-6 col-lg-2">
                        <label className="" htmlFor="status">
                          Contact Information
                        </label>
                        <select
                          name="ContactType"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.ContactType}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          <option value="B2C">B2C</option>
                          <option value="Employe">Employe</option>
                          <option value="GuestList">GuestList</option>
                        </select>
                        {validationErrors?.Destination && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.Destination}
                          </div>
                        )}
                      </div>
                      <div className="col-12 mt-2">
                        <div className="border rounded position-relative  px-2  p-2">
                          <label className="mb-1 m-0 position-absolute form-label-position-1  px-1 font-weight-bold">
                            Personal Information
                          </label>
                          <div className="row mt-1">
                            <div className="col-md-6 col-lg-2">
                              <div className="d-flex justify-content-between">
                                <label className="" htmlFor="country">
                                  Nationality
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                              </div>
                              <select
                                name="Nationality"
                                id="status"
                                className="form-control form-control-sm"
                                value={formValue?.Nationality}
                                onChange={handleFormChange}
                              >
                                <option value="">Select</option>
                                {nationalitylist?.length > 0 &&
                                  nationalitylist.map((value, index) => {
                                    return (
                                      <option value={value.id} key={index + 1}>
                                        {value.Name}
                                      </option>
                                    );
                                  })}
                              </select>
                              {validationErrors?.Nationality && (
                                <div
                                  id="val-username1-error"
                                  className="invalid-feedback animated fadeInUp"
                                  style={{ display: "block" }}
                                >
                                  {validationErrors?.Nationality}
                                </div>
                              )}
                            </div>
                            <div className="col-md-6 col-lg-2">
                              <div className="d-flex justify-content-between">
                                <label className="" htmlFor="country">
                                  Currency
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                              </div>
                              <select
                                name="Currency"
                                id="status"
                                className="form-control form-control-sm"
                                value={formValue?.Currency}
                                onChange={handleFormChange}
                              >
                                <option value="">Select</option>
                                {currenctlist?.length > 0 &&
                                  currenctlist.map((value, index) => {
                                    return (
                                      <option value={value.id} key={index + 1}>
                                        {value.CurrencyName}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>
                            <div className="col-md-6 col-lg-2">
                              <div className="d-flex justify-content-between">
                                <label className="" htmlFor="country">
                                  Title
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                              <select
                                name="Title"
                                id="Title"
                                className="form-control form-control-sm"
                                value={formValue?.Title}
                                onChange={handleFormChange}
                              >
                                <option value="">Select</option>
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Ms">Ms</option>
                              </select>
                              {validationErrors?.Title && (
                                <div
                                  id="val-username1-error"
                                  className="invalid-feedback animated fadeInUp"
                                  style={{ display: "block" }}
                                >
                                  {validationErrors?.Title}
                                </div>
                              )}
                            </div>
                            <div className="col-md-6 col-lg-2">
                              <div className="d-flex justify-content-between">
                                <label className="" htmlFor="name">
                                  First Name
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="FirstName"
                                name="FirstName"
                                value={formValue?.FirstName || ""}
                                onChange={handleFormChange}
                                placeholder="First Name"
                              />

                              {validationErrors?.FirstName && (
                                <div
                                  id="val-username1-error"
                                  className="invalid-feedback animated fadeInUp"
                                  style={{ display: "block" }}
                                >
                                  {validationErrors?.FirstName}
                                </div>
                              )}
                            </div>
                            <div className="col-md-6 col-lg-2">
                              <div className="d-flex justify-content-between">
                                <label className="" htmlFor="name">
                                  Middle Name
                                </label>
                              </div>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="MiddleName"
                                name="MiddleName"
                                value={formValue?.MiddleName}
                                onChange={handleFormChange}
                                placeholder="Middle Name"
                              />

                              {validationErrors?.MiddleName && (
                                <div
                                  id="val-username1-error"
                                  className="invalid-feedback animated fadeInUp"
                                  style={{ display: "block" }}
                                >
                                  {validationErrors?.MiddleName}
                                </div>
                              )}
                            </div>
                            <div className="col-md-6 col-lg-2">
                              <div className="d-flex justify-content-between">
                                <label className="" htmlFor="name">
                                  Last Name
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="LastName"
                                name="LastName"
                                value={formValue?.LastName}
                                onChange={handleFormChange}
                                placeholder="Last Name"
                              />
                              {validationErrors?.LastName && (
                                <div
                                  id="val-username1-error"
                                  className="invalid-feedback animated fadeInUp"
                                  style={{ display: "block" }}
                                >
                                  {validationErrors?.LastName}
                                </div>
                              )}
                            </div>
                            <div className="col-md-6 col-lg-2">
                              <div className="d-flex justify-content-between">
                                <label className="" htmlFor="country">
                                  Gender
                                </label>
                              </div>
                              <select
                                name="Gender"
                                id="country"
                                className="form-control form-control-sm"
                                value={formValue?.Gender}
                                onChange={handleFormChange}
                              >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                              {/* {validationErrors?.Gender && (
                                                                <div
                                                                    id="val-username1-error"
                                                                    className="invalid-feedback animated fadeInUp"
                                                                    style={{ display: "block" }}
                                                                >
                                                                    {validationErrors?.Gender}
                                                                </div>
                                                            )} */}
                            </div>
                            <div className="col-md-6 col-lg-2">
                              <div className="d-flex justify-content-between">
                                <label className="" htmlFor="name">
                                  DOB
                                </label>
                              </div>
                              <DatePicker
                                className="form-control form-control-sm w-100"
                                selected={getFromDate()}
                                name="DOB"
                                onChange={(e) => handleCalender(e)}
                                dateFormat="dd-MM-yyyy"
                                isClearable todayButton="Today"
                              />
                              {/* {validationErrors?.DOB && (
                                                                <div
                                                                    id="val-username1-error"
                                                                    className="invalid-feedback animated fadeInUp"
                                                                    style={{ display: "block" }}
                                                                >
                                                                    {validationErrors?.DOB}
                                                                </div>
                                                            )} */}
                            </div>
                            <div className="col-md-6 col-lg-2">
                              <div className="d-flex justify-content-between">
                                <label className="" htmlFor="name">
                                  Anniversary Date
                                </label>
                              </div>
                              <DatePicker
                                className="form-control form-control-sm w-100"
                                selected={getNextDate()}
                                name="AnniversaryDate"
                                onChange={(e) => handleNextCalender(e)}
                                dateFormat="dd-MM-yyyy"
                                isClearable todayButton="Today"
                              />
                              {validationErrors?.AnniversaryDate && (
                                <div
                                  id="val-username1-error"
                                  className="invalid-feedback animated fadeInUp"
                                  style={{ display: "block" }}
                                >
                                  {validationErrors?.AnniversaryDate}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 mt-2">
                        <div className="border rounded position-relative  px-2  p-2">
                          <div className="d-flex justify-content-start gap-4 align-items-center position-absolute form-label-position-1 px-1 font-weight-bold">
                            <label>Contact Information</label>
                            <i
                              class="fa-solid fa-plus fs-4"
                              style={{ color: "#e23428" }}
                              onClick={increaseContactList}
                            ></i>
                          </div>
                          {contactListArray.map((contact, index) => {
                            return (
                              <div className="row mt-1">
                                <div className="col-md-6 col-lg-2">
                                  <div className="d-flex justify-content-between">
                                    <label className="" htmlFor="status">
                                      Mobile Type
                                    </label>
                                  </div>
                                  <select
                                    name="Contact_Type"
                                    id="status"
                                    className="form-control form-control-sm"
                                    value={
                                      contactFormDataArray[index]?.Contact_Type
                                    }
                                    onChange={(e) =>
                                      handleContactinfoChangeData(index, e)
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option value="Work">Work</option>
                                    <option value="Residence">Residence</option>
                                    <option value="Fax">Fax</option>
                                    <option value="Phone">Phone</option>
                                  </select>
                                </div>
                                <div className="col-md-6 col-lg-2">
                                  <div className="d-flex justify-content-between">
                                    <label className="" htmlFor="status">
                                      Mobile
                                    </label>
                                  </div>

                                  <PhoneInput
                                    defaultCountry="in"
                                    value={contactFormDataArray[index].Mobile}
                                    onChange={(phone) =>
                                      handlePhoneChange(phone, index, "Mobile")
                                    }
                                  />
                                </div>
                                <div className="col-md-6 col-lg-2">
                                  <div className="d-flex justify-content-between">
                                    <label className="" htmlFor="status">
                                      Email Type
                                    </label>
                                  </div>
                                  <select
                                    name="EmailType"
                                    id="status"
                                    className="form-control form-control-sm"
                                    value={
                                      contactFormDataArray[index].EmailType
                                    }
                                    onChange={(e) =>
                                      handleContactinfoChangeData(index, e)
                                    }
                                  >
                                    {/* <option value="">Select</option> */}
                                    <option value="Work">Work</option>
                                    <option value="Residence">Residence</option>
                                    <option value="Fax">Fax</option>
                                    <option value="Phone">Phone</option>
                                  </select>
                                </div>
                                <div className="col-md-6 col-lg-2 ">
                                  <div className="d-flex ">
                                    <label className="" htmlFor="status">
                                      Email
                                    </label>
                                    <span className="text-danger">*</span>
                                  </div>

                                  <input
                                    type="email"
                                    className="form-control form-control-sm"
                                    id="name"
                                    value={contactFormDataArray[index].Email}
                                    name="Email"
                                    onChange={(e) =>
                                      handleContactinfoChangeData(index, e)
                                    }
                                    placeholder="Email"
                                  />
                                  {validationErrors?.[
                                    `Contactinfo[${index}].Email`
                                  ] && (
                                      <div
                                        className="invalid-feedback animated fadeInUp"
                                        style={{ display: "block" }}
                                      >
                                        {
                                          validationErrors?.[
                                          `Contactinfo[${index}].Email`
                                          ]
                                        }
                                      </div>
                                    )}
                                </div>
                                {index > 0 && (
                                  <div className="col-2 d-flex align-items-center">
                                    <i
                                      className="fa-solid fa-trash text-danger pt-3  cursor-pointer fs-6"
                                      onClick={deleteContactListItem}
                                    ></i>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          <div></div>
                        </div>
                      </div>
                      <div className="col-12 mt-2">
                        <div className="border rounded position-relative  px-2 p-2">
                          <label className="mb-1 m-0 position-absolute form-label-position-1  px-1 font-weight-bold">
                            Address Information
                          </label>

                          <div className="row mt-1">
                            <div className="col-md-6 col-lg-2">
                              <label className="" htmlFor="status">
                                Country
                              </label>
                              <select
                                name="Country"
                                id="status"
                                className="form-control form-control-sm"
                                value={formValue?.Country}
                                onChange={handleFormChange}
                              >
                                <option value="">Select</option>
                                {countryList?.length > 0 &&
                                  countryList.map((value, index) => {
                                    return (
                                      <option value={value.id} key={index + 1}>
                                        {value.Name}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>
                            <div className="col-md-6 col-lg-2">
                              <label className="" htmlFor="status">
                                State
                              </label>
                              <select
                                name="State"
                                id="status"
                                className="form-control form-control-sm"
                                value={formValue?.State}
                                onChange={handleFormChange}
                              >
                                <option value="">Select</option>
                                {stateList?.length > 0 &&
                                  stateList.map((value, index) => {
                                    return (
                                      <option value={value.id} key={index + 1}>
                                        {value.Name}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>
                            <div className="col-md-6 col-lg-2">
                              <label className="" htmlFor="status">
                                City
                              </label>
                              <select
                                name="City"
                                id="status"
                                className="form-control form-control-sm"
                                value={formValue?.City}
                                onChange={handleFormChange}
                              >
                                <option value="">Select</option>
                                {cityList?.length > 0 &&
                                  cityList.map((value, index) => {
                                    // console.log(value.id,"value")
                                    // console.log(formValue?.City,"formValue")

                                    return (
                                      <option value={value.id} key={index + 1}>
                                        {value.Name}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>
                            <div className="col-md-6 col-lg-2 ">
                              <label className="" htmlFor="status">
                                Pin/Zip
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                id="name"
                                name="Pin_Zip"
                                value={formValue?.Pin_Zip}
                                onChange={handleFormChange}
                                placeholder="Pin/Zip"
                              />
                            </div>
                            <div className="col-md-12 col-lg-4 ">
                              <label className="" htmlFor="status">
                                Address
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="name"
                                name="Address"
                                value={formValue?.Address}
                                onChange={handleFormChange}
                                placeholder="Address"
                              />
                            </div>
                          </div>

                          <div></div>
                        </div>
                      </div>
                      <div className="col-12 mt-2">
                        <div className="border rounded position-relative  px-2 d-flex col-gap-2 flex-wrap p-2">
                          <div className="d-flex justify-content-start gap-4 align-items-center position-absolute form-label-position-1  px-1 font-weight-bold">
                            <label>Documentation</label>
                            <i
                              class="fa-solid fa-plus fs-4"
                              style={{ color: "#e23428" }}
                              onClick={increaseDocumentationList}
                            ></i>
                          </div>
                          {documentationListArray.map((contact, index) => {
                            return (
                              <div className="row mt-1">
                                <div className="col-md-4 col-lg-2">
                                  <label className="" htmlFor="status">
                                    Document Type
                                  </label>
                                  <select
                                    id="status"
                                    className="form-control form-control-sm"
                                    name="DocumentType"
                                    value={
                                      documentationDataArray[index].DocumentType
                                    }
                                    onChange={(e) =>
                                      handleDocumentationChangeFormData(
                                        index,
                                        e
                                      )
                                    }
                                  >
                                    <option value="">Select</option>{" "}
                                    {/* Default option */}
                                    {documenttypemasterlist?.map(
                                      (doc, index) => {
                                        return (
                                          <option
                                            value={doc.id}
                                            key={index + 1}
                                          >
                                            {doc.Name}
                                          </option>
                                        );
                                      }
                                    )}
                                    {/* <option value="1">Adhar</option>
                                                                        <option value="2">Pan</option>
                                                                        <option value="3">VISA</option>
                                                                        <option value="4">Passport</option> */}
                                  </select>
                                </div>
                                <div className="col-md-4 col-lg-2">
                                  <label className="" htmlFor="status">
                                    Required
                                  </label>

                                  <select
                                    id="status"
                                    className="form-control form-control-sm"
                                    name="DocumentRequired"
                                    value={
                                      documentationDataArray[index]
                                        .DocumentRequired
                                    }
                                    onChange={(e) =>
                                      handleDocumentationChangeFormData(
                                        index,
                                        e
                                      )
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                  </select>
                                </div>
                                <div className="col-md-4 col-lg-2">
                                  <label className="" htmlFor="status">
                                    Document No
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="name"
                                    name="DocumentNo"
                                    placeholder="Document Number"
                                    value={
                                      documentationDataArray[index].DocumentNo
                                    }
                                    onChange={(e) =>
                                      handleDocumentationChangeFormData(
                                        index,
                                        e
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-md-4 col-lg-2">
                                  <label htmlFor="status">Issue Date</label>
                                  <DatePicker
                                    className="form-control form-control-sm w-100"
                                    selected={getIssueDateDate(index)}
                                    name="IssueDate"
                                    onChange={(e) =>
                                      handleIssueDateCalender(e, index)
                                    }
                                    dateFormat="yyyy-MM-dd"
                                    isClearable todayButton="Today"
                                  />
                                </div>

                                <div className="col-md-4 col-lg-2">
                                  <label className="" htmlFor="status">
                                    Expire Date
                                  </label>
                                  <DatePicker
                                    className="form-control form-control-sm w-100"
                                    selected={getIExpiryDateDate(index)}
                                    name="ExpiryDate"
                                    onChange={(e) =>
                                      handleExpiryDateCalender(e, index)
                                    }
                                    dateFormat="yyyy-MM-dd"
                                    isClearable todayButton="Today"
                                  />
                                </div>
                                <div className="col-md-4 col-lg-2">
                                  <label className="" htmlFor="status">
                                    Issue Country
                                  </label>
                                  <select
                                    id="status"
                                    className="form-control form-control-sm"
                                    name="IssueCountry"
                                    value={
                                      documentationDataArray[index].IssueCountry
                                    }
                                    onChange={(e) =>
                                      handleDocumentationChangeFormData(
                                        index,
                                        e
                                      )
                                    }
                                  >
                                    <option value="">Select</option>
                                    {countryList?.length > 0 &&
                                      countryList.map((value, index) => {
                                        return (
                                          <option
                                            value={value.id}
                                            key={index + 1}
                                          >
                                            {value.Name}
                                          </option>
                                        );
                                      })}
                                  </select>
                                </div>
                                <div className="col-md-4 col-lg-2">
                                  <label className="" htmlFor="status">
                                    Document Title
                                  </label>
                                  <select
                                    id="status"
                                    className="form-control form-control-sm"
                                    name="DocumentTitle"
                                    value={
                                      documentationDataArray[index]
                                        .DocumentTitle
                                    }
                                    onChange={(e) =>
                                      handleDocumentationChangeFormData(
                                        index,
                                        e
                                      )
                                    }
                                  >
                                    <option value="Both">Both</option>
                                    <option value="Front">Front</option>
                                    <option value="Back">Back</option>
                                  </select>
                                </div>
                                <div className="col-md-4 col-lg-2">
                                  <label className="" htmlFor="val-username">
                                    Document File
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control form-control-sm"
                                    id="val-username"
                                    name="ImageData"
                                    value={documentationDataArray?.ImageData}
                                    accept=".pdf, .doc, .docx"
                                    onChange={(e) =>
                                      handleDocumentationChangeFormData(
                                        index,
                                        e
                                      )
                                    }
                                  />
                                </div>

                                {location?.state?.Documentation &&
                                  location.state.Documentation.map(
                                    (img, index) => {
                                      const image = img.UploadDocument;
                                      // console.log(image, "111111");

                                      return image ? (
                                        <img
                                          key={index}
                                          src={image}
                                          alt=""
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                            padding: "10px",
                                          }}
                                        />
                                      ) : null;
                                    }
                                  )}

                                {/* {console.log(location?.state?.Documentation?.map((img)=>{
                                                                    return (
                                                                        img.UploadDocument

                                                                    )

                                                                }),"ImageData")} */}
                                {index > 0 && (
                                  <div className="col-2 d-flex align-items-center">
                                    <i
                                      className="fa-solid fa-trash text-danger pt-3  cursor-pointer fs-6"
                                      onClick={deleteDocumentationListArray}
                                    ></i>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          <div></div>
                        </div>
                      </div>
                      <div className="col-12 mt-2">
                        <div className="border rounded position-relative  px-2 d-flex col-gap-2 flex-wrap p-2">
                          <label className="mb-1 m-0 position-absolute form-label-position-1  px-1 font-weight-bold">
                            Social Media
                          </label>

                          <div className="row mt-1">
                            <div className="col-md-6 col-lg-2">
                              <label className="" htmlFor="status">
                                Facebook Profile
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="name"
                                name="Facebook"
                                placeholder="Facebook"
                                value={formValue?.Facebook}
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-6 col-lg-2">
                              <label className="" htmlFor="status">
                                Twitter Profile
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="name"
                                name="Twitter"
                                placeholder="Twitter"
                                value={formValue?.Twitter}
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-6 col-lg-2">
                              <label className="" htmlFor="status">
                                LinkedIn Profile
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="name"
                                name="LinkedIn"
                                value={formValue?.LinkedIn}
                                onChange={handleFormChange}
                                placeholder="LinkedIn"
                              />
                            </div>
                            <div className="col-md-6 col-lg-2">
                              <label className="" htmlFor="status">
                                Instagram Profile
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="name"
                                name="Instagram"
                                value={formValue?.Instagram}
                                onChange={handleFormChange}
                                placeholder="Instagram"
                              />
                            </div>
                            <div className="col-md-6 col-lg-2">
                              <label className="" htmlFor="status">
                                Skype Id
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="name"
                                name="Skype"
                                value={formValue?.Skype}
                                onChange={handleFormChange}
                                placeholder="Skype"
                              />
                            </div>

                            <div className="col-md-6 col-lg-2">
                              <label className="" htmlFor="status">
                                MSN Id
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="name"
                                name="MSN_Id"
                                value={formValue?.MSN_Id}
                                onChange={handleFormChange}
                                placeholder="MSN"
                              />
                            </div>
                          </div>

                          <div></div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="bg-primary text-white mt-2 d-flex gap-2">
                          <label className="font-size-12">
                            Add More Information
                          </label>
                          {addMoreInfo ? (
                            <i
                              className="fa-solid fa-caret-down fs-6 pl-1 cursor-pointer"
                              onClick={() => setAddMoreInfo(!addMoreInfo)}
                            ></i>
                          ) : (
                            <i
                              className="fa-solid fa-caret-up fs-6 pl-1 cursor-pointer"
                              onClick={() => setAddMoreInfo(!addMoreInfo)}
                            ></i>
                          )}
                        </div>
                        {addMoreInfo && (
                          <div>
                            <div className="row mt-1">
                              <div className="col-md-6 col-lg-2">
                                <label className="" htmlFor="status">
                                  Sales Person
                                </label>
                                <select
                                  name="SalesPerson"
                                  id="SalesPerson"
                                  className="form-control form-control-sm"
                                  value={formValue?.SalesPerson}
                                  onChange={handleFormChange}
                                >
                                  <option value="">Select</option>
                                  {salesList?.map((sales, index) => {
                                    return (
                                      <option value={sales.Id} key={index}>
                                        {sales.Name}
                                      </option>
                                    );
                                  })}

                                  {/* {countryList?.length > 0 && countryList.map((value, index) => {
                                                                        return (
                                                                            <option value={value.id} key={index + 1}>
                                                                                {value.Name}
                                                                            </option>
                                                                        );
                                                                    })} */}
                                </select>
                              </div>
                              <div className="col-md-6 col-lg-2">
                                <label className="" htmlFor="status">
                                  Status
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                                <select
                                  name="Status"
                                  id="status"
                                  className="form-control form-control-sm"
                                  value={formValue?.Status}
                                  onChange={handleFormChange}
                                >
                                  <option value="1">Active</option>
                                  <option value="0">Inactive</option>
                                </select>
                                {validationErrors?.Destination && (
                                  <div
                                    id="val-username1-error"
                                    className="invalid-feedback animated fadeInUp"
                                    style={{ display: "block" }}
                                  >
                                    {validationErrors?.Destination}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="row mt-2 border rounded position-relative  px-2 d-flex col-gap-2 flex-wrap p-2">
                              <label className="mb-1 m-0 position-absolute form-label-position-1  px-1 font-weight-bold w-25 mt-1">
                                Family Information
                              </label>
                              <div className="col-md-6 col-lg-2">
                                <label className="" htmlFor="status">
                                  Family Code
                                </label>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  id="val-username"
                                  name="FamilyCode"
                                  value={formValue?.FamilyCode}
                                  placeholder="Family Code"
                                  onChange={handleFormChange}
                                />
                              </div>
                              <div className="col-md-6 col-lg-2">
                                <label className="" htmlFor="status">
                                  Family Relation
                                </label>
                                <select
                                  name="FamilyRelation"
                                  id="FamilyRelation"
                                  className="form-control form-control-sm"
                                  value={formValue?.FamilyRelation}
                                  onChange={handleFormChange}
                                >
                                  <option value="">Select</option>
                                  {familyList?.map((family, index) => {
                                    return (
                                      <option value={family.id} key={index + 1}>
                                        {family.Name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                            <div className="row mt-2 border rounded position-relative  px-2  p-2">
                              <label className="mb-1 m-0 position-absolute form-label-position-1  px-1 font-weight-bold w-25 mt-1">
                                Preference
                              </label>

                              <div className="col-md-6 col-lg-2">
                                <label className="" htmlFor="status">
                                  Meal Preference
                                </label>
                                <select
                                  name="MealPreference"
                                  id="status"
                                  className="form-control form-control-sm"
                                  value={formValue?.MealPreference}
                                  onChange={handleFormChange}
                                >
                                  <option value="">Select</option>
                                  {mealList?.map((meal, index) => {
                                    return (
                                      <option value={meal.id} key={index + 1}>
                                        {meal.Name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                              <div className="col-md-6 col-lg-2">
                                <label className="" htmlFor="status">
                                  Special Assistence
                                </label>
                                <select
                                  name="SpecialAssisteance"
                                  id="status"
                                  className="form-control form-control-sm"
                                  value={formValue?.SpecialAssisteance}
                                  onChange={handleFormChange}
                                >
                                  <option value="">Select</option>
                                  {specialassistanc?.map((special, index) => {
                                    return (
                                      <option
                                        value={special.id}
                                        key={index + 1}
                                      >
                                        {special.Name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                              <div className="col-md-6 col-lg-2">
                                <label className="" htmlFor="status">
                                  Seat Preference
                                </label>
                                <select
                                  name="SeatPreference"
                                  id="SeatPreference"
                                  className="form-control form-control-sm"
                                  value={formValue?.SeatPreference}
                                  onChange={handleFormChange}
                                >
                                  <option value="">Select</option>
                                  {seatList?.map((seat, index) => {
                                    return (
                                      <option value={seat.id} key={index + 1}>
                                        {seat.Name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                              <div className="col-md-6 col-lg-2">
                                <label className="" htmlFor="status">
                                  Accomodation Pref
                                </label>
                                <select
                                  name="AccomodationPreference"
                                  id="status"
                                  className="form-control form-control-sm"
                                  value={formValue?.AccomodationPreference}
                                  onChange={handleFormChange}
                                >
                                  <option value="">Select</option>
                                  {accomodationpreferenceList?.map(
                                    (accompre, index) => {
                                      return (
                                        <option
                                          value={accompre.id}
                                          key={index + 1}
                                        >
                                          {accompre.Name}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                            </div>
                            <div className="row mt-2 border rounded position-relative  px-2  p-2">
                              <label className="mb-1 m-0 position-absolute form-label-position-1  px-1 font-weight-bold w-25 mt-1">
                                Others
                              </label>

                              <div className="col-md-6 col-lg-2">
                                <label className="" htmlFor="MarketType">
                                  Market Type
                                </label>
                                <select
                                  name="MarketType"
                                  id="MarketType"
                                  className="form-control form-control-sm"
                                  value={formValue?.MarketType}
                                  onChange={handleFormChange}
                                >
                                  <option value="">Select</option>
                                  {/* <option value="1">General</option> */}
                                  {markettypemasterlist?.map(
                                    (market, index) => {
                                      return (
                                        <option
                                          value={market.id}
                                          key={index + 1}
                                        >
                                          {market.Name}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                              <div className="col-md-6 col-lg-2">
                                <label className="" htmlFor="status">
                                  Holiday Preference
                                </label>
                                <HolidayInput />
                              </div>
                              <div className="col-md-6 col-lg-2">
                                <label className="" htmlFor="status">
                                  Covid Vaccinated
                                </label>
                                <select
                                  name="CovidVaccinated"
                                  id="status"
                                  className="form-control form-control-sm"
                                  value={formValue?.CovidVaccinated}
                                  onChange={handleFormChange}
                                >
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                              <div className="col-md-6 col-lg-2">
                                <label className="" htmlFor="status">
                                  Relation
                                </label>
                                <select
                                  name="NewsLetter"
                                  id="status"
                                  className="form-control form-control-sm"
                                  value={formValue?.NewsLetter}
                                  onChange={handleFormChange}
                                >
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                            </div>
                            <div></div>
                          </div>
                        )}
                      </div>

                      {/* <div className="col-md-6 col-lg-3">
                                                <label>
                                                    Local Agent
                                                </label>
                                                <div className="d-flex gap-3">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="LocalAgent"
                                                            value="Yes"
                                                            id="default_yes"
                                                            checked={formValue?.LocalAgent == "Yes"}
                                                            onChange={handleFormChange}
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="default_yes"
                                                        >
                                                            Yes
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="LocalAgent"
                                                            value="No"
                                                            id="default_no"
                                                            checked={formValue?.LocalAgent == "No"}
                                                            onChange={handleFormChange}
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="default_no"
                                                        >
                                                            No
                                                        </label>
                                                    </div>
                                                </div>
                                            </div> */}

                      {/* <div className="col-md-12 col-lg-4">
                                                <p> Remarks 1</p>


                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    value={formValue?.Remark1 || ""}
                                                    name="Remark1"
                                                    onChange={(event,editor) => {
                                                        const data = editor.getData();
                                                        handleRemarks(data,"Remark1")

                                                    }}

                                                />
                                            </div>
                                            <div className="col-md-12 col-lg-4">
                                                <p>Remarks 2</p>


                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    value={formValue?.Remark2 || ""}
                                                    name="Remark2"
                                                    onChange={(event,editor) => {
                                                        const data = editor.getData();
                                                        handleRemarks(data,"Remark2")

                                                    }}

                                                />
                                            </div>
                                            <div className="col-md-12 col-lg-4">
                                                <p>Remarks 3</p>


                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    value={formValue?.Remark3 || ""}
                                                    name="Remark3"
                                                    onChange={(event,editor) => {
                                                        const data = editor.getData();
                                                        handleRemarks(data,"Remark3")

                                                    }}

                                                />
                                            </div> */}
                      <div className="col-md-12 col-lg-4">
                        <label htmlFor="remark1">Remarks 1</label>
                        <textarea
                          className="form-control"
                          name="Remark1"
                          value={formValue?.Remark1 || ""}
                          onChange={handleFormChange}
                          rows="6"
                        ></textarea>
                      </div>

                      <div className="col-md-12 col-lg-4">
                        <label htmlFor="remark2">Remarks 2</label>
                        <textarea
                          className="form-control"
                          name="Remark2"
                          value={formValue?.Remark2 || ""}
                          onChange={handleFormChange}
                          rows="6"
                        ></textarea>
                      </div>

                      <div className="col-md-12 col-lg-4">
                        <label htmlFor="remark3">Remarks 3</label>
                        <textarea
                          className="form-control"
                          name="Remark3"
                          value={formValue?.Remark3 || ""}
                          onChange={handleFormChange}
                          rows="6"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="row pb-1">
            <div className="col-12 d-flex gap-3 justify-content-end">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary btn-custom-size"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClient;
