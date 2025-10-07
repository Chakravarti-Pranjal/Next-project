import React, { memo, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { useSelector } from "react-redux";
import { axiosOther } from "../../../../http/axios_base_url";

function PendingPopup() {
  // const [lgShow, setLgShow] = useState(false);
  // const [pendingServices, setPendingServices] = useState(null);
  // const [hasModalShown, setHasModalShown] = useState(false); // New state to track if modal has been shown
  // const { queryData, qoutationData } = useSelector((state) => state?.queryReducer);
  // const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  // const getPendingReservations = async () => {
  //     const payload = {
  //         QueryId: queryData?.QueryId,
  //         QuotationNumber: queryQuotation?.QoutationNum || qoutationData?.QuotationNumber,
  //         // QuotationNumber: qoutationData?.QuotationNumber || "",
  //         Status: "Pending",
  //     };
  //     try {
  //         const { data } = await axiosOther.post("getConfirmedReservations", payload);
  //         setPendingServices(data);
  //     } catch (e) {
  //         console.log(e);
  //     }
  // };
  // useEffect(() => {
  //     getPendingReservations();
  // }, [qoutationData, queryData]);
  // useEffect(() => {
  //     if (pendingServices?.List?.length > 0 && !hasModalShown) {
  //         setTimeout(() => {
  //             display();
  //         }, 1000);
  //     }
  // }, [pendingServices]);
  // const display = () => {
  //     setLgShow(true);
  //     setHasModalShown(true);
  // };
  // // const display = () => {
  // //     if (!hasModalShown) {
  // //         setLgShow(true)
  // //         setHasModalShown(true)
  // //     }
  // // }
  // // useEffect(() => {
  // //     pendingServices && setTimeout(() => {
  // //         display()
  // //     }, 1000);
  // // }, [pendingServices])
  // return (
  //     <Modal
  //         size="lg"
  //         show={lgShow}
  //         onHide={() => setLgShow(false)}
  //         aria-labelledby="example-modal-sizes-title-lg"
  //     >
  //         <Modal.Header closeButton>
  //             <Modal.Title id="example-modal-sizes-title-lg">
  //                 Pending Reservations
  //             </Modal.Title>
  //         </Modal.Header>
  //         <Modal.Body>
  //             <Table striped bordered hover className='itinerary-table'>
  //                 <thead>
  //                     <tr>
  //                         <th className='p-2' style={{ fontWeight: "700" }}>Service Date</th>
  //                         <th className='p-2' style={{ fontWeight: "700" }}>Service Type</th>
  //                         <th className='p-2' style={{ fontWeight: "700" }}>Services</th>
  //                         <th className='p-2' style={{ fontWeight: "700" }}>Supplier Name</th>
  //                         <th className='p-2' style={{ fontWeight: "700" }}>Status</th>
  //                     </tr>
  //                 </thead>
  //                 <tbody>
  //                     {pendingServices &&
  //                         pendingServices?.List
  //                             // filter unique by ServiceUniqueId
  //                             .filter(
  //                             (item, index, self) =>
  //                                 index === self.findIndex((t) => t.ServiceUniqueId === item.ServiceUniqueId)
  //                             )
  //                             .map((l) => (
  //                             <tr key={l.UniqueId}>
  //                                 <td className="p-3">{l.ConfirmationDate}</td>
  //                                 <td className="p-3">{l.ServiceType}</td>
  //                                 <td className="p-3">{l.ServicesName}</td>
  //                                 <td className="p-3">{l.SupplierName}</td>
  //                                 <td className="p-3">{l.ReservationStatus}</td>
  //                             </tr>
  //                             ))}
  //                 </tbody>
  //             </Table>
  //             <hr />
  //             <div className="d-flex justify-content-end">
  //                 <Button onClick={() => setLgShow(false)} className="voucher-btn-5">
  //                     Close
  //                 </Button>
  //             </div>
  //         </Modal.Body>
  //     </Modal>
  // );
}

export default memo(PendingPopup);
