const initialState = {
  messageData: "",
  perefernceValue: false,
};

export const MessageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET-MESSAGE-DATA":
      return { ...state, messageData: action.payload };
    case "RESET-MESSAGE-DATA":
      return { ...state, messageData: "" };
    case "SET-PEREFERENCE-TOGGLE":
      return { ...state, perefernceValue: !state.perefernceValue };
    // case "SET-FALSE":
    //   return { ...state, perefernceValue: false };

    default:
      return state;
  }
};
