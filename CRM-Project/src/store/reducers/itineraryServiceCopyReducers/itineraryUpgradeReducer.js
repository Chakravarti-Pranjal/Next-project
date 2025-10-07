const initialState = {
    transportData: {},
    transportButton: true,
  };
  
  const itineraryUpgradeReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET-UPGRADE-TRANSPORT":
        return { ...state, transportData: action?.payload };
        case "SET-UPGRADE-BUTTON":
          return { ...state, transportButton: action?.payload };
      default:
        return state;
    }
  };
  
  export default itineraryUpgradeReducer ;
  