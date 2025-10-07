const initialState = {
  queryQuotationData: "",
  queryFourDataRedux: "",
};

export const queryQuotationFourReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET-QUOTATION-FOUR-DATA":
      return { ...state, queryQuotationData: action.payload };
    case "SET-QUERY-FOUR-DATA":
      return { ...state, queryFourDataRedux: action.payload };
    default:
      return state;
  }
};
