const initialState = {
  Query: false,
  Qoutation: false,
  Costsheet: false,
  Proposal: false,
  ConfirmQuery: false,
  FinalizeSupplier: false,
  SchedulePayments: false,
  Voucher: false,
  Invoices: false,
};

export const stepperReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET-QUERY-STEP":
      return { ...state, Query: true };
    case "RESET-QUERY-STEP":
      return { ...state, Query: false };
    case "SET-QOUTATION-STEP":
      return { ...state, Qoutation: true };
    case "RESET-QOUTATION-STEP":
      return { ...state, Qoutation: false };
    case "SET-COSTSHEET-STEP":
      return { ...state, Costsheet: true };
    case "RESET-COSTSHEET-STEP":
      return { ...state, Costsheet: false };
    case "SET-PROPOSAL-STEP":
      return { ...state, Proposal: true };
    case "RESET-PROPOSAL-STEP":
      return { ...state, Proposal: false };
    case "SET-CONFIRMQUERY-STEP":
      return { ...state, ConfirmQuery: true };
    case "RESET-CONFIRMQUERY-STEP":
      return { ...state, ConfirmQuery: false };
    case "SET-FINALIZE-SUPPLIER-STEP":
      return { ...state, FinalizeSupplier: true };
    case "RESET-FINALIZE-SUPPLIER-STEP":
      return { ...state, FinalizeSupplier: false };
    case "SET-SCHEDULE-PAYMENT-STEP":
      return { ...state, SchedulePayments: true };
    case "RESET-SCHEDULE-PAYMENT-STEP":
      return { ...state, SchedulePayments: false };
    case "SET-VOUCHER-STEP":
      return { ...state, Voucher: true };
    case "RESET-VOUCHER-STEP":
      return { ...state, Voucher: false };
    case "SET-INVOICE-STEP":
      return { ...state, Invoices: true };
    case "RESET-INVOICE-STEP":
      return { ...state, Invoices: false };
    default:
      return state;
  }
};
