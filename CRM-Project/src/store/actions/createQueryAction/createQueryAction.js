export const setCreateQueryDataPackageList = (data) => {
  return {
    type: "SET-QUERY-DATA-PACKAGE-LIST",
    payload: data,
  };
};

export const resetCreateQueryDataPackageList = () => {
  return {
    type: "RESET-QUERY-DATA-PACKAGE-LIST",
  };
};
