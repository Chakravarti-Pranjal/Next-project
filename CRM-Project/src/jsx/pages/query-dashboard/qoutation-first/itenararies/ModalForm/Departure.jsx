import React from "react";

const Departure = () => {
  return (
    <div className="row row-gap-2">
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          SUPPLIER NAME
        </label>
        <select name="" id="" className="form-input-6 font-size-10">
          <option value="">CorrinTech</option>
        </select>
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          FLIGHT NUMBER
        </label>
        <input
          type="text"
          className="font-size-10 form-input-6"
          placeholder="877665"
        />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          FLIGHT CLASS
        </label>
        <select name="" id="" className="font-size-10 form-input-6">
          <option value="">First Class</option>
        </select>
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          BAG ALLOWENCE
        </label>
        <input
          type="text"
          className="font-size-10 form-input-6"
          placeholder="1"
        />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          TAX SLAB
        </label>
        <select name="" id="" className="form-input-6 font-size-10">
          <option value="">GST INC</option>
        </select>
      </div>

      <div className="col-4">
        <label htmlFor="" className="m-0 font-size-10">
          ADULT TICKET
        </label>
        <div className="d-flex gap-1">
          <div>
            <label htmlFor="" className="m-0 font-size-10">
              COST
            </label>
            <input
              type="text"
              placeholder="0"
              className="font-size-10 form-input-6"
            />
          </div>
          <div>
            <label htmlFor="" className="m-0 font-size-10">
              PAX
            </label>
            <input
              type="text"
              placeholder="0"
              className="font-size-10 form-input-6"
            />
          </div>
        </div>
      </div>
      <div className="col-4">
        <label htmlFor="" className="m-0 font-size-10">
          CHILD TICKET
        </label>
        <div className="d-flex gap-1">
          <div>
            <label htmlFor="" className="m-0 font-size-10">
              COST
            </label>
            <input
              type="text"
              placeholder="0"
              className="font-size-10 form-input-6"
            />
          </div>
          <div>
            <label htmlFor="" className="m-0 font-size-10">
              PAX
            </label>
            <input
              type="text"
              placeholder="0"
              className="font-size-10 form-input-6"
            />
          </div>
        </div>
      </div>
      <div className="col-12">
        <label htmlFor="" className="m-0 font-size-10">
          Remarks
        </label>
        <input
          type="textarea"
          placeholder="Remarks"
          className="font-size-10 form-input-6"
        />
      </div>
    </div>
  );
};

export default Departure;
