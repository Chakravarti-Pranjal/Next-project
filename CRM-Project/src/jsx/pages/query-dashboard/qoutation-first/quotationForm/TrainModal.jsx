import React, { useState } from "react";
import { trainPopupList } from "../quotationdata";
import PerfectScrollbar from "react-perfect-scrollbar";

const TrainModal = () => {
  const [addNew, setAddNew] = useState(false);
  const [formData, setFormData] = useState({
    Destination: "",
    DepartureFrom: "",
    ArrivalTo: "",
    FlightType: "",
    Search: "",
  });
  const [addFormData, setAddFormData] = useState({
    TrainName: "",
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
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                ----
              </label>
              <select
                name="Destination"
                value={formData?.Destination}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select Destination</option>
                <option value="1">All Destination</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                DEPARTURE FROM
              </label>
              <select
                name="DepartureFrom"
                value={formData?.DepartureFrom}
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
                ARRIVAL TO
              </label>
              <select
                name="ArrivalTo"
                value={formData?.ArrivalTo}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select</option>
                <option value="1">1 Night</option>
              </select>
            </div>
            <div className="col-5 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                SEARCH
              </label>
              <input
                type="text"
                placeholder="Search"
                className="font-size-10 border py-1 rounded outline-0"
                name="Search"
                value={formData?.Search}
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
                <div className="col-12 p-0">
                  <table className="table table-bordered table-striped">
                    <thead className="border-0">
                      <tr className="border-0">
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Train Name
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Supplier Name
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Train Number
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Train Class
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Currency[ROE]
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Adult Cost
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Child Cost
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center"></th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainPopupList?.DataList?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="p-1 font-size-11">
                              {item?.RateJson[0]?.TrainName}
                            </td>
                            <td className="p-1 font-size-11 text-center">
                              Srikanth
                            </td>
                            <td className="p-1 font-size-11 text-center">
                              INR[1]
                            </td>
                            <td className="p-1 font-size-11 text-center">13</td>
                            <td className="p-1 font-size-11 text-center">13</td>
                            <td className="p-1 font-size-11 text-center">13</td>
                            <td className="p-1 font-size-11 text-center">0</td>

                            <td className="p-1 font-size-11 text-center">
                              <p className="border py-1 px-1 bg-success rounded m-0 cursor-pointer font-size-10">
                                Select
                              </p>
                            </td>
                            <td className="p-1 font-size-11 text-center">
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
          <div className="row position-relative mt-2">
            <div className="col-4">
              <label htmlFor="" className="">
                TRAIN NAME
              </label>
              <input
                type="text"
                placeholder="Train Name"
                className="form-input-6"
                name="TrainName"
                value={addFormData?.TrainName}
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

export default TrainModal;
