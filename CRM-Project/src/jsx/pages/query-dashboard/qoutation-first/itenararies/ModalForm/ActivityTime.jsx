import React from "react";

const ActivityTime = () => {
  return (
    <div className="row row-gap-2">
      <div className="col-6">
        <label htmlFor="" className="font-size-10 m-0">
          START TIME
        </label>
        <input
          type="time"
          placeholder="00:00"
          className="font-size-10 form-input-6"
        />
      </div>
      <div className="col-6">
        <label htmlFor="" className="font-size-10 m-0">
          END TIME
        </label>
        <input
          type="time"
          placeholder="00:00"
          className="font-size-10 form-input-6"
        />
      </div>
    </div>
  );
};

export default ActivityTime;
