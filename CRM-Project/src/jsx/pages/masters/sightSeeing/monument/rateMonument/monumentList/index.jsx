import React from "react";
import { Row, Card, Col } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifySuccess, notifyError } from "../../../../../../../helper/notify";
import { axiosOther } from "../../../../../../../http/axios_base_url";
import "../../../../../../../scss/main.css";

const RateList = ({
  setDataUpdate,
  setIsUpdating,
  rateInitialList,
  rateList,
}) => {
  const handleRateDelete = async (uniquId, primId) => {
    try {
      const { data } = await axiosOther.post("deletemonumentrate", {
        MonumentId: primId,
        UniqueId: uniquId,
      });

      if (data?.status == 1 || data?.Status == 1) {
        rateList();
        notifySuccess(data?.Message || data?.message);
      }

      if (data?.status == 0 || data?.Status == 0) {
        notifyError(data?.Message || data?.message);
      }
    } catch (err) {
      notifyError(err.message);
    }
  };

  const handleRateEdit = (value, companyId) => {
    setIsUpdating(true);
    setDataUpdate({
      ...value,
      companyId: companyId,
    });
  };

  return (
    <>
      <Row className="mt-5">
        <Col lg={12}>
          <Card>
            <ToastContainer />
            <Card.Body className="p-0">
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    <th scope="col">
                      <strong>Validity</strong>
                    </th>

                    <th scope="col">
                      <strong>Monument Name</strong>
                    </th>
                    <th scope="col">
                      <strong>Currency</strong>
                    </th>
                    <th scope="col">
                      <strong>Supplier</strong>
                    </th>
                    <th scope="col">
                      <strong>Adult Cost (Foreign )</strong>
                    </th>
                    <th scope="col">
                      <strong>Child Cost (Foreign )</strong>
                    </th>
                    <th scope="col">
                      <strong>Adult Cost (indian)</strong>
                    </th>
                    <th scope="col">
                      <strong>Child Cost (indian)</strong>
                    </th>
                    <th scope="col">
                      <strong>GST Slab</strong>
                    </th>
                    <th scope="col">
                      <strong>Status</strong>
                    </th>
                    <th scope="col">
                      <strong>Action</strong>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rateInitialList?.map((item1) => {
                    return item1?.RateJson?.Data?.map((item2) => {
                      return item2?.RateDetails?.map((item) => {
                        console.log(item, "monumentItem");
                        return (
                          <tr key={item?.UniqueID}>
                            <td className="text-center px-0">
                              {item?.ValidFrom?.split("-")
                                ?.reverse()
                                ?.join("-")}
                              &nbsp; To &nbsp;
                              {item?.ValidTo?.split("-").reverse()?.join("-")}
                            </td>
                            <td className="text-center">
                              {item1?.RateJson?.MonumentName}
                            </td>
                            <td className="text-center">
                              {item?.CurrencyName}
                            </td>
                            <td className="text-center">
                              {item?.SupplierName}
                            </td>
                            <td className="text-center d-flex gap-0 flex-column">
                              {/* <span>{item?.IndianAdultEntFee}</span> */}
                              <span>{item?.ForeignerAdultEntFee}</span>
                            </td>
                            <td className="text-center">
                              <span className="d-flex flex-column">
                                {item?.ForeignerChildEntFee}
                              </span>
                              {/* <span>{item?.IndianChildEntFee}</span> */}
                            </td>
                            <td className="text-center d-flex gap-0 flex-column">
                              <span>{item?.IndianAdultEntFee}</span>
                            </td>
                            <td className="text-center">
                              {/* <span className="d-flex flex-column">
                                {item?.ForeignerChildEntFee}
                              </span> */}
                              <span>{item?.IndianChildEntFee}</span>
                            </td>
                            <td className="text-center">
                              {`${item?.TaxSlabName} ${item?.TaxSlabVal}`}
                            </td>
                            <td className="text-center">
                              {item?.Status == 1 ? "Active" : "Inactive"}
                            </td>
                            {/* {console.log(item?.Status,"status")} */}
                            <td className=" py-1">
                              <span className="d-flex gap-2 justify-content-center">
                                <i
                                  className="fa-solid fa-pencil cursor-pointer action-icon text-success"
                                  onClick={() =>
                                    handleRateEdit(
                                      item,
                                      item1?.RateJson?.companyId
                                    )
                                  }
                                ></i>
                                <i
                                  className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
                                  onClick={() =>
                                    handleRateDelete(
                                      item?.UniqueID,
                                      item1?.RateJson?.MonumentId
                                    )
                                  }
                                ></i>
                              </span>
                            </td>
                          </tr>
                        );
                      });
                    });
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default React.memo(RateList);
