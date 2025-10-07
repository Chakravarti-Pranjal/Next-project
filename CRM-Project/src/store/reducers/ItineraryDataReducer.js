const initialValue = {
  hotelFormData: {},
  hotelServiceData: [],
  monumentFormData: [],
  guideFormData: [],
  transportFormData: [],
  activityFormData: [],
  activityFormDataServiceCost: {},
  restaurantFormData: [],
  restaurantMealData: [],
  trainFormData: [],
  flightFormData: [],
  additionalFormData: [],
  upgradeAdditionalFormData: [],
  additionalFormDataServiceCost: {},
  localMonumentFormData: [],
  localActivityFormData: [],
  localAdditionalFormData: [],
  localTrainFormData: [],
  localAirFormData: [],
  localHotelFormData: [],
  localMealFormData: [],
  localResturantFormData: [],
  foreignMonumentFormData: [],
  foreignActivityFormData: [],
  foreignAdditionalFormData: [],
  transportUpgradeFormData: [],
  foreignTrainFormData: [],
  foreignAirFormData: [],
  foreignHotelFormData: [],
  foreignMealFormData: [],
  foreignRestaurantFormData: [],
};

export const itineraryReducer = (state = initialValue, action) => {
  switch (action.type) {
    case "HOTEL-DATA":
      return { ...state, hotelFormData: action?.payload };
    case "RESET-HOTEL-DATA":
      return { ...state, hotelFormData: [] };
    case "SET_hotelservicedata":
      return { ...state, hotelServiceData: action?.payload };
    case "RESET-SET_hotelservicedata":
      return { ...state, hotelServiceData: {} };
    case "MONUMENT-DATA":
      return { ...state, monumentFormData: action?.payload };
    case "RESET-MONUMENT-DATA":
      return { ...state, monumentFormData: [] };
    case "GUIDE-DATA":
      return { ...state, guideFormData: action?.payload };
    case "RESET-GUIDE-DATA":
      return { ...state, guideFormData: [] };
    case "TRANSPORT-DATA":
      return { ...state, transportFormData: action?.payload };
    case "RESET-TRANSPORT-DATA":
      return { ...state, transportFormData: [] };
    case "ACTIVITY-DATA":
      return { ...state, activityFormData: action?.payload };
    case "ACTIVITY-DATA-SERVICE-COST":
      return { ...state, activityFormDataServiceCost: action?.payload };
    case "RESET-ACTIVITY-DATA":
      return { ...state, activityFormData: [] };
    case "RESTAURANT-DATA":
      return { ...state, restaurantFormData: action?.payload };
    case "RESET-RESTAURANT-DATA":
      return { ...state, restaurantFormData: [] };
    case "RESTAURANT-MEAL-DATA":
      return { ...state, restaurantMealData: action?.payload };
    case "RESET-RESTAURANT-MEAL-DATA":
      return { ...state, restaurantMealData: [] };

    case "TRAIN-DATA":
      return { ...state, trainFormData: action?.payload };
    case "RESET-TRAIN-DATA":
      return { ...state, trainFormData: [] };
    case "FLIGHT-DATA":
      return { ...state, flightFormData: action?.payload };
    case "RESET-FLIGHT-DATA":
      return { ...state, flightFormData: [] };
    case "ADDITIONAL-DATA":
      return { ...state, additionalFormData: action?.payload };
    case "UPGRADE-ADDITIONAL-DATA":
      return { ...state, upgradeAdditionalFormData: action?.payload };
    case "ADDITIONAL-DATA-SERVICE-COST":
      return { ...state, additionalFormDataServiceCost: action?.payload };
    case "ADDITIONAL-DATA-SERVICE-COST":
      return { ...state, additionalFormDataServiceCost: {} };
    case "RESET-ADDITIONAL-DATA":
      return { ...state, additionalFormData: [] };
    case "MONUMENT-LOCAL-DATA":
      return { ...state, localMonumentFormData: action?.payload };
    case "RESET-LOCAL-MONUMENT-DATA":
      return { ...state, localMonumentFormData: [] };
    case "ACTIVITY-LOCAL-DATA":
      return { ...state, localActivityFormData: action?.payload };
    case "RESET-LOCAL-ACTIVITY-DATA":
      return { ...state, localActivityFormData: [] };
    case "ADDITIONAL-LOCAL-DATA":
      return { ...state, localAdditionalFormData: action?.payload };
    case "RESET-LOCAL-ADDITIONAL-DATA":
      return { ...state, localAdditionalFormData: [] };
    case "TRAIN-LOCAL-DATA":
      return { ...state, localTrainFormData: action?.payload };
    case "RESET-LOCAL-TRAIN-DATA":
      return { ...state, localTrainFormData: [] };
    case "AIR-LOCAL-DATA":
      return { ...state, localAirFormData: action?.payload };
    case "RESET-LOCAL-AIR-DATA":
      return { ...state, localAirFormData: [] };
    case "HOTEL-LOCAL-DATA":
      return { ...state, localHotelFormData: action?.payload };
    case "RESET-LOCAL-HOTEL-DATA":
      return { ...state, localHotelFormData: [] };
    case "MEAL-LOCAL-DATA":
      return { ...state, localMealFormData: action?.payload };
    case "RESET-LOCAL-MEAL-DATA":
      return { ...state, localMealFormData: [] };
    case "RESTURANT-LOCAL-DATA":
      return { ...state, localResturantFormData: action?.payload };
    case "RESET-LOCAL-RESTURANT-DATA":
      return { ...state, localResturantFormData: [] };
    case "MONUMENT-FOREIGN-DATA":
      return { ...state, foreignMonumentFormData: action?.payload };
    case "RESET-FOREIGN-MONUMENT-DATA":
      return { ...state, foreignMonumentFormData: [] };

    case "ACTIVITY-FOREIGN-DATA":
      return { ...state, foreignActivityFormData: action?.payload };
    case "RESET-FOREIGN-ACTIVITY-DATA":
      return { ...state, foreignActivityFormData: [] };

    case "ADDITIONAL-FOREIGN-DATA":
      return { ...state, foreignAdditionalFormData: action?.payload };
    case "RESET-FOREIGN-ADDITIONAL-DATA":
      return { ...state, foreignAdditionalFormData: [] };

    case "TRAIN-FOREIGN-DATA":
      return { ...state, foreignTrainFormData: action?.payload };
    case "RESET-FOREIGN-TRAIN-DATA":
      return { ...state, foreignTrainFormData: [] };
    case "AIR-FOREIGN-DATA":
      return { ...state, foreignAirFormData: action?.payload };
    case "RESET-FOREIGN-AIR-DATA":
      return { ...state, foreignAirFormData: [] };

    case "HOTEL-FOREIGN-DATA":
      return { ...state, foreignHotelFormData: action?.payload };
    case "RESET-FOREIGN-HOTEL-DATA":
      return { ...state, foreignHotelFormData: [] };

    case "MEAL-FOREIGN-DATA":
      return { ...state, foreignMealFormData: action?.payload };
    case "RESET-FOREIGN-MEAL-DATA":
      return { ...state, foreignMealFormData: [] };

    case "RESTAURANT-FOREIGN-DATA":
      return { ...state, foreignRestaurantFormData: action?.payload };
    case "RESET-FOREIGN-RESTAURANT-DATA":
      return { ...state, foreignRestaurantFormData: [] };

    default:
      return state;
  }
};
