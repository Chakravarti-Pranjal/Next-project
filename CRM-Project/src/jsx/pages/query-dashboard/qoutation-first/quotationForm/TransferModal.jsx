import React, { useState } from "react";
import { transferPopupList } from "../quotationdata";
import PerfectScrollbar from "react-perfect-scrollbar";

const TransferModal = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [formData, setFormData] = useState({
    Unknown: "",
    FromDestination: "",
    ToDestination: "",
    TransferType: "",
    TransferName: "",
    EnterName: "",
  });

  const [addFormData, setAddFormData] = useState({
    TrnasferName: "",
    VehicleType: "",
    TransferType: "",
    VehicleMode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddDataChange = (e) => {
    const { name, value } = e.target;
    setAddFormData({ ...addFormData, [name]: value });
  };

  // console.log("addFormData", addFormData);

  return (
    <>
      {!addNew && (
        <div>
          <div className="row px-2">
            <div className="col-1 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                --
              </label>
              <select
                name="Unknown"
                value={formData?.Unknown}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select</option>
                <option value="1">Destination</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                FROM DESTINATION
              </label>
              <select
                name="FromDestination"
                value={formData?.FromDestination}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select</option>
                <option value="1">Delhi</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                TO DESTINATION
              </label>
              <select
                name="ToDestination"
                value={formData?.ToDestination}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">All</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                TRANSFER TYPE
              </label>
              <select
                name="TransferType"
                value={formData?.TransferType}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">All</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                TRANSFER NAME
              </label>
              <select
                name="TransferName"
                value={formData?.TransferName}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">All</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                ENTER NAME
              </label>
              <input
                type="text"
                placeholder="Enter Keyword"
                className="font-size-10 border py-1 rounded outline-0"
                name="EnterName"
                value={formData?.EnterName}
                onChange={handleChange}
              />
            </div>
            <div className="col-1 p-0 d-flex justify-content-center align-items-center  border">
              <p
                className="m-0 font-size-10 px-2 py-1 bg-success rounded cursor-pointer"
                onClick={() => setIsSearching(true)}
              >
                Search
              </p>
            </div>
          </div>
          {isSearching && (
            <div className="mt-4">
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-success border font-size-10"
                  onClick={() => setAddNew(true)}
                >
                  {" "}
                  + Add New
                </button>
              </div>
              <div className="row mt-1">
                <div className="col">
                  <PerfectScrollbar className="dlabnav-scroll">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th className="p-0 text-center font-size-12 py-1">
                            Supplier Name
                          </th>
                          <th className="p-0 text-center font-size-12 py-1">
                            Transfer Name
                          </th>
                          <th className="p-0 text-center font-size-12 py-1">
                            Transfer Type
                          </th>
                          <th className="p-0 text-center font-size-12 py-1">
                            Vehicle Type/Name
                          </th>
                          <th className="p-0 text-center font-size-12 py-1">
                            Vehicle Cost
                          </th>
                          <th className="p-0 text-center font-size-12 py-1">
                            No Of Vehicle
                          </th>
                          <th className="p-0 text-center font-size-12 py-1">
                            Pax Slab
                          </th>
                          <th className="p-0 text-center font-size-12 py-1">
                            <button className="btn py-1 px-2 bg-success font-size-10">
                              Select All
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transferPopupList?.DataList?.map((item, index) => {
                          return (
                            <tr key={index + 1}>
                              <td>{item?.SupplierUID?.Name}</td>
                              <td>{item?.TransferUID?.Name}</td>
                              <td>{item?.TransferType?.Name}</td>
                              <td>{item?.RateJson?.VehicleTypeName}</td>
                              <td>{item?.RateJson?.VehicleCost}</td>
                              <td></td>
                              <td></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </PerfectScrollbar>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {addNew && (
        <div>
          <div className="row row-gap-2 mt-2 position-relative">
            <div className="col-3">
              <label htmlFor="" className="m-0">
                TRANSFER NAME
              </label>
              <input
                type="text"
                placeholder="Transfer Name"
                className="form-input-6"
                name="TrnasferName"
                value={addFormData?.TrnasferName}
                onChange={handleAddDataChange}
              />
            </div>
            <div className="col-3">
              <label htmlFor="" className="m-0">
                VEHICLE TYPE
              </label>
              <select
                name="VehicleType"
                id=""
                className="form-input-6"
                value={addFormData?.VehicleType}
                onChange={handleAddDataChange}
              >
                <option value="">All Vehicle Type</option>
                <option value="1">Car</option>
                <option value="2">Bus</option>
              </select>
            </div>
            <div className="col-3">
              <label htmlFor="" className="m-0">
                TRANSFER TYPE
              </label>
              <select
                name="TransferType"
                id=""
                className="form-input-6"
                value={addFormData?.TransferType}
                onChange={handleAddDataChange}
              >
                <option value="">Select</option>
                <option value="1">Arrival</option>
                <option value="2">Unarrival</option>
              </select>
            </div>
            <div className="col-3">
              <label htmlFor="" className="m-0">
                VEHICLE MODE
              </label>
              <select
                name="VehicleMode"
                id=""
                className="form-input-6"
                value={addFormData?.VehicleMode}
                onChange={handleAddDataChange}
              >
                <option value="">All Vehicle</option>
                <option value="1">4 Seater</option>
                <option value="2">6 Seater</option>
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

export default TransferModal;
