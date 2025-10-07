// import React, { Fragment, useState, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Dropdown } from "react-bootstrap";
// // import PageTitle from "../../../../layouts/PageTitle";

// const MailInbox = () => {
//   const [data, setData] = useState(
//     document.querySelectorAll(".email-right-box .email-list .message")
//   );
//   const sort = 9;
//   const activePag = useRef(0);
//   const [test, settest] = useState(0);

//   // Active data
//   const chageData = (frist, sec) => {
//     for (var i = 0; i < data.length; ++i) {
//       if (i >= frist && i < sec) {
//         data[i].classList.remove("d-none");
//       } else {
//         data[i].classList.add("d-none");
//       }
//     }
//   };
//   // use effect
//   useEffect(() => {
//     setData(document.querySelectorAll(".email-right-box .email-list .message"));
//     //chackboxFun();
//   }, [test]);
//   // Active pagginarion
//   activePag.current === 0 && chageData(0, sort);
//   // paggination
//   let paggination = Array(Math.ceil(data.length / sort))
//     .fill()
//     .map((_, i) => i + 1);

//   // Active paggination & chage data
//   const onClick = (i) => {
//     activePag.current = i;
//     chageData(activePag.current * sort, (activePag.current + 1) * sort);
//     settest(i);
//   };
//   const chackbox = document.querySelectorAll(".message input");
//   const motherChackBox = document.querySelector("#checkbox1");
//   const chackboxFun = (type) => {
//     for (let i = 0; i < chackbox.length; i++) {
//       const element = chackbox[i];
//       if (type === "all") {
//         if (motherChackBox.checked) {
//           element.checked = true;
//         } else {
//           element.checked = false;
//         }
//       } else {
//         if (!element.checked) {
//           motherChackBox.checked = false;
//           break;
//         } else {
//           motherChackBox.checked = true;
//         }
//       }
//     }
//   };
//   return (
//     <Fragment>
//       {/* <PageTitle activeMenu="Inbox" motherMenu="Email" pageContent="Email" /> */}

//       <div className="row">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="card-body">
//               <div className="row">
//                 <div className="col-xl-3 col-lg-4">
//                   <div className="email-left-box">
//                     <div className="p-0">
//                       <Link
//                         to="/mails/compose"
//                         className="btn btn-primary btn-block"
//                       >
//                         Compose
//                       </Link>
//                     </div>
//                     <div className="mail-list rounded mt-4">
//                       <Link to="/mails" className="list-group-item active">
//                         <i className="fa fa-inbox font-18 align-middle me-2"></i>
//                         Inbox
//                         <span className="badge badge-primary badge-sm float-end">
//                           198
//                         </span>
//                       </Link>
//                       <Link to="/mails" className="list-group-item">
//                         <i className="fa fa-paper-plane font-18 align-middle me-2"></i>
//                         Sent
//                       </Link>
//                       <Link to="/mails" className="list-group-item">
//                         <i className="fa fa-star font-18 align-middle me-2"></i>
//                         Important
//                         <span className="badge badge-danger text-white badge-sm float-end">
//                           47
//                         </span>
//                       </Link>
//                       <Link to="/mails" className="list-group-item">
//                         <i className="mdi mdi-file-document-box font-18 align-middle me-2"></i>
//                         Draft
//                       </Link>
//                       <Link to="/mails" className="list-group-item">
//                         <i className="fa fa-trash font-18 align-middle me-2"></i>
//                         Trash
//                       </Link>
//                     </div>

//                     <div className="mail-list rounded overflow-hidden mt-4">
//                       <div className="intro-title d-flex justify-content-between my-0">
//                         <h5>Categories</h5>
//                         <i className="icon-arrow-down" aria-hidden="true"></i>
//                       </div>
//                       <Link to="/mails" className="list-group-item">
//                         <span className="icon-warning">
//                           <i className="fa fa-circle" aria-hidden="true"></i>
//                         </span>
//                         Work
//                       </Link>
//                       <Link to="/mails" className="list-group-item">
//                         <span className="icon-primary">
//                           <i className="fa fa-circle" aria-hidden="true"></i>
//                         </span>
//                         Private
//                       </Link>
//                       <Link to="/mails" className="list-group-item">
//                         <span className="icon-success">
//                           <i className="fa fa-circle" aria-hidden="true"></i>
//                         </span>
//                         Support
//                       </Link>
//                       <Link to="/mail" className="list-group-item">
//                         <span className="icon-dpink">
//                           <i className="fa fa-circle" aria-hidden="true"></i>
//                         </span>
//                         Social
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-xl-9 col-lg-8">
//                   <div className="email-right-box">
//                     <div role="toolbar" className="toolbar ms-1 ms-sm-0">
//                       <div className="btn-group mb-1 me-1 ms-1">
//                         <div className="form-check custom-checkbox">
//                           <input
//                             type="checkbox"
//                             className="form-check-input"
//                             id="checkbox1"
//                             onClick={() => chackboxFun("all")}
//                           />
//                           <label
//                             className="form-check-label"
//                             htmlFor="checkbox1"
//                           ></label>
//                         </div>
//                       </div>
//                       <div className="btn-group mb-1">
//                         <button
//                           className="btn btn-primary light px-3"
//                           type="button"
//                         >
//                           <i className="ti-reload"></i>
//                         </button>
//                       </div>
//                       <Dropdown className="btn-group mb-1">
//                         <Dropdown.Toggle
//                           aria-expanded="false"
//                           data-toggle="dropdown"
//                           className="btn btn-primary px-3 light dropdown-toggle ms-1"
//                           type="button"
//                         >
//                           More <span className="caret"></span>
//                         </Dropdown.Toggle>
//                         <Dropdown.Menu className="dropdown-menu">
//                           <Dropdown.Item
//                             to="/email-inbox"
//                             className="dropdown-item"
//                           >
//                             Mark as Unread
//                           </Dropdown.Item>
//                           <Dropdown.Item
//                             to="/email-inbox"
//                             className="dropdown-item"
//                           >
//                             Add to Tasks
//                           </Dropdown.Item>
//                           <Dropdown.Item
//                             to="/email-inbox"
//                             className="dropdown-item"
//                           >
//                             Add Star
//                           </Dropdown.Item>
//                           <Dropdown.Item
//                             to="/email-inbox"
//                             className="dropdown-item"
//                           >
//                             Mute
//                           </Dropdown.Item>
//                         </Dropdown.Menu>
//                       </Dropdown>
//                     </div>
//                     {/** Single Message */}
//                     <div className="email-list mt-3">
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox2"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox2"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Ingredia Nutrisha, A collection of textile samples
//                               lay spread out on the table - Samsa was a
//                               travelling salesman - and above it there hung a
//                               picture
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox3"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox3"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Almost unorthographic life One day however a small
//                               line of blind text by the name of Lorem Ipsum
//                               decided to leave for the far World of Grammar.
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox4"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox4"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Pointing has no control about the blind texts it
//                               is an almost unorthographic life One day however a
//                               small line of blind text by the name of
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox5"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox5"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Even the all-powerful Pointing has no control
//                               about the blind texts it is an almost
//                               unorthographic life One day however a small line
//                               of blind text by the name of
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox6"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox6"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Ingredia Nutrisha, A collection of textile samples
//                               lay spread out on the table - Samsa was a
//                               travelling salesman - and above it there hung a
//                               picture
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox7"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox7"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Almost unorthographic life One day however a small
//                               line of blind text by the name of Lorem Ipsum
//                               decided to leave for the far World of Grammar.
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox8"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox8"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Pointing has no control about the blind texts it
//                               is an almost unorthographic life One day however a
//                               small line of blind text by the name of
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message unread">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox9"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox9"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Even the all-powerful Pointing has no control
//                               about the blind texts it is an almost
//                               unorthographic life One day however a small line
//                               of blind text by the name of
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message unread">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox10"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox10"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Ingredia Nutrisha, A collection of textile samples
//                               lay spread out on the table - Samsa was a
//                               travelling salesman - and above it there hung a
//                               picture
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox11"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox11"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Almost unorthographic life One day however a small
//                               line of blind text by the name of Lorem Ipsum
//                               decided to leave for the far World of Grammar.
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox12"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox12"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Pointing has no control about the blind texts it
//                               is an almost unorthographic life One day however a
//                               small line of blind text by the name of
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox13"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox13"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Even the all-powerful Pointing has no control
//                               about the blind texts it is an almost
//                               unorthographic life One day however a small line
//                               of blind text by the name of
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox14"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox14"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Ingredia Nutrisha, A collection of textile samples
//                               lay spread out on the table - Samsa was a
//                               travelling salesman - and above it there hung a
//                               picture
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message unread">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox15"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox15"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Almost unorthographic life One day however a small
//                               line of blind text by the name of Lorem Ipsum
//                               decided to leave for the far World of Grammar.
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox16"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox16"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Pointing has no control about the blind texts it
//                               is an almost unorthographic life One day however a
//                               small line of blind text by the name of
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox17"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox17"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Even the all-powerful Pointing has no control
//                               about the blind texts it is an almost
//                               unorthographic life One day however a small line
//                               of blind text by the name of
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox18"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox18"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Ingredia Nutrisha, A collection of textile samples
//                               lay spread out on the table - Samsa was a
//                               travelling salesman - and above it there hung a
//                               picture
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox19"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox19"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Almost unorthographic life One day however a small
//                               line of blind text by the name of Lorem Ipsum
//                               decided to leave for the far World of Grammar.
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message unread">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox20"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox20"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Pointing has no control about the blind texts it
//                               is an almost unorthographic life One day however a
//                               small line of blind text by the name of
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                       <div className="message">
//                         <div>
//                           <div className="d-flex message-single">
//                             <div className="ps-1 align-self-center">
//                               <div className="form-check custom-checkbox">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   onClick={() => chackboxFun()}
//                                   id="checkbox21"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="checkbox21"
//                                 />
//                               </div>
//                             </div>
//                             <div className="ms-2">
//                               <button className="border-0 bg-transparent align-middle p-0">
//                                 <i className="fa fa-star" aria-hidden="true" />
//                               </button>
//                             </div>
//                           </div>
//                           <Link to="email-read" className="col-mail col-mail-2">
//                             <div className="subject">
//                               Even the all-powerful Pointing has no control
//                               about the blind texts it is an almost
//                               unorthographic life One day however a small line
//                               of blind text by the name of
//                             </div>
//                             <div className="date">11:49 am</div>
//                           </Link>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="row mt-4">
//                       <div className="col-12 ps-3">
//                         <nav>
//                           <ul className="pagination pagination-gutter pagination-primary pagination-sm no-bg">
//                             <li className="page-item page-indicator">
//                               <Link
//                                 className="page-link"
//                                 to="/mail"
//                                 onClick={() =>
//                                   activePag.current > 0 &&
//                                   onClick(activePag.current - 1)
//                                 }
//                               >
//                                 <i className="la la-angle-left"></i>
//                               </Link>
//                             </li>
//                             {paggination.map((number, i) => (
//                               <li
//                                 key={i}
//                                 className={`page-item  ${
//                                   activePag.current === i ? "active" : ""
//                                 } `}
//                                 onClick={() => onClick(i)}
//                               >
//                                 <Link className="page-link" to="/mail">
//                                   {number}
//                                 </Link>
//                               </li>
//                             ))}

//                             <li className="page-item page-indicator">
//                               <Link
//                                 className="page-link"
//                                 to="/mail"
//                                 onClick={() =>
//                                   activePag.current + 1 < paggination.length &&
//                                   onClick(activePag.current + 1)
//                                 }
//                               >
//                                 <i className="la la-angle-right"></i>
//                               </Link>
//                             </li>
//                           </ul>
//                         </nav>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// export default MailInbox;

import React, { Fragment, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import axios from "axios";
import { axiosOther } from "../../http/axios_base_url";

const MailInbox = () => {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("inbox");
  const [activeCategory, setActiveCategory] = useState(null);
  const sort = 10;
  const activePag = useRef(0);
  const [test, settest] = useState(0);
  const [data, setData] = useState([]);

  const staticData = {
    inbox: [],
    sent: [
      { id: 101, subject: "Meeting Tomorrow", date: "2023-05-15T10:30:00", to: "john@example.com", read: false },
      { id: 102, subject: "Project Update", date: "2023-05-14T15:45:00", to: "team@example.com", read: true },
      { id: 103, subject: "Vacation Approval", date: "2023-05-12T09:15:00", to: "hr@example.com", read: false },
    ],
    important: [
      { id: 201, subject: "Urgent: Server Downtime", date: "2023-05-16T08:15:00", from: "admin@example.com", read: false },
      { id: 202, subject: "Important: Security Update", date: "2023-05-15T14:20:00", from: "security@example.com", read: true },
    ],
    draft: [
      { id: 301, subject: "Draft: Project Proposal", date: "2023-05-10T11:45:00", content: "Here's the initial draft of our project proposal..." },
      { id: 302, subject: "Draft: Team Meeting Agenda", date: "2023-05-08T16:30:00", content: "Topics to discuss in the next team meeting..." },
    ],
    trash: [
      { id: 401, subject: "Old Newsletter", date: "2023-04-01T09:10:00", from: "newsletter@example.com", deletedOn: "2023-05-01" },
      { id: 402, subject: "Expired Offer", date: "2023-03-15T12:00:00", from: "promotions@example.com", deletedOn: "2023-04-10" },
    ],
    categories: {
      work: [
        { id: 501, subject: "Project Deadline", date: "2023-05-18T14:00:00", from: "manager@example.com", read: false, category: "work" },
        { id: 502, subject: "Team Meeting Notes", date: "2023-05-17T11:30:00", from: "teamlead@example.com", read: true, category: "work" },
      ],
      private: [
        { id: 601, subject: "Family Gathering", date: "2023-05-20T18:00:00", from: "mom@example.com", read: false, category: "private" },
        { id: 602, subject: "Weekend Plans", date: "2023-05-19T09:15:00", from: "friend@example.com", read: true, category: "private" },
      ],
      support: [
        { id: 701, subject: "Your Support Ticket", date: "2023-05-16T13:45:00", from: "support@example.com", read: false, category: "support" },
        { id: 702, subject: "Issue Resolution", date: "2023-05-15T16:20:00", from: "helpdesk@example.com", read: true, category: "support" },
      ],
      social: [
        { id: 801, subject: "New Connection Request", date: "2023-05-17T08:30:00", from: "network@example.com", read: false, category: "social" },
        { id: 802, subject: "Event Invitation", date: "2023-05-16T19:00:00", from: "events@example.com", read: true, category: "social" },
      ],
    },
  };

  const fetchEmails = async () => {
    try {
      setError(null);
      const response = await axiosOther.post("emaillist");
      setEmails(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      setData(staticData.categories[activeCategory] || []);
    } else if (activeTab === "inbox") {
      setData(emails);
    } else {
      setData(staticData[activeTab] || []);
    }
    if (data.length > 0 && activePag.current === 0) {
      chageData(0, sort);
    }
  }, [activeTab, activeCategory, test, emails, data.length]);

  const chageData = (frist, sec) => {
    const emailElements = document.querySelectorAll(".email-right-box .email-list .message");
    for (var i = 0; i < emailElements.length; ++i) {
      if (i >= frist && i < sec) {
        emailElements[i].classList.remove("d-none");
      } else {
        emailElements[i].classList.add("d-none");
      }
    }
  };

  let paggination = Array(Math.ceil(data.length / sort))
    .fill()
    .map((_, i) => i + 1);

  const onClick = (i) => {
    activePag.current = i;
    chageData(activePag.current * sort, (activePag.current + 1) * sort);
    settest(i);
  };

  const chackboxFun = (type) => {
    const chackbox = document.querySelectorAll(".message input");
    const motherChackBox = document.querySelector("#checkbox1");

    for (let i = 0; i < chackbox.length; i++) {
      const element = chackbox[i];
      if (type === "all") {
        if (motherChackBox.checked) {
          element.checked = true;
        } else {
          element.checked = false;
        }
      } else {
        if (!element.checked) {
          motherChackBox.checked = false;
          break;
        } else {
          motherChackBox.checked = true;
        }
      }
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setActiveTab(null);
    activePag.current = 0;
  };

  if (error) {
    return <div className="text-center py-5 text-danger">Error: {error}</div>;
  }

  const renderEmailItem = (email, index) => {
    if (activeCategory) {
      return (
        <div className="message" key={email.id || index}>
          <div>
            <div className="d-flex message-single">
              <div className="ps-1 align-self-center">
                <div className="form-check custom-checkbox">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onClick={() => chackboxFun()}
                    id={`checkbox${index + 2}`}
                  />
                  <label className="form-check-label" htmlFor={`checkbox${index + 2}`} />
                </div>
              </div>
              <div className="ms-2">
                <button className="border-0 bg-transparent align-middle p-0">
                  <i className="fa fa-star" aria-hidden="true" />
                </button>
              </div>
            </div>
            <Link to="/mails" className="col-mail col-mail-2">
              <div className="subject">{email.subject || "No subject"}</div>
              <div className="date">
                {new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </Link>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "sent":
        return (
          <div className="message" key={email.id || index}>
            <div>
              <div className="d-flex message-single">
                <div className="ps-1 align-self-center">
                  <div className="form-check custom-checkbox">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onClick={() => chackboxFun()}
                      id={`checkbox${index + 2}`}
                    />
                    <label className="form-check-label" htmlFor={`checkbox${index + 2}`} />
                  </div>
                </div>
                <div className="ms-2">
                  <button className="border-0 bg-transparent align-middle p-0">
                    <i className="fa fa-star" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <Link to="/mails" className="col-mail col-mail-2">
                <div className="subject">{email.subject || "No subject"}</div>
                <div className="date">
                  {new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </Link>
            </div>
          </div>
        );
      case "important":
        return (
          <div className="message" key={email.id || index}>
            <div>
              <div className="d-flex message-single">
                <div className="ps-1 align-self-center">
                  <div className="form-check custom-checkbox">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onClick={() => chackboxFun()}
                      id={`checkbox${index + 2}`}
                    />
                    <label className="form-check-label" htmlFor={`checkbox${index + 2}`} />
                  </div>
                </div>
                <div className="ms-2">
                  <button className="border-0 bg-transparent align-middle p-0">
                    <i className="fa fa-star" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <Link to="/mails" className="col-mail col-mail-2">
                <div className="subject">
                  <i className="fa fa-exclamation-circle text-danger me-2" />
                  {email.subject || "No subject"}
                </div>
                <div className="date">
                  {new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </Link>
            </div>
          </div>
        );
      case "draft":
        return (
          <div className="message" key={email.id || index}>
            <div>
              <div className="d-flex message-single">
                <div className="ps-1 align-self-center">
                  <div className="form-check custom-checkbox">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onClick={() => chackboxFun()}
                      id={`checkbox${index + 2}`}
                    />
                    <label className="form-check-label" htmlFor={`checkbox${index + 2}`} />
                  </div>
                </div>
              </div>
              <Link to="/mails" className="col-mail col-mail-2">
                <div className="subject">
                  <i className="fa fa-file-text-o text-info me-2" />
                  {email.subject || "No subject"}
                </div>
                <div className="date">
                  {new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </Link>
            </div>
          </div>
        );
      case "trash":
        return (
          <div className="message" key={email.id || index}>
            <div>
              <div className="d-flex message-single">
                <div className="ps-1 align-self-center">
                  <div className="form-check custom-checkbox">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onClick={() => chackboxFun()}
                      id={`checkbox${index + 2}`}
                    />
                    <label className="form-check-label" htmlFor={`checkbox${index + 2}`} />
                  </div>
                </div>
              </div>
              <Link to="/mails" className="col-mail col-mail-2">
                <div className="subject">
                  <i className="fa fa-trash text-secondary me-2" />
                  {email.subject || "No subject"}
                </div>
                <div className="date">
                  Deleted on {new Date(email.deletedOn).toLocaleDateString()}
                </div>
              </Link>
            </div>
          </div>
        );
      default:
        return (
          <div className="message" key={email.id || index}>
            <div>
              <div className="d-flex message-single">
                <div className="ps-1 align-self-center">
                  <div className="form-check custom-checkbox">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onClick={() => chackboxFun()}
                      id={`checkbox${index + 2}`}
                    />
                    <label className="form-check-label" htmlFor={`checkbox${index + 2}`} />
                  </div>
                </div>
                <div className="ms-2">
                  <button className="border-0 bg-transparent align-middle p-0">
                    <i className="fa fa-star" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <Link to="/mails" className="col-mail col-mail-2">
                <div className="subject">{email.subject || "No subject"}</div>
                <div className="date">
                  {new Date(email.date || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <Fragment>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-xl-3 col-lg-4">
                  <div className="email-left-box">
                    <div className="p-0">
                      <Link to="/mails/compose" className="btn btn-primary btn-block">
                        Compose
                      </Link>
                    </div>
                    <div className="mail-list rounded mt-4">
                      <Link
                        to="/mails"
                        className={`list-group-item ${activeTab === "inbox" && !activeCategory ? "active" : ""}`}
                        onClick={() => {
                          setActiveTab("inbox");
                          setActiveCategory(null);
                        }}
                      >
                        <i className="fa fa-inbox font-18 align-middle me-2"></i>
                        Inbox
                        <span className="badge badge-primary badge-sm float-end">{emails.length}</span>
                      </Link>
                      <Link
                        to="/mails"
                        className={`list-group-item ${activeTab === "sent" ? "active" : ""}`}
                        onClick={() => {
                          setActiveTab("sent");
                          setActiveCategory(null);
                        }}
                      >
                        <i className="fa fa-paper-plane font-18 align-middle me-2"></i>
                        Sent
                        <span className="badge badge-primary badge-sm float-end">{staticData.sent.length}</span>
                      </Link>
                      <Link
                        to="/mails"
                        className={`list-group-item ${activeTab === "important" ? "active" : ""}`}
                        onClick={() => {
                          setActiveTab("important");
                          setActiveCategory(null);
                        }}
                      >
                        <i className="fa fa-star font-18 align-middle me-2"></i>
                        Important
                        <span className="badge badge-danger text-white badge-sm float-end">{staticData.important.length}</span>
                      </Link>
                      <Link
                        to="/mails"
                        className={`list-group-item ${activeTab === "draft" ? "active" : ""}`}
                        onClick={() => {
                          setActiveTab("draft");
                          setActiveCategory(null);
                        }}
                      >
                        <i className="mdi mdi-file-document-box font-18 align-middle me-2"></i>
                        Draft
                        <span className="badge badge-primary badge-sm float-end">{staticData.draft.length}</span>
                      </Link>
                      <Link
                        to="/mails"
                        className={`list-group-item ${activeTab === "trash" ? "active" : ""}`}
                        onClick={() => {
                          setActiveTab("trash");
                          setActiveCategory(null);
                        }}
                      >
                        <i className="fa fa-trash font-18 align-middle me-2"></i>
                        Trash
                        <span className="badge badge-primary badge-sm float-end">{staticData.trash.length}</span>
                      </Link>
                    </div>
                    <div className="mail-list rounded overflow-hidden mt-4">
                      <div className="intro-title d-flex justify-content-between my-0">
                        <h5>Categories</h5>
                        <i className="icon-arrow-down" aria-hidden="true"></i>
                      </div>
                      <Link
                        to="/mails"
                        className={`list-group-item ${activeCategory === "work" ? "active" : ""}`}
                        onClick={() => handleCategoryClick("work")}
                      >
                        <span className="icon-warning">
                          <i className="fa fa-circle" aria-hidden="true"></i>
                        </span>
                        Work
                        <span className="badge badge-primary badge-sm float-end">{staticData.categories.work.length}</span>
                      </Link>
                      <Link
                        to="/mails"
                        className={`list-group-item ${activeCategory === "private" ? "active" : ""}`}
                        onClick={() => handleCategoryClick("private")}
                      >
                        <span className="icon-primary">
                          <i className="fa fa-circle" aria-hidden="true"></i>
                        </span>
                        Private
                        <span className="badge badge-primary badge-sm float-end">{staticData.categories.private.length}</span>
                      </Link>
                      <Link
                        to="/mails"
                        className={`list-group-item ${activeCategory === "support" ? "active" : ""}`}
                        onClick={() => handleCategoryClick("support")}
                      >
                        <span className="icon-success">
                          <i className="fa fa-circle" aria-hidden="true"></i>
                        </span>
                        Support
                        <span className="badge badge-primary badge-sm float-end">{staticData.categories.support.length}</span>
                      </Link>
                      <Link
                        to="/mails"
                        className={`list-group-item ${activeCategory === "social" ? "active" : ""}`}
                        onClick={() => handleCategoryClick("social")}
                      >
                        <span className="icon-dpink">
                          <i className="fa fa-circle" aria-hidden="true"></i>
                        </span>
                        Social
                        <span className="badge badge-primary badge-sm float-end">{staticData.categories.social.length}</span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-xl-9 col-lg-8">
                  <div className="email-right-box">
                    <div role="toolbar" className="toolbar ms-1 ms-sm-0">
                      <div className="btn-group mb-1 me-1 ms-1">
                        <div className="form-check custom-checkbox">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="checkbox1"
                            onClick={() => chackboxFun("all")}
                          />
                          <label className="form-check-label" htmlFor="checkbox1"></label>
                        </div>
                      </div>
                      <div className="btn-group mb-1">
                        <button className="btn btn-primary light px-3" type="button" onClick={fetchEmails}>
                          <i className="ti-reload"></i>
                        </button>
                      </div>
                      <Dropdown className="btn-group mb-1">
                        <Dropdown.Toggle
                          aria-expanded="false"
                          data-toggle="dropdown"
                          className="btn btn-primary px-3 light dropdown-toggle ms-1"
                          type="button"
                        >
                          More <span className="caret"></span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu">
                          <Dropdown.Item to="/email-inbox" className="dropdown-item">
                            Mark as Unread
                          </Dropdown.Item>
                          <Dropdown.Item to="/email-inbox" className="dropdown-item">
                            Add to Tasks
                          </Dropdown.Item>
                          <Dropdown.Item to="/email-inbox" className="dropdown-item">
                            Add Star
                          </Dropdown.Item>
                          <Dropdown.Item to="/email-inbox" className="dropdown-item">
                            Mute
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className="email-list mt-3">
                      {data.length > 0 ? (
                        data.map((email, index) => renderEmailItem(email, index))
                      ) : (
                        <div className="text-center py-5">
                          No emails found in this {activeCategory ? 'category' : 'folder'}
                        </div>
                      )}
                    </div>
                    {data.length > 0 && (
                      <div className="row mt-4">
                        <div className="col-12 justify-content-end">
                          <nav>
                            <ul className="pagination pagination-gutter pagination-primary pagination-sm no-bg flex space-x-2 justify-content-end">
                              <li className="page-item page-indicator">
                                <Link
                                  className="page-link"
                                  to="/mails"
                                  onClick={() => activePag.current > 0 && onClick(activePag.current - 1)}
                                >
                                  <i className="la la-angle-left"></i>
                                </Link>
                              </li>
                              {paggination.map((number, i) => (
                                <li
                                  key={i}
                                  className={`page-item ${activePag.current === i ? "active" : ""}`}
                                  onClick={() => onClick(i)}
                                >
                                  <Link className="page-link" to="/mails">
                                    {number}
                                  </Link>
                                </li>
                              ))}
                              <li className="page-item page-indicator">
                                <Link
                                  className="page-link"
                                  to="/mails"
                                  onClick={() => activePag.current + 1 < paggination.length && onClick(activePag.current + 1)}
                                >
                                  <i className="la la-angle-right"></i>
                                </Link>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MailInbox;