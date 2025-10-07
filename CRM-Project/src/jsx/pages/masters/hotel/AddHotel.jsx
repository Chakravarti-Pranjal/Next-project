import React, { useState, useEffect } from "react";
import {
  hotelAddValidationSchema,
  hotelAddContactArraySchema,
} from "../master_validation";
import {
  hotelAddInitialValue,
  hotelAddContactInitialValue,
  supplierAddInitialValue,
  addContactInitialValue,
} from "../masters_initial_value";
import { useLocation, useNavigate } from "react-router-dom";
import useMultipleSelect from "../../../../hooks/custom_hooks/useMultipleSelect";
import { axiosOther } from "../../../../http/axios_base_url";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  notifyError,
  notifyHotError,
  notifyHotSuccess,
} from "../../../../helper/notify";
import useImageContainer from "../../../../helper/useImageContainer";

const AddHotel = () => {
  const [formValue, setFormValue] = useState({
    ...hotelAddInitialValue,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [destinationList, setDestinationList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [hotelChainList, setHotelChainList] = useState([]);
  const [hotelCategoryList, setHotelCategoryList] = useState([]);
    const [supplierList, setSupplierList] = useState([]);
  const [hotelTypeList, setHotelTypeList] = useState([]);
  const [roomTypeList, setRoomTypeList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [weekendList, setWeekendList] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [errorFileMessage, setErrorFileMessage] = useState("");
  const [contactFormValue, setContactFormValue] = useState([
    { ...hotelAddContactInitialValue, Division: "21" },
    { ...hotelAddContactInitialValue, Division: "22" },
  ]);
  const [roomTypeQuantities, setRoomTypeQuantities] = useState({}); // Store room type quantities
  const [editorData, setEditorData] = useState("");
  const [showEmailInfo, setShowEmailInfo] = useState(false);
  const [TrackDefaultValue, setTrackDefaultValue] = useState(0);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [companydata, setcompanydata] = useState(null);
  // console.log(companydata, "companydata")
  console.log(formValue, "formvalue")

  const { ImageContainer, multiFiles, setMultiFiles, handleFilesChange } =
    useImageContainer();

  // Fetch dropdown data
  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist", {
        CountryId: "",
        StateId: "",
        Name: "",
        Default: "",
        Status: "",
      });
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("divisionlist");
      setDivisionList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("hotelchainlist", {
        Search: "",
        Status: "",
      });
      setHotelChainList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("hotelcategorylist", {
        Search: "",
        Status: "",
      });
      setHotelCategoryList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("hoteltypelist", {
        Search: "",
        Status: "",
      });
      setHotelTypeList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("roomtypelist", {
        Search: "",
        Status: "",
      });
      setRoomTypeList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("countrylist", {
        Search: "",
        Status: "",
      });
      setCountryList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("weekendlist", {
        Search: "",
        Status: "",
      });
      setWeekendList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("amenitieslist");
      setAmenitiesList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    postDataToServer();
    setFormValue({
      ...formValue,
      HotelType: "9",
    });
  }, []);
  const getSupplierselect = async ()=>{
    if (!state?.HotelName || !state?.HotelDestination?.DestinationId) return
      try {
          console.log(state,state?.Name,state?.destinationId,"state?.destinationId");
          
          const { data } = await axiosOther.post("supplierlistforselect", {
            Name: state?.HotelName,
            id: "",
            SupplierService: [12],
            DestinationId: [state?.HotelDestination?.DestinationId],
          });
          console.log(data, "supplierlist");
    
          if (data?.DataList?.length > 0) {

            setSupplierList(data.DataList?.[0]);
            console.log(data.DataList?.[0]?.id, "supplierList");
            
    
            const matchingSupplier = data?.DataList?.find(
              (supplier) =>
                supplier.Name.trim().toLowerCase() ===
                state?.Name?.trim().toLowerCase()
            );
    
            // setFormValue((prev) => ({
            //   ...prev,
            //   SupplierId: matchingSupplier
            //     ? matchingSupplier.id
            //     : data?.DataList[0]?.id,
            // }));
          }
        } catch (err) {
          console.log(err);
        }

  }
  useEffect(()=>{
getSupplierselect();
  },[state?.HotelName,state?.HotelDestination?.DestinationId])
  useEffect(() => {
    const tokenString = localStorage.getItem("token");

    try {
      const token = JSON.parse(tokenString);
      // console.log(token, "TokenData");
      setcompanydata(token?.companyKey);
      // setUserId(token?.UserID)
    } catch (e) {
      console.error("Invalid token in localStorage:", e);
    }
  }, []);

  useEffect(() => {
    const dependentStateAndCity = async () => {
      if (formValue?.HotelCountry) {
        try {
          const { data } = await axiosOther.post("listStateByCountry", {
            countryid: formValue?.HotelCountry,
          });
          setCityList([]);
          setStateList(data.DataList);
        } catch (err) {
          console.log(err);
        }
      }
      if (formValue?.HotelCountry && formValue?.HotelState) {
        try {
          const { data } = await axiosOther.post(
            "listCityByStateandCountryName",
            {
              stateid: formValue?.HotelState,
            }
          );
          setCityList(data.DataList);
        } catch (err) {
          console.log(err);
        }
      }
    };
    dependentStateAndCity();
  }, [formValue?.HotelState, formValue?.HotelCountry]);

  // Multi select options
  const amenitiesOption = amenitiesList?.map((item) => ({
    value: item?.id,
    label: item?.Name,
  }));
  const roomTypeOption = roomTypeList?.map((item) => ({
    value: item?.id,
    label: item?.Name,
  }));

  // Multi select inputs
  const {
    SelectInput: AmenitiesInput,
    selectedData: amenitiesData,
    setSelectedData: setAmenitiesData,
  } = useMultipleSelect(amenitiesOption);

  const {
    SelectInput: RoomTypeInput,
    selectedData: roomTypeData,
    setSelectedData: setRoomTypeData,
  } = useMultipleSelect(roomTypeOption);

  // Handle room type quantity change
  const handleRoomTypeQuantityChange = (roomTypeId, value) => {
    setRoomTypeQuantities((prev) => ({
      ...prev,
      [roomTypeId]: value >= 0 ? value : "",
    }));
  };

  useEffect(() => {
    if (TrackDefaultValue >= 1 && formValue.Default === "Yes") {
      const response = window.confirm("Do you want to change the default?");
      if (response) {
        setFormValue((prevFormValue) => ({
          ...prevFormValue,
          Default: formValue.Default,
        }));
      }
    }
  }, [formValue.HotelCategory, formValue.Destination, formValue.Default]);

  // Submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare room type data with quantities
      const roomTypeDataWithQuantities = roomTypeData.map((id) => ({
        RoomTypeId: id.toString(),
        RoomTypeName: roomTypeList.find((rt) => rt.id === id)?.Name || "",
        NoOfRoom: roomTypeQuantities[id] || "0",
      }));

      await hotelAddValidationSchema.validate(
        {
          ...formValue,
          HotelRoomType: roomTypeDataWithQuantities,
          HotelAmenities: amenitiesData,
          contacts: contactFormValue,
        },
        { abortEarly: false }
      );

      await hotelAddContactArraySchema.validate(contactFormValue, {
        abortEarly: false,
      });

      setValidationErrors({});
      const stringAmenities = amenitiesData.map(String);
      // const hotel = {
      //   ...formValue,
      //   HotelRoomType: roomTypeDataWithQuantities,
      //   HotelAmenities: stringAmenities,
      //   contacts: contactFormValue,
      //   HotelInfo: editorData,
      // }
      // console.log(hotel, "HotelData")
      // const stringAmenities = amenitiesData.map(String);
      const { data } = await axiosOther.post("addupdatehotel", {
        ...formValue,
        HotelRoomType: roomTypeDataWithQuantities,
        HotelAmenities: stringAmenities,
        contacts: contactFormValue,
        HotelInfo: editorData,
        CompanyId: companydata
      });

      if (data?.Status == 1) {
        try {
          const supplResp = await axiosOther.post("addupdatesupplier", {
            ...supplierAddInitialValue,
            id:supplierList?.id || "",
          
            Destination: [formValue?.Destination],
            DefaultDestination: [formValue?.Destination],
            Name: formValue?.HotelName,
            AliasName: formValue?.HotelName,
            SupplierService: [12],
          });
          if (supplResp?.data?.Status == 1) {
            try {
              const contResp = await axiosOther.post("addupdatecontact", {
                ...addContactInitialValue,
                ParentId: supplResp?.data?.SupplireId || "",
                FirstName: contactFormValue[0]?.FirstName || "",
                LastName: contactFormValue[0]?.LastName || "",
                Designation: contactFormValue[0]?.Designation || "",
                MobileNo: contactFormValue[0]?.Phone1 || "",
                Phone: contactFormValue[0]?.Phone1 || "",
                Email: contactFormValue[0]?.Email || "",
                Title: contactFormValue[0]?.Title || "",
                CountryCode: "IN",
                OfficeName: "1",
              });
            } catch (error) {
              console.log("contact-error", error);
            }
          }
        } catch (error) {
          console.log("supplier-error", error);
        }
        notifyHotSuccess(data?.Message || data?.message);
        navigate("/hotel");
      } else {
        notifyHotError(data?.message || data?.Message);
      }
    } catch (error) {
      if (error.inner) {
        const validationErrorss = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrorss);
      }

      if (error.response?.data?.Errors) {
        const data = Object.entries(error.response?.data?.Errors);
        notifyHotError(data[0][1]);
      }
    }
  };
  // Handling form changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "Default") {
      setTrackDefaultValue((prev) => prev + 1);
    }

    if (files) {
      const file = files[0];
      const fileType = file.type;
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/gif",
      ];
      if (allowedTypes.includes(fileType)) {
        setErrorFileMessage("");
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result;
          setFormValue({
            ...formValue,
            ImageData: base64String,
            ImageName: file.name,
          });
        };
        reader.readAsDataURL(file);
      } else {
        setErrorFileMessage(
          "Invalid file type. Please upload a PDF, DOC, or image."
        );
        e.target.value = "";
      }
    } else {
      setFormValue({ ...formValue, [name]: value });
    }

    if (name === "HotelCountry" && value === "") {
      setStateList([]);
      setCityList([]);
    }
    if (name === "HotelState" && value === "") {
      setCityList([]);
    }
    if (name === "HotelCountry") {
      setFormValue({
        ...formValue,
        HotelState: "",
        HotelCity: "",
        HotelCountry: value,
      });
    }
  };
  // Handle contact change
  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    setContactFormValue((prevArr) => {
      const newArray = [...prevArr];
      newArray[index] = { ...newArray[index], [name]: value };
      return newArray;
    });
  };
  // Handle contact increment
  const handleContactIncrement = () => {
    setContactFormValue([...contactFormValue, hotelAddContactInitialValue]);
  };
  // Handle contact delete
  const handleContactDelete = (index) => {
    const filteredContact = contactFormValue.filter((i, ind) => ind !== index);
    setContactFormValue(filteredContact);
  };
  // Populate form data when editing
  useEffect(() => {
    if (state) {
      const roomTypeQuantitiesFromState = {};
      state?.HotelBasicDetails?.HotelRoomType?.forEach((item) => {
        roomTypeQuantitiesFromState[item.RoomTypeId] = item.NoOfRoom || "0";
      });
      setFormValue({
        id: state?.id,
        HotelName: state?.HotelName,
        SelfSupplier: state?.SelfSupplier == "Yes" ? 1 : 0,
        HotelCountry: state?.HotelCountry?.CountryId,
        HotelCity: state?.HotelCity?.Cityid,
        Destination: state?.HotelDestination?.DestinationId,
        AddedBy: state?.AddedBy,
        UpdatedBy: 1,
        HotelPinCode: state?.HotelBasicDetails?.HotelPinCode,
        HotelAddress: state?.HotelBasicDetails?.HotelAddress,
        HotelGSTN: state?.HotelBasicDetails?.HotelGSTN,
        HotelType: state?.HotelBasicDetails?.HotelType?.TypeId,
        HotelCategory: state?.HotelBasicDetails?.HotelCategory?.CategoryId,
        HotelLink: state?.HotelBasicDetails?.HotelLink,
        HotelPolicy: state?.HotelBasicDetails?.HotelPolicy,
        HotelTC: state?.HotelBasicDetails?.HotelTC,
        HotelState: state?.HotelBasicDetails?.HotelState?.StateId,
        HotelWeekend: state?.HotelBasicDetails?.HotelWeekend?.WeekendId,
        HotelChain: state?.HotelBasicDetails?.HotelChain?.ChainId,
        Days: state?.HotelBasicDetails?.Days,
        CheckInTime: state?.HotelBasicDetails?.CheckInTime,
        CheckOutTime: state?.HotelBasicDetails?.CheckOutTime,
        PaymentType: state?.HotelBasicDetails?.PaymentType?.trim()
          ? state?.HotelBasicDetails?.PaymentType
          : "Cash",

        Status: state?.Status,
        Verified: state?.HotelBasicDetails?.Verified,
        InternalNote: state?.HotelBasicDetails?.InternalNote,
        ImageName: state?.HotelBasicDetails?.ImageName,
        ImageData: "",
        Default: state?.Default,
        cutofdayGIT: state?.cutofdayGIT,
        cutofdayFIT: state?.cutofdayFIT,
        TotalNoOfRoom: state?.TotalNoOfRoom,
        TwinRoom: state?.TwinRoom,
        CompanyId: state?.CompanyId,
      });
      const amenitiesId = state?.HotelBasicDetails?.HotelAmenities?.map((item) => Number(item.id));
      // console.log(amenitiesId, "Sagar")
      const roomTypeId = state?.HotelBasicDetails?.HotelRoomType?.map((item) => Number(item.RoomTypeId));
      // console.log(roomTypeId, "Sagar")
      setAmenitiesData(amenitiesId);
      setRoomTypeData(roomTypeId);
      setRoomTypeQuantities(roomTypeQuantitiesFromState);
      setEditorData(state?.HotelInfo || "");

      if (Array.isArray(state?.HotelContactDetails) && state.HotelContactDetails.length > 0) {
        setContactFormValue(
          state?.HotelContactDetails
            ?.map((item) => ({
              Division: item?.Division,
              Title: item?.Title,
              FirstName: item?.FirstName,
              LastName: item?.LastName,
              Designation: item?.Designation,
              CountryCode: item?.CountryCode,
              Phone1: item?.Phone1,
              Phone2: item?.Phone2,
              Phone3: item?.Phone3,
              Email: item?.Email,
              SecondaryEmail: item?.SecondaryEmail || "",
            }))
        );
      }
    }
  }, [state]);

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };

  const handleCopyChange = (e) => {
    const { checked } = e.target;

    if (checked) {
      const firstCont = contactFormValue[0];
      setContactFormValue((prevCont) => {
        let newCont = [...prevCont];
        newCont[1] = { ...firstCont, Division: "22" };
        return newCont;
      });
    } else {
      setContactFormValue((prevCont) => {
        let newCont = [...prevCont];
        newCont[1] = { ...hotelAddContactInitialValue, Division: "22" };
        return newCont;
      });
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Add Hotel</h4>
            <div className="d-flex gap-3">
              <button
                className="btn btn-dark btn-custom-size"
                onClick={() =>
                  navigate("/hotel", {
                    state: {
                      selectedDestination: state?.selectedDestination,
                      selecthotelname: state?.selecthotelname,
                    },
                  })
                }
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
              <ToastContainer />
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
                <div className="row form-row-gap">
                  <div className="col-md-6 col-lg-2">
                    <label className="m-0">Hotel Chain</label>
                    <select
                      className="form-control form-control-sm"
                      name="HotelChain"
                      value={formValue?.HotelChain}
                      onChange={handleInputChange}
                    >
                      <option value={""}>Select</option>
                      {hotelChainList?.map((item, ind) => (
                        <option value={item?.Id} key={ind + 1}>
                          {item?.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-2">
                    <label className="m-0">
                      Hotel Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Hotel Name"
                      className="form-control form-control-sm"
                      name="HotelName"
                      value={formValue?.HotelName}
                      onChange={handleInputChange}
                    />
                    {validationErrors?.HotelName && (
                      <div
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.HotelName}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-lg-2">
                    <label className="m-0">
                      Destination <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control form-control-sm"
                      name="Destination"
                      value={formValue?.Destination}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {destinationList?.map((value, ind) => (
                        <option value={value?.id} key={ind + 1}>
                          {value.Name}
                        </option>
                      ))}
                    </select>
                    {validationErrors?.Destination && (
                      <div
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.Destination}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-lg-2">
                    <label className="m-0">Hotel Category</label>
                    <select
                      className="form-control form-control-sm"
                      name="HotelCategory"
                      value={formValue?.HotelCategory}
                      onChange={handleInputChange}
                    >
                      <option value={""}>Select</option>
                      {hotelCategoryList.map((value, ind) => (
                        <option value={value?.id} key={ind + 1}>
                          {value.UploadKeyword}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-2">
                    <label className="m-0">Hotel Type</label>
                    <select
                      className="form-control form-control-sm"
                      name="HotelType"
                      value={formValue?.HotelType}
                      onChange={handleInputChange}
                    >
                      <option value={""}>Select</option>
                      {hotelTypeList.map((value, ind) => (
                        <option value={value?.id} key={ind + 1}>
                          {value.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-2">
                    <label className="m-0">Hotel Link</label>
                    <input
                      type="text"
                      placeholder="Link"
                      className="form-control form-control-sm"
                      name="HotelLink"
                      value={formValue?.HotelLink}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-2">
                    <label className="m-0">Self Supplier</label>
                    <select
                      className="form-control form-control-sm"
                      name="SelfSupplier"
                      value={formValue?.SelfSupplier}
                      onChange={handleInputChange}
                    >
                      <option value={"1"}>Yes</option>
                      <option value={"0"}>No</option>
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-2">
                    <label className="m-0">
                      Country <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control form-control-sm"
                      name="HotelCountry"
                      value={formValue?.HotelCountry}
                      onChange={handleInputChange}
                    >
                      <option value={""}>Select</option>
                      {countryList?.map((item, ind) => (
                        <option value={item?.id} key={ind + 1}>
                          {item?.Name}
                        </option>
                      ))}
                    </select>
                    {validationErrors?.HotelCountry && (
                      <div
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.HotelCountry}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-lg-2">
                    <label className="m-0">State</label>
                    <select
                      className="form-control form-control-sm"
                      name="HotelState"
                      value={formValue?.HotelState}
                      onChange={handleInputChange}
                    >
                      <option value={""}>Select</option>
                      {stateList?.map((item, ind) => (
                        <option value={item?.id} key={ind + 1}>
                          {item?.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-2">
                    <label className="m-0">City</label>
                    <select
                      className="form-control form-control-sm"
                      name="HotelCity"
                      value={formValue?.HotelCity}
                      onChange={handleInputChange}
                    >
                      <option value={""}>Select</option>
                      {cityList?.map((item, ind) => (
                        <option value={item?.id} key={ind + 1}>
                          {item?.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-2">
                    <label className="m-0">Pin Code</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="201301"
                      name="HotelPinCode"
                      value={formValue?.HotelPinCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-2">
                    <label className="m-0">GSTN</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="GSTN"
                      name="HotelGSTN"
                      value={formValue?.HotelGSTN}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label className="m-0">Room Type</label>
                    <RoomTypeInput />
                  </div>
                  <div className="col-sm-4">
                    <label className="m-0">Hotel Amenities</label>
                    <AmenitiesInput />
                  </div>
                  {/* Total Rooms and Twin Rooms */}
                  <div className="col-md-6 col-lg-2">
                    <label className="m-0">Total Rooms</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      name="TotalNoOfRoom"
                      value={formValue?.TotalNoOfRoom}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="Enter total rooms"
                    />
                  </div>
                  <div className="col-md-6 col-lg-2">
                    <label className="m-0">Twin Rooms</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      name="TwinRoom"
                      value={formValue?.TwinRoom}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="Enter twin rooms"
                    />
                  </div>
                  {/* Room Type Table */}
                  {roomTypeData.length > 0 && (<div className="row">
                    <div className="col-4">
                      <div className="col-12">
                        <table className="table table-bordered itinerary-table m-0">
                          <thead>
                            <tr>
                              <th>Room Type</th>
                              <th>Number of Rooms</th>
                            </tr>
                          </thead>
                          <tbody>
                            {roomTypeData.map((roomTypeId) => {
                              const roomType = roomTypeList.find((rt) => rt.id === roomTypeId);
                              return (
                                <tr key={roomTypeId}>
                                  <td>{roomType?.Name || "Unknown"}</td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control form-control-sm w-75 mx-auto"
                                      value={roomTypeQuantities[roomTypeId] || ""}
                                      onChange={(e) =>
                                        handleRoomTypeQuantityChange(
                                          roomTypeId,
                                          e.target.value
                                        )
                                      }
                                      min="0"
                                      placeholder="Enter number of rooms"
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  )}
                  <div className="row">
                    <div className="col-6">
                      <div className="row">
                        <div className="col-md-12">
                          <label className="m-0">Address</label>
                          <textarea
                            className="form-control form-control-sm"
                            placeholder="Address"
                            name="HotelAddress"
                            value={formValue?.HotelAddress}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="row">
                        <div className="col-md-12 col-lg-6">
                          <label className="m-0">
                            Hotel Status <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-control form-control-sm"
                            name="Status"
                            value={formValue?.Status}
                            onChange={handleInputChange}
                          >
                            <option value={"Active"}>Active</option>
                            <option value={"Inactive"}>Inactive</option>
                          </select>
                          {validationErrors?.Status && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Status}
                            </div>
                          )}
                        </div>
                        <div className="col-md-12 col-lg-6">
                          <label className="m-0">Check In Time</label>
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            name="CheckInTime"
                            value={formValue?.CheckInTime}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-12 col-lg-6">
                          <label className="m-0">Check Out Time</label>
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            name="CheckOutTime"
                            value={formValue?.CheckOutTime}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-12 col-lg-6">
                          <label className="m-0">
                            Pay <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-control form-control-sm"
                            name="PaymentType"
                            value={formValue?.PaymentType}
                            onChange={handleInputChange}
                          >
                            <option value="Cash">Advance</option>
                            <option value="Credit">Credit</option>
                          </select>
                        </div>
                        <div className="col-md-12 col-lg-6">
                          <label className="m-0">Cut Off Day FIT</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            name="cutofdayFIT"
                            value={formValue?.cutofdayFIT}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-12 col-lg-6">
                          <label className="m-0">Cut Off Day GIT</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            name="cutofdayGIT"
                            value={formValue?.cutofdayGIT}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label>
                      Set Default <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="Default"
                          value="Yes"
                          id="default_yes"
                          checked={formValue?.Default === "Yes"}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="default_yes">
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="Default"
                          value="No"
                          id="default_no"
                          checked={formValue?.Default === "No"}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="default_no">
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mt-2">
                    <div className="d-flex gap-3 mt-1">
                      <p className="font-weight-bold m-0 p-1">Contact Person</p>
                      <button
                        className="cursor-pointer btn btn-secondary btn-custom-size"
                        onClick={handleContactIncrement}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row mt-4 form-row-gap">
                  <div className="col-12">
                    <span>Contact Information</span>
                  </div>
                  <div className="col-12">
                    {contactFormValue?.map((form, index) => (
                      <div
                        className={`row form-row-gap ${index > 0 && "mt-3"}`}
                        key={index}
                      >
                        <div className="col-12">
                          <div className="custom-bottom-border"></div>
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label className="m-0">Division</label>
                          <select
                            className="form-control form-control-sm"
                            name="Division"
                            value={contactFormValue[index]?.Division || ""}
                            onChange={(e) => handleContactChange(index, e)}
                          >
                            <option value="">Select</option>
                            {divisionList?.map((data, key) => (
                              <option key={key} value={data?.id}>
                                {data?.Name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label className="m-0">Title</label>
                          <select
                            className="form-control form-control-sm"
                            name="Title"
                            value={contactFormValue[index]?.Title || ""}
                            onChange={(e) => handleContactChange(index, e)}
                          >
                            <option value={"Mr"}>Mr</option>
                            <option value={"Mrs"}>Mrs</option>
                            <option value={"Ms"}>Ms</option>
                          </select>
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label className="m-0">First Name</label>
                          <input
                            type="text"
                            placeholder="First Name"
                            className="form-control form-control-sm"
                            name="FirstName"
                            value={contactFormValue[index]?.FirstName || ""}
                            onChange={(e) => handleContactChange(index, e)}
                          />
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label className="m-0">Last Name</label>
                          <input
                            type="text"
                            placeholder="Last Name"
                            className="form-control form-control-sm"
                            name="LastName"
                            value={contactFormValue[index]?.LastName || ""}
                            onChange={(e) => handleContactChange(index, e)}
                          />
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label className="m-0">Designation</label>
                          <input
                            type="text"
                            placeholder="Designation"
                            className="form-control form-control-sm"
                            name="Designation"
                            value={contactFormValue[index]?.Designation || ""}
                            onChange={(e) => handleContactChange(index, e)}
                          />
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label className="m-0">Mobile</label>
                          <input
                            type="text"
                            placeholder="Mobile"
                            className="form-control form-control-sm"
                            name="Phone1"
                            value={contactFormValue[index]?.Phone1 || ""}
                            onChange={(e) => handleContactChange(index, e)}
                          />
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label className="m-0">Phone 2</label>
                          <input
                            type="text"
                            placeholder="Phone 2"
                            className="form-control form-control-sm"
                            name="Phone2"
                            value={contactFormValue[index]?.Phone2 || ""}
                            onChange={(e) => handleContactChange(index, e)}
                          />
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label className="m-0">Phone 3</label>
                          <input
                            type="text"
                            placeholder="Phone 3"
                            className="form-control form-control-sm"
                            name="Phone3"
                            value={contactFormValue[index]?.Phone3 || ""}
                            onChange={(e) => handleContactChange(index, e)}
                          />
                        </div>
                        <div className="col-md-6 col-lg-4">
                          <label className="m-0">
                            Email <span className="text-danger ms-1">*</span>
                            <i
                              className="fa-solid fa-circle-info m-0 text-warning cursor-pointer ms-1"
                              onClick={() => setShowEmailInfo(!showEmailInfo)}
                            ></i>
                          </label>
                          {showEmailInfo && (
                            <span className="text-warning invalid-feedback animated fadeInUp d-block ms-1">
                              Email should be comma separated
                            </span>
                          )}
                          <input
                            type="text"
                            placeholder="Email"
                            className="form-control form-control-sm position-hover-eye"
                            name="Email"
                            value={contactFormValue[index]?.Email || ""}
                            onChange={(e) => handleContactChange(index, e)}
                          />
                          {validationErrors[`[${index}].Email`] && (
                            <span className="text-danger font-size-11">
                              {validationErrors[`[${index}].Email`]}
                            </span>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2 d-flex align-items-end">
                          {index > 1 && (
                            <Button
                              className="btn btn-primary m-0 rounded cursor-pointer fs-3 py-0 px-4"
                              onClick={() => handleContactDelete(index)}
                            >
                              -
                            </Button>
                          )}
                        </div>
                        {index === 0 && (
                          <div className="d-flex gap-2 mt-1 d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              id="copy_contact"
                              onChange={handleCopyChange}
                            />
                            <label htmlFor="copy_contact" className="m-0 mt-1">
                              Copy
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-6 mt-3">
                    <div className="row">
                      <div className="col-12">
                        <label className="m-0">Hotel Information</label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={editorData || ""}
                          onChange={handleEditorChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mt-3">
                    <div className="row form-row-gap">
                      <div className="col-12">
                        <label className="m-0">Policy</label>
                        <textarea
                          placeholder="Policy"
                          className="form-control form-control-sm"
                          name="HotelPolicy"
                          value={formValue?.HotelPolicy}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12">
                        <label className="m-0">T&C Document</label>
                        <ImageContainer />
                        {errorFileMessage && (
                          <div
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {errorFileMessage}
                          </div>
                        )}
                      </div>
                      <div className="col-12">
                        <label className="m-0">T&C</label>
                        <textarea
                          placeholder="Terms & Condition"
                          className="form-control form-control-sm h-100"
                          name="HotelTC"
                          value={formValue?.HotelTC}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12">
                        <div className="row">
                          <div className="col-2 pr-0">
                            <label className="m-0">Verified</label>
                            <select
                              name="Verified"
                              className="form-control form-control-sm"
                              value={formValue?.Verified}
                              onChange={handleInputChange}
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className="col-10 mb-2">
                            <label className="m-0">Internal Note</label>
                            <textarea
                              placeholder="Internal Note"
                              className="form-control form-control-sm h-100"
                              name="InternalNote"
                              value={formValue?.InternalNote}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="d-flex gap-3 justify-content-end">
              <button
                className="btn btn-dark btn-custom-size"
                onClick={() =>
                  navigate("/hotel", {
                    state: {
                      selectedDestination: state?.selectedDestination,
                      selecthotelname: state?.selecthotelname,
                    },
                  })
                }
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

export default AddHotel;
