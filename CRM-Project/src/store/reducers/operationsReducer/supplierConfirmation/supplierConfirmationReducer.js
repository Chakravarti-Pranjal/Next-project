const initialValue = {
  count: 0,
};

export const operationSupplierConfirmationReducer = (
  state = initialValue,
  action
) => {
  switch (action.type) {
    case "SET-API-COUNT":
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
};
