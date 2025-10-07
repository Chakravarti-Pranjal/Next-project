export const setQueryData = (data) => {
  return {
    type: "SET-QUERY-DATA",
    payload: data,
  };
};
export const resetQueryData = () => {
  return {
    type: "RESET-QUERY-DATA",
  };
};
export const setQoutationData = (data) => {
  return {
    type: "SET-QOUTATION-DATA",
    payload: data,
  };
};
export const DayServicesCondition = (data) => {
  return {
    type: "DAY-SERVICES-CONDITION",
    payload: data,
  };
};
export const resetQoutationData = () => {
  return {
    type: "RESET-QOUTATION-DATA",
  };
};
export const setQueryUpdateData = (data) => {
  return {
    type: "SET-QUERY-UPDATE-DATA",
    payload: data,
  };
};
export const resetQueryUpdateData = () => {
  return {
    type: "RESET-QUERY-UPDATE-DATA",
  };
};
export const setPolicyData = (data) => {
  return {
    type: "SET-POLICY-DATA",
    payload: data,
  };
};
export const resetPolicyData = () => {
  return {
    type: "RESET-POLICY-DATA",
  };
};
export const setItineraryHeaderDropdonw = (data) => {
  return {
    type: "STORE-ITINERARY-DROPDOWN",
    payload: data,
  };
};
export const resetItineraryHeaderDropdown = () => {
  return {
    type: "RESET-ITINERARY-DROPDOWN",
  };
};
export const storeMonumentDayType = (data) => {
  return {
    type: "SET-DAY-TYPE",
    payload: data,
  };
};
export const resetMonumentDayType = () => {
  return {
    type: "RESET-DAY-TYPE",
  };
};
export const setItineraryEditingTrue = () => {
  return {
    type: "ITINERARY-EDITING-TRUE",
  };
};
export const setItineraryEditingFalse = () => {
  return {
    type: "ITINERARY-EDITING-FALSE",
  };
};
export const setHeadingShowTrue = () => {
  return {
    type: "SHOW-SUBJECT-HEADING",
  };
};
export const setHeadingShowFalse = () => {
  return {
    type: "HIDE-SUBJECT-HEADING",
  };
};
export const setQoutationSubject = (data) => {
  return {
    type: "SET-QOUTATION-SUBJECT",
    payload: data,
  };
};
export const resetQoutationSubject = () => {
  return {
    type: "RESET-QOUTATION-SUBJECT",
  };
};
export const setItineraryHotelFormValue = (data) => {
  return {
    type: "SET-ITNRY-HOTEL",
    payload: data,
  };
};
export const resetItineraryHotelFormValue = () => {
  return {
    type: "RESET-ITNRY-HOTEL",
  };
};
export const setLocalHotelFormValue = (data) => {
  return {
    type: "SET-LOCAL-HOTEL",
    payload: data,
  };
};
export const resetLocalHotelFormValue = () => {
  return {
    type: "RESET-LOCAL-HOTEL",
  };
};

export const setLocalMonumentFormValue = (data) => {
  return {
    type: "SET-LOCAL-MONUMENT",
    payload: data,
  };
};

export const resetLocalMonumentFormValue = () => {
  return {
    type: "RESET-LOCAL-MONUMENT",
  };
};
export const setHotelFinalValue = (data) => {
  return {
    type: "SET-FINAL-HOTEL",
    payload: data,
  };
};

export const resetHotelFinalValue = () => {
  return {
    type: "RESET-FINAL-HOTEL",
  };
};

export const setFinalMonumentFormValue = (data) => {
  return {
    type: "SET-FINAL-MONUMENT",
    payload: data,
  };
};

export const resetFinalMonumentFormValue = () => {
  return {
    type: "RESET-FINAL-MONUMENT",
  };
};
export const setGuideFinalValue = (data) => {
  console.log(data, "data110");

  return {
    type: "SET-FINAL-GUIDE",
    payload: data,
  };
};

export const resetGuideFinalValue = () => {
  return {
    type: "RESET-FINAL-GUIDE",
  };
};
export const setTransportFinalForm = (data) => {
  // console.log(data,"data110");

  return {
    type: "SET-FINAL-TRANSPORT",
    payload: data,
  };
};

export const resetTransportFinalForm = () => {
  return {
    type: "RESET-FINAL-TRANSPORT",
  };
};
export const setActivityFinalData = (data) => {
  // console.log(data,"data110");

  return {
    type: "SET-FINAL-ACTIVITY",
    payload: data,
  };
};

export const resetActivityFinalData = () => {
  return {
    type: "RESET-FINAL-ACTIVITY",
  };
};
export const setAdditionalFinalForm = (data) => {
  // console.log(data,"data110");

  return {
    type: "SET-FINAL-ADDITIONAL",
    payload: data,
  };
};

export const resetAdditionalFinalForm = () => {
  return {
    type: "RESET-FINAL-ADDITIONAL",
  };
};
export const setRestaurantFinalForm = (data) => {
  console.log(data, "data110");

  return {
    type: "SET-FINAL-RESTAURANT",
    payload: data,
  };
};

export const resetRestaurantFinalForm = () => {
  return {
    type: "RESET-FINAL-RESTAURANT",
  };
};
export const setTrainformdata = (data) => {
  // console.log(data,"data110");

  return {
    type: "SET-FINAL-TRAIN",
    payload: data,
  };
};

export const resetTrainformdata = () => {
  return {
    type: "RESET-FINAL-TRAIN",
  };
};
export const setFightFinaldata = (data) => {
  // console.log(data,"data110");

  return {
    type: "SET-FINAL-Flight",
    payload: data,
  };
};

export const resetFightFinaldata = () => {
  return {
    type: "RESET-FINAL-Flight",
  };
};

export const SET_TRUE = (data) => {
  return {
    type: "SET_TRUE",
    payload: data,
  };
};
export const SET_FALSE = () => {
  return {
    type: "SET_FALSE",
  };
};
export const setQueryTravelData = (data) => {
  return {
    type: "SET-QUERYTRAVEL-DATA",
    payload: data,
  };
};
export const resetQueryTravelData = () => {
  return {
    type: "RESET-QUERYTRAVEL-DATA",
  };
};
export const setQuotationDataOperation = (data) => {
  return {
    type: "SET-QUOTATION-DATA-OPERATION",
    payload: data,
  };
};
export const resetQuotationDataOperation = () => {
  return {
    type: "RESET-QUOTATION-DATA-OPERATION",
  };
};
export const setCreateQueryData = (data) => {
  return {
    type: "SET-CREATE-QUERY-DATA",
    payload: data,
  };
};
export const resetCreateQueryData = () => {
  return {
    type: "RESET-CREATE-QUERY-DATA",
  };
};
export const setPayloadQueryData = (data) => {
  return {
    type: "SET-PAYLOAD-QUERY-DATA",
    payload: data,
  };
};
export const resetPayloadQueryData = () => {
  return {
    type: "RESET-PAYLOAD-QUERY-DATA",
  };
};
export const setQoutationResponseData = (data) => {
  return {
    type: "SET-QOUTATION-RESPONSE",
    payload: data,
  };
};
export const resetQoutationResponseData = () => {
  return {
    type: "RESET-QOUTATION-RESPONSE",
  };
};
export const setSummaryIncAndExc = (data) => {
  return {
    type: "SET-INC-EXC",
    payload: data,
  };
};
export const resetSummaryIncAndExc = () => {
  return {
    type: "RESET-INC-EXC",
  };
};
export const setSummaryVisa = (data) => {
  return {
    type: "SET-SUMMARY-VISA",
    payload: data,
  };
};
export const resetSummaryVisa = () => {
  return {
    type: "RESET-SUMMARY-VISA",
  };
};
export const setSubjectProgramName = (data) => {
  return {
    type: "SET-Subject-ProgramName",
    payload: data,
  };
};
export const resetSubjectProgramName = () => {
  return {
    type: "RESET-Subject-ProgramName",
  };
};
export const setItineraryHeading = (data) => {
  return {
    type: "SET-ITINERARY-HEAD",
    payload: data,
  };
};
export const resetItineraryHeading = (data) => {
  return {
    type: "RESET-ITINERARY-HEAD",
  };
};
