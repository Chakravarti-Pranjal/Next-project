import React, { useState } from "react";
import { guidePopupList } from "../quotationdata";
import PerfectScrollbar from "react-perfect-scrollbar";

const GuideModal = () => {
  const [addNew, setAddNew] = useState(false);

  const [formData, setFormData] = useState({
    ServiceType: "",
    DestinationType: "",
    Destination: "",
    PaxRange: "",
    Unknown: "",
    FromDay: "",
    ToDay: "",
    GuideService: "",
    MealType: "",
  });
  const [addFormData, setAddFormData] = useState({
    GuideService: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddDataChange = (e) => {
    const { name, value } = e.target;
    setAddFormData({ ...addFormData, [name]: value });
  };

  return (
    <>
      {!addNew && (
        <div>
          <div className="row px-2">
            <div className="col-1 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                SERVICE TYPE
              </label>
              <select
                name="ServiceType"
                id=""
                className="font-size-10 border py-1 rounded"
                value={formData?.ServiceType}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">Agent</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                DESTINATION TYPE
              </label>
              <select
                name="DestinationType"
                id=""
                className="font-size-10 border py-1 rounded"
                value={formData?.DestinationType}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">Delhi</option>
              </select>
            </div>
            <div className="col-1 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                DESTINATION
              </label>
              <select
                name="Destination"
                id=""
                className="font-size-10 border py-1 rounded"
                value={formData?.Destination}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">All</option>
              </select>
            </div>
            <div className="col-1 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                PAX RANGE
              </label>
              <select
                name="PaxRange"
                id=""
                className="font-size-10 border py-1 rounded"
                value={formData?.PaxRange}
                onChange={handleChange}
              >
                <option value="">PaxRange</option>
                <option value="1">All</option>
              </select>
            </div>
            <div className="col-1 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                ---
              </label>
              <select
                name="Unknown"
                id=""
                className="font-size-10 border py-1 rounded"
                value={formData?.Unknown}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">All</option>
              </select>
            </div>
            <div className="col-1 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                FROM DAY
              </label>
              <select
                name="FromDay"
                id=""
                className="font-size-10 border py-1 rounded"
                value={formData?.FromDay}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">Nigh-1 Delhi</option>
              </select>
            </div>
            <div className="col-1 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                TO DAY
              </label>
              <select
                name="ToDay"
                id=""
                className="font-size-10 border py-1 rounded"
                value={formData?.ToDay}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">Night-1 Delhi</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                GUIDE SERVICE
              </label>
              <input
                type="text"
                placeholder="Search Hotel"
                className="font-size-10 border py-1 rounded outline-0"
                name="GuideService"
                value={formData?.GuideService}
                onChange={handleChange}
              />
            </div>
            <div className="col-1 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                MEAL TYPE
              </label>
              <select
                name="MealType"
                id=""
                className="border rounded font-size-10 py-1 "
                value={formData?.MealType}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">All</option>
              </select>
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
            <div className="col-12 p-0">
              <PerfectScrollbar className="dlabnav-scroll">
                <table className="table table-bordered table-striped">
                  <thead className="border-0">
                    <tr className="border-0">
                      <th className="border-0">Guide Service</th>
                      <th className="border-0">Day Type</th>
                      <th className="border-0">Pax Range</th>
                      <th className="border-0">Pax Slab</th>
                      <th className="border-0">Guide Cost</th>
                      <th className="border-0">L.Allowance</th>
                      <th className="border-0">Other Cost</th>
                      <th className="border-0"></th>
                      <th className="border-0"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {guidePopupList?.Data?.map((value, index) => {
                      return (
                        <tr key={index + 1}>
                          <td className="p-1 font-size-11">
                            {value?.GuideServiceName}
                          </td>
                          <td className="p-1 font-size-11 text-center">
                            {value?.RateJson?.DayType}
                          </td>
                          <td className="p-1 font-size-11 text-center">
                            {value?.RateJson?.PaxRange}
                          </td>
                          <td className="p-1 font-size-11 text-center">
                            <select name="" id="" className="form-control">
                              <option value="">All Pax</option>
                              <option value="">1 Pax</option>
                            </select>
                          </td>
                          <td className="p-1 font-size-11 text-center">
                            {value?.RateJson?.CurrencyName}
                          </td>
                          <td className="p-1 font-size-11 text-center">
                            {value?.RateJson?.LangAllowance}
                          </td>
                          <td className="p-1 font-size-11 text-center">
                            {value?.RateJson?.OtherCost}
                          </td>
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
              </PerfectScrollbar>
            </div>
          </div>
        </div>
      )}

      {addNew && (
        <div>
          <div className="row position-relative">
            <div className="col-4">
              <label htmlFor="">GUIDE SERVICE</label>
              <input
                type="text"
                placeholder="Guide Service"
                className="form-input-6"
                name="GuideService"
                value={addFormData?.GuideService}
                onChange={handleAddDataChange}
              />
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

export default GuideModal;
