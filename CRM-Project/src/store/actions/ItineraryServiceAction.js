export const setTransportServiceForm = (form) => {
  return {
    type: "SET-TRANSPORT-SERVICE-FORM",
    payload: form,
  };
};
export const resetTransportServiceForm = () => {
  return {
    type: "RESET-TRANSPORT-SERVICE-FOR",
  };
};
export const setGuideServiceForm = (form) => {
  return {
    type: "SET-GUIDE-SERVICE-FORM",
    payload: form,
  };
};
export const resetGuideServiceForm = (form) => {
  return {
    type: "RESET-GUIDE-SERVICE-FORM",
    payload: form,
  };
};
export const setRestaurantServiceForm = (form) => {
  return {
    type: "SET-RESTAURANT-SERVICE-FORM",
    payload: form,
  };
};
export const resetRestaurantServiceForm = (form) => {
  return {
    type: "RESET-RESTAURANT-SERVICE-FORM",
  };
};
export const monumentAutoGuideToggle = () => {
  return {
    type: "AUTO-GUIDE-TOGGLE",
  };
};
