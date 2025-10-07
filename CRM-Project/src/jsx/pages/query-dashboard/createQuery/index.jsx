// @ts-nocheck
import React, {
  createContext,
  lazy,
  useEffect,
  useReducer,
  useState,
} from "react";
import Contact from "./contact";
import Accomodation from "./accomodation";
import preferencered from "../../../../images/svg/preferencered.svg";
import {
  queryAddInitialValue,
  preferencesInitialValue,
  insuranceInitial,
} from "../query_intial_value";
import { queryAddValidation } from "../query_validation.js";
import { axiosOther } from "../../../../http/axios_base_url";
import PaxDetail from "./paxDetail";
import TravelInfo from "./travel";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SetPreference from "./setPreference";
import Destination from "./destination";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import QueryHeading from "../QueryHeading.jsx";
const FlightServices = lazy(() => import("./flightServices"));
const VisaServices = lazy(() => import("./visaServices"));
const InsuranceService = lazy(() => import("./insuranceServices"));
const currentQueryGlobalContext = createContext();

import { useDispatch, useSelector } from "react-redux";
import {
  setHeadingShowTrue,
  setPayloadQueryData,
  setQoutationSubject,
  setQueryData,
} from "../../../../store/actions/queryAction.js";
import { notifyError, notifySuccess } from "../../../../helper/notify.jsx";
import LoadingOverlay from "../../../layouts/LoadingOverlay.jsx";
import { currentDate } from "../../../../helper/currentDate.js";
import { resetCreateQueryDataPackageList } from "../../../../store/actions/createQueryAction/createQueryAction.js";

const addQueryContext = createContext();

const CreateQuery = () => {
  const [showPreference, setShowPreference] = useState(true);

  const navigate = useNavigate();
  const { state } = useLocation();
  const [TravelDate, setTravelDate] = useState([]);
  const [PaxInfo, setPaxInfo] = useState("");
  const [RoomInfo, setRoomInfo] = useState([]);
  const [queryType, setQueryType] = useState([1]);
  const [formValue, setFormValue] = useState(queryAddInitialValue);
  const [insurance, setInsurance] = useState({});
  const [flight, setFlight] = useState({});
  const [visa, setVisa] = useState({});
  const [preferences, setPreferences] = useState(preferencesInitialValue);
  const [services, setServices] = useState([]);
  const [editDestinationTemplate, setEditDestinationTemplate] = useState("");
  const [agentSearch, setAgentSearch] = useState("");
  const [savedQueryInfo, setSavedQueryInfo] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState("");
  const [tempQueryData, setTempQueryData] = useState(null);
  const [headingShow, setHeadingShow] = useState(false);
  const [toggleValue, setToggleValue] = useState(state?.tourType);

  const storeData = JSON.parse(localStorage.getItem("token"));

  // console.log(state, "sdkd655");
  // console.log(agentSearch, "agentSearch");

  const { queryUpdateData, queryData } = useSelector(
    (data) => data?.queryReducer
  );
  // console.log(queryData, "QUerujd3266");
  // console.log(queryUpdateData, "queryUpdateData");

  // Set queryType from update data if available, otherwise default
  useEffect(() => {
    if (queryUpdateData?.QueryType) {
      // console.log('queryUpdateData.QueryType', queryUpdateData.QueryType);
      if (Array.isArray(queryUpdateData.QueryType)) {
        setQueryType(queryUpdateData.QueryType.map((q) => q.QueryTypeId));
      } else {
        setQueryType([queryUpdateData.QueryType.QueryTypeId]);
      }
    }
  }, [queryUpdateData]);

  const packageQueryInfo = useSelector(
    (state) => state.createQueryPageReducer.packageQueryInfo
  );

  const [tempQueryId, setTempQueryId] = useState(null);

  const [previewData, setPreviewData] = useState("");
  const forGetSubject = useSelector((data) => data);
  const getPreviewData = async () => {
    try {
      const { data } = await axiosOther.post("querymasterlist", {
        QueryId: state?.QueryAlphaNumId || queryData?.QueryAlphaNumId,
      });
      localStorage.setItem("query-data", JSON.stringify(data?.DataList[0]));
      setPreviewData(data?.DataList[0]);
      dispatch(
        setQoutationSubject(
          data?.DataList[0]?.ServiceDetail?.ServiceCompanyName +
          " " +
          currentDate(data?.DataList[0]?.QueryDate?.Date)
        )
      );
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   getPreviewData();
  // }, [queryData?.QueryId]);

  const [validationErorrs, setValidationErrors] = useState({
    queryAddValidation,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [agentData, setAgentData] = useState({
    Agent: "",
    Contact: "",
  });
  const [dayWiseForm, setDayWiseForm] = useState({
    From: "",
    To: "",
  });
  const dispatch = useDispatch();

  const [formNavigateTo, setFormNavigateTo] = useState(0);
  const [loading, setLoading] = useState(false);

  const dropdownInitialState = {
    hotelType: [],
    hotelMeal: [],
    leadList: [],
    tourType: [],
    countryList: [],
    cityList: [],
    businessType: [],
    vehicleType: [],
    seasonList: [],
    destinationList: [],
    hotelCategory: [],
    agentList: [],
    roomList: [],
    queryType: [],
    mealPlan: [],
    paxList: [],
    insuranceTypeList: [],
    visatypeList: [],
    classPerferenceList: [],
    seatPerferenceList: [],
    mealChoiceList: [],
    airlineList: [],
    visaList: [],
    isoList: [],
    consortiaList: [],
  };
  const handleDescription = (data, editor) => {
    const cleanedData = data.replace(/<[^>]*>/g, "").trim();
    setFormValue((prevState) => ({
      ...prevState,
      Description: data,
    }));
  };

  const dropdownReducer = (state, action) => {
    switch (action.type) {
      case "HOTEL-TYPE":
        return { ...state, hotelType: action.payload };
      case "HOTEL-MEAL":
        return { ...state, hotelMeal: action.payload };
      case "LEAD-LIST":
        return { ...state, leadList: action.payload };
      case "TOUR-TYPE":
        return { ...state, tourType: action.payload };
      case "COUNTRY-LIST":
        return { ...state, countryList: action.payload };
      case "CITY-LIST":
        return { ...state, cityList: action.payload };
      case "BUSINESS-TYPE":
        return { ...state, businessType: action.payload };
      case "VEHICLE-TYPE":
        return { ...state, vehicleType: action.payload };
      case "SEASON-LIST":
        return { ...state, seasonList: action.payload };
      case "DESTINATION-LIST":
        return { ...state, destinationList: action.payload };
      case "HOTEL-CATEGORY":
        return { ...state, hotelCategory: action.payload };
      case "AGENT-LIST":
        return { ...state, agentList: action.payload };
      case "ROOM-LIST":
        return { ...state, roomList: action.payload };
      case "QUERY-TYPE":
        return { ...state, queryType: action.payload };
      case "MEAL-PLAN":
        return { ...state, mealPlan: action.payload };
      case "PAX-LIST":
        return { ...state, paxList: action.payload };
      case "INSURANCETYPE-LIST":
        return { ...state, insuranceTypeList: action.payload };
      case "VISATYPE-LIST":
        return { ...state, visatypeList: action.payload };
      case "CLASSPERFERENCETYPE-LIST":
        return { ...state, classPerferenceList: action.payload };
      case "SEAT-PERFERENCETYPE-LIST":
        return { ...state, seatPerferenceList: action.payload };
      case "MEAL-CHOICE-LIST":
        return { ...state, mealChoiceList: action.payload };
      case "AIRLINE-LIST":
        return { ...state, airlineList: action.payload };
      case "VISA-LIST":
        return { ...state, visaList: action.payload };
      case "ISO-LIST":
        return { ...state, isoList: action.payload };
      case "CONSORTIA-LIST":
        return { ...state, consortiaList: action.payload };
    }
    return state;
  };
  const [dropdownState, dropdownDispatch] = useReducer(
    dropdownReducer,
    dropdownInitialState
  );

  const fetchingApiDataForDropdown = async () => {
    try {
      const { data } = await axiosOther.post("roomsharingmasterlist", {
        Search: "",
        Status: "1",
      });

      dropdownDispatch({
        type: "ROOM-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("businesstypelist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "BUSINESS-TYPE",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("seasonlist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "SEASON-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("querytypelist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "QUERY-TYPE",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("hotelcategorylist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "HOTEL-CATEGORY",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("destinationlist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "DESTINATION-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("vehicletypemasterlist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "VEHICLE-TYPE",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("citylist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "CITY-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("countrylist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "COUNTRY-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("tourlist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "TOUR-TYPE",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("hoteltypelist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "HOTEL-TYPE",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("leadlist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "LEAD-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("hotelmealplanlist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "MEAL-PLAN",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("paxlist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "PAX-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("isomasterlist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "ISO-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("consortiamasterlist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "CONSORTIA-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("insurancetypemasterlist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "INSURANCETYPE-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("class-preference-list", {
        Search: "",
        Status: "",
      });
      dropdownDispatch({
        type: "CLASSPERFERENCETYPE-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("visatypemasterlist", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "VISATYPE-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("seat-preference-list", {
        Search: "",
        Status: "1",
      });
      dropdownDispatch({
        type: "SEAT-PERFERENCETYPE-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("meal-choice-list", {
        Search: "",
        Status: "",
      });
      dropdownDispatch({
        type: "MEAL-CHOICE-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("airlinemasterlist", {
        Search: "",
        Status: "",
      });
      dropdownDispatch({
        type: "AIRLINE-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("visamasterlist", {
        Search: "",
        Status: "",
      });
      dropdownDispatch({
        type: "VISA-LIST",
        payload: data?.DataList,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(state, 'RAMAN753')

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Directly update the state if the key is not nested
    if (name in formData) {
      setFormValue((prevData) => ({
        ...prevData,
        [name]: value, // Update the value directly
      }));
    } else {
      // Handle nested keys
      const keys = name?.split(".");
      const newFormData = { ...formData };
      let current = newFormData;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value; // Update the final key
        } else {
          current = current[key]; // Move to the next nested object
        }
      });

      setFormValue(newFormData);
    }
  };
  useEffect(() => {
    fetchingApiDataForDropdown();
    localStorage.setItem(
      "Query_Qoutation",
      JSON.stringify({
        QoutationNum: "",
        QueryID: "",
      })
    );
    localStorage.setItem("query-data", JSON.stringify({}));
    localStorage.setItem("Query_Type_Status", JSON.stringify({}));
  }, []);
  const handleCheckBoxInput = (e) => {
    const { checked, value } = e.target;
    const valueArrForCheck1 = [4, 5, 6];
    const valueArrForCheck2 = [1, 2, 3];

    if (checked && !valueArrForCheck1.includes(parseInt(value))) {
      setQueryType([parseInt(value)]);
      setFormValue({ ...formValue, TravelType: "Inbound" });
      return null;
    }

    if (checked && valueArrForCheck1.includes(parseInt(value))) {
      if (valueArrForCheck2.includes(queryType[0])) {
        setQueryType([parseInt(value)]);
        setFormValue({ ...formValue, TravelType: "ValueAddedServices" });
        return null;
      }
      setQueryType([...queryType, parseInt(value)]);
      setFormValue({ ...formValue, TravelType: "ValueAddedServices" });
      return null;
    }

    if (
      !checked &&
      valueArrForCheck1.includes(parseInt(value)) &&
      queryType.length > 1
    ) {
      const afterUnChecked = queryType.filter((item) => item != value);
      setQueryType(afterUnChecked);
      return null;
    }
    if (
      !checked &&
      valueArrForCheck1.includes(parseInt(value)) &&
      queryType.length >= 1
    ) {
      setQueryType([1]);
      return null;
    }
  };

  useEffect(() => {
    if (state) {
      if (state?.isPartial) {
        setFormValue({
          // id: queryData?.QueryId,
          Fk_QueryId: state?.queryId,
          Type: toggleValue,
          CompanyId: queryData?.QueryAllData?.CompanyId,
          UserId: queryData?.QueryAllData?.UserId,
          UserType: queryData?.QueryAllData?.UserType,
          ClientType: 1,
          TAT: "",
          CurrencyId: queryData?.QueryAllData?.CurrencyId,
          ClientName: queryData?.QueryAllData?.ClientName,
          ConversionRate: queryData?.QueryAllData?.ConversionRate,
          LeadSource: queryData?.QueryAllData?.LeadSource,
          MealPlan: queryData?.QueryAllData?.MealPlan,
          Consortia: queryData?.QueryAllData?.Consortia,
          Language: queryData?.QueryAllData?.Language,
          ISO: queryData?.QueryAllData?.ISO,
          Budget: queryData?.QueryAllData?.Budget,
          QueryType: queryData?.QueryAllData?.QueryType?.[0]?.QueryTypeId,
          ServiceDetail: {
            ServiceId: queryData?.QueryAllData?.ServiceDetail?.Serviceid,
            BusinessTypeId:
              queryData?.QueryAllData?.ServiceDetail?.BusinessTypeId,
          },
          ContactInfo: {
            ContactId: queryData?.QueryAllData?.ContactInfo?.ContactId,
          },
          PaxInfo: {
            PaxType: queryData?.QueryAllData?.PaxInfo?.PaxType,
            TotalPax: queryData?.QueryAllData?.PaxInfo?.TotalPax,
            Adult: queryData?.QueryAllData?.PaxInfo?.Adult,
            Child: queryData?.QueryAllData?.PaxInfo?.Child,
            Infant: queryData?.QueryAllData?.PaxInfo?.Infant,
          },
          TravelDateInfo: {
            ScheduleType: queryData?.QueryAllData?.TravelDateInfo?.ScheduleType,
            SeasonType: queryData?.QueryAllData?.TravelDateInfo?.SeasonType,
            SeasonYear: queryData?.QueryAllData?.TravelDateInfo?.SeasonYear,
            // TotalNights: queryData?.QueryAllData?.TravelDateInfo?.TotalNights,
            FromDate: queryData?.QueryAllData?.TravelDateInfo?.FromDate,
            FromDateDateWise:
              queryData?.QueryAllData?.TravelDateInfo?.FromDateDateWise,
            ToDate: queryData?.QueryAllData?.TravelDateInfo?.ToDate,
            TravelData:
              queryData?.QueryAllData?.TravelDateInfo?.TravelData || [],
          },
          Description: queryData?.QueryAllData?.Description,
          TravelType: queryData?.QueryAllData?.TravelType,
          ValueAddedServices:
            queryData?.QueryAllData?.ValueAddedServiceDetails?.Services || "",
          Hotel: {
            HotelCategory: queryData?.QueryAllData?.Hotel?.HotelCategory,
          },
        });
        // state?.queryData?.QueryAllData?.TravelDateInfo
        setTravelDate(state?.queryData?.QueryAllData?.TravelDateInfo);

        setAgentSearch(
          queryData?.QueryAllData?.ServiceDetail?.ServiceCompanyName
        );
        setAgentData({
          Agent: {
            CompanyEmailAddress:
              queryData?.QueryAllData?.ServiceDetail?.CompanyEmail,
            MarketTypeName: queryData?.QueryAllData?.ServiceDetail?.MarketType,
            NationalityName:
              queryData?.QueryAllData?.ServiceDetail?.Nationality,
            CompanyName:
              queryData?.QueryAllData?.ServiceDetail?.ServiceCompanyName,
            CompanyPhoneNumber:
              queryData?.QueryAllData?.ServiceDetail?.CompanyPhone,
          },
        });
        setRoomInfo(queryData?.QueryAllData?.Hotel?.RoomInfo);

        setPreferences({
          ...queryData?.QueryAllData?.Prefrences,
          VehiclePreference:
            queryData?.QueryAllData?.Prefrences?.VehiclePreference,
        });
      } else {
        setIsUpdating(true);
        setFormValue({
          id: state?.id,
          CompanyId: state?.CompanyId,
          UserId: state?.UserId,
          UserType: state?.UserType,
          ClientType: 1,
          TAT: "",
          CurrencyId: state?.CurrencyId,
          ClientName: state?.ClientName,
          ConversionRate: state?.ConversionRate,
          LeadSource: state?.LeadSource,
          MealPlan: state?.MealPlan,
          Consortia: state?.Consortia,
          Language: state?.Language,
          ISO: state?.ISO,
          Budget: state?.Budget,
          QueryType: state?.QueryType?.QueryTypeId || state?.QueryType[0]?.QueryTypeId,
          ServiceDetail: {
            ServiceId: state?.ServiceDetail?.Serviceid,
            BusinessTypeId: state?.ServiceDetail?.BusinessTypeId,
          },
          ContactInfo: {
            ContactId: state?.ContactInfo?.ContactId,
          },
          PaxInfo: {
            PaxType: state?.PaxInfo?.PaxType,
            TotalPax: state?.PaxInfo?.TotalPax,
            Adult: state?.PaxInfo?.Adult,
            Child: state?.PaxInfo?.Child,
            Infant: state?.PaxInfo?.Infant,
          },
          TravelDateInfo: {
            ScheduleType: state?.TravelDateInfo?.ScheduleType,
            SeasonType: state?.TravelDateInfo?.SeasonType,
            SeasonYear: state?.TravelDateInfo?.SeasonYear,
            // FromDate:
            //   state?.TravelDateInfo?.FromDate == null ||
            //   (state?.TravelDateInfo?.FromDate == null) == ""
            //     ? new Date().toISOString().split("T")[0]
            //     : state?.TravelDateInfo?.FromDate,
            ToDate: state?.TravelDateInfo?.ToDate,
            FromDateDateWise: state?.TravelDateInfo?.FromDateDateWise,
            TotalNights: state?.TravelDateInfo?.TotalNights,
            FromDate: dayWiseForm?.From,
            ToDate: dayWiseForm?.To,
          },
          Description: state?.Description,
          TravelType: state?.TravelType,
          ValueAddedServices: "",
          Hotel: {
            HotelCategory: state?.Hotel?.HotelCategory,
          },
        });
        const filteredTravelData = state?.TravelDateInfo?.TravelData?.filter(
          (item) => !item.isEnroute
        );
        setTravelDate(filteredTravelData);

        setAgentSearch(state?.ServiceDetail?.ServiceCompanyName);
        setAgentData({
          Agent: {
            CompanyEmailAddress: state?.ServiceDetail?.CompanyEmail,
            MarketTypeName: state?.ServiceDetail?.MarketType,
            NationalityName: state?.ServiceDetail?.Nationality,
            CompanyName: state?.ServiceDetail?.ServiceCompanyName,
            CompanyPhoneNumber: state?.ServiceDetail?.CompanyPhone,
          },
        });
        setRoomInfo(state?.Hotel?.RoomInfo);

        setPreferences({
          ...state?.Prefrences,
          // LeadReferencedId: state?.LeadReferencedId,
          VehiclePreference: state?.Prefrences?.VehiclePreference,
        });
      }
    }
  }, [state, agentSearch]);

  useEffect(() => {
    return () => {
      dispatch(resetCreateQueryDataPackageList());
    };
  }, []);

  // addupdatequerymaster
  const getaddUpdateQuerymaster = async () => {
    try {
      const { data } = await axiosOther.post("addupdatequerymaster", {
        ...formValue,
        AddedBy: storeData?.UserID,
        Hotel: { ...formValue.Hotel, RoomInfo: RoomInfo },
        TravelDateInfo: {
          ...formValue?.TravelDateInfo,
          FromDate: dayWiseForm?.From,
          ToDate: dayWiseForm?.To,
          TravelData: TravelDate,
        },
        LeadSource: preferences?.LeadSource,
        Prefrences: preferences,
        QueryType: queryType,
        CompanyId: storeData?.companyKey,
        UserId: storeData?.UserID,
        UserType: storeData?.Role,
        ValueAddedServices: {
          services: [{ ...insurance }, { ...flight }, { ...visa }],
        },
      });

      if (data?.Status === 1) {
        const cid = data?.Id;
        const cQid = data?.QueryId;

        setSavedQueryInfo({
          Id: cid,
          QueryId: cQid,
        });

        dispatch(setHeadingShowTrue());
        dispatch(
          setQueryData({
            QueryId: data?.Id,
            QueryAlphaNumId: data?.QueryId,
            QueryAllData: "",
          })
        );
      }

      dispatch(
        setPayloadQueryData({
          ...formValue,
          Hotel: { ...formValue.Hotel, RoomInfo: RoomInfo },
          TravelDateInfo: {
            ...formValue?.TravelDateInfo,
            FromDate: dayWiseForm?.From,
            ToDate: dayWiseForm?.To,
            TravelData: TravelDate,
          },
          LeadSource: preferences?.LeadSource,
          Prefrences: preferences,
          QueryType: queryType,
          CompanyId: storeData?.companyKey,
          UserId: storeData?.UserID,
          UserType: storeData?.Role,
          ValueAddedServices: {
            services: [{ ...insurance }, { ...flight }, { ...visa }],
          },
        })
      );

      return {
        Id: data?.Id,
        QueryId: data?.QueryId,
      };
    } catch (error) {
      console.log(error);
    }
  };

  // on Submit click
  const runPackegelistApi = async (response) => {
    try {
      const { data } = await axiosOther.post(
        "generate-query-package-from-packageid",
        {
          OldQueryId: packageQueryInfo?.QueryNumber,
          NewQueryId: response?.QueryId,
        }
      );

      const response1 = await axiosOther.post("create-excort-days", {
        QueryId: response?.QueryId,
        QuotationNumber: data?.quotation?.QuotationNumber,
        ExcortType: "Local",
        NoOfEscort: "1",
      });
      const response2 = await axiosOther.post("create-excort-days", {
        QueryId: response?.QueryId,
        QuotationNumber: data?.quotation?.QuotationNumber,
        ExcortType: "Foreigner",
        NoOfEscort: "1",
      });

      if (
        data?.status == 1 &&
        (response1?.data?.Status == 1 || response1?.data?.Status == 200) &&
        (response2?.data?.Status == 1 || response2?.data?.Status == 200)
      ) {
        localStorage.setItem(
          "Query_Qoutation",
          JSON.stringify({
            QoutationNum: data?.quotation?.QuotationNumber,
            QueryID: response?.QueryId,
          })
        );
        if (window.location.origin === "https://beta.creativetravel.in") {
          navigate("/query/quotation-four");
          return;
        }
        navigate("/query/quotation");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(queryType[0], "formValue22");

  const handleSubmitQuery = async (e, actionType) => {
    e.preventDefault();
    setLoadingBtn(actionType);

    if (queryType == 3) {
      localStorage.setItem(
        "Query_Type_Status",
        JSON.stringify({
          QueryType: queryType[0],
          QueryStatus: ""
        })
      );
    }



    try {
      // Nayi query create karne ka logic
      await queryAddValidation.validate(
        {
          BusinessTypeId: formValue?.ServiceDetail?.BusinessTypeId,
          ServiceId: formValue?.ServiceDetail?.ServiceId,
          // Priority: preferences?.Priority,
        },
        { abortEarly: false }
      );
      setValidationErrors({});

      // console.log(packageQueryInfo, "packageQueryInfo");

      // Logic for when select data from packege list
      if (actionType === "submit" && packageQueryInfo) {
        const response = await getaddUpdateQuerymaster();

        if (response) {
          runPackegelistApi(response);
          return;
        }
        return;
      }

      if (actionType === "submit" && state?.isPartial && toggleValue) {
        // console.log("this part executed", toggleValue);

        const { data } = await axiosOther.post("addupdatequerymaster", {
          ...formValue,
          AddedBy: storeData?.UserID,
          Hotel: { ...formValue.Hotel, RoomInfo: RoomInfo },
          TravelDateInfo: {
            ...formValue?.TravelDateInfo,
            FromDate: dayWiseForm?.From,
            ToDate: dayWiseForm?.To,
            TravelData: TravelDate,
          },
          LeadSource: preferences?.LeadSource,
          Prefrences: preferences,
          QueryType: queryType,
          CompanyId: storeData?.companyKey,
          UserId: storeData?.UserID,
          UserType: storeData?.Role,
          ValueAddedServices: {
            services: [{ ...insurance }, { ...flight }, { ...visa }],
          },
        });

        // console.log(data.Status, "Status753");

        if (data.Status == 1) {
          const cid = data?.Id;
          const cQid = data?.QueryId;

          // setSavedQueryInfo({
          //   Id: cid,
          //   QueryId: cQid,
          // });

          // dispatch(setHeadingShowTrue());
          // dispatch(
          //   setQueryData({
          //     QueryId: data?.Id,
          //     QueryAlphaNumId: data?.QueryId,
          //     QueryAllData: "",
          //   })
          // );

          // dispatch(
          //   setPayloadQueryData({
          //     ...formValue,
          //     Hotel: { ...formValue.Hotel, RoomInfo: RoomInfo },
          //     TravelDateInfo: {
          //       ...formValue?.TravelDateInfo,
          //       FromDate: dayWiseForm?.From,
          //       ToDate: dayWiseForm?.To,
          //       TravelData: TravelDate,
          //     },
          //     LeadSource: preferences?.LeadSource,
          //     Prefrences: preferences,
          //     QueryType: queryType,
          //     CompanyId: storeData?.companyKey,
          //     UserId: storeData?.UserID,
          //     UserType: storeData?.Role,
          //     ValueAddedServices: {
          //       services: [{ ...insurance }, { ...flight }, { ...visa }],
          //     },
          //   })
          // );

          // console.log(actionType, "ACTIONTYPE");

          // Navigate based on button

          if (actionType === "submit") {
            setLoadingBtn(actionType);
            if (toggleValue) {
              const date = currentDate();

              // console.log("inside the if part");

              const subject = null;
              // console.log(cQid, subject, "checksubject");

              // agentData?.Agent?.ContactList[0]?.CompanyName + " " + date;
              const { data } = await axiosOther.post("addquerywithjson", {
                QueryId: cQid,
                Subject: subject,
                HotelCategory: "Single Hotel Category",
                PaxSlabType: "Single Slab",
                HotelMarkupType: "Service Wise Markup",
                HotelStarCategory: [],
                PackageID: "",
              });

              const response1 = await axiosOther.post("create-excort-days", {
                QueryId: cQid,
                QuotationNumber: data?.Response?.QuotationNumber,
                ExcortType: "Local",
                NoOfEscort: "1",
              });
              const response2 = await axiosOther.post("create-excort-days", {
                QueryId: cQid,
                QuotationNumber: data?.Response?.QuotationNumber,
                ExcortType: "Foreigner",
                NoOfEscort: "1",
              });

              const response3 = await axiosOther.post("querymasterlist", {
                QueryId: cQid,
              });

              if (
                data?.status == 1 &&
                response1?.data?.Status == 1 &&
                response2?.data?.Status === 1 &&
                response3?.data?.Status === 200
              ) {
                localStorage.setItem(
                  "Query_Qoutation",
                  JSON.stringify({
                    QoutationNum: data?.Response.QuotationNumber,
                    QueryID: cQid,
                  })
                );
                localStorage.setItem(
                  "query-data",
                  JSON.stringify(response3?.data?.DataList[0])
                );
                if (
                  window.location.origin === "https://beta.creativetravel.in"
                ) {
                  navigate("/query/quotation-four");
                  return;
                }
                // setTimeout(() => {
                navigate("/query/quotation");
                // }, 1000);
              }
            }
          }
        } else {
          notifyError(data?.message || data?.Message);
        }

        return;
      }

      const isSavedData = savedQueryInfo ? false : state;

      if (
        (actionType === "submit" && isSavedData) ||
        (actionType === "preview" && isSavedData)
      ) {
        setLoadingBtn(actionType);
        const { data } = await axiosOther.post("addupdatequerymaster", {
          ...formValue,
          id: queryData?.QueryId,
          AddedBy: storeData?.UserID,
          Hotel: { ...formValue.Hotel, RoomInfo: RoomInfo },
          TravelDateInfo: {
            ...formValue?.TravelDateInfo,
            FromDate: dayWiseForm?.From,
            ToDate: dayWiseForm?.To,
            TravelData: TravelDate,
          },
          LeadSource: preferences?.LeadSource,
          Prefrences: preferences,
          QueryType: queryType,
          CompanyId: storeData?.companyKey,
          UserId: storeData?.UserID,
          UserType: storeData?.Role,
          ValueAddedServices: {
            services: [{ ...insurance }, { ...flight }, { ...visa }],
          },
        });

        dispatch(
          setQueryData({
            QueryId: queryData?.QueryId,
            QueryAlphaNumId: queryData?.QueryAlphaNumId,
            QueryAllData: "",
          })
        );

        dispatch(
          setPayloadQueryData({
            ...formValue,
            Hotel: { ...formValue.Hotel, RoomInfo: RoomInfo },
            TravelDateInfo: {
              ...formValue?.TravelDateInfo,
              FromDate: dayWiseForm?.From,
              ToDate: dayWiseForm?.To,
              TravelData: TravelDate,
            },
            LeadSource: preferences?.LeadSource,
            Prefrences: preferences,
            QueryType: queryType,
            CompanyId: storeData?.companyKey,
            UserId: storeData?.UserID,
            UserType: storeData?.Role,
            ValueAddedServices: {
              services: [{ ...insurance }, { ...flight }, { ...visa }],
            },
          })
        );

        localStorage.setItem(
          "Query_Qoutation",
          JSON.stringify({
            QoutationNum: "",
            QueryID: state?.QueryID,
          })
        );

        if (actionType === "preview" && isSavedData) {
          setLoadingBtn(actionType);
          navigate(`/query/preview/${state?.id || queryData?.QueryId}`, {
            state: {
              QueryAlphaNumId: savedQueryInfo?.QueryId || state?.QueryID,
            },
          });
          return;
        }

        // setTimeout(() => {
        if (window.location.origin === "https://beta.creativetravel.in") {
          navigate("/query/quotation-four");
          return;
        }
        navigate("/query/quotation-list");
        // }, 1000);

        return;
      }

      if (actionType === "save" && savedQueryInfo) {
        setLoadingBtn(actionType);

        const existingQuery = queryData;
        if (existingQuery) {
          const storeData = JSON.parse(localStorage.getItem("token"));
          // console.log(storeData, "storeData");

          const { data } = await axiosOther.post("addupdatequerymaster", {
            ...formValue,
            id: existingQuery?.QueryId,
            AddedBy: storeData?.UserID,
            Hotel: { ...formValue.Hotel, RoomInfo: RoomInfo },
            TravelDateInfo: {
              ...formValue?.TravelDateInfo,
              FromDate: dayWiseForm?.From,
              ToDate: dayWiseForm?.To,
              TravelData: TravelDate,
            },
            LeadSource: preferences?.LeadSource,
            Prefrences: preferences,
            QueryType: queryType,
            CompanyId: storeData?.companyKey,
            UserId: storeData?.UserID,
            UserType: storeData?.Role,
            ValueAddedServices: {
              services: [{ ...insurance }, { ...flight }, { ...visa }],
            },
          });
          dispatch(
            setQueryData({
              QueryId: existingQuery?.QueryId,
              QueryAlphaNumId: existingQuery?.QueryAlphaNumId,
              QueryAllData: "",
            })
          );

          dispatch(
            setPayloadQueryData({
              ...formValue,
              Hotel: { ...formValue.Hotel, RoomInfo: RoomInfo },
              TravelDateInfo: {
                ...formValue?.TravelDateInfo,
                FromDate: dayWiseForm?.From,
                ToDate: dayWiseForm?.To,
                TravelData: TravelDate,
              },
              LeadSource: preferences?.LeadSource,
              Prefrences: preferences,
              QueryType: queryType,
              CompanyId: storeData?.companyKey,
              UserId: storeData?.UserID,
              UserType: storeData?.Role,
              ValueAddedServices: {
                services: [{ ...insurance }, { ...flight }, { ...visa }],
              },
            })
          );

          notifySuccess(data?.Message);

          setLoadingBtn("");
          return;
        }
        return;
      }

      if (
        (actionType === "preview" || actionType === "submit") &&
        savedQueryInfo
      ) {
        setLoadingBtn(actionType);
        if (actionType === "preview") {
          navigate(`/query/preview/${state?.id || queryData?.QueryId}`, {
            state: {
              QueryAlphaNumId: savedQueryInfo?.QueryId || state?.QueryID,
            },
          });
        } else {
          localStorage.setItem(
            "Query_Qoutation",
            JSON.stringify({
              QoutationNum: "",
              QueryID: state?.QueryID,
            })
          );

          if (window.location.origin === "https://beta.creativetravel.in") {
            navigate("/query/quotation-four");
            return;
          }

          // setTimeout(() => {
          navigate("/query/quotation-list");
          // }, 1000);
        }
        return;
      }

      const { data } = await axiosOther.post("addupdatequerymaster", {
        ...formValue,
        AddedBy: storeData?.UserID,
        Hotel: { ...formValue.Hotel, RoomInfo: RoomInfo },
        TravelDateInfo: {
          ...formValue?.TravelDateInfo,
          FromDate: dayWiseForm?.From,
          ToDate: dayWiseForm?.To,
          TravelData: TravelDate,
        },
        LeadSource: preferences?.LeadSource,
        Prefrences: preferences,
        QueryType: queryType,
        CompanyId: storeData?.companyKey,
        UserId: storeData?.UserID,
        UserType: storeData?.Role,
        ValueAddedServices: {
          services: [{ ...insurance }, { ...flight }, { ...visa }],
        },
      });
      // console.log(data, "datadata");

      if (data.Status == 1) {
        const cid = data?.Id;
        const cQid = data?.QueryId;

        setSavedQueryInfo({
          Id: cid,
          QueryId: cQid,
        });

        dispatch(setHeadingShowTrue());
        dispatch(
          setQueryData({
            QueryId: data?.Id,
            QueryAlphaNumId: data?.QueryId,
            QueryAllData: "",
          })
        );

        dispatch(
          setPayloadQueryData({
            ...formValue,
            Hotel: { ...formValue.Hotel, RoomInfo: RoomInfo },
            TravelDateInfo: {
              ...formValue?.TravelDateInfo,
              FromDate: dayWiseForm?.From,
              ToDate: dayWiseForm?.To,
              TravelData: TravelDate,
            },
            LeadSource: preferences?.LeadSource,
            Prefrences: preferences,
            QueryType: queryType,
            CompanyId: storeData?.companyKey,
            UserId: storeData?.UserID,
            UserType: storeData?.Role,
            ValueAddedServices: {
              services: [{ ...insurance }, { ...flight }, { ...visa }],
            },
          })
        );

        // Navigate based on button

        if (actionType === "save") {
          // Do nothing
        } else if (actionType === "preview") {
          setLoadingBtn(actionType);
          navigate(`/query/preview/${data?.Id || state?.id}`, {
            state: { QueryAlphaNumId: data?.QueryId },
          });
        } else if (actionType === "submit") {
          // console.log("function callls");
          // console.log(actionType, "actionType");

          setLoadingBtn(actionType);
          // console.log(savedQueryInfo, "savedQueryInfo");

          if (!savedQueryInfo) {
            const date = currentDate();

            const subject = formValue?.BusinessTypeName + " " + date;
            // console.log(cQid, subject, "subjectsubject");

            const { data } = await axiosOther.post("addquerywithjson", {
              QueryId: cQid,
              Subject: subject,
              HotelCategory: "Single Hotel Category",
              PaxSlabType: "Single Slab",
              HotelMarkupType: "Service Wise Markup",
              HotelStarCategory: [],
              PackageID: "",
            });

            const response1 = await axiosOther.post("create-excort-days", {
              QueryId: cQid,
              QuotationNumber: data?.Response?.QuotationNumber,
              ExcortType: "Local",
              NoOfEscort: "1",
            });
            const response2 = await axiosOther.post("create-excort-days", {
              QueryId: cQid,
              QuotationNumber: data?.Response?.QuotationNumber,
              ExcortType: "Foreigner",
              NoOfEscort: "1",
            });

            const response3 = await axiosOther.post("querymasterlist", {
              QueryId: cQid,
            });

            if (
              data?.status == 1 &&
              response1?.data?.Status == 1 &&
              response2?.data?.Status === 1 &&
              response3?.data?.Status === 200
            ) {
              localStorage.setItem(
                "Query_Qoutation",
                JSON.stringify({
                  QoutationNum: data?.Response.QuotationNumber,
                  QueryID: cQid,
                })
              );
              localStorage.setItem(
                "query-data",
                JSON.stringify(response3?.data?.DataList[0])
              );
              if (window.location.origin === "https://beta.creativetravel.in") {
                navigate("/query/quotation-four");
                return;
              }
              // setTimeout(() => {
              navigate("/query/quotation");
              // }, 1000);
            }
          }
        }
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
      }

      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
      }

      if (error.response?.Data || error.response?.data) {
        const data = Object.entries(
          error.response?.Data || error.response?.data
        );
        notifyError(data[0][1]);
      }
    } finally {
      setLoadingBtn("");
    }
  };

  // console.log(formValue, "HFGGDG76");

  return (
    <addQueryContext.Provider
      value={{
        queryObjects: {
          formValue,
          setFormValue,
        },
        TravelDateObject: {
          dayWiseForm,
          setDayWiseForm,
        },
        flightObject: {
          flight,
          setFlight,
        },
        insuranceObject: {
          insurance,
          setInsurance,
        },
        visaObject: {
          visa,
          setVisa,
        },
        preferenceObject: {
          preferences,
          setPreferences,
        },
        serviceObject: [services, setServices],
        paxObject: {
          PaxInfo,
          setPaxInfo,
        },
        roomObject: {
          RoomInfo,
          setRoomInfo,
        },
        travelObject: {
          TravelDate,
          setTravelDate,
        },
        dropdownObject: {
          dropdownState,
        },
        destinationObject: {
          editDestinationTemplate,
          setEditDestinationTemplate,
        },
        searchAgent: {
          agentSearch,
          setAgentSearch,
        },
        contactData: {
          agentData,
          setAgentData,
        },

        handleChange: handleChange,
        isUpdating: isUpdating,
      }}
    >
      {/* <QueryHeading headData={state?.QueryID} /> */}
      <div className="row text-black m-2 ms-0 me-0">
        {loading && <LoadingOverlay />}

        {/* {state?.QueryID
        ? <div className="row">
          <div className="col-12">
            <span className="ps-3 fs-5 d-flex align-items-center gap-1">
              <span className="querydetails text-grey">Query# : </span>{" "}
              {state?.QueryID}
            </span>
          </div>
        </div> : ""
      } */}
        <div className="col-12 border border-left-0 border-right-0 py-2 ps-0">
          <ToastContainer />
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="d-flex  gap-2 flex-wrap align-items-center mb-3 mb-lg-0">
              {dropdownState?.queryType?.map((item, index) => {
                return (
                  <div className="" key={index}>
                    <div className=" d-flex gap-2 px-1 align-items-center box-shadow-1 padding-y-3 rounded">
                      <label
                        htmlFor={`${item?.Name?.toLocaleLowerCase()}-toggle`}
                        className="m-0 font-size-11 font-weight-500 cursor-pointer"
                      >
                        {item?.Name}
                      </label>
                      <div className="toggle-container m-0">
                        <input
                          type="checkbox"
                          className="toggle m-0"
                          id={`${item?.Name?.toLocaleLowerCase()}-toggle`}
                          checked={queryType.includes(item?.id)}
                          value={item?.id}
                          name={item?.id}
                          onChange={handleCheckBoxInput}
                        />
                        <label
                          htmlFor={`${item?.Name?.toLocaleLowerCase()}-toggle`}
                          className="toggle-label m-0"
                        ></label>
                      </div>
                    </div>
                  </div>
                );
              })}
              {dropdownState?.queryType.length == 0 &&
                Array(6)
                  .fill(null)
                  .map((item, index) => {
                    return (
                      <div className="" key={index}>
                        <div className=" d-flex gap-2 px-1 align-items-center box-shadow-1 padding-y-3 rounded shimmer-effect">
                          <label className="m-0 font-size-11 font-weight-500 cursor-pointer">
                            <p className="px-3"></p>
                          </label>
                        </div>
                      </div>
                    );
                  })}
            </div>

            <div className="d-flex  justify-content-end gap-2 mt-xs-2 mt-md-0 ">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              {/* <button
                className="btn btn-dark btn-custom-size"
                style={{
                  backgroundColor: "rgb(40, 167, 69)",
                  borderColor: "rgb(40, 167, 69)",
                }}
                name="SaveButton"
                onClick={(e) => handleSubmitQuery(e, "save")}
              >
                {loadingBtn === "save" ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save"
                )}
                
              </button> */}
              <button
                className="btn btn-dark btn-custom-size"
                style={{
                  backgroundColor: "rgb(0, 123, 255)",
                  borderColor: "rgb(0, 123, 255)",
                }}
                name="SaveButton"
                onClick={(e) => handleSubmitQuery(e, "preview")}
              >
                {loadingBtn === "preview" ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Preview
                  </>
                ) : (
                  "Preview"
                )}
              </button>

              <button
                className="btn btn-primary btn-custom-size"
                name="SubmitButton"
                name="SaveButton"
                onClick={(e) => handleSubmitQuery(e, "submit")}
              >
                {loadingBtn === "submit" ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Submiting...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row text-black m-2 ms-0 pb-1">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center prefrencehover">
            {/* Left side — Query and Type */}
            {state?.tourType && (
              <div className="d-flex justify-content-start align-items-center">
                <span className="me-5 m-0 pe-3 p-0">
                  Query: {state?.queryId}
                </span>
                <div className="d-flex gap-2 px-1 align-items-center box-shadow-1 padding-y-3 rounded">
                  <label
                    htmlFor="pre-toggle"
                    className="m-0 font-size-11 font-weight-500 cursor-pointer"
                  >
                    Pre
                  </label>
                  <div className="toggle-container m-0">
                    <input
                      type="checkbox"
                      className="toggle m-0"
                      id="pre-toggle"
                      checked={toggleValue === "Pre"}
                      value="pre"
                      name="pre"
                      onChange={(e) =>
                        setToggleValue(e.target.checked ? "Pre" : "Post")
                      }
                    />
                    <label
                      htmlFor="pre-toggle"
                      className="toggle-label m-0"
                    ></label>
                  </div>
                </div>

                <div className="d-flex gap-2 px-1 align-items-center box-shadow-1 padding-y-3 rounded">
                  <label
                    htmlFor="post-toggle"
                    className="m-0 font-size-11 font-weight-500 cursor-pointer"
                  >
                    Post
                  </label>
                  <div className="toggle-container m-0">
                    <input
                      type="checkbox"
                      className="toggle m-0"
                      id="post-toggle"
                      checked={toggleValue === "Post"}
                      value="post"
                      name="post"
                      onChange={(e) =>
                        setToggleValue(e.target.checked ? "Post" : "Pre")
                      }
                    />
                    <label
                      htmlFor="post-toggle"
                      className="toggle-label m-0"
                    ></label>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end prefrencehover ">
              {showPreference ? (
                <>
                  <span className="me-5 m-0 pe-3 p-0">Preferences</span>
                  <img
                    src={preferencered}
                    onClick={() => setShowPreference(!showPreference)}
                    style={{
                      color: "red!important",
                      height: "25px",
                      width: "auto",
                      cursor: "pointer",
                      position: "absolute",
                      right: "35px",
                    }}
                    className="pb-2 "
                    alt=""
                  />{" "}
                  <ul>
                    <li className=" d-none">
                      <p>Prefrences</p>
                    </li>
                  </ul>
                </>
              ) : (
                <i
                  className="fa-sharp fa-solid fa-arrow-right fs-3 fs-md-3 fs-lg-2"
                  onClick={() => setShowPreference(!showPreference)}
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "35px",
                    zIndex: "1",
                  }}
                ></i>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-1 m-0 text-black">
        <div className={showPreference ? "col-lg-9 p-1" : "col-lg-8 p-1 pe-0"}>
          <div className="row m-0">
            <div className="col-lg-6 p-1">
              <div className="row m-0">
                <div className="col-12 p-0">
                  <Contact
                    validationErorrs={validationErorrs}
                    queryType={queryType}
                  />
                </div>
                <div className="col-12 p-0">
                  <PaxDetail queryType={queryType} />
                </div>
              </div>
            </div>
            <div className="col-lg-6 p-1 ">
              <div
                className="row m-0 query"
                style={{
                  height: !queryType.includes(1) ? "40rem" : "40rem",
                  overflow: "hidden auto",
                }}
              >
                <div
                  className="col-12 p-0"
                  style={{
                    display: queryType.some((item) => [4, 5, 6].includes(item))
                      ? "none"
                      : "block",
                  }}
                >
                  {!queryType.some((item) => [4, 5, 6].includes(item)) && (
                    <Accomodation />
                  )}
                </div>
                <div className="col-12 p-0">
                  <TravelInfo queryType={queryType} />
                  {queryType?.includes(4) && (
                    <FlightServices queryType={queryType} />
                  )}
                  {queryType?.includes(5) && (
                    <VisaServices queryType={queryType} />
                  )}
                  {queryType?.includes(6) && (
                    <InsuranceService queryType={queryType} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={showPreference ? "col-lg-3 p-0 ps-0" : "col-lg-4 p-1 ps-0"}
        >
          <div className="row py-1 m-0">
            <div
              className={showPreference ? "col-md-12 p-0 ps-0" : "col-md-7 p-1"}
            >
              <Destination queryType={queryType} />
            </div>

            <div className={showPreference ? "d-none" : "col-md-5 p-1"}>
              <SetPreference
                validationErorrs={validationErorrs}
                queryType={queryType}
              />
            </div>
          </div>
        </div>
        {/* <div className="col-lg-4 p-0">
          <div className="row py-1 m-0">
            <div className="col-md-7 p-1">
              <Destination queryType={queryType} />
            </div>
            <div className="col-md-5 p-1">
              <SetPreference
                validationErorrs={validationErorrs}
                queryType={queryType}
              />
            </div>
            <div className="col-md-7 p-1">
              <Destination />
            </div>
          </div>
        </div> */}
        <div className="col-12 p-0 mt-4">
          <div className="form-group" dir="ltr">
            <label htmlFor="exampleFormControlTextarea1" className="m-0">
              Notes
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={formValue?.Description || ""}
              name="Description"
              onChange={(event, editor) => {
                const data = editor.getData();
                handleDescription(data, editor);
              }}
            />
          </div>
        </div>
        <div className="col-12 p-0 d-flex justify-content-end mt-4 gap-2">
          {/* <button
            className="btn btn-dark btn-custom-size"
            style={{
              backgroundColor: "rgb(40, 167, 69)",
              borderColor: "rgb(40, 167, 69)",
            }}
            name="SaveButton"
            onClick={(e) => handleSubmitQuery(e, "save")}
          >
            {loadingBtn === "save" ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button> */}
          {/* <button
            className="btn btn-dark btn-custom-size"
            style={{
              backgroundColor: "rgb(0, 123, 255)",
              borderColor: "rgb(0, 123, 255)",
            }}
            name="SaveButton"
            onClick={(e) => handleSubmitQuery(e, "preview")}
          >
            Preview
          </button> */}
          <button
            className="btn btn-dark btn-custom-size"
            style={{
              backgroundColor: "rgb(0, 123, 255)",
              borderColor: "rgb(0, 123, 255)",
            }}
            name="SaveButton"
            onClick={(e) => handleSubmitQuery(e, "preview")}
          >
            {loadingBtn === "preview" ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Preview
              </>
            ) : (
              "Preview"
            )}
          </button>
          <button
            className="btn btn-primary btn-custom-size"
            name="SubmitButton"
            name="SaveButton"
            onClick={(e) => handleSubmitQuery(e, "submit")}
          >
            {loadingBtn === "submit" ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>Submiting...</span>
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
      {/* </div> */}
    </addQueryContext.Provider>
  );
};

export default CreateQuery;
export { addQueryContext };
