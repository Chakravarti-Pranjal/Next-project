import React, { useState } from "react";
import { transportationPopupList } from "../quotationdata";
import PerfectScrollbar from "react-perfect-scrollbar";

const TransportationModal = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [formData, setFormData] = useState({
    From: "",
    To: "",
    Uknown: "",
    FromDestination: "",
    ToDestination: "",
    TransferType: "",
    Transportation: "",
    CostType: "",
    EnterName: "",
  });

  const [addFormData, setAddFormData] = useState({
    TransportationName: "",
    VehicleType: "",
    TransportationType: "",
    VehicleModel: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = () => {
    setIsSearching(true);
  };

  const handleAddDataChange = (e) => {
    const { name, value } = e.target;
    setAddFormData({ ...addFormData, [name]: value });
  };

  return (
    <>
      {!addNew && (
        <div className="position-relative">
          <div className="row px-2">
            <div className="col-1 p-0 d-flex flex-column justify-content-between border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                FROM
              </label>
              <select
                name="SelectDestination"
                id=""
                className="font-size-10 border py-1 rounded"
                value={formData?.From}
                onChange={handleChange}
              >
                <option value="">Destination</option>
                <option value="1">India</option>
              </select>
            </div>
            <div className="col-1 p-0 d-flex flex-column justify-content-between border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                To
              </label>
              <select
                name="Destinations"
                id=""
                className="font-size-10 border py-1 rounded"
                value={formData?.To}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">Delhi</option>
              </select>
            </div>
            <div className="col-1 p-0 d-flex flex-column justify-content-between border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                ----
              </label>
              <select
                name="StartRating"
                id=""
                className="font-size-10 border py-1 rounded"
                value={formData?.Unknown}
                onChange={handleChange}
              >
                <option value="">Select Destination</option>
                <option value="1">Noida</option>
              </select>
            </div>
            <div className="col-1 p-0 d-flex flex-column justify-content-between border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                FROM DESTINAION
              </label>
              <select
                name="HotelType"
                id=""
                className="font-size-10 border py-1 rounded"
                value={formData?.FromDestination}
                onChange={handleChange}
              >
                <option value="">Noida</option>
                <option value="1">Delhi</option>
              </select>
            </div>
            <div className="col-1 p-0 d-flex flex-column justify-content-between border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                TO DESTINATION
              </label>
              <select
                name="RoomType"
                id=""
                className="font-size-10 border py-1 rounded"
                value={formData?.ToDestination}
                onChange={handleChange}
              >
                <option value="">Delhi</option>
                <option value="1">Noida</option>
              </select>
            </div>
            <div className="col-1 p-0 d-flex flex-column justify-content-between border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                TRANSFER TYPE
              </label>
              <select
                name="From"
                id=""
                value={formData?.TransferType}
                onChange={handleChange}
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select</option>
                <option value="1"></option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column justify-content-between border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                TRANSPORTATION
              </label>
              <select
                name="To"
                id=""
                className="font-size-10 border py-1 rounded"
                value={formData?.Transportation}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1"></option>
              </select>
            </div>
            <div className="col-1 p-0 d-flex flex-column justify-content-between border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                Cost Type
              </label>
              <select
                name="To"
                id=""
                className="font-size-10 border py-1 rounded"
                value={formData?.CostType}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1"></option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column justify-content-between border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                ENTER NAME
              </label>
              <input
                type="text"
                placeholder="Enter Keyword"
                name="EnterName"
                value={formData?.EnterName}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-1 p-0 d-flex justify-content-center align-items-center  border">
              <p
                onClick={handleSearch}
                className="m-0 font-size-10 px-2 py-1 bg-success rounded cursor-pointer"
              >
                Search
              </p>
            </div>
          </div>
          {isSearching && (
            <>
              <div className="row mt-2 justify-content-end px-2">
                <div className="col-2 p-0 d-flex justify-content-end">
                  <button
                    className="btn btn-success font-size-10"
                    onClick={() => setAddNew(true)}
                  >
                    Add New +
                  </button>
                </div>
              </div>
              <div className="row mt-2">
                <PerfectScrollbar className="dlabnav-scroll">
                  <form action="">
                    <div className="col-12 p-0">
                      <table className="table table-bordered table-striped">
                        <thead className="border-0">
                          <tr className="border-0">
                            <th className="border-0 font-size-10 p-0 p-1 text-center">
                              Supplier Name
                            </th>
                            <th className="border-0 font-size-10 p-0 p-1 text-center">
                              TPT Name
                            </th>
                            <th className="border-0 font-size-10 p-0 p-1 text-center">
                              Vehicle Type
                            </th>
                            <th className="border-0 font-size-10 p-0 p-1 text-center">
                              Currency[ROE]
                            </th>
                            <th className="border-0 font-size-10 p-0 p-1 text-center">
                              Pax Capacity
                            </th>
                            <th className="border-0 font-size-10 p-0 p-1 text-center">
                              Package Cost
                            </th>
                            <th className="border-0 font-size-10 p-0 p-1 text-center">
                              Days
                            </th>
                            <th className="border-0 font-size-10 p-0 p-1 text-center">
                              No Of Vehicle
                            </th>
                            <th className="border-0 font-size-10 p-0 p-1 text-center">
                              Pax Slab
                            </th>
                            <th className="border-0 font-size-10 p-0 p-1 text-center">
                              <p className="m-0 py-1 font-size-10 bg-success rounded">
                                Select All
                              </p>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {transportationPopupList?.DataList?.map((item) => {
                            return (
                              <tr>
                                <td className="p-1 font-size-11">
                                  {item?.SupplierUID?.Name}
                                </td>
                                <td className="p-1 font-size-11 text-center">
                                  {item?.TransportUID?.Name}
                                </td>
                                <td className="p-1 font-size-11 text-center">
                                  {item?.RateJson?.VehicleTypeName}
                                </td>
                                <td className="p-1 font-size-11 text-center">
                                  {item?.RateJson?.CurrencyName}
                                </td>
                                <td className="p-1 font-size-11 text-center">
                                  0
                                </td>
                                <td className="p-1 font-size-11 text-center">
                                  0
                                </td>
                                <td className="p-1 font-size-11 text-center">
                                  0
                                </td>
                                <td className="p-1 font-size-11 text-center">
                                  0
                                </td>

                                <td className="p-1 font-size-11 text-center width-80"></td>
                                <td className="p-1 font-size-11 text-center width-100"></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </form>
                </PerfectScrollbar>
              </div>
            </>
          )}
        </div>
      )}
      {addNew && (
        <div>
          <div className="row row-gap-2">
            <div className="col-3">
              <label className="m-0">TRANSPORTATION NAME</label>
              <input
                type="text"
                className="form-input-6"
                placeholder="Transportation Name"
                name="TransportationName"
                value={addFormData?.TransportationName}
                onChange={handleAddDataChange}
              />
            </div>
            <div className="col-3">
              <label className="m-0">VEHICLE TYPE</label>
              <select
                name="VehicleType"
                id=""
                className="form-input-6"
                value={addFormData?.VehicleType}
                onChange={handleAddDataChange}
              >
                <option value="">Select</option>
                <option value="1">None</option>
              </select>
            </div>
            <div className="col-3">
              <label className="m-0">TRANSPORTATION TYPE</label>
              <select
                name="TransportationType"
                id=""
                className="form-input-6"
                value={addFormData?.TransportationType}
                onChange={handleAddDataChange}
              >
                <option value="">Select</option>
                <option value="1">None</option>
              </select>
            </div>
            <div className="col-3">
              <label className="m-0">VEHICLE MODEL</label>
              <select
                name="VehicleModel"
                id=""
                className="form-input-6"
                value={addFormData?.VehicleModel}
                onChange={handleAddDataChange}
              >
                <option value="">Select</option>
                <option value="1">None</option>
              </select>
            </div>

            <button
              className=" btn width60px btn-sm btn-dark position-absolute bottom-80px right190px"
              onClick={() => setAddNew(false)}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TransportationModal;
