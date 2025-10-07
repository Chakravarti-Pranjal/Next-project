const initialValue = {
  packageQueryInfo: null,
};

export const createQueryPageReducer = (state = initialValue, action) => {
  switch (action.type) {
    case "SET-QUERY-DATA-PACKAGE-LIST":
      return { ...state, packageQueryInfo: action?.payload };

    case "RESET-QUERY-DATA-PACKAGE-LIST":
      return { ...state, packageQueryInfo: null };

    default:
      return state;
  }
};
