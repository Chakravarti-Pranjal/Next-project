export const setMessage = (data) => {
  return {
    type: "SET-MESSAGE-DATA",
    payload: data,
  };
};

export const resetMessage = () => {
  return {
    type: "RESET-MESSAGE-DATA",
  };
};

export const setPereferenceToggle = () => {
  return {
    type: "SET-PEREFERENCE-TOGGLE",
  };
};
