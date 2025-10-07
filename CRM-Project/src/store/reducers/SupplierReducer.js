const initialState = {
    communicationData: {},
    
  };
  
  export const supplierReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET-COMMUNICATION-DATA":
        return { ...state, communicationData: action.payload };
      case "RESET-COMMUNICATION-DATA":
        return { ...state, communicationData: {} };
      default:
        return state;
    }
  };
  