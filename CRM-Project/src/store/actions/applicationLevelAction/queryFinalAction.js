export const setFinalQueryAction = (data) => {
  return {
    type: "SET_FINAL_QUERY",
    payload: data,
  };
};

export const setFinalQueryDataAction = (data) => {
  return {
    type: "SET_FINAL_QUERY_DATA",
    payload: data,
  };
};
