const initialState = {
  local: false,
  foreigner: false,
  toggleLocalForeigner: 1,
  incrementLocalForeignerSlab: 1,
  incrementMainSlab: [],
  incrementForeignerSlab: [],
  ForeignerRefreshTrigger: 0,
};

const createExcortDayLocalForeigner = (state = initialState, action) => {
  switch (action.type) {
    case "EXCORT-LOCAL":
      return {
        ...state,
        local: true,
      };
    case "EXCORT-FOREIGNER":
      return {
        ...state,
        foreigner: true,
      };
    case "TOGGLE-MAIN-FOREIGNER-SALB":
      return {
        ...state,
        toggleLocalForeigner: action.payload,
      };
    case "INCRE-MAIN-FOREIGNER-SALB":
      return {
        ...state,
        incrementLocalForeignerSlab: action.payload,
      };
    case "INCRE-FORGN-PAX-SLAB":
      return {
        ...state,
        incrementForeignerSlab: action.payload,
      };
    case "INCRE-MAIN-PAX-SLAB":
      return {
        ...state,
        incrementMainSlab: action.payload,
      };
    case "FORN-REFRESH-KEY":
      return {
        ...state,
        ForeignerRefreshTrigger: state?.ForeignerRefreshTrigger + 1,
      };
    default:
      return state;
  }
};

export default createExcortDayLocalForeigner;
