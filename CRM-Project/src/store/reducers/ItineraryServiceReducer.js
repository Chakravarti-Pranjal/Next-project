const initialValue = {
  TransportService: [],
  GuideService: [],
  RestaurantService: [],
  AutoGuideCheck: true,
};

const ItineraryServiceReducer = (state = initialValue, action) => {
  switch (action.type) {
    case "SET-TRANSPORT-SERVICE-FORM":
      return { ...state, TransportService: action.payload };
    case "RESET-TRANSPORT-SERVICE-FOR":
      return { ...state, TransportService: [] };
    case "SET-GUIDE-SERVICE-FORM":
      return { ...state, GuideService: action.payload };
    case "RESET-GUIDE-SERVICE-FORM":
      return { ...state, GuideService: [] };
    case "SET-RESTAURANT-SERVICE-FORM":
      return { ...state, RestaurantService: action.payload };
    case "RESET-RESTAURANT-SERVICE-FORM":
      return { ...state, RestaurantService: [] };
    case "AUTO-GUIDE-TOGGLE":
      return { ...state, AutoGuideCheck: !state?.AutoGuideCheck };
    default:
      return state;
  }
};

export default ItineraryServiceReducer;
