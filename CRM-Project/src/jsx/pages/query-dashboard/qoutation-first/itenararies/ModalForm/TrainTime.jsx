import React from 'react';

const TrainTime = () =>{
    return(
        <div className="row row-gap-2">
      <div className="col-3">
        <label htmlFor="" className="font-size-10 m-0">
          DEPARTURE DATE
        </label>
        <input type="date" className="font-size-10 form-input-6" />
      </div>
      <div className="col-3">
        <label htmlFor="" className="font-size-10 m-0">
          DEPARTURE TIME
        </label>
        <input type="time" className="font-size-10 form-input-6" />
      </div>
      <div className="col-3">
        <label htmlFor="" className="font-size-10 m-0">
          ARRIVAL DATE
        </label>
        <input type="date" className="font-size-10 form-input-6" />
      </div>
      <div className="col-3">
        <label htmlFor="" className="font-size-10 m-0">
          ARRIVAL TIME
        </label>
        <input type="time" className="font-size-10 form-input-6" />
      </div>
      <div className="col-12">
        <label htmlFor="" className="font-size-10 m-0">
          REMARKS
        </label>
        <input
          type="textarea"
          className="font-size-10 form-input-6"
          placeholder="Remarks"
        />
      </div>
    </div>
    )
};

export default TrainTime;