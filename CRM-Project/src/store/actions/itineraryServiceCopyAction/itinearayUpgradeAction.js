// Transport Data
export const setItineraryUpgradeFormData = (data) => {
    return {
      type: "SET-UPGRADE-TRANSPORT",
      payload: data,
    };
  };
  export const setItineraryUpgradeFormDataButton = (data) => {
    return {
      type: "SET-UPGRADE-BUTTON",
      payload: data,
    };
  };