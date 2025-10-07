import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../../../helper/formatDate";
import moment from "moment";
import useQueryData from "../../../hooks/custom_hooks/useQueryData";
import { useDispatch } from "react-redux";
import { axiosOther } from "../../../http/axios_base_url";
import { setQoutationData } from "../../../store/actions/queryAction";
import { Modal } from "react-bootstrap";

const QueryDetailedCard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryData = useQueryData();
  const [queryMasterList, setQueryMasterList] = useState({});
  const [qoutationList, setQoutationList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tourType, setTourType] = useState("");
  const dispatch = useDispatch();
  // console.log(queryData, "state11")

  const isQuotationListRoute = location.pathname === "/query/quotation-list";
  console.log(queryData, "queryData");

  const getQueryList = async (quotation) => {
    if (!queryData?.QueryAlphaNumId) return;
    console.log(queryData?.QueryAlphaNumId, "queryData?.QueryAlphaNumId");

    try {
      const { data } = await axiosOther.post("querymasterlist", {
        QueryId: queryData?.QueryAlphaNumId,
      });
      console.log(data?.DataList, "checkkkdataafirsttt");

      setQueryMasterList(data?.DataList?.[0]);
    } catch (error) {
      console.log("error", error);
    }
  };
  // console.log(queryMasterList, "qqqqq");

  useEffect(() => {
    getQueryList();
  }, [queryData]);

  const getQoutationList = async () => {
    try {
      const { data } = await axiosOther.post("listqueryquotation", {
        QueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
        QuotationNo: "",
      });

      if (data?.success) {
        setQoutationList(data?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getQoutationList();
  }, [state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId]);

  const { QueryStatus, TourSummary, QueryInfo, Pax } =
    qoutationList[0] != undefined ? qoutationList[0] : {};

  const qoutationGenerate = async () => {
    try {
      const { data } = await axiosOther.post("addquerywithjson", {
        QueryId: queryData?.QueryAlphaNumId,
        Type: "New",
        Subject: "Corenthum",
        HotelCategory: "Single Hotel Category",
        PaxSlabType: "Single Slab",
        HotelMarkupType: "Service Wise Markup",
        HotelStarCategory: [],
        PackageID: "",
      });

      if (data?.status == 1) {
        dispatch(setQoutationData(data?.Response));
        if (window.location.origin === "https://beta.creativetravel.in") {
          navigate("/query/quotation-four");
          return;
        }
        navigate("/query/quotation");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const itemVal = qoutationList[0]?.Days?.map((item) => item?.DayServices);
  const condition = itemVal?.every((item) => item?.length > 0);

  useEffect(() => {
    dispatch({ type: "DAY-SERVICES-CONDITION", payload: condition });
  }, [condition]);

  const handlePaymentRequest = () => {
    navigate("/query/payments", { state: { name: "John", age: 30 } });
  };
  // console.log(qoutationList, "qoutationList")

  const handleRought = () => {
    const dataToStore = {
      TourId: queryMasterList?.TourId || qoutationList[1]?.TourId,
      QoutationNum:
        queryMasterList?.QuotationNumber || qoutationList[1]?.QuotationNumber,
      QueryID: queryMasterList?.QueryID || qoutationList[1]?.QueryID,
      Subject:
        queryMasterList[0]?.Header?.Subject ||
        qoutationList[1]?.Header?.Subject,
      ReferenceId:
        queryMasterList?.ReferenceId || qoutationList[1]?.ReferenceId,
    };
    console.log(dataToStore, "dataToStore");

    localStorage.setItem("Query_Qoutation", JSON.stringify(dataToStore));
    navigate("/query/costsheet-list");
  };

  const handleRadioChange = (e) => {
    setTourType(e.target.value);
  };

  const handleNext = () => {
    const queryId = queryMasterList?.QueryID || qoutationList[1]?.QueryID;
    // console.log("TourType:", tourType, queryId);
    navigate("/query", {
      state: {
        queryId,
        tourType,
        isPartial: true,
        queryData,
      },
    });
  };

  const currentPath = location.pathname;
  return (
    <>
      <div className="row me-lg-4 mb-2">
        <div className="col-12 d-flex justify-content-end align-items-center ps-1 gap-2">
          {isQuotationListRoute && (
            <>
              <div className="d-flex">
                <button
                  className="btn btn-primary btn-custom-size fs-10"
                  style={{ whiteSpace: "nowrap" }}
                  onClick={qoutationGenerate}
                >
                  Add Quotation
                </button>
                <button
                  className="btn btn-primary btn-custom-size fs-10 ms-2"
                  style={{ whiteSpace: "nowrap" }}
                  onClick={() => setShowModal(true)}
                >
                  Tour Extension
                </button>
              </div>

              <Modal
                size="md"
                show={showModal}
                onHide={() => setShowModal(false)}
                aria-labelledby="example-modal-sizes-title-lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title id="example-modal-sizes-title-lg">
                    Pre / Post Query
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: "10px" }}>
                  <p style={{ paddingLeft: "20px" }}>
                    Query ID :{" "}
                    {queryMasterList?.QueryID || qoutationList[1]?.QueryID}
                  </p>
                  <div className="d-flex gap-5 justify-content-center py-3">
                    {["Pre", "Post"].map((type) => (
                      <div className="form-check" key={type}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="sendTourType"
                          value={type}
                          id={type}
                          checked={tourType === type}
                          onChange={handleRadioChange}
                        />
                        <label className="form-check-label fs-5" htmlFor={type}>
                          {type === "Pre" ? "Pre" : "Post"}
                        </label>
                      </div>
                    ))}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className="btn btn-primary btn-custom-size"
                    onClick={handleNext}
                    disabled={!setTourType}
                  >
                    Generate Query
                  </button>
                </Modal.Footer>
              </Modal>
            </>
          )}
          <div className="d-flex align-items-center flex-wrap">
            <button
              className="btn btn-dark btn-custom-size me-2"
              style={{ whiteSpace: "nowrap" }}
              onClick={() =>
                isQuotationListRoute ? navigate("/queries") : navigate(-1)
              }
            >
              <span>Back</span>
              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded ms-1"></i>
            </button>
            {currentPath === "/query/quotation-list" && (
              <button
                className="btn btn-primary btn-custom-size"
                name="SaveButton"
                // onClick={() => navigate("/query/costsheet-list")}
                onClick={handleRought}
                style={{ whiteSpace: "nowrap" }}
              >
                <span className="me-1">Next</span>
                <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
              </button>
            )}
            {currentPath === "/query/costsheet-list" && (
              <button
                className="btn btn-primary btn-custom-size"
                name="SaveButton"
                onClick={() => navigate("/query/proposal-list")}
                style={{ whiteSpace: "nowrap" }}
              >
                <span className="me-1">Next</span>
                <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
              </button>
            )}
            {currentPath === "/query/proposal-list" && (
              <button
                className="btn btn-primary btn-custom-size"
                name="SaveButton"
                onClick={() => navigate("/query/client-communication")} // go to next page
                style={{ whiteSpace: "nowrap" }}
              >
                <span className="me-1">Next</span>
                <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="row quotationquery top-marginMinus">
        <div className="col-12 col-md-2 col-lg-2 p-0 d-flex align-items-center gap-2 d-md-block">
          <p className="m-0 querydetails text-grey">Query Date:</p>
          <p className="m-0 querydetailspara text-grey">
            {formatDate(queryMasterList?.QueryDate?.Date)} |{" "}
            {moment(queryMasterList?.QueryDate?.Time, "HH:mm:ss").format(
              "h:mm a"
            )}
          </p>
        </div>
        <div className="col-12 col-md-2 col-lg-1 p-0 d-flex align-items-center gap-2 d-md-block">
          <p className="m-0 querydetails text-grey">Status:</p>
          <p
            className="m-0  font-weight-bold  badge py-1 px-2 text-grey"
            style={{ backgroundColor: QueryStatus?.color }}
          >
            {queryMasterList?.QueryStatus?.Name}
          </p>
        </div>
        <div className="col-12 col-md-2 col-lg-2 p-0 d-flex align-items-center gap-2 d-md-block">
          <p className="m-0 querydetails text-grey  ps-md-4">End Date:</p>
          <p className="m-0 querydetailspara text-grey ps-md-4">
            {/* {formatDate(TourSummary?.ToDate)} | 12:46 */}
            {TourSummary?.ToDate
              ? `${formatDate(TourSummary.ToDate)} | 12:46 pm`
              : ""}
          </p>
        </div>
        <div className="col-12 col-md-3 col-lg-3 p-0 d-flex gap-3 align-items-center">
          <div className="d-flex gap-3">
            <div className="d-flex align-items-center">
              <i className="fa-solid fa-circle-user fs-4 text-secondary"></i>
            </div>
            <div>
              <p className="m-0 font-size-14 font-weight-bold">
                <b> {queryMasterList?.ServiceDetail?.ServiceCompanyName}</b>
              </p>
              <p className="m-0 font-weight-bold font-size-10">
                <b>{queryMasterList?.ServiceDetail?.CompanyPhone}</b>
              </p>
            </div>
          </div>
          <div className="whatsapp-icon">
            <img src="/assets/icons/whatsapp.svg" alt="" />
          </div>
        </div>

        {/* <div className="col-12 col-md-4  col-lg-4 d-flex justify-content-center align-items-center ps-1 gap-2">
                <div>
                    <button
                        className="btn btn-dark btn-custom-size"
                        onClick={() => navigate("/queries")}
                    >
                        <span>Back</span>
                        <i className="fa-solid fa-backward text-dark bg-white p-1 rounded ms-1"></i>
                    </button>
                </div>
                <div>
                    <button
                        className="btn btn-primary btn-custom-size fs-10"
                        onClick={qoutationGenerate}
                    >
                        Add Quotation
                    </button>
                </div>

            </div> */}
      </div>
      <div className="row quotationquery pt-2 mt-1">
        <div className="col-12 col-md-2 col-lg- p-0 d-flex align-items-center gap-2 d-md-block">
          <p className="m-0 querydetails text-grey ">Client/Agent Name:</p>
          <p className="m-0 querydetailspara text-grey">
            {queryMasterList?.ClientName} /{" "}
            {queryMasterList?.ServiceDetail?.ServiceCompanyName}
          </p>
        </div>
        <div className="col-12 col-md-2 col-lg-1 p-0 d-flex align-items-center gap-2 d-md-block">
          <p className="m-0 querydetails text-grey ">Country:</p>
          <p className="m-0 querydetailspara text-grey"></p>
        </div>
        <div className="col-12 col-md-2 col-lg-2 p-0 d-flex align-items-center gap-2 d-md-block">
          <p className="m-0 querydetails text-grey ps-md-4">ISO:</p>
          <p className="m-0 querydetailspara text-grey ps-md-4">
            {queryMasterList?.Prefrences?.ISOName}
          </p>
        </div>

        <div className="col-12 col-md-2 col-lg-2 p-0 d-flex align-items-center gap-2 d-md-block">
          <p className="m-0 querydetails text-grey ">Consortia:</p>
          <p className="m-0 querydetailspara text-grey">
            {/* {queryMasterList?.ConsortiaName} */}
            {queryMasterList?.Prefrences?.ConsortiaName}
          </p>
        </div>
      </div>
    </>
  );
};

export default QueryDetailedCard;
