import React, { useState } from "react";
import { formatDate, formatTime } from "../../../helper/formatDate";
import { useDispatch, useSelector } from "react-redux";
import { axiosOther } from "../../../http/axios_base_url";
import {
  setQoutationSubject,
  setQueryData,
} from "../../../store/actions/queryAction";
import Remainder from "../../components/Queryheading/Remainder";
import { useLocation } from "react-router-dom";

const QueryHeading = ({ headData }) => {
  const [copied, setCopied] = useState(false);
  const { queryData, qoutationData, qoutationSubject } = useSelector(
    (data) => data?.queryReducer
  );

  console.log(queryData, "WSTSFTST363636SFSR");

  const location = useLocation();
  const { pathname } = location;

  const [isSubjectEditing, setIsSubjectEditing] = useState(false);
  const [subjectValue, setSubjectValue] = useState(qoutationSubject);
  const [showError, setShowError] = useState("");
  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  // console.log(queryQuotation, "GFBHGF877656");

  const handleCopy = () => {
    navigator.clipboard.writeText(
      queryData.QueryAlphaNumId || queryQuotation?.QueryID
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  console.log(qoutationData, "subjectValue");
  const handleSaveSubject = async () => {
    try {
      if (subjectValue != "") {
        const { data } = await axiosOther.post("update-generateQuotation", {
          QueryId: queryData?.QueryAlphaNumId,
          QuotationNumber: qoutationData?.QuotationNumber,
          Subject: subjectValue,
        });

        if (data?.status == 1) {
          setIsSubjectEditing(false);
          dispatch(setQoutationSubject(data?.Response?.Header?.Subject));
        }
      } else {
        setShowError("Please Enter Subject");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // console.log(queryData?.QueryAlphaNumId, "JHU788", queryQuotation?.QueryID,headData);
  if (!headData) {
    if (pathname === "/query") return null;
  }

  return (
    <div className="col-xl-12 font-size10 pb-2">
      <div className="card-body d-sm-flex align-items-sm-center justify-content-sm-between flex-sm-wrap query-heading ps-4 p-2 queryHeadingFont m-lg-0">
        <div className="d-flex align-items-center mb-3 mb-sm-0">
          <div className="ml-3 d-flex align-items-center justify-content-center gap-1">
            <span className="d-block">
              <span className="querydetails text-grey">Query# :</span>{" "}
              {queryData?.QueryAlphaNumId || queryQuotation?.QueryID}
            </span>
            <div className="icon-container ">
              {" "}
              <i onClick={handleCopy} className="fa-solid fa-copy copyIcon"></i>
              <p style={{ top: "-30px" }} className="tooltip-text py-1 px-1">
                {copied ? "Copied!" : "Copy"}
              </p>
            </div>
          </div>
        </div>
        {/* {qoutationData && ( */}
        <div className="d-flex align-items-center mb-3 mb-sm-0">
          <div className="ml-3">
            <span>
              <span className="querydetails text-grey">Quotation# :</span>{" "}
              {qoutationData?.QuotationNumber || queryQuotation?.QoutationNum}
            </span>
          </div>
        </div>
        {/* )} */}

        <div className="d-flex align-items-center mb-3 mb-sm-0">
          <div className="ml-3">
            <span>
              <span className="querydetails text-grey">TourId : </span>{" "}
              {headData?.Prefrences?.TourType ||
                qoutationData?.TourId ||
                queryQuotation?.TourId}
            </span>
          </div>
        </div>
        <div className="d-flex align-items-center mb-3 mb-sm-0">
          <div className="ml-3 d-flex gap-2 align-items-center">
            {isSubjectEditing ? (
              <div className="d-flex gap-2 align-items-center">
                <span className="querydetails text-grey">Subject</span>
                <input
                  type="text"
                  className="formControl1"
                  placeholder="Subject"
                  style={{ width: "10rem" }}
                  value={subjectValue}
                  onChange={(e) => setSubjectValue(e.target.value)}
                />
                <div
                  className="subject-edit d-flex justify-content-center align-items-center cursor-pointer"
                  onClick={handleSaveSubject}
                >
                  <i className="fa-solid fa-floppy-disk text-white"></i>
                </div>
                <div
                  className="subject-edit d-flex justify-content-center align-items-center cursor-pointer"
                  onClick={() => setIsSubjectEditing(false)}
                >
                  <i className="fa-solid fa-xmark text-white"></i>
                </div>
              </div>
            ) : (
              <span>
                <span className="querydetails text-grey">Subject : </span>{" "}
                {qoutationSubject || queryQuotation?.Subject}
                {/* {qoutationSubject || queryQuotation?.Subject} */}
              </span>
            )}
            {!isSubjectEditing && (
              <div
                className="subject-edit d-flex justify-content-center align-items-center cursor-pointer"
                onClick={() => setIsSubjectEditing(true)}
              >
                <i className="fa-solid fa-pen-nib text-white"></i>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center mb-3 mb-sm-0">
          <div className="ml-3">
            {queryData?.QueryAllData != "" ? (
              <span>
                <span className="querydetails text-grey">Date : </span>{" "}
                {formatDate(queryData?.QueryAllData?.QueryDate?.Date)}
                &nbsp;:&nbsp;
                {formatTime(queryData?.QueryAllData?.QueryDate?.Time)}
              </span>
            ) : (
              <span>
                Date: {formatDate(headData?.QueryDate?.Date)},{" "}
                {formatTime(headData?.QueryDate?.Time)}
              </span>
            )}
          </div>
        </div>

        <div>
          <span>
            <span className="querydetails text-grey">Current Status : </span>{" "}
            {queryData?.QueryAllData?.QueryStatus?.Name}
          </span>
        </div>

        <div>
          <Remainder
            queryId={queryData?.QueryAlphaNumId}
            currentStatus={queryData?.QueryAllData?.QueryStatus?.Name}
          />
        </div>
      </div>
    </div>
  );
};

export default QueryHeading;
