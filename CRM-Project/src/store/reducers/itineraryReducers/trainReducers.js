const initialValue = {
  trainFormDataMain: [],
};

export const itineraryFromDataReducer = (state = initialValue, action) => {
  switch (action.type) {
    case "TRAIN-FORM-DATA":
      return { ...state, trainFormDataMain: action?.payload };
    default:
      return state;
  }
};
