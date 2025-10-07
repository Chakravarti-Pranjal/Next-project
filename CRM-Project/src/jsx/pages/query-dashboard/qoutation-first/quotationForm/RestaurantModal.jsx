import React, { useState } from "react";
import { restaurantPopupList } from "../quotationdata";
import PerfectScrollbar from "react-perfect-scrollbar";

const RestaurantModal = () => {
  const [addNew, setAddNew] = useState(false);
  const [formData, setFormData] = useState({
    LocationType: "",
    Destination: "",
    Search: "",
  });

  const [addFormData, setAddFormData] = useState({
    RestaurantName: "",
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
            <div className="col-3 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                LOCATION TYPE
              </label>
              <select
                name="LocationType"
                value={formData?.LocationType}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select</option>
                <option value="1">India</option>
              </select>
            </div>
            <div className="col-3 p-0 d-flex flex-column border p-1">
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
                <div className="col-12">
                  <table className="table table-bordered table-striped">
                    <thead className="border-0">
                      <tr className="border-0">
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Restaurant Name
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Supplier Name
                        </th>
                        <th className="border-0 font-size-10 p-0 p-1 text-center">
                          Currency [ROE]
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
                      {restaurantPopupList?.DataList?.map((value, index) => {
                        return (
                          <tr key={index + 1}>
                            <td className="p-1 font-size-11">
                              {value?.RateJson?.RestaurantName}
                            </td>
                            <td className="p-1 font-size-11 text-center">
                              Srikanth
                            </td>
                            <td className="p-1 font-size-11 text-center">
                              INR[1]
                            </td>
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
          <div className="row mt-2 position-relative">
            <div className="col-4">
              <label htmlFor="">RESTAURANT NAME</label>
              <input
                type="text"
                placeholder="Restaurant Name"
                className="form-input-6"
                name="RestaurantName"
                value={addFormData?.RestaurantName}
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

export default RestaurantModal;
