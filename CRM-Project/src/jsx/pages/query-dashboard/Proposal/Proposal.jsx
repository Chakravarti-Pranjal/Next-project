import React, { useEffect, useState } from "react";
// import { axiosOther } from "../../../../../http/axios_base_url";
// import { NavLink,useLocation,useNavigate } from "react-router-dom";
import { Modal, Button, Row, Table, ToastContainer } from "react-bootstrap";
import icon3 from "../../../../images/quotation/icon3.svg";
import { axiosOther } from "../../../../http/axios_base_url";
import { json, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import { formatDate } from "../../../../helper/formatDate";
import useQueryData from "../../../../hooks/custom_hooks/useQueryData";
import { setQoutationData } from "../../../../store/actions/queryAction";
import { useDispatch } from "react-redux";
import DestinationsCard from "../../../components/destinationsCard/DestinationsCard";
import QueryDetailedCard from "../../../components/queryDetailedCard/QueryDetailedCard";
// import mammoth from 'mammoth';
// import JSZip from 'jszip';
// import { saveAs } from 'file-saver';
const Proposal = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [qoutationList, setQoutationList] = useState([]);
  const [templateUrl, settempurl] = useState([]);
  const [queryData, setQueryData] = useState({});
  const query = useQueryData();
  // console.log(query?.QueryAlphaNumId, "81");

  const getQoutationList = async () => {
    setQueryData(query?.QueryAllData);
    try {
      const { data } = await axiosOther.post("listqueryquotation", {
        QueryId: query?.QueryAlphaNumId,
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
    dispatch(setQoutationData({}));
    getQoutationList();
    return () => {
      setQueryData({});
    };
  }, [query]);

  // const getQueryList = async () => {
  //     try {
  //         const { data } = await axiosOther.post("querymasterlist",{
  //             QueryId: state?.QueryData?.QueryID,

  //         });

  //         setQueryData(data?.DataList?.[0]);

  //     } catch (error) {
  //         console.log("error",error);
  //     }
  // }
  // useEffect(() => {
  //     getQueryList()
  // },[])

  const { QueryStatus, TourSummary, QueryInfo, Pax } =
    qoutationList[0] != undefined ? qoutationList[0] : {};

  // const openPurposal = async (quotation, QuotationList) => {
  //   console.log(qoutationList[0]?.QuotationNumber, "QuotationNumber");
  //   try {
  //     const response = await axiosOther.post("proposal-template", {
  //       QueryId: query?.QueryAlphaNumId,
  //       QuotationNumber:
  //         qoutationList.length > 0 ? qoutationList[0]?.QuotationNumber : "",
  //     });

  //     console.log(response, "response");
  //     if (response.status !== 200) {
  //       throw new Error(`API request failed with status ${response.status}`);
  //     }
  //     let templateUrl = response.data.TemplateUrl;
  //     if (!templateUrl) {
  //       throw new Error("TemplateUrl is missing in API response");
  //     }
  //     // Proceed only if API call is successful
  //     window.open(
  //       templateUrl,
  //       "_blank",
  //       "noopener,noreferrer",
  //       "PopupWindow",
  //       "width=100%,height=100%,top=100,left=100"
  //     );
  //   } catch (error) {
  //     console.error("Error in openProposal:", error);
  //   }
  // };

  const openPurposal = async (quotation) => {
    // console.log(query?.QueryAlphaNumId,qoutationList[0]?.QuotationNumber,"1111111111")
    try {
      const response = await axiosOther.post("proposal-template", {
        QueryId: query?.QueryAlphaNumId,
        QuotationNumber: qoutationList[0]?.QuotationNumber,
        TemplateType: "FIT-proposal"
      });

      console.log(response, "respose");
      if (response.status !== 200) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      let templateUrl = response.data.TemplateUrl;
      // console.log(templateUrl, "lwfhsladkhf");

      settempurl(templateUrl)
      if (!templateUrl) {
        throw new Error("TemplateUrl is missing in API response");
      }
      // window.open(
      //   templateUrl,
      //   "_blank",
      //   "noopener,noreferrer",
      //   "PopupWindow",
      //   "width=100%,height=100%,top=100,left=100"
      // );
      // Proceed only if API call is successful


      // Proceed only if API call is successful

    } catch (error) {
      console.error("Error in openProposal:", error);
    }
  };
  useEffect(() => {
    openPurposal()
  }, [qoutationList, queryData])



  const exportTemplateWord = async (templateUrl) => {
    console.log(templateUrl, "alksjfsakd");

    try {
      const response = await axiosOther.post("createViewWord", {
        url: templateUrl,
      });

      if (response.status !== 200) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const { status, download_url } = response.data;

      if (status && download_url) {
        // Trigger download automatically
        const link = document.createElement("a");
        link.href = download_url;
        link.download = "filename.doc"; // Optional: "filename.doc" if you want to set filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Word generation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error exporting HTML to Word:", error);
      alert("Export failed. Please try again.");
    }
  };
  //   const openwordfile = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5173/assets/Purposalsecond/proposalword.html");

  //       // If the file is found, fetch its content
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }

  //       const htmlContent = await response.text();

  //       // Create a Word document
  //       const docxContent = await createDocxFromHtml(htmlContent);

  //       // Create a Blob for the Word file
  //       const docxBlob = new Blob([docxContent], {
  //         type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //       });

  //       // Trigger the download
  //       const link = document.createElement('a');
  //       link.href = URL.createObjectURL(docxBlob);
  //       link.download = 'proposalword.docx';
  //       link.click();
  //     } catch (error) {
  //       console.error("Error fetching HTML file or converting to DOCX:", error);
  //     }
  //   };

  //   const createDocxFromHtml = async (htmlContent) => {
  //     const zip = new JSZip();

  //     // Basic structure of a .docx file
  //     const docx = {
  //       'word': {
  //         'document': {
  //           '_r': { _type: 'xml', _text: 'word/document.xml' }
  //         }
  //       }
  //     };

  //     // Add some content to the Word file
  //     const docText = `
  //       <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  //         <w:body>
  //           <w:p>
  //             <w:r>
  //               <w:t>${htmlContent}</w:t>
  //             </w:r>
  //           </w:p>
  //         </w:body>
  //       </w:document>
  //     `;

  //     // Add XML data to the Word .docx
  //     zip.file('word/document.xml', docText);

  //     // Generate the .docx file
  //     const content = await zip.generateAsync({ type: 'blob' });

  //     return content;
  //   };
  const openwordfile = async () => {
    try {
      localStorage.setItem("qoutationList", JSON.stringify(qoutationList));
      localStorage.setItem("query", JSON.stringify(query));

      // const baseUrl = `${import.meta.env.VITE_BASE_URL}/Proposals`;
      // const params = new URLSearchParams();
      // if (query?.QueryAlphaNumId) {
      //   params.append("QueryAlphaNumId", query.QueryAlphaNumId);
      // }

      //  const url = `${baseUrl}?${params.toString()}`;
      // const url = `${import.meta.env.VITE_BASE_URL}/Proposals?${encodeURIComponent(query?.QueryAlphaNumId)}`;
      const url = `/query/Proposals?${encodeURIComponent(query?.QueryAlphaNumId)}`;

      // const url = `http://localhost:5173/Proposals?${encodeURIComponent(
      //   query?.QueryAlphaNumId
      // )}`;
      window.open(
        url,
        "_blank",
        "noopener,noreferrer",
        "PopupWindow",
        "width=100%,height=100%,top=100,left=100"
      );
    } catch (err) {
      console.error("Error generating Word file:", err);
    }
  };
  //   function inlineAllStyles(doc) {
  //     const elements = doc.body.querySelectorAll('*');
  //     const computedStyles = window.getComputedStyle;

  //     elements.forEach((el) => {
  //       const style = computedStyles(el);
  //       let cssText = '';
  //       for (let i = 0; i < style.length; i++) {
  //         const prop = style[i];
  //         cssText += `${prop}:${style.getPropertyValue(prop)};`;
  //       }
  //       el.setAttribute('style', cssText);
  //     });
  //   }

  return (
    <div className="mt-3 p-0 ms-1 m-0">
      <div className="row border quotatation-shadows padding-around  py-2 px-2">
        <div className="col-12 col-lg-12 col-md-12 col-sm-12">
          <Modal className="fade hotelList">
            <Modal.Header>
              <ToastContainer />
              <Modal.Title>Check Availability</Modal.Title>
              <Button
                variant="close"
                className="btn-close" // Ensure handleClose exists
              ></Button>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Table
                  responsive
                  striped
                  bordered
                  className="rate-table mt-2"
                >
                  <thead>
                    <tr>
                      <th scope="col" className="py-2 align-middle ">
                        Destination
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        From
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        To
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        Room Type
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        Meal Plan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="fs-12">
                      <td className="text-center text-nowrap py-2"></td>
                      <td className="text-center text-nowrap py-2"></td>
                      <td className="text-center text-nowrap py-2"></td>
                      <td className="text-center text-nowrap py-2">
                        <span className="fs-12"></span>
                      </td>
                      <td className="text-center text-nowrap py-2">
                        <span className="fs-12"></span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Row>
            </Modal.Body>
          </Modal>

          <Modal className="fade quotationList">
            <Modal.Header>
              <Modal.Title>Make Final/ Select Supplement</Modal.Title>
              <Button
                variant="close"
                className="btn-close" // Ensure handleClose exists
              ></Button>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Table className="rate-table mt-2">
                  <thead>
                    <tr>
                      <th scope="col" className="py-2 align-middle ">
                        Day
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        Service Type
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        Select Hotel
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        Price
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center text-nowrap py-2 fs-5"></td>
                      <td className="text-center text-nowrap py-2 fs-5"></td>
                      <td className="text-center text-nowrap py-2 fs-5">
                        <select
                          name="Status"
                          id="status"
                          className="form-control form-control-sm"
                        >
                          <option value="">Select</option>
                        </select>
                      </td>
                      <td className="text-center text-nowrap py-2 fs-5"></td>
                      <td className="text-center text-nowrap py-2 fs-5">
                        <button className="btn btn-primary btn-custom-size fs-14"></button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Row>
            </Modal.Body>
          </Modal>

          {/* <div className="row quotationquery">
            <div className="col-2 col-md-2 col-lg-2 p-0">
              <p className="m-0 querydetails text-grey">Query Date:</p>
              <p className="m-0 querydetailspara text-grey">
                {" "}
                {formatDate(queryData?.QueryDate?.Date)} |
                {moment(queryData?.QueryDate?.Time, "HH:mm:ss").format(
                  "h:mm a"
                )}
              </p>
            </div>
            <div className="col-2 col-md-2 p-0 text-center">
              <p className="m-0 querydetails text-grey">Status:</p>
              <p
                className="m-0  font-weight-bold  badge py-1 px-2 text-grey"
                style={{ backgroundColor: QueryStatus?.color }}
              >
                {" "}
                {queryData?.QueryStatus?.Name}
              </p>
            </div>
            <div className="col-2 col-md-2 col-lg-2 p-0">
              <p className="m-0 querydetails text-grey">End Date:</p>
              <p className="m-0 querydetailspara text-grey">
                {formatDate(TourSummary?.ToDate)} | 12:46
              </p>
            </div>
            <div className="col-3 col-md-3 col-lg-3 p-0 d-flex gap-3 align-items-center">
              <div className="d-flex gap-3">
                <div className="d-flex align-items-center">
                  <i className="fa-solid fa-circle-user fs-4 text-secondary"></i>
                </div>
                <div>
                  <p className="m-0 font-size-14 font-weight-bold">
                    <b> Pawan Travel India</b>
                  </p>
                  <p className="m-0 font-weight-bold font-size-10">
                    <b>876636556</b>
                  </p>
                </div>
              </div>
              <div className="whatsapp-icon">
                <img src="/assets/icons/whatsapp.svg" alt="" />
              </div>
            </div>
            <div className="col-2 col-md-2  col-lg-3 d-flex justify-content-end align-items-center ">
              <div className="row quotationbuttons ">
                <div className="col-lg-12 col-4  d">
                  <button className="btn btn-dark btn-custom-size text-end">
                    <span className="me-1">Back</span>
                    <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                  </button>
                </div>
              </div>
            </div>
          </div> */}

          <QueryDetailedCard />
        </div>
      </div>

      <div className="row quotation-table mt-3">
        <div
          className="col-md-12  col-lg-9 overflow  tablelist queryListHeight"
          style={{ overflowY: "auto", overflowX: "hidden" }}
        >
          <Table responsive className="quotationlist">
            <thead className="w-100 tableparahead">
              <tr className="w-100 light-gray-text ">
                <th
                  className="p-0 py-2 px-1 border-0 quotationheading"
                  scope="col"
                  style={{ width: "116px" }}
                >
                  {" "}
                  Quotation Id
                </th>
                {/* <th
                  className="p-0 py-2 px-1 border-0 quotationheading"
                  scope="col"
                  style={{ width: "116px" }}
                >
                  {" "}
                  REFERENCE ID
                </th> */}
                <th
                  className="p-0 py-2 px-1 border-0 quotationheading"
                  scope="col"
                  style={{ width: "116px" }}
                >
                  {" "}
                  Season
                </th>
                <th
                  className="p-0 py-2 px-1 border-0 quotationheading "
                  scope="col"
                  style={{ width: "100px" }}
                >
                  {" "}
                  From Date
                </th>
                {/* <th
                  className="p-0 py-2 px-1 border-0 quotationheading"
                  scope="col"
                  style={{ width: "100px" }}
                >
                  {" "}
                  TO DATE
                </th> */}
                <th
                  className="p-0 py-2 px-1 border-0 quotationheading "
                  scope="col"
                  style={{ width: "116px" }}
                >
                  {" "}
                  Duration
                </th>
                <th
                  className="p-0 py-2 px-1 border-0 quotationheading"
                  scope="col"
                  style={{ width: "116px" }}
                >
                  {" "}
                  Total Pax
                </th>
                <th
                  className="p-0 py-2 px-1 border-0  quotationheading"
                  scope="col"
                >
                  {" "}
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="w-100 tablepara">
              {qoutationList?.map((qoutation, index) => {
                return (
                  <tr className="w-100  my-1" key={index + 1}>
                    <td
                      className=" quotationtext p-0 py-1 px-1 border-0 "
                      onClick={openwordfile}
                    >
                      <span className="text-queryList-primary cursor-pointer">
                        {qoutation?.QuotationNumber}
                      </span>
                    </td>
                    {/* <td className="quotationtexts p-0 py-2 px-1 border-0  text-light">
                      {qoutation?.ReferenceId}
                    </td> */}
                    <td className="quotationtexts p-0 py-2 px-1 border-0  text-light">
                      {qoutation?.TravelDateInfo?.SeasonType == 18
                        ? "Winter"
                        : qoutation?.TravelDateInfo?.SeasonType == 17
                          ? "Summer"
                          : ""}
                    </td>
                    <td className="quotationtexts p-0 py-2 px-1 border-0  text-light">
                      {qoutation?.TourSummary?.FromDate}
                    </td>
                    {/* <td className="quotationtexts p-0 py-2 px-1 border-0 text-light ">
                      {qoutation?.TourSummary?.ToDate}
                    </td> */}
                    <td className="quotationtexts p-0 py-2 px-1 border-0 text-light">
                      {qoutation?.TravelDateInfo?.TotalNights}N/
                      {qoutation?.TravelDateInfo?.TotalNoOfDays > 0
                        ? qoutation.TravelDateInfo.TotalNoOfDays
                        : 0}
                      D
                    </td>
                    <td className="quotationtexts p-0 py-2 px-1 border-0 text-light ">
                      {qoutation?.TourSummary?.PaxCount} Pax
                    </td>
                    {/* <td className="p-0 py-2 px-1 fs-6 text-white">
                      <div className="d-flex gap-3 ">
                        <div
                          className="icon-container "
                          onClick={openwordfile}
                        >
                          <i className=" costsheeticon fa-sharp cursor-pointer action-icon  text-info fa-solid fa-eye-slash"></i>
                          <p className="tooltip-text py-1 px-1">view</p>
                        </div>
                        <div className="icon-container ">
                          <i className=" costsheeticon fa-solid cursor-pointer action-icon  text-secondary fa-download"></i>
                          <p className="tooltip-text py-1 px-1">Download</p>
                        </div>
                        <div className="icon-container ">
                          <i className=" costsheeticon fa-regular fa-envelope  action-icon cursor-pointer text-success"></i>
                          <p className="tooltip-text py-1 px-1">Mail</p>
                        </div>
                        <div className="icon-container ">
                          <i className=" costsheeticon fa-sharp fa-solid fa-share cursor-pointer action-icon text-danger"></i>
                          <p className="tooltip-text m-auto py-1 px-1 ">
                            Share
                          </p>
                        </div>
                      </div>
                    </td> */}
                    <td className="p-0 py-2 px-1 fs-6 text-white pe-3">
                      <div className="d-flex gap-3 ">
                        <div
                          className="icon-container "
                        >
                          <button className="btn bg-info btn-custom-size px-1 quotation-button newQuotationIconButton" onClick={openwordfile}>
                            <i className=" costsheeticon fa-sharp cursor-pointer action-iconDisable text-info fa-solid fa-eye text-white"></i>
                          </button>

                          <p className="tooltip-text py-1 px-1">view</p>
                        </div>
                        <div className="icon-container ">
                          <button
                            className="btn bg-secondary btn-custom-size px-1 quotation-button newQuotationIconButton"
                            onClick={() => { exportTemplateWord(templateUrl) }}
                          >
                            <i className=" costsheeticon fa-solid cursor-pointer action-iconDisable  text-secondary fa-download text-white"></i>
                          </button>
                          <p className="tooltip-text py-1 px-1">
                            Download
                          </p>
                        </div>
                        <div className="icon-container ">
                          <button className="btn bg-success btn-custom-size px-1 quotation-button newQuotationIconButton">
                            <i className=" costsheeticon fa-regular fa-envelope  action-iconDisable cursor-pointer text-success text-white"></i>
                          </button>

                          <p className="tooltip-text py-1 px-1">Mail</p>
                        </div>
                        <div className="icon-container ">
                          <button className="btn bg-danger btn-custom-size px-1 quotation-button newQuotationIconButton">
                            <i className=" costsheeticon fa-sharp fa-solid fa-share cursor-pointer action-iconDisable text-white"></i>
                          </button>
                          <p className="tooltip-text m-auto py-1 px-1 ">
                            Share
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        {/* <div className="col-md-2  col-lg-2 col-sm-2 quotatation-shadows py-2 px-1 quatationdata border-end">
          <p className="text-center Destination font-w500 fs-14 text-grey">
            Destinations
          </p>
          <div className="row quotationstateres">
            <div className="col-4 ">
              <p className="m-0 headings text-grey">From</p>
              <p className="quotationstate m-0 text-grey"> DELHI</p>
            </div>

            <div className="col-4 imagesicon text-grey">
              <img src={icon3} alt="icon3" />
            </div>

            <div className="col-4">
              <p className="m-0 headings text-grey">To</p>
              <p className="quotationstate  m-0  text-grey"> AGRA</p>
            </div>
          </div>
          <div className="row sidetables">
            <div className="mt-3 tables col-sm-12">
              <div className="tabledata m-0 p-0">
                
                <div className="row text-center tabless text-grey">
                  <div className="col p-0 px-1 th">Duration</div>
                  <div className="col p-0 px-1 th">Destination</div>
                  <div className="col p-0 px-1 th">Date</div>
                </div>
                {TourSummary?.TourDetails?.map((tour, index) => {
                  return (
                    <div className="row text-center  text-grey" key={index}>
                      <div className="col p-0 p-1 td">{tour?.DayNo}</div>
                      <div className="col p-0 p-1 td">
                        {tour?.DestinationName}
                      </div>
                      <div className="col p-0 p-1 td">{tour?.Date}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="my-2 ">
            <div className="row m-0 customgap ">
              <div className="width-30-percent p-0 col-4 pe-1">
                <div className="border d-flex flex-column">
                  <span className="m-0 p-0 text-center headingdata text-grey">
                    NIGHTS
                  </span>
                  <span className="number text-center text-number-quotationList">
                    3
                  </span>
                </div>
              </div>
              <div className="width-30-percent p-0 col-4 pe-1">
                <div className="border d-flex flex-column ">
                  <span className="m-0 p-0 text-center headingdata text-grey">
                    ADULTS
                  </span>
                  <span className="number text-center text-number-quotationList">
                    5
                  </span>
                </div>
              </div>
              <div className="width-30-percent p-0 col-4 pe-1">
                <div className="border d-flex flex-column">
                  <span className="m-0 text-center headingdata text-grey">
                    CHILDS
                  </span>
                  <span className="number text-center text-number-quotationList">
                    0
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="my-2 ">
            <div className="row m-0 customgap ">
              <div className="width-30-percent p-0 col-4 pe-1">
                <div className="border border-bottom-0 d-flex flex-column">
                  <span className="m-0 p-0 text-center headingdata text-grey">
                    SGL
                  </span>
                  <span className="number text-center text-number-quotationList">
                    3
                  </span>
                </div>
              </div>
              <div className="width-30-percent p-0 col-4 pe-1">
                <div className="border d-flex flex-column ">
                  <span className="m-0 p-0 text-center headingdata text-grey">
                    DBL
                  </span>
                  <span className="number text-center text-number-quotationList">
                    2
                  </span>
                </div>
              </div>
              <div className="width-30-percent p-0 col-4 pe-1">
                <div className="border d-flex flex-column">
                  <span className="m-0 text-center headingdata text-grey">
                    TPL
                  </span>
                  <span className="number text-center text-number-quotationList">
                    0
                  </span>
                </div>
              </div>
            </div>
          </div>

          

          <div className="my-2 ">
            <div className="row m-0">
              <div className=" col-6 p-0 ">
                <div className="border d-flex flex-column">
                  <span className="text-center m-0 headingdata text-grey">
                    BUDGET
                  </span>
                  <span className="text-center m-0 number text-number-quotationList">
                    0
                  </span>
                </div>
              </div>
              
            </div>
          </div>
          <div className="my-2">
            <div className="row m-0">
              <div className=" col-12 p-0">
                <div className="border-bottom p-1 py-2 mt-2 border-right-0 border-left-0 ">
                  <p className="m-0  headingdata text-grey">
                    ROOM PREFERENCE :
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="my-2">
            <div className="row m-0">
              <div className=" col-12 ps-1">
                <div className="d-flex flex-column">
                  <span className="headingdata text-grey">
                    OPERATION PERSON
                  </span>
                  <b>Mohd Rizwan</b>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <DestinationsCard />
      </div>
    </div>
  );
};

export default Proposal;
