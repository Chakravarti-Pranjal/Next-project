import React, { useEffect, useState } from "react";
import activeCostSheet from "/assets/icons/activeIcons/Costsheet.svg";
import PaymentReceiptModal from "../PaymentReceiptModal";
import { axiosOther } from "../../../../../http/axios_base_url";

function SupplierPaymentList({
  supplierPaymentList,
  listFinalSupplierPayment,
  setListFinalSupplierPayment,
  paidAmountList,
}) {
  const supplierFinalPrice =
    supplierPaymentList?.PaymentInfo?.TotalPaymentInfo?.PurchaseAmount;
  const [paidAmount, setPaidAmount] = useState();
  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const companyId = JSON.parse(localStorage.getItem("token"))?.companyKey;

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);

  const [paymentReceiptURL, setPaymentReceiptURL] = useState(null);
   const [paymentReceiptHTML, setPaymentReceiptHTML] = useState(null);

  // console.log(supplierPaymentList, "paidAmountList");

  const getDataFromApi = async () => {
    const { data } = await axiosOther.post("generatePaymentsReceipts", {
      QueryId: "YJCK1FB4",
      QutationNo: "YJCK1FB4-A Final",
      TourId: "03B31C40",
      CompanyId: companyId,
      UniqueId: "A4EDD41307B7",
      Type: "Supplier",
    });
  };

  useEffect(() => {
    const totalPaymentAmount = paidAmountList.reduce(
      (sum, item) => sum + (parseFloat(item.PaymentAmount) || 0),
      0
    );
    setPaidAmount(totalPaymentAmount);
  }, [paidAmountList]);

  const handlePaymentReceipt = async (data) => {
    const payload = {
      QueryId: data?.QueryId,
      QutationNo: data?.QuotationNumber,
      TourId: queryQuotation?.TourId,
      CompanyId: companyId,
      UniqueId: data?.UniqueId,
      Type: "Supplier",
    };

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

  // const handleSendMail = () => {
  //   const iframeDocument = iframeRef.current?.contentDocument;
  //   const htmlContent = iframeDocument?.documentElement.outerHTML;

  //   const subject = encodeURIComponent("HTML Content");
  //   const body = encodeURIComponent(htmlContent || "No content");

  //   // This will only work for short HTML, and won't preserve styles well
  //   window.location.href = `mailto:?subject=${subject}&body=${body}`;
  // };

  return (
    <>
      <table className="table table-bordered itinerary-table">
        <thead>
          <tr>
            <th>Supplier Name</th>
            <th>Payment Type</th>
            <th>Amount</th>
            <th>Attachment</th>
            <th>Bank Name</th>
            <th>Remarks</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {console.log(paidAmountList, "paidAmountList")}
          {paidAmountList.length > 0 &&
            paidAmountList.map((list, index) => (
              <tr key={index}>
                <td>
                  <span>{list.SupplierName}</span>
                </td>
                <td>
                  <span>{list.PaymentThrough}</span>
                </td>
                <td>
                  <span>{list.PaymentAmount}</span>
                </td>
                <td>
                  <span></span>
                </td>
                <td>
                  <span>{list.BankName}</span>
                </td>
                <td>
                  <span>{list.Remarks}</span>
                </td>
                <td>
                  <span className="badge badge-success light badge">
                    {list.Status}
                  </span>
                </td>
                <td>
                  <div>
                    <div className="icon-container">
                      <button
                        onClick={() => handlePaymentReceipt(list)}
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
                    {/* <div className="icon-container">
                      <button
                        onClick={() => handleSendMail()}
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
                        Send
                      </p>
                    </div> */}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="amt mt-4 mb-4">
        <div className="row">
          <div className="col m-2 p-2">
            <div className="number" style={{ color: "#F0AD00" }}>
              {supplierFinalPrice}
            </div>
            <div className="name mt-1">Purchase</div>
          </div>
          <div className="col m-2 p-2">
            <div className="number" style={{ color: "#32C100" }}>
              {paidAmount}
            </div>
            <div className="name mt-1">Paid amt</div>
          </div>
          <div className="col m-2 p-2">
            <div className="number" style={{ color: "#E30000" }}>
              {supplierFinalPrice - paidAmount}
            </div>
            <div className="name mt-1">Pending Amt.</div>
          </div>
          <div className="col m-2 p-2">
            <div className="number">
              {supplierPaymentList?.PaymentInfo?.TotalPaymentInfo?.SellAmount}
            </div>
            <div className="name mt-1">Sell Amt.</div>
          </div>
          <div className="col m-2 p-2">
            <div className="number">
              {supplierPaymentList?.PaymentInfo?.TotalPaymentInfo?.TaxAmount}
            </div>
            <div className="name mt-1">Tax Amt.</div>
          </div>
          <div className="col m-2 p-2">
            <div className="number">
              {supplierPaymentList?.PaymentInfo?.TotalPaymentInfo?.TCSAmount}
            </div>
            <div className="name mt-1">TCS Amt</div>
          </div>
          <div className="col m-2 p-2">
            <div className="number">
              {supplierPaymentList?.PaymentInfo?.TotalPaymentInfo?.Commission}
            </div>
            <div className="name mt-1">COMMISSION</div>
          </div>
          <div className="col m-2 p-2">
            <div className="number">
              {supplierPaymentList?.PaymentInfo?.TotalPaymentInfo?.Discount}
            </div>
            <div className="name mt-1">DISCOUNT</div>
          </div>
          <div className="col m-2 p-2">
            <div className="number">
              {supplierPaymentList?.PaymentInfo?.TotalPaymentInfo?.Expenses}
            </div>
            <div className="name mt-1">EXPENSES</div>
          </div>
          <div className="col m-2 p-2 ">
            <div className="number">
              {supplierPaymentList?.PaymentInfo?.TotalPaymentInfo?.NetMargin}
            </div>
            <div className="name mt-1">NET MARGIN.</div>
          </div>
          <div className="col-lg-1 col-sm-6 gap-left-3 m-2 p-2 SUPPLIER ms-4">
            <div className="">SUPPLIER</div>
            <div className="mt-1">COST SHEET</div>
          </div>
        </div>
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

export default SupplierPaymentList;
