import React, { useEffect, useState, useContext, useRef } from 'react'
import { Modal, Row, Table } from "react-bootstrap";
import { Tab, Nav, Button } from "react-bootstrap";
import { Dropdown } from 'react-bootstrap';
import html2pdf from 'html2pdf.js';
import { ThemeContext } from "../../../../src/context/ThemeContext";
import useQueryData from "../../../hooks/custom_hooks/useQueryData";
import { setQoutationData } from "../../../store/actions/queryAction";
import { useDispatch } from "react-redux";
import { axiosOther } from '../../../http/axios_base_url';
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";



const Proposals = () => {
  const [html, setHtml] = useState("");
  const [open, setopen] = useState(false);
  const [share, setshare] = useState(false);
  const { background } = useContext(ThemeContext);
  const [queryData, setQueryData] = useState({});
  const [qoutationList, setQoutationList] = useState([]);
  const [templateUrl, settempurl] = useState([]);
  const [quotationNumber, setquotationNumber] = useState([]);
  const [proposalType, setProposalType] = useState('with-images');
  const contentRef = useRef();
  // console.log(qoutationList,"qoutationList11")

  const { state } = useLocation();
  const dispatch = useDispatch()
  const query = useQueryData()
  // console.log(query,"81")

  useEffect(() => {
    const qoutationList = JSON.parse(localStorage.getItem("qoutationList") || "[]");
    const query = JSON.parse(localStorage.getItem("query") || "{}");


    console.log("Received in Proposals:", query,);
    setQoutationList(qoutationList)
    setQueryData(query)



  }, [])


  // const openwordfile = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5173/assets/Purposalsecond/demoproposal.html");

  //     if (!response.ok) {
  //       throw new Error('Failed to load HTML content');
  //     }

  //     let htmlContent = await response.text();

  //     // Parse HTML content into DOM
  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(htmlContent, "text/html");

  //     // Convert all <img> sources to base64
  //     const images = doc.querySelectorAll("img");
  //     for (const img of images) {
  //       const src = img.getAttribute("src");
  //       if (!src || src.startsWith("data:")) continue;

  //       const absoluteSrc = new URL(src, "http://localhost:5173").href;
  //       const imgResponse = await fetch(absoluteSrc);
  //       const blob = await imgResponse.blob();
  //       const base64 = await blobToBase64(blob);

  //       img.setAttribute("src", base64);
  //     }

  //     // Inject styling to control Word layout and appearance
  //     const styleTag = doc.createElement('style');
  //     styleTag.innerHTML = `
  //       @page {
  //         size: 27.94cm 25.94cm;
  //         margin: 0in;
  //       }
  //       * {
  //           box-sizing: border-box;
  //       }
  //       .proposal-wrapper {
  //       width: 100%;
  //       max-width: 28.94cm; /* Optional: To restrict within printable area */
  //       margin: 0 auto;
  //     }
  //       body {
  //         margin: 0cm !important;
  //         padding: 0 !important;
  //         font-family: 'Segoe UI', sans-serif;
  //         color: #1c1c1c;
  //         letter-spacing: 0.3px;
  //         line-height: 1.5;
  //       }
  //       // table, th, td {
  //       //   border-collapse: collapse;
  //       //   border: 1px solid #ccc;
  //       // }
  //     `;
  //     doc.head.prepend(styleTag);

  //     // Get modified HTML string
  //     htmlContent = doc.documentElement.outerHTML;

  //     // Convert to Word (.docx)
  //     const docxBlob = new Blob([window.htmlDocx.asBlob(htmlContent)], {
  //       type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //     });

  //     // Trigger download
  //     const link = document.createElement('a');
  //     link.href = URL.createObjectURL(docxBlob);
  //     link.download = 'proposalword.docx';
  //     link.click();
  //   } catch (err) {
  //     console.error("Error generating Word file:", err);
  //   }
  // };

  // Helper: Convert image blob to base64
  // function blobToBase64(blob) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => resolve(reader.result);
  //     reader.onerror = reject;
  //     reader.readAsDataURL(blob);
  //   });
  // }




  // const openwordfile = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5173/assets/Purposalsecond/purposal3.html");

  //     if (!response.ok) {
  //       throw new Error('Failed to load HTML content');
  //     }


  //     let htmlContent = await response.text();

  //     // Convert HTML string to a DOM object
  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(htmlContent,"text/html");
  //     const images = doc.querySelectorAll("img");

  //     // Convert each <img> to base64
  //     for (const img of images) {
  //       const src = img.getAttribute("src");

  //       // Skip if already base64
  //       if (!src || src.startsWith("data:")) continue;

  //       // Convert image to base64
  //       const absoluteSrc = new URL(src,"http://localhost:5173").href; // handle relative paths
  //       const imgResponse = await fetch(absoluteSrc);
  //       const blob = await imgResponse.blob();
  //       const base64 = await blobToBase64(blob);

  //       img.setAttribute("src",base64);
  //     }

  //     // Get the modified HTML with embedded images
  //     htmlContent = doc.documentElement.outerHTML;

  //     // Generate .docx using htmlDocx-js from global CDN script
  //     const docxBlob = new Blob([window.htmlDocx.asBlob(htmlContent)],{
  //       type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //     });

  //     const link = document.createElement('a');
  //     link.href = URL.createObjectURL(docxBlob);
  //     link.download = 'proposalword.docx';
  //     link.click();

  //     // window.open(
  //     //   "http://localhost:5173/Proposals",
  //     //   "_blank",
  //     //   "noopener,noreferrer",
  //     //   "PopupWindow",
  //     //   "width=100%,height=100%,top=100,left=100"
  //     // );
  //   } catch (err) {
  //     console.error("Error generating Word file:",err);
  //   }

  // };

  // Utility function to convert Blob to base64
  // function blobToBase64(blob) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => resolve(reader.result);
  //     reader.onerror = reject;
  //     reader.readAsDataURL(blob);
  //   });
  // }


  // const convertToPDF = async () => {
  //   try {

  //     const response = await fetch("http://localhost:5173/assets/Purposalsecond/proposalword.html");

  //     if (!response.ok) throw new Error("Could not load HTML file");

  //     const htmlContent = await response.text();


  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(htmlContent, "text/html");


  //     const images = doc.querySelectorAll("img");
  //     for (const img of images) {
  //       const src = img.getAttribute("src");
  //       if (!src || src.startsWith("data:")) continue;

  //       const absoluteSrc = new URL(src, window.location.origin).href;
  //       const imgResponse = await fetch(absoluteSrc);
  //       const blob = await imgResponse.blob();
  //       const base64 = await blobToBase64s(blob);
  //       img.setAttribute("src", base64);
  //     }

  //     const container = document.createElement("div");
  //     container.style.display = "none";
  //     container.innerHTML = doc.body.innerHTML;
  //     document.body.appendChild(container);


  //     await html2pdf().from(container).set({
  //       margin: 0.5,
  //       filename: "proposal.pdf",
  //       image: { type: "jpeg", quality: 0.98 },
  //       html2canvas: { scale: 2 },
  //       jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  //     }).save();

  //     document.body.removeChild(container);
  //   } catch (error) {
  //     // console.error("Error:", error.message);http://localhost:5173/assets/Purposalsecond/proposalword.html
  //     alert("Something went wrong. Check console for details.");
  //   }
  // };

  // const blobToBase64s = (blob) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => resolve(reader.result);
  //     reader.onerror = reject;
  //     reader.readAsDataURL(blob);
  //   });
  // };



  const openemail = () => {
    const recipient = "someone@example.com";
    const subject = "Hello from React";
    const body = "This is a pre-filled email body from my React app.";

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // This line opens the user's default mail app
    window.location.href = mailtoLink;
  };
  const openWhatsApp = () => {
    const phoneNumber = "**********"; // Use country code (no + sign), e.g., 91 for India
    const message = "Hello! I'm interested in your service.";

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank"); // Opens WhatsApp in a new tab or app
  };
  // console.log(query?.QueryAlphaNumId,qoutationList[0]?.QuotationNumber,"1111111112")
  const openPurposal = async (quotation) => {
    if (!queryData?.QueryAlphaNumId || !qoutationList[0]?.QuotationNumber) return
    // console.log(query?.QueryAlphaNumId,qoutationList[0]?.QuotationNumber,"1111111111")
    try {
      // console.log(queryData?.QueryAlphaNumId, "88888");
      // console.log(qoutationList[0]?.QuotationNumber, "88888");

      const endpoint =
        proposalType === 'with-images'
          ? 'proposal-template'
          : 'proposal-withoutimage-template';

      const response = await axiosOther.post(endpoint, {
        QueryId: queryData?.QueryAlphaNumId,
        QuotationNumber: qoutationList[0]?.QuotationNumber,
        TemplateType: "FIT-proposal"
      });

      if (response.status !== 200) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      let templateUrl = response.data.TemplateUrl;

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

  }, [qoutationList, queryData, proposalType])


  // useEffect(() => {
  //   console.log(templateUrl, "templateUrl1");

  //   if (templateUrl) {
  //     fetch(templateUrl)
  //     .then(res => {
  //       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  //       return res.text();
  //     })
  //     .then(data => {
  //       console.log("Loaded HTML:", data);
  //       setHtml(data);
  //     })
  //     .catch(err => {
  //       console.error("Fetch error:", err);
  //     });
  //   }
  // }, [templateUrl]);


  const exportTemplateWord = async (templateUrl) => {
    console.log(templateUrl, "alksjfsakd");

    try {

      const endpoint =
        proposalType === 'with-images'
          ? 'createViewWord'
          : 'viewWordFileWithoutImageProposal';
      const response = await axiosOther.post(endpoint, {
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

  return <>
    <div className="row d-flex justify-content-between align-items-end text-white m-0 p-2 px-lg-5 gap-2 pb-3" style={{ background: 'var(--rgba-primary-1)' }}
    >

      <div className="col-md-12 col-lg-2">
        <label className="fs-6 ms-2 customThemeLabel">Select Proposal</label>
        <select
          name="ProposalType"
          className="form-control form-control-sm"
          value={proposalType}
          onChange={(e) => setProposalType(e.target.value)}
        >
          <option value="">Select</option>
          <option value="with-images">With Images</option>
          <option value="without-images">With Out Images</option>
        </select>
      </div>
      <div className="col-md-12 col-lg-2">
        <label className="fs-6 ms-2 customThemeLabel">Select Language</label>
        <select
          name="Status"
          className="form-control form-control-sm"

        >
          <option value="">Select</option>
          <option value="hindi">Hindi</option>
          <option value="english">English</option>
        </select>
      </div>
      <div className='col-md-12 col-lg-6'>
        <div className="row d-flex justify-content-end gap-2 align-items-end">
          <div className="col-lg-3 col-md-3">
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic" className="m-0 p-0 w-100">
                <button className="btn btn-primary btn-custom-size w-100 justify-content-center d-flex align-items-center gap-2" >
                  <i className="fas fa-download"></i>
                  <div>Export</div>
                </button>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {/* <Dropdown.Item href="#/action-1" onClick={convertToPDF} className="d-flex align-items-center gap-2"><i className="fa-solid fa-file fs-4 "></i> <div className="">PDF Download</div></Dropdown.Item> */}
                <Dropdown.Item href="#/action-2" onClick={() => { exportTemplateWord(templateUrl) }} className="d-flex align-items-center gap-2"><i className="fa-solid fa-file-word fs-4 "></i><div className="">Word Download</div> </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="col-lg-3 col-md-3">
            <button className="btn btn-primary btn-custom-size w-100 justify-content-center d-flex align-items-center gap-2">
              <i className="fas fa-eye-slash"></i>
              <div>Proposal</div>
            </button>
          </div>
          <div className="col-lg-3 col-md-3">
            <Dropdown>
              <Dropdown.Toggle variant="warning" id="dropdown-basic" className="m-0 p-0 w-100 mx-auto">
                <button className="btn btn-warning btn-custom-size w-100 justify-content-center d-flex align-items-center gap-2 " >
                  <i className="fa-solid fa-share"></i>
                  <div>Share</div>
                </button>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#" onClick={openWhatsApp} className="d-flex align-items-center gap-2"><i className="fa-brands fa-whatsapp fs-4 "></i> <div className="">Send via WhatsApp</div></Dropdown.Item>
                <Dropdown.Item href="#" onClick={openemail} className="d-flex align-items-center gap-2"><i className="fa-solid fa-envelope fs-4"></i><div className="">Send via Email</div> </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

    </div>

    {/* <div ref={contentRef} dangerouslySetInnerHTML={{ __html: html }} /> */}
    <iframe
      src={templateUrl}
      width="100%"
      height="630px"
      style={{ border: "none" }}

      title="Proposal Preview"
    />
  </>




}

export default Proposals