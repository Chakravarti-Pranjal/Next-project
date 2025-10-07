import React, { useContext, useState } from "react";
import { quotationContext } from "../Quotation";
import { enroutePopupList } from "../quotationdata";
import PerfectScrollbar from "react-perfect-scrollbar";

const EnrouteModal = () => {
  const [addNew, setAddNew] = useState(false);
  const { quotationGlobalData } = useContext(quotationContext);

  const [formData, setFormData] = useState({
    Unknown: "",
    Destination: "",
    Default: "",
  });

  const [addFormData, setAddFormData] = useState({
    EnrouteName: "",
    Currency: "",
    PerPaxCost: "",
    Destination: "",
    Default: "",
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

  return (
    <>
      {!addNew && (
        <div>
          <div className="row px-2">
            <div className="col-4 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                ----
              </label>
              <select
                name="Unknown"
                value={formData?.Unknown}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select Destination</option>
                <option value="1">All Destination</option>
              </select>
            </div>
            <div className="col-4 p-0 d-flex flex-column border p-1">
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
            <div className="col-3 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                DEFAULT
              </label>
              <select
                name="Default"
                value={formData?.Default}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select</option>
                <option value="1">Default Enroute</option>
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
            <PerfectScrollbar className="dlabnav-scroll">
              <form action="">
                <div className="col-12 p-0">
                  <table className="table table-bordered table-striped">
                    <thead className="border-0">
                      <tr className="border-0">
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Enroute Name
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Pax Cost
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center"></th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {enroutePopupList?.DataList?.map((item, index) => {
                        return (
                          <tr key={index + 1}>
                            <td className="p-1 font-size-11 text-center">
                              {item?.Name}
                            </td>
                            <td className="p-1 font-size-11 text-center">
                              {item?.PerPaxCost}
                            </td>
                            <td className="p-1 font-size-11 text-center width-80">
                              <p className="border py-1 px-1 bg-success rounded m-0 cursor-pointer font-size-10">
                                Select
                              </p>
                            </td>
                            <td className="p-1 font-size-11 text-center width-100">
                              <p className="border py-1 px-1 bg-success rounded m-0 cursor-pointer font-size-10 d-flex justify-content-center">
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
                EROUTE NAME
              </label>
              <input
                type="text"
                placeholder="Enroute Name"
                className="form-input-6"
                name="EnrouteName"
                value={addFormData?.EnrouteName}
                onChange={handleAddDataChange}
              />
            </div>
            <div className="col-3">
              <label htmlFor="" className="m-0">
                Currency
              </label>
              <select
                name="Currency"
                id=""
                className="form-input-6"
                value={addFormData?.Currency}
                onChange={handleAddDataChange}
              >
                <option value="">INR</option>
                <option value="">DINAR</option>
              </select>
            </div>
            <div className="col-3">
              <label htmlFor="" className="m-0">
                PER PAX COST
              </label>
              <input
                type="text"
                className="form-input-6"
                placeholder="Per pax cost"
                name="PerPaxCost"
                value={addFormData?.PerPaxCost}
                onChange={handleAddDataChange}
              />
            </div>
            <div className="col-3">
              <label htmlFor="" className="m-0">
                Destination
              </label>
              <select
                name="Destination"
                id=""
                className="form-input-6"
                value={addFormData?.Destination}
                onChange={handleAddDataChange}
              >
                <option value="">Noida</option>
                <option value="">Delhi</option>
              </select>
            </div>
            <div className="col-3">
              <label htmlFor="" className="m-0">
                Default
              </label>
              <select
                name="Default"
                id=""
                className="form-input-6"
                value={addFormData?.Default}
                onChange={handleAddDataChange}
              >
                <option value="">Noida</option>
                <option value="">Delhi</option>
              </select>
            </div>
            <div className="col-3">
              <label htmlFor="" className="m-0">
                Status
              </label>
              <select
                name="Status"
                id=""
                className="form-input-6"
                value={addFormData?.Status}
                onChange={handleAddDataChange}
              >
                <option value="">Active</option>
                <option value="">InActive</option>
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

export default EnrouteModal;
