const intialState = {
  togglePriceState:false,
  HotelPrice: 0,
  MealPrice: 0,
  FlightPrice: 0,
  TrainPrice: 0,
  ActivityPrice: 0,
  TransportPrice: 0,
  GuidePrice: 0,
  MonumentPrice: 0,
  RestaurantPrice: 0,
  AdditinalPrice: 0,
  TotalHotelPricePax: [],
  TotalMealPricePax: [],
  TotalActivityPricePax: "",
  TotalAdditionalPricePax: [],
  TotalMonumentPricePax: "",
  TotalGuidePricePax: "",
  TotalTransportPricePax: "",
  TotalResturantPricePax: "",
  transTypeDrop: [],
};

const priceReducer = (state = intialState, action) => {
  switch (action?.type) {
    case "SET-HOTEL-PRICE":
      return { ...state, HotelPrice: action.payload };
    case "RESET-HOTEL-PRICE":
      return { ...state, HotelPrice: 0 };
    case "SET-MEAL-PRICE":
      return { ...state, MealPrice: action.payload };
    case "RESET-MEAL-PRICE":
      return { ...state, MealPrice: 0 };
    case "SET-FLIGHT-PRICE":
      return { ...state, FlightPrice: action.payload };
    case "RESET-FLIGHT-PRICE":
      return { ...state, FlightPrice: 0 };
    case "SET-TRAIN-PRICE":
      return { ...state, TrainPrice: action.payload };
    case "RESET-TRAIN-PRICE":
      return { ...state, TrainPrice: 0 };
    case "SET-ACTIVITY-PRICE":
      return { ...state, ActivityPrice: action.payload };
    case "RESET-ACTIVITY-PRICE":
      return { ...state, ActivityPrice: 0 };
    case "SET-TRANSPORT-PRICE":
      return { ...state, TransportPrice: action.payload };
    case "RESET-TRANSPORT-PRICE":
      return { ...state, TransportPrice: 0 };
    case "SET-GUIDE-PRICE":
      return { ...state, GuidePrice: action.payload };
    case "RESET-GUIDE-PRICE":
      return { ...state, GuidePrice: 0 };
    case "SET-MONUMENT-PRICE":
      return { ...state, MonumentPrice: action.payload };
    case "RESET-MONUMENT-PRICE":
      return { ...state, MonumentPrice: 0 };
    case "SET-RESTAURANT-PRICE":
      return { ...state, RestaurantPrice: action.payload };
    case "RESET-RESTAURANT-PRICE":
      return { ...state, RestaurantPrice: 0 };
    case "SET-TOTAL-HOTEL-PRICE-PAX":
      return { ...state, TotalHotelPricePax: action.payload };
    case "RESET-TOTAL-HOTEL-PRICE-PAX":
      return { ...state, TotalHotelPricePax: [] };
    case "SET-TOTAL-MEAL-PRICE-PAX":
      return { ...state, TotalMealPricePax: action.payload };
    case "RESET-TOTAL-MEAL-PRICE-PAX":
      return { ...state, TotalMealPricePax: [] };
    case "SET-TOTAL-ACTIVITY-PRICE-PAX":
      return { ...state, TotalActivityPricePax: action.payload };
    case "RESET-TOTAL-ACTIVITY-PRICE-PAX":
      return { ...state, TotalActivityPricePax: "" };
    case "SET-TOTAL-MONUMENT-PRICE-PAX":
      return { ...state, TotalMonumentPricePax: action.payload };
    case "RESET-TOTAL-MONUMENT-PRICE-PAX":
      return { ...state, TotalMonumentPricePax: "" };
    case "SET-TOTAL-GUIDE-PRICE-PAX":
      return { ...state, TotalGuidePricePax: action.payload };
    case "RESET-TOTAL-GUIDE-PRICE-PAX":
      return { ...state, TotalGuidePricePax: "" };
    case "SET-TOTAL-TRANSPORT-PRICE-PAX":
      return { ...state, TotalTransportPricePax: action.payload };
    case "RESET-TOTAL-TRANSPORT-PRICE-PAX":
      return { ...state, TotalTransportPricePax: "" };
    case "SET-TOTAL-RESTURANT-PRICE-PAX":
      return { ...state, TotalResturantPricePax: action.payload };
    case "RESET-TOTAL-RESTURANT-PRICE-PAX":
      return { ...state, TotalResturantPricePax: "" };
    case "SET-TOTAL-ADDITIONAL-PRICE-PAX":
      return { ...state, TotalAdditionalPricePax: action.payload };
    case "RESET-TOTAL-ADDITIONAL-PRICE-PAX":
      return { ...state, TotalAdditionalPricePax: [] };
    case "SET-TRANS-TYPE-DROP-PAX":
      return { ...state, transTypeDrop: action.payload };
    case "RESET-TRANS-TYPE-DROP-PAX":
      return { ...state, transTypeDrop: [] };
    case "ADDITIONAL-PRICE":
      return { ...state, AdditinalPrice: action.payload };
    case "RESET-ADDITIONAL-PIRCE":
      return { ...state, AdditinalPrice: 0 };
    case "TOGGLE-PRICE-STATE":
      return { ...state, togglePriceState:!state?.togglePriceState };
    default:
      return state;
  }
};

export { priceReducer };
