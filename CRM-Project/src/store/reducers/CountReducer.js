const initialState = {
  notificationCount: 0,
  chatCount: 0,
};

const countReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION_COUNT":
      return { ...state, notificationCount: Number(action.payload) };
    case 'INCREMENT_NOTIFICATION_COUNT':
      return { ...state, notificationCount: state.notificationCount + 1 };
    case "SET_CHAT_COUNT":
      return { ...state, chatCount: action.payload };
    case "INCREMENT_SET_CHAT_COUNT":
      return { ...state, chatCount: state.chatCount + 1 };
    default:
      return state;
  }
};

export default countReducer;
