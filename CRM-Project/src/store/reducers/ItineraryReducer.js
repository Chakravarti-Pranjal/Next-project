const headerDropdown = {
  Hotel: "",
  MealPlan: "",
  MonumentPkg: "",
  Activity: "",
  Transfer: "",
  Guide: "",
};

export const itineraryReducer = (state = headerDropdown, action) => {
  switch (action.type) {
    case "SET-QUERY-DATA":
      return { ...state, queryData: action.payload };
    case "RESET-QOUTATION-DATA":
      return { ...state, qoutationData: "" };
    default:
      return state;
  }
};
