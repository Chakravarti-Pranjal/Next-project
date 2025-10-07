const initialState = {
  serviceData: null,
  OptionQoutationData: {},
  selectTab: "communication",
  hideSendBtn: true,
  UpdateLocalEscortCharges: 0,
  UpdateForeignEscortCharges: 0,
  paxSlabApiLoad: 0,
  commissionLoad: 0,
};

const supplierStateChange = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LIST_MULTIPLE_QUOTATION":
      return {
        ...state,
        OptionQoutationData: action.payload,
      };
    case "SET_SERVICE_DATA":
      return {
        ...state,
        serviceData: action.payload,
      };
    case "CHANGE_TAB":
      return {
        ...state,
        selectTab: action.payload,
      };
    case "HIDE_SEND_BTN":
      return {
        ...state,
        hideSendBtn: action.payload,
      };
    case "UPDATE_LOCAL_ESCORT_CHARGES":
      return {
        ...state,
        UpdateLocalEscortCharges:
          action.payload || state.UpdateLocalEscortCharges + 1,
      };
    case "UPDATE_FOREIGN_ESCORT_CHARGES":
      return {
        ...state,
        UpdateForeignEscortCharges:
          action.payload || state.UpdateForeignEscortCharges + 1,
      };
    case "SET-PAXSLAB-LOAD":
      return {
        ...state,
        paxSlabApiLoad: action.payload || state.paxSlabApiLoad + 1,
      };
    case "RESET-PAXSLAB-LOAD":
      return {
        ...state,
        paxSlabApiLoad: action.payload !== undefined ? action.payload : 0,
      };
    case "SET-commission-LOAD":
      return {
        ...state,
        commissionLoad: state.commissionLoad + 1,
      };
    case "RESET-commission-LOAD":
      return {
        ...state,
        commissionLoad: action.payload !== undefined ? action.payload : 0,
      };
    default:
      return state;
  }
};

export default supplierStateChange;
