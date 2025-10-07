import React, { useState } from "react";
import activeCostSheet from "/assets/icons/activeIcons/Costsheet.svg";
import PaymentReceiptModal from "../PaymentReceiptModal";
import { axiosOther } from "../../../../../http/axios_base_url";

function PaymentList({ finalPaymentList, agentPaymentList }) {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const [paymentReceiptURL, setPaymentReceiptURL] = useState(null);
  const [paymentReceiptHTML, setPaymentReceiptHTML] = useState(null);

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const companyId = JSON.parse(localStorage.getItem("token"))?.companyKey;

  const totalAmount =
    finalPaymentList[0]?.PaymentInfo?.TotalPaymentInfo?.SellAmount;

  const receivedAmount = agentPaymentList
    .filter((item) => item.Status === "Paid")
    .reduce((total, item) => total + Number(item.PaymentAmount || 0), 0);

  console.log(finalPaymentList, "HGT67");

  const handlePaymentReceipt = async (data) => {
    const payload = {
      QueryId: data?.QueryId,
      QutationNo: data?.QuotationNumber,
      TourId: queryQuotation?.TourId,
      CompanyId: companyId,
      UniqueId: data?.UniqueId,
      Type: "Agent",
    };

    console.log(payload, "AGENT877");

    try {
      const { data } = await axiosOther.post(
        "generatePaymentsReceipts",
        payload
      );
      console.log(data, "RES098");

      if (data && data?.TemplateUrl) {
        setPaymentReceiptURL(data?.TemplateUrl);
        setPaymentReceiptHTML(data?.html)
        setShowModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="headingtable ms-0 mt-2 p-1 col-lg-12">
        <div className="amt">
          <div className="col-10">
            <div className="row ">
              <div className="col m-2 p-2">
                <div className="number" style={{ color: "#00A893" }}>
                  INR
                </div>
                <div className="name mt-1">Currency </div>
              </div>
              <div className="col m-2 p-2">
                <div className="number" style={{ color: "#0029FF" }}>
                  {Math.ceil(totalAmount || 0)}
                </div>
                <div className="name mt-1">Sell Amt</div>
              </div>
              <div className="col m-2 p-2">
                <div className="number" style={{ color: "#04B100" }}>
                  {Math.ceil(receivedAmount ?? 0)}
                </div>
                <div className="name mt-1">Received Amt</div>
              </div>
              <div className="col m-2 p-2">
                <div className="number" style={{ color: "#FF6B00" }}>
                  {Math.ceil(totalAmount - receivedAmount)}
                </div>
                <div className="name mt-1">Pending Amt</div>
              </div>
              <div className="col m-2 p-2">
                <div className="number" style={{ color: "#DD6A00" }}>
                  {
                    finalPaymentList?.[0]?.PaymentInfo?.TotalPaymentInfo
                      ?.TaxAmount
                  }
                </div>
                <div className="name mt-1">Tax Amt</div>
              </div>
              <div className="col m-2 p-2">
                <div className="number">
                  {
                    finalPaymentList?.[0]?.PaymentInfo?.TotalPaymentInfo
                      ?.TCSAmount
                  }
                </div>
                <div className="name mt-1">TCS Amt</div>
              </div>
              <div className="col m-2 p-2">
                <div className="number">
                  {
                    finalPaymentList?.[0]?.PaymentInfo?.TotalPaymentInfo
                      ?.Discount
                  }
                </div>
                <div className="name mt-1">DISCOUNT</div>
              </div>
              <div className="col m-2 p-2">
                <div className="number">
                  {
                    finalPaymentList?.[0]?.PaymentInfo?.TotalPaymentInfo
                      ?.Expenses
                  }
                </div>
                <div className="name mt-1">EXPENSE</div>
              </div>
              <div className="col m-2 p-2">
                <div className="number">
                  {
                    finalPaymentList?.[0]?.PaymentInfo?.TotalPaymentInfo
                      ?.Commission
                  }
                </div>
                <div className="name mt-1">COMMISSION</div>
              </div>
              <div className="col m-2 p-2">
                <div className="number">
                  {
                    finalPaymentList?.[0]?.PaymentInfo?.TotalPaymentInfo
                      ?.NetMargin
                  }
                </div>
                <div className="name mt-1">NET MARGIN</div>
              </div>
            </div>
          </div>
        </div>
        <table className="table table-bordered itinerary-table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Payment Type</th>
              <th>Amount</th>
              <th>Payment Through</th>
              <th>Bank Name</th>
              <th>Transaction Id/Cheque No.</th>
              <th>Remarks</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {agentPaymentList?.length > 0 &&
              agentPaymentList
                ?.filter((item) => item.Status === "Paid")
                ?.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.PaymentName}</td>
                    <td>{Math.ceil(item.PaymentAmount)}</td>
                    <td>{item.PaymentThrough}</td>
                    <td>{item.BankName}</td>
                    <td>{item.TransactionId}</td>
                    <td>{item.Remarks}</td>
                    <td>
                      <span className="badge badge-success light badge">
                        {item.Status}
                      </span>
                    </td>
                    <td>
                      {/* <button className="btn btn-primary btn-custom-size buttons">
                      Payment Receipt
                    </button> */}
                      <div className="icon-container">
                        <button
                          onClick={() => handlePaymentReceipt(item)}
                          className="badge bg-info rounded-pill quotation-button newQuotationIconButton"
                          style={{ width: "21px", height: "20px" }}
                        >
                          <img
                            src={activeCostSheet}
                            alt="icon"
                            style={{
                              width: "0.7rem",
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                            }}
                          />
                        </button>
                        <p
                          className="tooltip-text py-1 px-1"
                          style={{ fontSize: "7px" }}
                        >
                          Payment Receipt
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <PaymentReceiptModal
        show={showModal}
        handleClose={handleClose}
        paymentReceiptURL={paymentReceiptURL}
        paymentReceiptHTML={paymentReceiptHTML}
      />
    </>
  );
}

export default PaymentList;
