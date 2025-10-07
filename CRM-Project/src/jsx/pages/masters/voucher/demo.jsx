import React, { useEffect, useState } from "react";
import { Card, Tab, Nav, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  setQoutationData,
  setQoutationSubject,
  setQueryData,
} from "../../../../store/actions/queryAction";
import { axiosOther } from "../../../../http/axios_base_url";
import useQueryData from "../../../../hooks/custom_hooks/useQueryData";
import PerfectScrollbar from "react-perfect-scrollbar";
import Select from "react-select";
import ClientVoucher from "./ClientVoucher";
import SupplierVoucher from "./SupplierVoucher";
import "./voucher.css";

function VouchersList() {
  const { qoutationData } = useSelector((data) => data?.queryReducer);
  const dispatch = useDispatch();
  const [showTabs, setShowTabs] = useState(false);
  const [qoutationList, setQoutationList] = useState([]);
  const [queryData, setQueryData] = useState({});
  const query = useQueryData();
  const [queryDataSet, setQueryDataSet] = useState(null);
  const [productList, setProductList] = useState([]);
  const [listFinalQuotationData, setListFinalQuotationData] = useState([]);
  const [selectedService, setSelectedService] = useState(null); // Track selected service
  const [selectedProductlist, setselectedProductlist] = useState({
    value: "all",
    label: "All",
  });
  // // Default to "All"

  const getProductList = async () => {
    try {
      const productRes = await axiosOther.post("listproduct");
      const productListData = productRes?.data?.Datalist || [];
      setProductList(productListData);
      setselectedProductlist(productListData);
      console.log(productListData, "productListData");
    } catch (error) {
      console.log("Error fetching product list:", error);
    }
  };

  useEffect(() => {
    getProductList();
  }, []);

  const optionss = [
    { value: "all", label: "All" },
    ...(Array.isArray(productList)
      ? productList.map((dest) => ({
          value: dest.id,
          label: dest.name,
        }))
      : []),
  ];

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#2e2e40",
      color: "white",
      border: "1px solid transparent",
      boxShadow: "none",
      borderRadius: "0.5rem",
      width: "100%",
      minWidth: "10rem",
      height: "2rem", // compact height
      minHeight: "2rem",
      fontSize: "1em",
      zIndex: 0,
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
      fontSize: "0.85em",
    }),
    input: (base) => ({
      ...base,
      color: "white",
      fontSize: "0.85em",
      margin: 0,
      padding: 0,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6c757d",
      fontSize: "0.85em",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#ccc",
      padding: "0 6px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#2e2e40",
      zIndex: 9999, // only number here
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#444" : "#2e2e40",
      color: "white",
      cursor: "pointer",
      fontSize: "0.85em",
      padding: "6px 10px",
    }),
  };

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  const getQoutationList = async () => {
    setQueryData(queryDataSet?.QueryAllData);
    try {
      const { data } = await axiosOther.post("listqueryquotation", {
        QueryId: queryDataSet?.QueryAlphaNumId,
        QuotationNo: queryQuotation?.QoutationNum,
      });
      if (data?.success) {
        setQoutationList(data?.data);
      }
    } catch (error) {
      console.log("Error fetching quotation list:", error);
    }
  };

  useEffect(() => {
    if (queryDataSet) {
      getQoutationList();
      dispatch(setQoutationData({}));
    }
  }, [queryDataSet]);

  useEffect(() => {
    setQueryDataSet(query);
  }, [queryDataSet]);
  console.log(selectedService, "payload");

  const getDataFromApi = async () => {
    const payload = {
      QueryId: queryQuotation?.QueryID,
    };
    try {
      const { data } = await axiosOther.post("querymasterlist", payload);
      console.log();

      dispatch(
        setQueryData({
          QueryData: {
            QueryId: data?.DataList[0]?.ServiceId,
            QueryAlphaNumId: data?.DataList[0]?.QueryID,
            QueryAllData: data?.DataList[0],
          },
        })
      );
    } catch (e) {
      console.log(e);
    }
    try {
      const { data } = await axiosOther.post("lisFinalQuotation", {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber: queryQuotation?.QoutationNum,
      });
      if (data?.Success) {
        setListFinalQuotationData(data?.FilteredQuotations[0]);
        console.log(data?.FilteredQuotations[0], "HJG78");
      }
    } catch (error) {
      console.log("Error fetching final quotation:", error);
    }
  };

  useEffect(() => {
    getDataFromApi();
  }, []);

  const redirectToItinerary = (data, service) => {
    // localStorage.removeItem('quotationList');
    dispatch(setQoutationSubject(data?.Header?.Subject));
    // localStorage.setItem(
    //   'Query_Qoutation',
    //   JSON.stringify({
    //     QoutationNum: data?.QuotationNumber,
    //     QueryID: data?.QueryAlphaNumId,
    //     ReservationStatus: 'Confirmed',
    //   })
    // );
    dispatch(setQoutationData(data));
    setSelectedService(service); // Set the selected service
    setShowTabs(true);
  };

  // Conditional rendering of tables based on selected filter
  const renderTables = () => {
    const selectedValue = selectedProductlist?.label?.toLowerCase()
      ? selectedProductlist?.label?.toLowerCase()
      : "";

    return (
      <div
        className="col-md-12 col-lg-12 overflow tablelist"
        style={{ overflowY: "auto", overflowX: "hidden" }}
      >
        {(!selectedValue ||
          selectedValue === "all" ||
          selectedValue === "hotel") && (
          <>
            <h5 className="">Hotel</h5>
            <table className="table table-bordered itinerary-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Entry</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Hotel</th>
                  <th>Nights</th>
                  <th>Double Rooms</th>
                  <th>Double Amount</th>
                  <th>Twin Rooms</th>
                  <th>Twin Amount</th>
                  <th>Single Rooms</th>
                  <th>Single Amount</th>
                  <th>Triple Rooms</th>
                  <th>Triple Amount</th>
                  <th>Voucher No</th>
                  <th>Client Conf</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {listFinalQuotationData?.ReservationRequest?.filter(
                  (item) =>
                    item?.ReservationStatus === "Confirmed" &&
                    item?.ServiceType?.toLowerCase() === "hotel"
                )?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td
                      className="cursor-pointer text-primary"
                      onClick={() =>
                        redirectToItinerary(listFinalQuotationData, {
                          ServiceId: item.ServiceId,
                          ServiceName: item.ServiceType,
                        })
                      }
                    >
                      {item?.SupplierName}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{item?.ReservationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {(!selectedValue ||
          selectedValue === "all" ||
          selectedValue === "restaurant") && (
          <>
            <h5 className="">Restaurant</h5>
            <table className="table table-bordered itinerary-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Entry</th>
                  <th>Restaurant / Hotel</th>
                  <th>Date</th>
                  <th>Pax</th>
                  <th>Breakfast Amount</th>
                  <th>Lunch Amount</th>
                  <th>Dinner Amount</th>
                  <th>Voucher No</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {listFinalQuotationData?.ReservationRequest?.filter(
                  (item) =>
                    item?.ReservationStatus === "Confirmed" &&
                    item?.ServiceType?.toLowerCase() === "restaurant"
                )?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>Pax</td>
                    <td
                      className="cursor-pointer text-primary"
                      onClick={() =>
                        redirectToItinerary(listFinalQuotationData, {
                          ServiceId: item.ServiceId,
                          ServiceName: item.ServiceType,
                        })
                      }
                    >
                      {item?.SupplierName}
                    </td>
                    <td>{item?.Date}</td>
                    <td>{item?.Pax}</td>
                    <td>{item?.BreakfastAmount}</td>
                    <td>{item?.LunchAmount}</td>
                    <td>{item?.DinnerAmount}</td>
                    <td>{item?.VoucherNo}</td>
                    <td>{item?.ReservationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {(!selectedValue ||
          selectedValue === "all" ||
          selectedValue === "transport") && (
          <>
            <h5 className="">Transport</h5>
            <table className="table table-bordered itinerary-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Local Agent</th>
                  <th>Voucher No</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {listFinalQuotationData?.ReservationRequest?.filter(
                  (item) =>
                    item?.ReservationStatus === "Confirmed" &&
                    item?.ServiceType?.toLowerCase() === "transport"
                )?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.From}</td>
                    <td>{item?.To}</td>
                    <td>{item?.Amount}</td>
                    <td
                      className="cursor-pointer text-primary"
                      onClick={() =>
                        redirectToItinerary(listFinalQuotationData, {
                          ServiceId: item.ServiceId,
                          ServiceName: item.ServiceType,
                        })
                      }
                    >
                      {item?.SupplierName}
                    </td>
                    <td>{item?.VoucherNo}</td>
                    <td>{item?.ReservationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {(!selectedValue ||
          selectedValue === "all" ||
          selectedValue === "train") && (
          <div>
            <h5 className="">Train</h5>
            <table className="table table-bordered itinerary-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Mode</th>
                  <th>PNR No</th>
                  <th>Train Name</th>
                  <th>Voucher No</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {listFinalQuotationData?.ReservationRequest?.filter(
                  (item) =>
                    item?.ReservationStatus === "Confirmed" &&
                    item?.ServiceType?.toLowerCase() === "train"
                )?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.From}</td>
                    <td>{item?.To}</td>
                    <td>{item?.Mode}</td>
                    <td>{item?.PNRNo}</td>
                    <td
                      className="cursor-pointer text-primary"
                      onClick={() =>
                        redirectToItinerary(listFinalQuotationData, {
                          ServiceId: item.ServiceId,
                          ServiceName: item.ServiceType,
                        })
                      }
                    >
                      {item?.SupplierName}
                    </td>
                    <td>{item?.VoucherNo}</td>
                    <td>{item?.ReservationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(!selectedValue ||
          selectedValue === "all" ||
          selectedValue === "flight") && (
          <div>
            <h5 className="">Air</h5>
            <table className="table table-bordered itinerary-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Mode</th>
                  <th>PNR No</th>
                  <th>Name</th>
                  <th>Voucher No</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {listFinalQuotationData?.ReservationRequest?.filter(
                  (item) =>
                    item?.ReservationStatus === "Confirmed" &&
                    item?.ServiceType?.toLowerCase() === "flight"
                )?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.From}</td>
                    <td>{item?.To}</td>
                    <td>{item?.Mode}</td>
                    <td>{item?.PNRNo}</td>
                    <td
                      className="cursor-pointer text-primary"
                      onClick={() =>
                        redirectToItinerary(listFinalQuotationData, {
                          ServiceId: item.ServiceId,
                          ServiceName: item.ServiceType,
                        })
                      }
                    >
                      {item?.SupplierName}
                    </td>
                    <td>{item?.VoucherNo}</td>
                    <td>{item?.ReservationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <Card.Body className="pt-0 ps-0 pe-0">
        <div className="d-flex align-items-center mb-2 gap-1">
          <h3>Generate Voucher |</h3>
          <div className="nav-item d-flex align-items-center mb-2">
            <Select
              id="optionss"
              options={optionss}
              value={selectedProductlist}
              onChange={setselectedProductlist}
              styles={customStyles}
              isSearchable
              className="customSelectLightTheame"
              classNamePrefix="custom"
            />
          </div>
        </div>
        <div className="d-flex align-items-center mb-2 gap-1">
          <span>Reference Id : </span>
          <span className="querydetails text-grey">
            {listFinalQuotationData?.ReferenceId}
          </span>
        </div>

        <div className="custom-tab-1">
          {!showTabs ? (
            renderTables()
          ) : (
            <Tab.Container defaultActiveKey="ClientVoucher">
              <>
                <Nav
                  as="ul"
                  className="nav-tabs"
                  style={{ backgroundColor: "var(--rgba-primary-1)" }}
                >
                  <Nav.Item as="li">
                    <Nav.Link eventKey="ClientVoucher">
                      <span className="nav-name">Client Voucher</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link eventKey="SupplierVoucher">
                      <span className="nav-name">Supplier Voucher</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Button
                    className="btn btn-dark btn-custom-size ms-auto me-5 my-2"
                    onClick={() => setShowTabs(false)}
                  >
                    <span className="me-1">Back</span>
                    <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                  </Button>
                </Nav>

                <Tab.Content className="pt-2">
                  <Tab.Pane eventKey="ClientVoucher">
                    <ClientVoucher selectedService={selectedService} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="SupplierVoucher">
                    <SupplierVoucher selectedService={selectedService} />
                  </Tab.Pane>
                </Tab.Content>
              </>
            </Tab.Container>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default VouchersList;

{
  /* {list?.ServiceType === "Monument" && (
                <div>
                  <h5 className="">Monument</h5>
                  <table className="table table-bordered itinerary-table">
                    <thead>
                      <tr>
                        <th className="p-1">
                          <div className="form-check check-sm d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              // checked={
                              //   selectedRows.length === reservationList.length
                              // }
                              onChange={handleSelectAll}
                            />
                          </div>
                        </th>
                        <th>S.No.</th>
                        <th>Type</th>
                        <th>Destination</th>
                        <th>Service Name</th>
                        <th>Supplier Name</th>
                        <th>Voucher No</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uniqueServices("Monument").map((item, index) => (
                        <tr
                          key={item.UniqueId}
                          className="cursor-pointer text-primary"
                          onClick={() =>
                            redirectToItinerary(listFinalQuotationData, {
                              UniqueId: item?.UniqueId,
                              ServiceId: item?.ServiceId,
                              ServiceUniqueId: item?.ServiceUniqueId,
                              ServiceName: item?.ServiceType,
                              SupplierId: item?.SupplierId,
                            })
                          }
                        >
                          <td className="p-1">
                            <div className="form-check check-sm d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                // checked={
                                //   selectedRows.length === reservationList.length
                                // }
                                onChange={handleSelectAll}
                              />
                            </div>
                          </td>
                          <td>
                            <span>{index + 1}</span>
                          </td>
                          <td
                            className="cursor-pointer text-primary"
                            onClick={() =>
                              redirectToItinerary(listFinalQuotationData, {
                                UniqueId: item?.UniqueId,
                                ServiceId: item?.ServiceId,
                                ServiceUniqueId: item?.ServiceUniqueId,
                                ServiceName: item?.ServiceType,
                                SupplierId: item?.SupplierId,
                              })
                            }
                          >
                            <span>{item?.ServiceType}</span>
                          </td>
                          <td>
                            <span>
                              {item?.ServiceDetails[0]?.DestinationName}
                            </span>
                          </td>
                          <td>
                            <span>
                              {item?.ServiceDetails[0]?.ServiceName || "-"}
                            </span>
                          </td>
                          <td>
                            <span>{item?.SupplierName}</span>
                          </td>
                          <td>
                            <span>{item?.VoucherNo}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {list?.ServiceType === "Activity" && (
                <div>
                  <h5 className="">Activity</h5>
                  <table className="table table-bordered itinerary-table">
                    <thead>
                      <tr>
                        <th className="p-1">
                          <div className="form-check check-sm d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              // checked={
                              //   selectedRows.length === reservationList.length
                              // }
                              onChange={handleSelectAll}
                            />
                          </div>
                        </th>
                        <th>S.No.</th>
                        <th>Type</th>
                        <th>Destination</th>
                        <th>Service Name</th>
                        <th>Supplier Name</th>
                        <th>Voucher No</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uniqueServices("Activity").map((item, index) => (
                        <tr
                          key={item.UniqueId}
                          className="cursor-pointer text-primary"
@ -734,18 +1141,20 @@ function VouchersList() {
                          }
                        >
                          <td className="p-1">
                            <div className="form-check check-sm d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                // checked={
                                //   selectedRows.length === reservationList.length
                                // }
                                onChange={handleSelectAll}
                              />
                            </div>
                          </td>
                          <td>
                            <span>{index + 1}</span>
                          </td>
                          <td
                            className="cursor-pointer text-primary"
                            onClick={() =>
@ -760,44 +1169,56 @@
                          >
                            <span>{item?.ServiceType}</span>
                          </td>
                          <td>
                            <span>
                              {item?.ServiceDetails[0]?.DestinationName}
                            </span>
                          </td>
                          <td>
                            <span>
                              {item?.ServiceDetails[0]?.ServiceName || "-"}
                            </span>
                          </td>
                          <td>
                            <span>{item?.SupplierName}</span>
                          </td>
                          <td>
                            <span>{item?.ServiceDetails[0]?.VoucherNo}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {list?.ServiceType === "Guide" && (
                <div>
                  <h5 className="">Guide</h5>
                  <table className="table table-bordered itinerary-table">
                    <thead>
                      <tr>
                        <th className="p-1">
                          <div className="form-check check-sm d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              // checked={
                              //   selectedRows.length === reservationList.length
                              // }
                              onChange={handleSelectAll}
                            />
                          </div>
                        </th>
                        <th>S.No.</th>
                        <th>Type</th>
                        <th>Destination</th>
                        <th>Service Name</th>
                        <th>Supplier Name</th>
                        <th>Voucher No</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uniqueServices("Guide").map((item, index) => (
                        <tr
                          key={item.UniqueId}
                          className="cursor-pointer text-primary"
 function VouchersList() {
                          }
                        >
                          <td className="p-1">
                            <div className="form-check check-sm d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                // checked={
                                //   selectedRows.length === reservationList.length
                                // }
                                onChange={handleSelectAll}
                              />
                            </div>
                          </td>
                          <td>
                            <span>{index + 1}</span>
                          </td>
                          <td
                            className="cursor-pointer text-primary"
                            onClick={() =>
@ -838,284 +1261,197 @@
                          >
                            <span>{item?.ServiceType}</span>
                          </td>
                          <td>
                            <span>
                              {item?.ServiceDetails[0]?.DestinationName}
                            </span>
                          </td>
                          <td>
                            <span>
                              {item?.ServiceDetails[0]?.ServiceName || "-"}
                            </span>
                          </td>
                          <td>
                            <span>{item?.SupplierName}</span>
                          </td>
                          <td>
                            <span>{item?.ServiceDetails[0]?.VoucherNo}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {list?.ServiceType === "Transport" && (
                <div>
                  <h5 className="">Transport</h5>
                  <table className="table table-bordered itinerary-table">
                    <thead>
                      <tr>
                        <th className="p-1">
                          <div className="form-check check-sm d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              // checked={
                              //   selectedRows.length === reservationList.length
                              // }
                              onChange={handleSelectAll}
                            />
                          </div>
                        </th>
                        <th>S.No.</th>
                        <th>Type</th>
                        <th>Destination</th>
                        <th>Service Name</th>
                        <th>Supplier Name</th>
                        <th>Voucher No</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uniqueServices("Transport").map((item, index) => (
                        <tr
                          key={item.UniqueId}
                          className="cursor-pointer text-primary"
                          onClick={() =>
                            redirectToItinerary(listFinalQuotationData, {
                              UniqueId: item?.UniqueId,
                              ServiceId: item?.ServiceId,
                              ServiceUniqueId: item?.ServiceUniqueId,
                              ServiceName: item?.ServiceType,
                              SupplierId: item?.SupplierId,
                            })
                          }
                        >
                          <td className="p-1">
                            <div className="form-check check-sm d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                // checked={
                                //   selectedRows.length === reservationList.length
                                // }
                                onChange={handleSelectAll}
                              />
                            </div>
                          </td>
                          <td>
                            <span>{index + 1}</span>
                          </td>
                          <td
                            className="cursor-pointer text-primary"
                            onClick={() =>
                              redirectToItinerary(listFinalQuotationData, {
                                UniqueId: item?.UniqueId,
                                ServiceId: item?.ServiceId,
                                ServiceUniqueId: item?.ServiceUniqueId,
                                ServiceName: item?.ServiceType,
                                SupplierId: item?.SupplierId,
                              })
                            }
                          >
                            <span>{item?.ServiceType}</span>
                          </td>
                          <td>
                            <span>
                              {item?.ServiceDetails[0]?.DestinationName}
                            </span>
                          </td>
                          <td>
                            <span>
                              {item?.ServiceDetails[0]?.ServiceName || "-"}
                            </span>
                          </td>
                          <td>
                            <span>{item?.SupplierName}</span>
                          </td>
                          <td>
                            <span>{item?.ServiceDetails[0]?.VoucherNo}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}*/
}
{
  /*
    {/* type === 'Supplier' && 
                <div>
                  <h5 className="">Local Agent</h5>
                  <table className="table table-bordered itinerary-table">
                    <thead>
                      <tr>
                        <th className="p-1">
                                  <div className="form-check check-sm d-flex align-items-center">
                                    <input
                                      type="checkbox"
                                      className="form-check-input height-em-1 width-em-1"
                                      // checked={
                                      //   selectedRows.length === reservationList.length
                                      // }
                                      onChange={handleSelectAll}
                                    />
                                  </div>
                                </th>
                        <th>S.No.</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Local Agent</th>
                        <th>Voucher No</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uniqueServices("Train").map((item, index) => (
                        <tr
                          key={item.UniqueId}
                          className="cursor-pointer text-primary"
                          onClick={() =>
                            redirectToItinerary(listFinalQuotationData, {
                              UniqueId: item?.UniqueId,
                              ServiceId: item?.ServiceId,
                              ServiceUniqueId: item?.ServiceUniqueId,
                              ServiceName: item?.ServiceType,
                              SupplierId: item?.SupplierId,
                            })
                          }
                        >
                          <td className="p-1">
                                  <div className="form-check check-sm d-flex align-items-center">
                                    <input
                                      type="checkbox"
                                      className="form-check-input height-em-1 width-em-1"
                                      // checked={
                                      //   selectedRows.length === reservationList.length
                                      // }
                                      onChange={handleSelectAll}
                                    />
                                  </div>
                                </td>
                          <td><span>{index + 1}</span></td>
                          <td
                            className="cursor-pointer text-primary"
                            onClick={() =>
                              redirectToItinerary(listFinalQuotationData, {
                                UniqueId: item?.UniqueId,
                                ServiceId: item?.ServiceId,
                                ServiceUniqueId: item?.ServiceUniqueId,
                                ServiceName: item?.ServiceType,
                                SupplierId: item?.SupplierId,
                              })
                            }
                          >
                            <span>{item?.ServiceType}</span>
                          </td>
                          <td><span>{item?.ServiceDetails[0]?.DestinationName}</span></td>
                          <td><span>{item?.ServiceDetails[0]?.ServiceName || "-"}</span></td>
                          <td><span>{item?.ServiceDetails[0]?.VoucherNo}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              */
}

// const renderTables = () => {
//   const filteredServices = listFinalQuotationData?.filter((item) => {
//     const matchesService = service
//       ? item?.ServiceType?.toLowerCase() === service.label?.toLowerCase()
//       : true;
//     const matchesSupplier = supplier
//       ? item?.SupplierId === supplier.value
//       : true;
//     return (
//       item.ReservationStatus === "Confirmed" &&
//       matchesService &&
//       matchesSupplier
//     );
//   });

//   const uniqueServices = (serviceType = null) => {
//     const seen = new Set();
//     return (
//       filteredServices?.filter((item) => {
//         const isConfirmed = item?.ReservationStatus === "Confirmed";
//         const matchesServiceType = serviceType
//           ? item?.ServiceType?.toLowerCase() === serviceType.toLowerCase()
//           : true;
//         const isUnique = !seen.has(item.ServiceUniqueId);

//         if (isConfirmed && matchesServiceType && isUnique) {
//           seen.add(item.ServiceUniqueId);
//           return true;
//         }
//         return false;
//       }) || []
//     );
//   };

//   console.log(uniqueServices("Hotel"), "SFDSFDSFDS554");

//   // Get unique service types for rendering sections
//   const services = [];
//   const seenServiceTypes = new Set();

//   filteredServices?.forEach((item) => {
//     if (
//       item.ReservationStatus === "Confirmed" &&
//       !seenServiceTypes.has(item.ServiceType)
//     ) {
//       seenServiceTypes.add(item.ServiceType);
//       services.push(item);
//     }
//   });

//   return (
//     <div
//       className="col-md-12 col-lg-12 overflow tablelist"
//       style={{ overflowY: "auto", overflowX: "hidden" }}
//     >
//       {/*<Nav
//         as="ul"
//         className="nav-tabs"
//         style={{
//           backgroundColor: "var(--rgba-primary-1)",
//           marginBottom: "10px",
//         }}
//         activeKey={type === "Client" ? "ClientVoucher" : "SupplierVoucher"}
//         onSelect={(selectedKey) => {
//           if (selectedKey === "SupplierVoucher") setType("Supplier");
//           else if (selectedKey === "ClientVoucher") setType("Client");
//         }}
//       >
//         <Nav.Item as="li">
//           <Nav.Link eventKey="ClientVoucher" active={type === "Client"}>
//             <span className="nav-name">Client Voucher</span>
//           </Nav.Link>
//         </Nav.Item>
//         <Nav.Item as="li">
//           <Nav.Link eventKey="SupplierVoucher" active={type === "Supplier"}>
//             <span className="nav-name">Supplier Voucher</span>
//           </Nav.Link>
//         </Nav.Item>
//       </Nav>*/}

//       {console.log(uniqueServices("Hotel"), "skfsdkfkds549715")}

//       {services?.length > 0 || localAgentList.length > 0 ? (
//         <>
//           {services?.map((list, idx) => (
//             <div key={idx}>
//               {list?.ServiceType === "Hotel" && (
//                 <div>
//                   <h5 className="">Hotel</h5>
//                   <table className="table table-bordered itinerary-table">
//                     <thead>
//                       <tr>
//                         <th className="p-1">
//                           <div className="form-check check-sm d-flex align-items-center">
//                             <input
//                               type="checkbox"
//                               className="form-check-input height-em-1 width-em-1"
//                               onChange={handleSelectAll}
//                             />
//                           </div>
//                         </th>
//                         <th>S.No.</th>
//                         <th>Entity</th>
//                         <th>From</th>
//                         <th>To</th>
//                         <th>Hotel</th>
//                         <th>Nts</th>
//                         <th>DBL Rooms</th>
//                         <th>DBL Amount</th>
//                         <th>Twin Rooms</th>
//                         <th>Twin Amount</th>
//                         <th>SGL Rooms</th>
//                         <th>SGL Amount</th>
//                         <th>TPL Rooms</th>
//                         <th>TPL Amount</th>
//                         <th>Voucher No</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {uniqueServices("Hotel").map((item, index) => (
//                         <tr key={index}>
//                           <td className="p-1">
//                             <div className="form-check check-sm d-flex align-items-center">
//                               <input
//                                 type="checkbox"
//                                 className="form-check-input height-em-1 width-em-1"
//                                 onChange={handleSelectAll}
//                               />
//                             </div>
//                           </td>
//                           <td>
//                             <span>{index + 1}</span>
//                           </td>
//                           <td>
//                             <span>Pax</span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails?.[0]?.FromDate ||
//                                 "DD-MM-YYYY"}
//                             </span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails?.[0]?.ToDate ||
//                                 "DD-MM-YYYY"}
//                             </span>
//                           </td>
//                           <td
//                             className="cursor-pointer text-primary"
//                             onClick={() =>
//                               redirectToItinerary(listFinalQuotationData, {
//                                 UniqueId: item?.UniqueId,
//                                 ServiceId: item?.ServiceId,
//                                 ServiceUniqueId: item?.ServiceUniqueId,
//                                 ServiceName: item?.ServiceType,
//                                 SupplierId: item?.SupplierId,
//                               })
//                             }
//                           >
//                             <span>{item?.SupplierName}</span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails?.[0]?.TotalNights}
//                             </span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails?.[0]?.Rooms?.find(
//                                 (r) => r.RoomType === "DBL Room"
//                               )?.Count || "0"}
//                             </span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails?.[0]?.Rooms?.find(
//                                 (r) => r.RoomType === "DBL Room"
//                               )?.Cost || "0"}
//                             </span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails?.[0]?.Rooms?.find(
//                                 (r) => r.RoomType === "TPL Room"
//                               )?.Count || "0"}
//                             </span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails?.[0]?.Rooms?.find(
//                                 (r) => r.RoomType === "TPL Room"
//                               )?.Cost || "0"}
//                             </span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails?.[0]?.Rooms?.find(
//                                 (r) => r.RoomType === "SGL Room"
//                               )?.Count || "0"}
//                             </span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails?.[0]?.Rooms?.find(
//                                 (r) => r.RoomType === "SGL Room"
//                               )?.Cost || "0"}
//                             </span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails?.[0]?.RoomBedType?.find(
//                                 (r) =>
//                                   r.RoomBedTypeName?.toLowerCase()?.includes(
//                                     "extrabed"
//                                   )
//                               )?.RoomBedTypeName || "0"}
//                             </span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails?.[0]?.RoomBedType?.find(
//                                 (r) =>
//                                   r.RoomBedTypeName?.toLowerCase()?.includes(
//                                     "extrabed"
//                                   )
//                               )?.RoomCost || "0"}
//                             </span>
//                           </td>

//                           <td>
//                             <span>{item?.ServiceDetails[0]?.VoucherNo}</span>
//                           </td>
//                           <td>
//                             <span></span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//               {list?.ServiceType === "Restaurant" && (
//                 <div>
//                   <h5 className="">Restaurant</h5>
//                   <table className="table table-bordered itinerary-table">
//                     <thead>
//                       <tr>
//                         <th className="p-1">
//                           <div className="form-check check-sm d-flex align-items-center">
//                             <input
//                               type="checkbox"
//                               className="form-check-input height-em-1 width-em-1"
//                               onChange={handleSelectAll}
//                             />
//                           </div>
//                         </th>
//                         <th>S.No.</th>
//                         <th>Entity</th>
//                         <th>Type</th>
//                         <th>Destination</th>
//                         <th>Supplier</th>
//                         <th>Restaurant/Hotel</th>
//                         <th>Pax</th>
//                         <th>Breakfast amount</th>
//                         <th>Lunch amount</th>
//                         <th>Dinner amount</th>
//                         <th>Voucher No</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {uniqueServices("Restaurant").map((item, index) => (
//                         <tr
//                           key={item.UniqueId}
//                           className="cursor-pointer text-primary"
//                           onClick={() =>
//                             redirectToItinerary(listFinalQuotationData, {
//                               UniqueId: item?.UniqueId,
//                               ServiceId: item?.ServiceId,
//                               ServiceUniqueId: item?.ServiceUniqueId,
//                               ServiceName: item?.ServiceType,
//                               SupplierId: item?.SupplierId,
//                             })
//                           }
//                         >
//                           <td className="p-1">
//                             <div className="form-check check-sm d-flex align-items-center">
//                               <input
//                                 type="checkbox"
//                                 className="form-check-input height-em-1 width-em-1"
//                                 onChange={handleSelectAll}
//                               />
//                             </div>
//                           </td>
//                           <td>
//                             <span>{index + 1}</span>
//                           </td>
//                           <td>
//                             <span>Pax</span>
//                           </td>
//                           <td
//                             className="cursor-pointer text-primary"
//                             onClick={() =>
//                               redirectToItinerary(listFinalQuotationData, {
//                                 UniqueId: item?.UniqueId,
//                                 ServiceId: item?.ServiceId,
//                                 ServiceUniqueId: item?.ServiceUniqueId,
//                                 ServiceName: item?.ServiceType,
//                                 SupplierId: item?.SupplierId,
//                               })
//                             }
//                           >
//                             <span>{item?.ServiceType}</span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails[0]?.DestinationName ||
//                                 "-"}
//                             </span>
//                           </td>
//                           <td>
//                             <span>{item?.SupplierName}</span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails[0]?.ServiceName || "-"}
//                             </span>
//                           </td>
//                           <td>
//                             <span>{"-"}</span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails?.[0]?.MealPlan?.find(
//                                 (m) =>
//                                   m.MealPlanName?.toLowerCase() ===
//                                   "breakfast"
//                               )?.MealPlanCost || "0"}
//                             </span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails?.[0]?.MealPlan?.find(
//                                 (m) =>
//                                   m.MealPlanName?.toLowerCase() === "lunch"
//                               )?.MealPlanCost || "0"}
//                             </span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails?.[0]?.MealPlan?.find(
//                                 (m) =>
//                                   m.MealPlanName?.toLowerCase() === "dinner"
//                               )?.MealPlanCost || "0"}
//                             </span>
//                           </td>
//                           <td>
//                             <span>{item?.ServiceDetails[0]?.VoucherNo}</span>
//                           </td>
//                           <td>
//                             <span></span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//               {list?.ServiceType === "Flight" && (
//                 <div>
//                   <h5 className="">Flight</h5>
//                   <table className="table table-bordered itinerary-table">
//                     <thead>
//                       <tr>
//                         <th className="p-1">
//                           <div className="form-check check-sm d-flex align-items-center">
//                             <input
//                               type="checkbox"
//                               className="form-check-input height-em-1 width-em-1"
//                               onChange={handleSelectAll}
//                             />
//                           </div>
//                         </th>
//                         <th>S.No.</th>
//                         <th>Type</th>
//                         <th>Destination</th>
//                         <th>Service Name</th>
//                         <th>Supplier Name</th>
//                         <th>Voucher No</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {uniqueServices("Flight").map((item, index) => (
//                         <tr
//                           key={item.UniqueId}
//                           className="cursor-pointer text-primary"
//                           onClick={() =>
//                             redirectToItinerary(listFinalQuotationData, {
//                               UniqueId: item?.UniqueId,
//                               ServiceId: item?.ServiceId,
//                               ServiceUniqueId: item?.ServiceUniqueId,
//                               ServiceName: item?.ServiceType,
//                               SupplierId: item?.SupplierId,
//                             })
//                           }
//                         >
//                           <td className="p-1">
//                             <div className="form-check check-sm d-flex align-items-center">
//                               <input
//                                 type="checkbox"
//                                 className="form-check-input height-em-1 width-em-1"
//                                 onChange={handleSelectAll}
//                               />
//                             </div>
//                           </td>
//                           <td>
//                             <span>{index + 1}</span>
//                           </td>
//                           <td
//                             className="cursor-pointer text-primary"
//                             onClick={() =>
//                               redirectToItinerary(listFinalQuotationData, {
//                                 UniqueId: item?.UniqueId,
//                                 ServiceId: item?.ServiceId,
//                                 ServiceUniqueId: item?.ServiceUniqueId,
//                                 ServiceName: item?.ServiceType,
//                                 SupplierId: item?.SupplierId,
//                               })
//                             }
//                           >
//                             <span>{item?.ServiceType}</span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails[0]?.DestinationName}
//                             </span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails[0]?.ServiceName || "-"}
//                             </span>
//                           </td>
//                           <td>
//                             <span>{item?.SupplierName}</span>
//                           </td>
//                           <td>
//                             <span>{item?.ServiceDetails[0]?.VoucherNo}</span>
//                           </td>
//                           <td>
//                             <span></span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//               {list?.ServiceType === "Train" && (
//                 <div>
//                   <h5 className="">Train</h5>
//                   <table className="table table-bordered itinerary-table">
//                     <thead>
//                       <tr>
//                         <th className="p-1">
//                           <div className="form-check check-sm d-flex align-items-center">
//                             <input
//                               type="checkbox"
//                               className="form-check-input height-em-1 width-em-1"
//                               onChange={handleSelectAll}
//                             />
//                           </div>
//                         </th>
//                         <th>S.No.</th>
//                         <th>Type</th>
//                         <th>Destination</th>
//                         <th>Service Name</th>
//                         <th>Supplier Name</th>
//                         <th>Voucher No</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {uniqueServices("Train").map((item, index) => (
//                         <tr
//                           key={item.UniqueId}
//                           className="cursor-pointer text-primary"
//                           onClick={() =>
//                             redirectToItinerary(listFinalQuotationData, {
//                               UniqueId: item?.UniqueId,
//                               ServiceId: item?.ServiceId,
//                               ServiceUniqueId: item?.ServiceUniqueId,
//                               ServiceName: item?.ServiceType,
//                               SupplierId: item?.SupplierId,
//                             })
//                           }
//                         >
//                           <td className="p-1">
//                             <div className="form-check check-sm d-flex align-items-center">
//                               <input
//                                 type="checkbox"
//                                 className="form-check-input height-em-1 width-em-1"
//                                 onChange={handleSelectAll}
//                               />
//                             </div>
//                           </td>
//                           <td>
//                             <span>{index + 1}</span>
//                           </td>
//                           <td
//                             className="cursor-pointer text-primary"
//                             onClick={() =>
//                               redirectToItinerary(listFinalQuotationData, {
//                                 UniqueId: item?.UniqueId,
//                                 ServiceId: item?.ServiceId,
//                                 ServiceUniqueId: item?.ServiceUniqueId,
//                                 ServiceName: item?.ServiceType,
//                                 SupplierId: item?.SupplierId,
//                               })
//                             }
//                           >
//                             <span>{item?.ServiceType}</span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails[0]?.DestinationName}
//                             </span>
//                           </td>
//                           <td>
//                             <span>
//                               {item?.ServiceDetails[0]?.ServiceName || "-"}
//                             </span>
//                           </td>
//                           <td>
//                             <span>{item?.SupplierName}</span>
//                           </td>
//                           <td>
//                             <span>{item?.ServiceDetails[0]?.VoucherNo}</span>
//                           </td>
//                           <td>
//                             <span></span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           ))}
//           {localAgentList.length > 0 && (
//             <div>
//               <h5 className="">Local Agents</h5>
//               {console.log(localAgentList, "sjfskldf")}
//               <table className="table table-bordered itinerary-table">
//                 <thead>
//                   <tr>
//                     <th className="p-1">
//                       <div className="form-check check-sm d-flex align-items-center">
//                         <input
//                           type="checkbox"
//                           className="form-check-input height-em-1 width-em-1"
//                           onChange={handleSelectAll}
//                         />
//                       </div>
//                     </th>
//                     <th>S.No.</th>
//                     <th>From Date</th>
//                     <th>To Date</th>
//                     <th>Destination</th>
//                     <th>Supplier</th>
//                     <th>Voucher No</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {localAgentList.map((item, index) => (
//                     <tr key={index} className="cursor-pointer text-primary">
//                       <td className="p-1">
//                         <div className="form-check check-sm d-flex align-items-center">
//                           <input
//                             type="checkbox"
//                             className="form-check-input height-em-1 width-em-1"
//                             onChange={handleSelectAll}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <span>{index + 1}</span>
//                       </td>
//                       <td>
//                         <span>{item?.Date || "DD-MM-YYYY"}</span>
//                       </td>
//                       <td>
//                         <span>{item?.Date || "DD-MM-YYYY"}</span>
//                       </td>
//                       <td
//                         className="cursor-pointer text-primary"
//                         onClick={() =>
//                           redirectToItinerary(listFinalQuotationData, {
//                             UniqueId: item?.UniqueId,
//                             ServiceId: item?.ServiceId,
//                             ServiceUniqueId: item?.ServiceUniqueId,
//                             ServiceName: item?.ServiceType,
//                             SupplierId: item?.SupplierId,
//                           })
//                         }
//                       >
//                         <span>{item?.DestinationName}</span>
//                       </td>

//                       <td
//                         className="cursor-pointer text-primary"
//                         onClick={() =>
//                           redirectToItinerary(listFinalQuotationData, {
//                             UniqueId: item?.UniqueId,
//                             ServiceId: item?.ServiceId,
//                             ServiceUniqueId: item?.ServiceUniqueId,
//                             ServiceName: item?.ServiceType,
//                             SupplierId: item?.SupplierId,
//                           })
//                         }
//                       >
//                         <span>{item?.SupplierName}</span>
//                       </td>
//                       <td>
//                         <span>{item?.VoucherNo}</span>
//                       </td>
//                       <td>
//                         <span></span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       ) : (
//         <div>Vouchers not available!</div>
//       )}
//     </div>
//   );
// };
