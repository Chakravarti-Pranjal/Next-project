import React from "react";

const Train = () => {
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
          TRAIN NUMBER
        </label>
        <input
          type="text"
          placeholder="987665"
          className="font-size-10 form-input-6"
        />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          TRAIN CALSS
        </label>
        <select name="" id="" className="font-size-10 form-input-6">
          <option value="">First Class</option>
        </select>
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          JOURNEY TYPE
        </label>
        <select name="" id="" className="font-size-10 form-input-6">
          <option value="">Day Journey</option>
        </select>
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          TAX SLAB(%)
        </label>
        <select name="" id="" className="font-size-10 form-input-6">
          <option value="">GST</option>
        </select>
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          CURRENCY
        </label>
        <select name="" id="" className="font-size-10 form-input-6">
          <option value="">INR</option>
        </select>
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          R.O.E(INR)
        </label>
        <input
          type="text"
          placeholder="0"
          className="font-size-10 form-input-6"
        />
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
              COST
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
              COST
            </label>
            <input
              type="text"
              placeholder="0"
              className="font-size-10 form-input-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Train;
