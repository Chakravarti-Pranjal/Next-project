const initialState = {
  items: false,
};

const activeTabReducer = (state = initialState, action) => {
  switch (action.type) {
    // case "ADD_CHAT":
    //   return { ...state, items: "chat" };
    // case "ADD_NOTIFICATION":
    //   return { ...state, items: "alerts" };
    case "OPEN_MSG": // Yeh action open karne ke liye
      return { ...state, items: true };
    case "CLOSE_MSG": // Yeh action close karne ke liye
      return { ...state, items: false };
    default:
      return state;
  }
};

export default activeTabReducer;
