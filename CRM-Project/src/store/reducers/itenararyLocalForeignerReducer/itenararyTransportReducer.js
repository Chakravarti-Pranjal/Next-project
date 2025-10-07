const initialState = {
   transportForeignerDataForm : []
  };
  
  const itinararyLocalForeignerData = (state = initialState, action) => {
    switch (action.type) {
      case "SET-FOREIGNER-TRANSPORT":
        return { ...state, transportForeignerDataForm: action?.payload };
      default:
        return state;
    }
  };
  
  export default itinararyLocalForeignerData;
  