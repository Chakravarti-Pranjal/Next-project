import React from "react";

const Guide = () => {
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
          RATE VALID FORM
        </label>
        <input type="date" className="form-input-6 font-size-10" />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          RATE VALID TO
        </label>
        <input type="date" className="form-input-6 font-size-10" />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          PAX RANGE
        </label>
        <select name="" id="" className="form-input-6 font-size-10">
          <option value="">All Pax</option>
        </select>
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          DAY TYPE
        </label>
        <select name="" id="" className="form-input-6 font-size-10">
          <option value="">Half Day</option>
        </select>
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          UNIVERSAL COST
        </label>
        <select name="" id="" className="form-input-6 font-size-10">
          <option value="">Yes</option>
        </select>
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          CURRENCY
        </label>
        <select name="" id="" className="form-input-6 font-size-10">
          <option value="">INR</option>
        </select>
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          R.O.E
        </label>
        <input
          type="text"
          placeholder="0"
          className="form-input-6 font-size-10"
        />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          GUID COST
        </label>
        <input
          type="text"
          placeholder="0"
          className="form-input-6 font-size-10"
        />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          L.A
        </label>
        <input
          type="text"
          placeholder="0"
          className="form-input-6 font-size-10"
        />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          OTHER COST
        </label>
        <input
          type="text"
          placeholder="0"
          className="form-input-6 font-size-10"
        />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          GST SLAB
        </label>
        <select name="" id="" className="form-input-6 font-size-10">
          <option value="">GSTInc.</option>
        </select>
      </div>
    </div>
  );
};

export default Guide;
