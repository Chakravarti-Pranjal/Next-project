const initialState = {
  queryData: "",
  qoutationData: "",
  queryUpdateData: "",
  qoutationResponseData: {},
  policyData: "",
  dayTypeArr: "",
  isItineraryEditing: false,
  isShowingSubjectHeading: false,
  qoutationSubject: "",
  itineraryHotelValue: {},
  localHotelValue: {},
  localMonumentValue: {},
  ToolTipShow: true,
  queryTravelData: [],
  quotationDataOperation: [],
  createQueryData: [],
  payloadQueryData: {},
  summaryIncAndExc: [],
  summaryVisa: {},
  itineryHeading: {},
  dayServicesCondition: null,
  FinalHotelvalue: {},
  FinalMonumentvalue: {},
  FinalGuidevalue: {},
  FinalTransportvalue: {},
  FinalActivityvalue: {},
  FinalAddtionalvalue: {},
  FinalRestaurantvalue: {},
  FinalTrainvalue: {},
  FinalFlightvalue: {},
};

export const queryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "DAY-SERVICES-CONDITION":
      return { ...state, dayServicesCondition: action.payload };
    case "DAY-SERVICES-CONDITION":
      return { ...state, dayServicesCondition: null };
    case "SET-QUERY-DATA":
      console.log(action.payload, "WSYAXSFG3837A");
      return { ...state, queryData: action.payload };
    case "RESET-QUERY-DATA":
      return { ...state, queryData: "" };
    case "SET-QUERY-UPDATE-DATA":
      return { ...state, queryUpdateData: action.payload };
    case "RESET-QUERY-UPDATE-DATA":
      return { ...state, queryUpdateData: "" };
    case "SET-QOUTATION-DATA":
      // console.log("AQoutationData", action.payload);
      return { ...state, qoutationData: action.payload };
    case "RESET-QOUTATION-DATA":
      return { ...state, qoutationData: "" };
    case "SET-POLICY-DATA":
      return { ...state, policyData: action.payload };
    case "RESET-POLICY-DATA":
      return { ...state, policyData: "" };
    case "SET-DAY-TYPE":
      // console.log(action?.payload, "checkpayload");
      return { ...state, dayTypeArr: action?.payload };

    case "RESET-DAY-TYPE":
      return { ...state, dayTypeArr: [] };
    case "ITINERARY-EDITING-TRUE":
      return { ...state, isItineraryEditing: true };
    case "ITINERARY-EDITING-FALSE":
      return { ...state, isItineraryEditing: false };
    case "SHOW-SUBJECT-HEADING":
      return { ...state, isShowingSubjectHeading: true };
    case "HIDE-SUBJECT-HEADING":
      return { ...state, isShowingSubjectHeading: false };
    case "SET-QOUTATION-SUBJECT":
      return { ...state, qoutationSubject: action?.payload };
    case "RESET-QOUTATION-SUBJECT":
      return { ...state, qoutationSubject: "" };
    case "SET-ITNRY-HOTEL":
      return { ...state, itineraryHotelValue: action?.payload };
    case "RESET-ITNRY-HOTEL":
      return { ...state, itineraryHotelValue: {} };
    case "SET-LOCAL-HOTEL":
      return { ...state, localHotelValue: action?.payload };
    case "RESET-LOCAL-HOTEL":
      return { ...state, localHotelValue: {} };

    case "SET-LOCAL-MONUMENT":
      return { ...state, localMonumentValue: action?.payload };
    case "RESET-LOCAL-MONUMENT":
      return { ...state, localMonumentValue: {} };
    case "SET-FINAL-HOTEL":
      return { ...state, FinalHotelvalue: action?.payload };
    case "RESET-FINAL-HOTEL":
      return { ...state, FinalHotelvalue: {} };
    case "SET-FINAL-MONUMENT":
      return { ...state, FinalMonumentvalue: action?.payload };
    case "RESET-FINAL-MONUMENT":
      return { ...state, FinalMonumentvalue: {} };
    case "SET-FINAL-GUIDE":
      return { ...state, FinalGuidevalue: action?.payload };
    case "RESET-FINAL-GUIDE":
      return { ...state, FinalGuidevalue: {} };
    case "SET-FINAL-TRANSPORT":
      return { ...state, FinalTransportvalue: action?.payload };
    case "RESET-FINAL-TRANSPORT":
      return { ...state, FinalTransportvalue: {} };
    case "SET-FINAL-ACTIVITY":
      return { ...state, FinalActivityvalue: action?.payload };
    case "RESET-FINAL-ACTIVITY":
      return { ...state, FinalActivityvalue: {} };
    case "SET-FINAL-ADDITIONAL":
      return { ...state, FinalAddtionalvalue: action?.payload };
    case "RESET-FINAL-ADDITIONAL":
      return { ...state, FinalAddtionalvalue: {} };
    case "SET-FINAL-RESTAURANT":
      return { ...state, FinalRestaurantvalue: action?.payload };
    case "RESET-FINAL-RESTAURANT":
      return { ...state, FinalRestaurantvalue: {} };
    case "SET-FINAL-TRAIN":
      return { ...state, FinalTrainvalue: action?.payload };
    case "RESET-FINAL-TRAIN":
      return { ...state, FinalTrainvalue: {} };
    case "SET-FINAL-Flight":
      return { ...state, FinalFlightvalue: action?.payload };
    case "RESET-FINAL-Flight":
      return { ...state, FinalFlightvalue: {} };
    case "SET_TRUE":
      return { ...state, ToolTipShow: action?.payload };
    case "SET_FALSE":
      return { ...state, ToolTipShow: false };
    case "SET-QUERYTRAVEL-DATA":
      return { ...state, queryTravelData: action.payload };
    case "RESET-QUERYTRAVEL-DATA":
      return { ...state, queryTravelData: "" };
    case "SET-QUOTATION-DATA-OPERATION":
      return { ...state, quotationDataOperation: action.payload };
    case "RESET-QUOTATION-DATA-OPERATION":
      return { ...state, quotationDataOperation: [] };
    case "SET-PAYLOAD-QUERY-DATA":
      return { ...state, payloadQueryData: action.payload };
    case "RESET-PAYLOAD-QUERY-DATA":
      return { ...state, payloadQueryData: {} };
    case "SET-QOUTATION-RESPONSE":
      return { ...state, qoutationResponseData: action.payload };
    case "RESET-QOUTATION-RESPONSE":
      return { ...state, qoutationResponseData: {} };
    case "SET-INC-EXC":
      return { ...state, summaryIncAndExc: action.payload };
    case "RESET-INC-EXC":
      return { ...state, summaryIncAndExc: [] };
    case "SET-SUMMARY-VISA":
      return { ...state, summaryVisa: action.payload };
    case "RESET-SUMMARY-VISA":
      return { ...state, summaryVisa: {} };
    case "SET-Subject-ProgramName":
      return { ...state, SubjectProgramName: action.payload };
    case "RESET-Subject-ProgramName":
      return { ...state, SubjectProgramName: {} };
    case "SET-ITINERARY-HEAD":
      return { ...state, itineryHeading: action.payload };
    case "RESET-ITINERARY-HEAD":
      return { ...state, itineryHeading: {} };
    case "RESET-QOUTATION-SUBJECT":
      return { ...state, qoutationSubject: "" };
    default:
      return state;
  }
};
