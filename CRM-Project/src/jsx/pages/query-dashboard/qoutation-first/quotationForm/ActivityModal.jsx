import React, { useState } from "react";
import { activityPopupList } from "../quotationdata";
import PerfectScrollbar from "react-perfect-scrollbar";

const ActivityModal = () => {
  const [addNew, setAddNew] = useState(false);
  const [formData, setFormData] = useState({
    DestinationType: "",
    Destination: "",
    Date: "",
    Type: "",
    Unknown: "",
    ActivityName: "",
  });
  const [addFormData, setAddFormData] = useState({
    Type: "",
    ActivityName: "",
    Destination: "",
    Default: "",
    SelectSupplier: "",
    Status: "",
    Description: "",
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
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                DESTINATION TYPE
              </label>
              <select
                name="DestinationType"
                value={formData?.DestinationType}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select</option>
                <option value="1">Destination</option>
              </select>
            </div>
            <div className="col-1 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                DESTINATION
              </label>
              <select
                name="Destination"
                value={formData?.Destination}
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
                DATE
              </label>
              <input
                type="date"
                name="Date"
                value={formData?.Date}
                onChange={handleChange}
                className="font-size-10 border py-1 rounded"
              />
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                Type
              </label>
              <select
                name="Type"
                value={formData?.Type}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select</option>
                <option value="1">Activity</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                ---
              </label>
              <select
                name="Unknown"
                id=""
                value={formData?.Unknown}
                onChange={handleChange}
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select</option>
                <option value="1">All Activity</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                ACTIVITY NAME
              </label>
              <input
                type="text"
                placeholder="Activity Name"
                className="font-size-10 border py-1 rounded outline-0"
                name="ActivityName"
                value={formData?.ActivityName}
                onChange={handleChange}
              />
            </div>
            <div className="col-1 p-0 d-flex justify-content-center align-items-center  border">
              <p className="m-0 font-size-10 px-2 py-1 bg-success rounded cursor-pointer">
                Search
              </p>
            </div>
          </div>
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
                <div className="col-12">
                  <table className="table table-bordered table-striped">
                    <thead className="border-0">
                      <tr className="border-0">
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Service Name
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Type
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Supplier
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Pax Slab
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Currency (ROE)
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Pax Range
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Activity Cost
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          No Of Activity
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center"></th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityPopupList?.DataList?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="p-1 font-size-11">
                              {item?.RateJson?.Service}
                            </td>
                            <td className="p-1 font-size-11 text-center">
                              {item?.Type}
                            </td>
                            <td className="p-1 font-size-11 text-center">
                              {item?.SupplierUID?.Name}
                            </td>
                            <td className="p-1 font-size-11 text-center">
                              <select name="" id="" className="form-control">
                                <option value="">All Pax</option>
                                <option value="">1 Pax</option>
                              </select>
                            </td>
                            <td className="p-1 font-size-11 text-center">
                              {item?.Currency?.Name}
                            </td>
                            <td className="p-1 font-size-11 text-center">
                              {item?.RateJson?.PaxRange}
                            </td>
                            <td className="p-1 font-size-11 text-center">0</td>
                            <td className="p-1 font-size-11 text-center">0</td>
                            <td className="p-1 font-size-11 text-center d-felx">
                              <p className="border py-1 px-1 bg-success rounded m-0 cursor-pointer font-size-10">
                                Select
                              </p>
                            </td>
                            <td className="p-1 font-size-11 text-center d-felx">
                              <p className="border py-1 px-1 bg-success rounded m-0 cursor-pointer font-size-10">
                                Edit Price
                              </p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </form>
            </PerfectScrollbar>
          </div>
        </div>
      )}
      {addNew && (
        <div>
          <div className="row row-gap-2 position-relative">
            <div className="col-3">
              <label htmlFor="" className="m-0">
                TYPE
              </label>
              <select
                name="Type"
                id=""
                className="form-input-6"
                value={addFormData?.Type}
                onChange={handleAddDataChange}
              >
                <option value="">Select</option>
                <option value="1">Client</option>
                <option value="2">Supplier</option>
              </select>
            </div>
            <div className="col-3">
              <label htmlFor="" className="m-0">
                ACTIVITY NAME
              </label>
              <select
                name="ActivityName"
                id=""
                className="form-input-6"
                value={addFormData?.ActivityName}
                onChange={handleAddDataChange}
              >
                <option value="">Select</option>
                <option value="1">Swiming</option>
                <option value="2">Running</option>
              </select>
            </div>
            <div className="col-3">
              <label htmlFor="" className="m-0">
                DESTINATION
              </label>
              <select
                name="Destination"
                id=""
                className="form-input-6"
                value={addFormData?.Destination}
                onChange={handleAddDataChange}
              >
                <option value="">Select</option>
                <option value="1">Noida</option>
                <option value="2">Delhi</option>
              </select>
            </div>
            <div className="col-3">
              <label htmlFor="" className="m-0">
                DEFAULT
              </label>
              <select
                name="Default"
                className="form-input-6"
                value={addFormData?.Default}
                onChange={handleAddDataChange}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="col-3">
              <label htmlFor="" className="m-0">
                SELECT SUPPLIER
              </label>
              <select
                name="SelectSupplier"
                id=""
                className="form-input-6"
                value={addFormData?.SelectSupplier}
                onChange={handleAddDataChange}
              >
                <option value="">Select</option>
                <option value="1">Agent</option>
                <option value="2">B2B</option>
              </select>
            </div>
            <div className="col-3">
              <label htmlFor="" className="m-0">
                STATUS
              </label>
              <select
                name="Status"
                id=""
                className="form-input-6"
                value={addFormData?.Status}
                onChange={handleAddDataChange}
              >
                <option value="">Select</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div className="col-12">
              <label htmlFor="" className="m-0">
                DESCRIPTION
              </label>
              <textarea
                name="Description"
                id=""
                className="form-input-6 h-100"
                value={addFormData?.Description}
                onChange={handleAddDataChange}
              ></textarea>
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

export default ActivityModal;
