export const setOptionQuotationData = (data) => {
  return {
    type: "SET_LIST_MULTIPLE_QUOTATION",
    payload: data,
  };
};
export const setExcortDayLocal = () => {
  return {
    type: "EXCORT-LOCAL",
  };
};
export const setExcortDayForeigner = () => {
  return {
    type: "EXCORT-FOREIGNER",
  };
};
export const setHideSendBtn = (data) => {
  return {
    type: "HIDE_SEND_BTN",
    payload: data,
  };
};
export const incrementLocalEscortCharges = (data) => {
  return {
    type: "UPDATE_LOCAL_ESCORT_CHARGES",
    payload: data,
  };
};

export const incrementForeignEscortCharges = (data) => {
  return {
    type: "UPDATE_FOREIGN_ESCORT_CHARGES",
    payload: data,
  };
};

export const paxSlabApiLoadAction = (data) => {
  return {
    type: "SET-PAXSLAB-LOAD",
    payload: data,
  };
};

export const resetPaxSlabApiLoadAction = (data) => {
  return {
    type: "RESET-PAXSLAB-LOAD",
    payload: data,
  };
};
export const commissionLoadAction = (data) => {
  return {
    type: "SET-commission-LOAD",
    payload: data,
  };
};
export const resetcommissionLoadAction = (data) => {
  return {
    type: "RESET-commission-LOAD",
    payload: data,
  };
};

export const toggleMainPaxSlabForignerSlab = (data) => {
  return {
    type: "TOGGLE-MAIN-FOREIGNER-SALB",
    payload: data,
  };
};

export const incrementMainPaxSlabForignerSlab = (data) => {
  return {
    type: "INCRE-MAIN-FOREIGNER-SALB",
    payload: data,
  };
};

export const incrementForeignerPaxSlab = (data) => {
  return {
    type: "INCRE-FORGN-PAX-SLAB",
    payload: data,
  };
};
export const incrementMainPaxSlab = (data) => {
  return {
    type: "INCRE-MAIN-PAX-SLAB",
    payload: data,
  };
};

export const foreignerRefreshKey = (data) => {
  return {
    type: "FORN-REFRESH-KEY",
    payload: data,
  };
};
