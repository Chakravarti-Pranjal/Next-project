const initialState = {
  supplierSectionChange: 0,
};

const supplierStateChange = (state = initialState, action) => {
  switch (action.type) {
    case "SUPPLIER_CHANGE_STATE":
      return {
        ...state,
        supplierSectionChange: state.supplierSectionChange + 1,
      };
    default:
      return state;
  }
};

export default supplierStateChange;
