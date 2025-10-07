import React from "react";

const HotelRoomSupplement = () => {
  return (
    <>
      <div
        class="modal fade hotel-room-supplement"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div className="modal-header bg-blue px-2">
              <h5 className="modal-title" id="exampleModalLabel">
                Title Here
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" className="m-0">
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th className="font-size-10 p-0 text-nowrap p-1 text-center">
                        Hotel
                      </th>
                      <th className="font-size-10 p-0 text-nowrap p-1 text-center">
                        Supplier
                      </th>
                      <th className="font-size-10 p-0 text-nowrap p-1 text-center">
                        Category/HotelType
                      </th>
                      <th className="font-size-10 p-0 text-nowrap p-1 text-center">
                        RoomType/Meal
                      </th>
                      <th className="font-size-10 p-0 text-nowrap p-1 text-center">
                        Tariff Type
                      </th>
                      <th className="font-size-10 p-0 text-nowrap p-1 text-center">
                        Rate Validate
                      </th>
                      <th className="font-size-10 p-0 text-nowrap p-1 text-center">
                        Double
                      </th>
                      <th className="font-size-10 p-0 text-nowrap p-1 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-1 text-center">Jaipur</td>
                      <td className="p-1 text-center">3 Star</td>
                      <td className="p-1 text-center"></td>
                      <td className="p-1 text-center"></td>
                      <td className="p-1 text-center"></td>
                      <td className="p-1 text-center"></td>
                      <td className="p-1 text-center"></td>
                      <td className="p-1 d-flex justify-content-center border-0">
                        <button
                          className="modal-save-button w-auto"
                          data-toggle="modal"
                          data-target=".hotel-room-add-supplement"
                        >
                          Add New
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* hotel room supplement add form modal*/}
      <div
        class="modal fade hotel-room-add-supplement"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div className="modal-header bg-blue px-3">
              <h5 className="modal-title" id="exampleModalLabel">
                Title Here
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" className="m-0">
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th
                          className="font-size-10 text-nowrap bg-primary font-weight-normal font-size-12 py-0 px-1"
                          colSpan={4}
                        >
                          <p className="m-0">REFERENCE RATE</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-1 text-center">
                          <select
                            name=""
                            id=""
                            className="form-input-6 font-size-10"
                          >
                            <option value="">Generel</option>
                          </select>
                        </td>
                        <td className="p-1 text-center">
                          <select
                            name=""
                            id=""
                            className="form-input-6 font-size-10"
                          >
                            <option value="">Season Type</option>
                          </select>
                        </td>
                        <td className="p-1 text-center">
                          <select
                            name=""
                            id=""
                            className="form-input-6 font-size-10"
                          >
                            <option value="">Season Year</option>
                          </select>
                        </td>
                        <td className="p-1 text-center">
                          <button className="modal-save-button w-auto">
                            Search
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-12">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th
                          className="font-size-8 text-nowrap p-1"
                        >
                          MARKET TYPE
                        </th>
                        <th
                          className="font-size-8 text-nowrap p-1"
                        >
                          SEASON TYPE
                        </th>
                        <th
                          className="font-size-8 text-nowrap p-1"
                        >
                          SEASON YEAR
                        </th>
                        <th
                          className="font-size-8 text-nowrap p-1"
                        >
                          SUPPLIER
                        </th>
                        <th
                          className="font-size-8 text-nowrap p-1"
                        >
                          MEAL
                        </th>
                        <th
                          className="font-size-8 text-nowrap p-1"
                        >
                          SINGLE
                        </th>
                        <th
                          className="font-size-8 text-nowrap p-1"
                        >
                          DOUBLE
                        </th>
                        <th
                          className="font-size-8 text-nowrap p-1"
                        >
                          EXTRA BED(ADULT)
                        </th>
                        <th
                          className="font-size-8 text-nowrap p-1"
                        >
                          EXTRA BED(CHILD)
                        </th>
                        <th
                          className="font-size-8 text-nowrap p-1"
                        >
                          CHILD W/B
                        </th>
                        <th
                          className="font-size-8 text-nowrap p-1"
                        >
                          BREAKFAST
                        </th>
                        <th
                          className="font-size-8 text-nowrap p-1"
                        >
                          LUNCH
                        </th>
                        <th
                          className="font-size-8 text-nowrap p-1"
                        >
                          DINNER
                        </th>
                        <th
                          className="font-size-8 text-nowrap p-1"
                        >
                          TAC(%)
                        </th>
                        <th
                          className="font-size-8 text-nowrap p-1"
                        >
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-0 py-1 font-size-10 text-center">
                            General
                        </td>
                        <td className="p-0 py-1 font-size-10 text-center">
                            Summer
                        </td>
                        <td className="p-0 py-1 font-size-10 text-center">
                            2023
                        </td>
                        <td className="p-0 py-1 font-size-10 text-center">
                            Taj Mahal Tower Delhi
                        </td>
                        <td className="p-0 py-1 font-size-10 text-center">
                            CP
                        </td>
                        <td className="p-0 py-1 font-size-10 text-center">
                            INR 3400
                        </td>
                        <td className="p-0 py-1 font-size-10 text-center">
                            INR 3000
                        </td>
                        <td className="p-0 py-1 font-size-10 text-center">
                            INR 000
                        </td>
                        <td className="p-0 py-1 font-size-10 text-center">
                            INR
                        </td>
                        <td className="p-0 py-1 font-size-10 text-center">
                            INR0
                        </td>
                        <td className="p-0 py-1 font-size-10 text-center">
                            INR 1650
                        </td>
                        <td className="p-0 py-1 font-size-10 text-center">
                            INR 3500
                        </td>
                        <td className="p-0 py-1 font-size-10 text-center">
                            INR 3800
                        </td>
                        <td className="p-0 py-1 font-size-10 text-center">
                            0
                        </td>
                        <td className="p-0 py-1 font-size-10 text-primray font-weight-bold text-center">
                            Select
                        </td>

                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row m-0 mt-3">
                <div className="col-12 bg-primary ">MANUAL RATE</div>
              </div>
              <div className="row row-gap-2">
                <div className="col-2">
                  <label htmlFor="" className="font-size-10 m-0">
                    SUPPLIER NAME
                  </label>
                  <select name="" id="" className="form-input-6 font-size-10">
                    <option value="">Red Fort</option>
                  </select>
                </div>
                <div className="col-2">
                  <label htmlFor="" className="font-size-10 m-0">
                    RATE VALID FROM
                  </label>
                  <input type="date" className="form-input-6 font-size-10" />
                </div>
                <div className="col-2">
                  <label htmlFor="" className="font-size-10 m-0">
                    RATE VALID TO
                  </label>
                  <input type="date" className="form-input-6 font-size-10" />
                </div>
                <div className="col-2">
                  <label htmlFor="" className="font-size-10 m-0">
                    TARIFF TYPE
                  </label>
                  <select name="" id="" className="font-size-10 form-input-6">
                    <option value="">Normal</option>
                  </select>
                </div>
                <div className="col-2">
                  <label htmlFor="" className="font-size-10 m-0">
                    CURRENCY
                  </label>
                  <select name="" id="" className="font-size-10 form-input-6">
                    <option value="">INR</option>
                  </select>
                </div>
                <div className="col-2">
                  <label htmlFor="" className="font-size-10 m-0">
                    R.O.E
                  </label>
                  <input
                    type="text"
                    placeholder="1"
                    className="form-input-6 font-size-10"
                  />
                </div>
                <div className="col-2">
                  <label htmlFor="" className="font-size-10 m-0">
                    ROOM TYPE
                  </label>
                  <select name="" id="" className="font-size-10 form-input-6">
                    <option value="">Standard Room</option>
                  </select>
                </div>
                <div className="col-2">
                  <label htmlFor="" className="font-size-10 m-0">
                    MEAL PLAN
                  </label>
                  <select name="" id="" className="font-size-10 form-input-6">
                    <option value="">AP</option>
                  </select>
                </div>
                <div className="col-2">
                  <label htmlFor="" className="font-size-10 m-0">
                    GST RANGE TYPE
                  </label>
                  <select name="" id="" className="font-size-10 form-input-6">
                    <option value="">Taxi</option>
                  </select>
                </div>
                <div className="col-2">
                  <label htmlFor="" className="font-size-10 m-0">
                    MEAL TAX SLAB(%)
                  </label>
                  <select name="" id="" className="font-size-10 form-input-6">
                    <option value="">GST Inclusion</option>
                  </select>
                </div>
              </div>
              <div className="row row-gap-2 mt-2">
                <div className="col-2">
                  <label htmlFor="" className="m-0 font-size-10">
                    SINGLE
                  </label>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="" className="m-0 font-size-10">
                        COST
                      </label>
                      <input
                        type="text"
                        placeholder="0"
                        className="font-size-10 form-input-6"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="" className="m-0 font-size-10">
                        ROOM
                      </label>
                      <input
                        type="text"
                        placeholder="0"
                        className="font-size-10 form-input-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <label htmlFor="" className="m-0 font-size-10">
                    DOUBLE
                  </label>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="" className="m-0 font-size-10">
                        COST
                      </label>
                      <input
                        type="text"
                        placeholder="0"
                        className="font-size-10 form-input-6"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="" className="m-0 font-size-10">
                        ROOM
                      </label>
                      <input
                        type="text"
                        placeholder="0"
                        className="font-size-10 form-input-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <label htmlFor="" className="m-0 font-size-10">
                    TWIN
                  </label>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="" className="m-0 font-size-10">
                        COST
                      </label>
                      <input
                        type="text"
                        placeholder="0"
                        className="font-size-10 form-input-6"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="" className="m-0 font-size-10">
                        ROOM
                      </label>
                      <input
                        type="text"
                        placeholder="0"
                        className="font-size-10 form-input-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <label htmlFor="" className="m-0 font-size-10">
                    EXTRA BED(A)
                  </label>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="" className="m-0 font-size-10">
                        COST
                      </label>
                      <input
                        type="text"
                        placeholder="0"
                        className="font-size-10 form-input-6"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="" className="m-0 font-size-10">
                        ROOM
                      </label>
                      <input
                        type="text"
                        placeholder="0"
                        className="font-size-10 form-input-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <label htmlFor="" className="m-0 font-size-10">
                    CWBED(C)
                  </label>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="" className="m-0 font-size-10">
                        COST
                      </label>
                      <input
                        type="text"
                        placeholder="0"
                        className="font-size-10 form-input-6"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="" className="m-0 font-size-10">
                        ROOM
                      </label>
                      <input
                        type="text"
                        placeholder="0"
                        className="font-size-10 form-input-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <label htmlFor="" className="m-0 font-size-10">
                    CNBED(C)
                  </label>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="" className="m-0 font-size-10">
                        COST
                      </label>
                      <input
                        type="text"
                        placeholder="0"
                        className="font-size-10 form-input-6"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="" className="m-0 font-size-10">
                        ROOM
                      </label>
                      <input
                        type="text"
                        placeholder="0"
                        className="font-size-10 form-input-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <label htmlFor="" className="m-0 font-size-10">
                    BREAKFAST
                  </label>
                  <input type="text" className="font-size-10 form-input-6" />
                </div>
                <div className="col-2">
                  <label htmlFor="" className="m-0 font-size-10">
                    LUNCH
                  </label>
                  <input type="text" className="font-size-10 form-input-6" />
                </div>
                <div className="col-2">
                  <label htmlFor="" className="m-0 font-size-10">
                    DINNER
                  </label>
                  <input type="text" className="font-size-10 form-input-6" />
                </div>
                <div className="col-2">
                  <label htmlFor="" className="m-0 font-size-10">
                    TAC(%)
                  </label>
                  <input type="text" className="font-size-10 form-input-6" />
                </div>
                <div className="col-4">
                  <label htmlFor="" className="m-0 font-size-10">
                    REMARKS
                  </label>
                  <input type="text" className="font-size-10 form-input-6" />
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
              <button type="button" className="modal-save-button">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HotelRoomSupplement;
