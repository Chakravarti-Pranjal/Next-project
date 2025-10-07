import React from "react";

const Hotel = () => {
  return (
    <div className="row row-gap-2">
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          ROOM TYPE
        </label>
        <select name="" id="" className="form-input-6 font-size-10">
          <option value="">Delux</option>
        </select>
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          MEAL PLAN
        </label>
        <select name="" id="" className="form-input-6 font-size-10">
          <option value="">AP</option>
          <option value="">CP</option>
        </select>
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          CURRENCY
        </label>
        <select name="" id="" className="form-input-6 font-size-10">
          <option value="">INR</option>
          <option value="">PKR</option>
          <option value="">DOLLAR</option>
        </select>
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          R.O.E
        </label>
        <input type="text" placeholder="0" className="form-input-6" />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          SINGLE
        </label>
        <input type="text" placeholder="0" className="form-input-6" />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          DOUBLE
        </label>
        <input type="text" placeholder="0" className="form-input-6" />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          TWIN
        </label>
        <input type="text" placeholder="0" className="form-input-6" />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          TRIPLE
        </label>
        <input type="text" placeholder="0" className="form-input-6" />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          BREAKFAST
        </label>
        <input type="text" placeholder="0" className="form-input-6" />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          LUNCH(A)
        </label>
        <input type="text" placeholder="0" className="form-input-6" />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          DINNER(A)
        </label>
        <input type="text" placeholder="0" className="form-input-6" />
      </div>
      <div className="col-3">
        <label htmlFor="" className="m-0 font-size-10">
          REMARKS
        </label>
        <input type="text" placeholder="0" className="form-input-6" />
      </div>
    </div>
  );
};

export default Hotel;
