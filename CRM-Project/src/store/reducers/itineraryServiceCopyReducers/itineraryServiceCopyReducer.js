const initialState = {
  hotelData: {},
  additionalData: {},
  activityData: {},
  restaurantData: {},
  transportData: {},
  monumentData: {},
  trainData: {},
  flightData: {},
  hotelCheckbox: { local: true, foreigner: true },
  additionalCheckbox: true,
  activityCheckbox: { local: true, foreigner: true },
  restaurantCheckbox: true,
  transportCheckbox: { local: true, foreigner: true },
  monumentCheckbox: true,
  trainCheckbox: { local: true, foreigner: true },
  flightCheckbox: { local: true, foreigner: true },
};

const itineraryServiceCopyReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET-COPY-HOTEL":
      if (!state.hotelCheckbox.local || !state.hotelCheckbox.foreigner) return;
      return { ...state, hotelData: action?.payload };
    case "SET-COPY-ADDITIONAL":
      return { ...state, additionalData: action?.payload };
    case "SET-COPY-ACTIVITY":
      return { ...state, activityData: action?.payload };
    case "SET-COPY-RESTAURANT":
      return { ...state, restaurantData: action?.payload };
    case "SET-COPY-TRANSPORT":
      return { ...state, transportData: action?.payload };
    case "SET-COPY-MONUMENT":
      return { ...state, monumentData: action?.payload };
    case "SET-COPY-TRAIN":
      return { ...state, trainData: action?.payload };
    case "SET-COPY-FLIGHT":
      return { ...state, flightData: action?.payload };
    case "SET-HOTEL-CHECKBOX":
      return {
        ...state,
        hotelCheckbox: {
          ...state.hotelCheckbox,
          ...action.payload,
        },
      };
    case "SET-ADDITIONAL-CHECKBOX":
      return { ...state, additionalCheckbox: action?.payload };
    case "SET-ACTIVITY-CHECKBOX":
      return {
        ...state,
        activityCheckbox: {
          ...state.activityCheckbox,
          ...action.payload,
        },
      };
    case "SET-RESTAURANT-CHECKBOX":
      return { ...state, restaurantCheckbox: action?.payload };
    case "SET-TRANSPORT-CHECKBOX":
      return {
        ...state,
        transportCheckbox: {
          ...state.hotelCheckbox,
          ...action.payload,
        },
      };
    case "SET-MONUMENT-CHECKBOX":
      return { ...state, monumentCheckbox: action?.payload };
    case "SET-TRAIN-CHECKBOX":
      return {
        ...state,
        trainCheckbox: {
          ...state.hotelCheckbox,
          ...action.payload,
        },
      };
    case "SET-FLIGHT-CHECKBOX":
      return {
        ...state,
        flightCheckbox: {
          ...state.hotelCheckbox,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default itineraryServiceCopyReducer;
