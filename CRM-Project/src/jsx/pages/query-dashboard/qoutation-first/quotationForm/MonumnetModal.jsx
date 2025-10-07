import React, { useEffect, useState } from "react";
import { monumentPopupList } from "../quotationdata";
import { axiosOther } from "../../../../../http/axios_base_url";
import PerfectScrollbar from "react-perfect-scrollbar";

const MonumentModal = () => {
  const [addNew, setAddNew] = useState(false);
  const [formData, setFormData] = useState({
    LocationType: "",
    Destination: "",
    FromDay: "",
    ToDay: "",
    Unknown: "",
    Search: "",
  });
  const [addFormData, setAddFormData] = useState({
    EntranceName: "",
  });
  const [monumentSearchList, setMonumnetSearchList] = useState([]);

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("monumentsearchlist", {
        id: "",
        MonumentUID: "",
        Destination: "",
        Date: "",
        ValidFrom: "",
        ValidTo: "",
        QueryId: "25",
        QuatationNo: "YO3N4AP6-A",
      });
      setSearchMonumentList(data?.Data);
      console.log("m-1-monument-list", data);
    } catch (error) {
      console.log("m-1-error", error);
    }
  };

  useEffect(() => {
    postDataToServer();
  }, []);

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
                FROM DAY
              </label>
              <select
                name="FromDay"
                value={formData?.FromDay}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select</option>
                <option value="1">1 Night</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                TO DAY
              </label>
              <select
                name="ToDay"
                value={formData?.ToDay}
                onChange={handleChange}
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select</option>
                <option value="1">1 Night</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                ---
              </label>
              <select
                name="Unknown"
                value={formData?.Unknown}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select</option>
                <option value="1">All Entrance</option>
                <option value="2">Default Entrance</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                SEARCH
              </label>
              <input
                type="text"
                placeholder="Search"
                className="font-size-10 border py-1 rounded outline-0"
                name="Search"
                value={formData.Search}
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
            <div className="col-2 p-0 d-flex justify-content-end gap-4">
              <button className="btn btn-success font-size-10">
                Select All
              </button>
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
                          Monument Name
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
                      {monumentPopupList?.DataList?.map((value, index) => {
                        return (
                          <tr key={index + 1}>
                            <td className="p-1 font-size-11">
                              {value?.MonumentName}
                            </td>
                            <td className="p-1 font-size-11 text-center">
                              {value?.SupplierUID?.Name}
                            </td>
                            <td className="p-1 font-size-11 text-center">
                              {value?.CompanyID?.Name}
                            </td>
                            <td className="p-1 font-size-11 text-center">
                              {value?.RateJson?.AdultEntFee}
                            </td>
                            <td className="p-1 font-size-11 text-center">
                              {value?.RateJson?.ChildEntFee}
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
          <div className="row position-relative">
            <div className="col-4">
              <label htmlFor="" className="m-0">
                ENTRANCE NAME
              </label>
              <input
                type="text"
                placeholder="Entrance Name"
                className="form-input-6"
                name="EntranceName"
                value={addFormData?.EntranceName}
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

export default MonumentModal;
