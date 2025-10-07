import React from "react";

const RestaurantSuppliment = () => {
  return (
    <>
      <div
        class="modal fade restaurant-supplement"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div className="modal-header bg-primary">
              <h4 className="m-0">Restaurant Supplement</h4>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-3">
                  <label htmlFor="" className="m-0 font-size-10">
                    LOCATION TYPE
                  </label>
                  <select name="" id="" className="form-input-6 font-size-10">
                    <option value="">Selected Destination</option>
                  </select>
                </div>
                <div className="col-3">
                  <label htmlFor="" className="m-0 font-size-10">
                    DESTINATION
                  </label>
                  <select name="" id="" className="form-input-6 font-size-10">
                    <option value="">Selected Destination</option>
                  </select>
                </div>
                <div className="col-5">
                  <label htmlFor="" className="m-0 font-size-10">
                    SEARCH
                  </label>
                  <input
                    type="text"
                    className="form-input-6 font-size-10"
                    placeholder="Search Restaurant"
                  />
                </div>
                <div className="col-1 m-0 mt-3">
                  <button className="modal-save-button w-auto">Search</button>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-12 d-flex justify-content-end">
                  <button className="modal-save-button w-auto">
                    + Add New
                  </button>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-12">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th className="p-1 font-size-10 text-center">
                          Restaurant Name
                        </th>
                        <th className="p-1 font-size-10 text-center">
                          Supplier Name
                        </th>
                        <th className="p-1 font-size-10 text-center">
                          Currency[ROE]
                        </th>
                        <th className="p-1 font-size-10 text-center">
                          Adult Cost
                        </th>
                        <th className="p-1 font-size-10 text-center">
                          Child Cost
                        </th>
                        <th className="p-1 font-size-10 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-1 text-center">Aman</td>
                        <td className="p-1 text-center">NA</td>
                        <td className="p-1 text-center">NA</td>
                        <td className="p-1 text-center">0</td>
                        <td className="p-1 text-center">0</td>
                        <td className="p-1 d-flex justify-content-around border-0">
                          <button className="modal-save-button w-auto px-2">
                            <i className="fa-solid fa-hand-pointer pr-1"></i>
                            Select
                          </button>
                          <button className="modal-save-button w-auto px-2">
                            <i className="fa-solid fa-pen-to-square pr-1"></i>
                            Edit
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="modal-footer px-3">
              <button
                type="button"
                className="modal-close-button"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="modal-save-button m-0">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantSuppliment;
