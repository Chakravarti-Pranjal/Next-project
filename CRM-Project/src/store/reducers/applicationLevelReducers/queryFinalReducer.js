const initialState = {
  finalQueryData: false,
  finalQueryDataJson: [],
};

const finalQueryDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FINAL_QUERY":
      return { ...state, finalQueryData: action?.payload };
    case "SET_FINAL_QUERY_DATA":
      return { ...state, finalQueryDataJson: action?.payload };
    default:
      return state;
  }
};

export default finalQueryDataReducer;
