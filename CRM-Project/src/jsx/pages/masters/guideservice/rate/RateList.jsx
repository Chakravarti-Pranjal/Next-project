// import React, { useState } from "react";
// import {
//   Row,
//   Card,
//   Col,
//   Button,
//   Table,
//   Modal,
// } from "react-bootstrap";
// import { axiosOther } from "../../../../../http/axios_base_url";
// import "../../../../../scss/main.css";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { notifyError, notifySuccess } from "../../../../../helper/notify";

// const RateList = ({
//   id,
//   setDataUpdate,
//   setIsUpdating,
//   rateInitialList,
//   rateList,
// }) => {
//   const handleDeleteData = async (uniqeId, primId) => {
//     try {
//       const { data } = await axiosOther.post("deleteguideratejson", {
//         id: primId,
//         UniqueId: uniqeId,
//       });

//       if (data?.status == 1 || data?.Status == 1) {
//         rateList();
//         notifySuccess(data?.Message || data?.message);
//       }

//       if (data?.status == 0 || data?.Status == 0) {
//         notifyError(data?.Message || data?.message);
//       }
//     } catch (err) {
//       notifyError(err.message);
//     }
//   };

//   const [modalCentered, setModalCentered] = useState(false);
//   const [costViewData, setCostViewData] = useState([]);

//   const handleRateEdit = (value, companyId) => {
//     // console.log("Editing rate:", value);
//     setIsUpdating(true);
//     setDataUpdate({
//       ...value,
//       RateUniqueId: value.UniqueID,
//       CompanyId: companyId,
//     });
//   };

//   const handleCostView = (cost) => {
//     setModalCentered(true);
//     setCostViewData(cost);
//   };

//   return (
//     <>
//       <Row className="mt-5">
//         <Col lg={12}>
//           <Card>
//             <ToastContainer />
//             <Card.Body className="p-0">
//               <Table responsive striped bordered>
//                 <Modal className="fade quotationList" show={modalCentered}>
//                   <Modal.Header>
//                     <Modal.Title>Price Details</Modal.Title>
//                     <Button
//                       onClick={() => setModalCentered(false)}
//                       variant=""
//                       className="btn-close"
//                     ></Button>
//                   </Modal.Header>
//                   <Modal.Body className="py-2">
//                     <Row className="form-row-gap-2">
//                       <Col className="col-12 mt-2">
//                         {Array?.isArray(costViewData) &&
//                           costViewData.length > 0 ? (
//                           <Table
//                             responsive
//                             striped
//                             bordered
//                             className="rate-table mt-2"
//                           >
//                             <thead>
//                               <tr>
//                                 <th className="p-1 align-middle" rowSpan={2}>
//                                   <span>Pax</span>
//                                 </th>
//                                 <th className="p-1" colSpan={2}>
//                                   <span>Guide Fee</span>
//                                 </th>
//                                 <th className="p-1" colSpan={2}>
//                                   <span>Language Allowance</span>
//                                 </th>
//                                 <th className="p-1" colSpan={2}>
//                                   <span>Other Cost</span>
//                                 </th>
//                               </tr>
//                               <tr>
//                                 <th className="p-1">
//                                   <span>Full Day</span>
//                                 </th>
//                                 <th className="p-1">
//                                   <span>Half Day</span>
//                                 </th>
//                                 <th className="p-1">
//                                   <span>Full Day</span>
//                                 </th>
//                                 <th className="p-1">
//                                   <span>Half Day</span>
//                                 </th>
//                                 <th className="p-1">
//                                   <span>Full Day</span>
//                                 </th>
//                                 <th className="p-1">
//                                   <span>Half Day</span>
//                                 </th>
//                               </tr>
//                             </thead>
//                             {/* <tbody>
//                               {Array?.isArray(costViewData) ? (
//                                 costViewData?.map((cost, key) => (
//                                   <tr key={key}>
//                                     <td className="p-1">
//                                       {cost?.StartPax}-{cost?.EndPax}
//                                     </td>
//                                     <td className="p-1">
//                                       {cost?.GuideHalfDayFee}
//                                     </td>
//                                     <td className="p-1">
//                                       {cost?.GuideFullDayFee}
//                                     </td>
//                                     <td className="p-1">
//                                       {cost?.LAHalfDayFee}
//                                     </td>
//                                     <td className="p-1">
//                                       {cost?.LAFullDayFee}
//                                     </td>
//                                     <td className="p-1">
//                                       {cost?.OthersHalfDayFee}
//                                     </td>
//                                     <td className="p-1">
//                                       {cost?.OthersFullDayFee}
//                                     </td>
//                                   </tr>
//                                 ))
//                               ) : (
//                                 <tr>
//                                   <td colSpan={7}>No records found</td>
//                                 </tr>
//                               )}
//                             </tbody> */}
//                             <tbody>
//                               {Array?.isArray(costViewData) ? (
//                                 costViewData?.map((cost, key) => (
//                                   <tr key={key}>
//                                     <td className="p-1">{cost?.StartPax}-{cost?.EndPax}</td>
//                                     <td className="p-1">{cost?.GuideFullDayFee}</td>
//                                     <td className="p-1">{cost?.GuideHalfDayFee}</td>
//                                     <td className="p-1">{cost?.LAFullDayFee}</td>
//                                     <td className="p-1">{cost?.LAHalfDayFee}</td>
//                                     <td className="p-1">{cost?.OthersFullDayFee}</td>
//                                     <td className="p-1">{cost?.OthersHalfDayFee}</td>
//                                   </tr>
//                                 ))
//                               ) : (
//                                 <tr>
//                                   <td colSpan={7}>No records found</td>
//                                 </tr>
//                               )}
//                             </tbody>
//                           </Table>
//                         ) : (
//                           <p className="text-center">No records found !</p>
//                         )}
//                       </Col>
//                     </Row>
//                   </Modal.Body>
//                   <Modal.Footer>
//                     <Button
//                       onClick={() => setModalCentered(false)}
//                       variant="danger light"
//                       className="btn-custom-size"
//                     >
//                       Close
//                     </Button>
//                     <Button variant="primary" className="btn-custom-size">
//                       Save
//                     </Button>
//                   </Modal.Footer>
//                 </Modal>
//                 <thead>
//                   <tr>
//                     <th scope="col">
//                       <strong>Supplier</strong>
//                     </th>
//                     <th scope="col">
//                       <strong>Validity</strong>
//                     </th>
//                     <th scope="col">
//                       <strong>Day Type</strong>
//                     </th>
//                     <th scope="col">
//                       <strong>Guide GST(%)</strong>
//                     </th>
//                     <th scope="col">
//                       <strong>Status</strong>
//                     </th>
//                     <th scope="col">
//                       <strong>Action</strong>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rateInitialList?.map((item1) =>
//                     item1?.Ratejson?.Data?.map((item2) =>
//                       item2?.RateDetails?.map((item) => (
//                         <tr key={item?.UniqueID}>
//                           <td className="">{item?.SupplierName}</td>
//                           <td className="">
//                             {item?.ValidFrom?.split("-")?.reverse().join("-")}{" "}
//                             To {item?.ValidTo?.split("-").reverse().join("-")}
//                           </td>
//                           <td className="">{item?.DayType}</td>
//                           <td className="">{item?.GstSlabValue}</td>
//                           <td
//                             className={`font-weight-bold ${item?.Status == "1" ? "text-success" : "text-danger"
//                               }`}
//                           >
//                             <span>
//                               {item?.Status == 1 ? "Active" : "Inactive"}
//                             </span>
//                           </td>
//                           <td>
//                             <div className="d-flex justify-content-center">
//                               <span className="d-flex gap-1">
//                                 <i
//                                   className="fa-solid fa-pencil cursor-pointer text-success action-icon border-0 shadow"
//                                   onClick={() =>
//                                     handleRateEdit(item, item1?.CompanyId)
//                                   }
//                                 ></i>
//                                 <i
//                                   className="fa-solid fa-trash-can cursor-pointer text-danger action-icon shadow"
//                                   onClick={() =>
//                                     handleDeleteData(item?.UniqueID, item1?.id)
//                                   }
//                                 ></i>
//                                 <i
//                                   className="fa-solid fa-eye cursor-pointer text-warning action-icon shadow"
//                                   onClick={() => handleCostView(item?.ServiceCost)}
//                                 ></i>
//                               </span>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     )
//                   )}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default React.memo(RateList);

