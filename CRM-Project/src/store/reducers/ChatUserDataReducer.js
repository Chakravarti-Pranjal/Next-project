const initialState = {
    chatData: [],
};

const chatUserDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SAVE_CHAT_USER_DATA": // Yeh action open karne ke liye
            return {
                ...state,
                chatData: [action.payload], // Push new item into array
            };
        default:
            return state;
    }
};

export default chatUserDataReducer;