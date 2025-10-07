const initialValue = {
  tab: "main-itinerary",
};

const itineraryTabWiseDataLoad = (state = initialValue, action) => {
  switch (action.type) {
    case "SET-TAB":
      return { ...state, tab: action?.payload };
    default:
      return state;
  }
};

export default itineraryTabWiseDataLoad;
