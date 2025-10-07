import React, { useEffect } from "react";
import "../../../css/stepper.css";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import {
  setQueryStep,
  resetQueryStep,
  setQoutationStep,
  resetQoutationStep,
  setCostsheetStep,
  resetCostsheetStep,
  setProposalStep,
  resetProposalStep,
  setConfirmQueryStep,
  setFinalizeSupplierStep,
  resetFinalizeSupplierStep,
  setSchedulePaymentStep,
  resetSchedulePaymentStep,
  setVoucherStep,
  resetVoucherStep,
  setInvoiceStep,
  resetInvoiceStep,
} from "../../../store/actions/stepperAction";
import { setHeadingShowFalse } from "../../../store/actions/queryAction";

const Stepper = () => {
  const {
    Query,
    Qoutation,
    Costsheet,
    Proposal,
    ConfirmQuery,
    FinalizeSupplier,
    SchedulePayments,
    Voucher,
    Invoices,
    
  } = useSelector((state) => state?.stepperReducer);

  const dispatch = useDispatch();
  const location = useLocation(); // Track current location
  const { id } = useParams();

  useEffect(() => {
    // Dynamically determine which step to activate based on the current route
    switch (location.pathname) {
      case "/query":
        dispatch(setQueryStep());
        dispatch(resetQoutationStep());
        dispatch(resetCostsheetStep());
        dispatch(resetProposalStep());
        break;
      case `/query/preview/${id}`:
        dispatch(resetQoutationStep());
        dispatch(resetCostsheetStep());
        dispatch(resetProposalStep());
        break;
      case "/query/quotation":
        dispatch(setQueryStep());
        dispatch(setQoutationStep());
        dispatch(resetCostsheetStep());
        dispatch(resetProposalStep());
        break;
      case "/query/quotation-list":
        dispatch(setQueryStep());
        dispatch(setQoutationStep());
        dispatch(resetCostsheetStep());
        dispatch(resetProposalStep());
        break;
      case "/query/costsheet-list":
        dispatch(setCostsheetStep());
        dispatch(resetProposalStep());
        break;
      case "/query/proposal-list":
        dispatch(setProposalStep());
        break;
      case "/query/client-communication":
        dispatch(setConfirmQueryStep());
        break;
      case "/query/supplier-communication":
        dispatch(setFinalizeSupplierStep());
        break;
      case "/query/payments":
        dispatch(setSchedulePaymentStep());
        break;
      case "/query/vouchers":
        dispatch(setVoucherStep());
        break;
      case "/query/invoices":
        dispatch(setInvoiceStep());
        break;
      default:
        break;
    }
  }, [location.pathname, dispatch]);

  return (
    <div className="stepper stepper-scroll">
      <div className={`step ${Query && "active"}`}>Create Query</div>
      <div className={`step ${Qoutation && "active"}`}>Quotation</div>
      <div className={`step ${Costsheet && "active"}`}>Costsheet</div>
      <div className={`step ${Proposal && "active"}`}>Proposal</div>
      <div className={`step ${ConfirmQuery && "active"}`}>Confirm Query</div>
      <div className={`step ${FinalizeSupplier && "active"}`}>
        Finalize Supplier
      </div>
      <div className={`step ${SchedulePayments && "active"}`}>
        Schedule Payments
      </div>
      <div className={`step ${Voucher && "active"}`}>Vouchers</div>
      <div className={`step ${Invoices && "active"}`}>Invoices</div>
    </div>
  );
};

export default Stepper;
