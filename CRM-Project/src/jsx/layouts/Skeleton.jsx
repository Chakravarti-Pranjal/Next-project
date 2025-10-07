import React from "react";
import "../../css/skeleton.css";

const Skeleton = () => {
  return (
    <div className="container-fluid p-0 mb-4">
      <div className="row mt-3">
        <div className="col-12">
          <div className="table">
            <div className="table-row">
              <div className="table-cell shimmerCustom"></div>
              <div className="table-cell shimmerCustom"></div>
              <div className="table-cell shimmerCustom"></div>
            </div>
            <div className="table-row">
              <div className="table-cell shimmerCustom"></div>
              <div className="table-cell shimmerCustom"></div>
              <div className="table-cell shimmerCustom"></div>
            </div>
            <div className="table-row">
              <div className="table-cell shimmerCustom"></div>
              <div className="table-cell shimmerCustom"></div>
              <div className="table-cell shimmerCustom"></div>
            </div>
            <div className="table-row">
              <div className="table-cell shimmerCustom"></div>
              <div className="table-cell shimmerCustom"></div>
              <div className="table-cell shimmerCustom"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
