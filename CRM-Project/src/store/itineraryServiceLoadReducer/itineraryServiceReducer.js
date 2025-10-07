const initialState = {
  monument: false,
  guide: false,
  transport: false,
  transportmain: false,
  activity: false,
  restaurant: false,
  train: false,
  flight: false,
  additional: false,
};

const inineraryServiceDataLoad = (state = initialState, action) => {
  switch (action.type) {
    case "SET_MONUMENT_DATA_LOAD":
      return {
        ...state,
        monument: action.payload,
      };
    case "SET_GUIDE_DATA_LOAD":
      return {
        ...state,
        guide: action.payload,
      };
    case "SET_TRANSPORT_DATA_LOAD":
      return {
        ...state,
        transport: action.payload,
      };
    case "SET_TRANSPORT_DATA_LOADmain":
      console.log("Setting transportmain to:", action.payload);
      return {
        ...state,
        transportmain: action.payload,
      };
    case "SET_ACTIVITY_DATA_LOAD":
      return {
        ...state,
        activity: action.payload,
      };
    case "SET_RESTAURANT_DATA_LOAD":
      return {
        ...state,
        restaurant: action.payload,
      };
    case "SET_TRAIN_DATA_LOAD":
      console.log(action.payload, "VCHDG877");
      return {
        ...state,
        train: action.payload,
      };
    case "SET_FLIGHT_DATA_LOAD":
      return {
        ...state,
        flight: action.payload,
      };
    case "SET_ADDITIONAL_DATA_LOAD":
      return {
        ...state,
        additional: action.payload,
      };

    default:
      return state;
  }
};

export default inineraryServiceDataLoad;
