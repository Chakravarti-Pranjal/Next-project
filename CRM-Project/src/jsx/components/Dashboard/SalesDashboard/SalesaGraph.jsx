import React from "react";
import Todolist from "./Todolist"; // Ensure this component is correctly imported
import Topdestination from "./Salestopdestination";
import SalesRevenue from "./SalesRevenue";
import Salespipeline from "./Salespipeline";
import Saleslist from "./Saleslist";
import SearchDate from "./SearchDate";

const SalesaGraph = () => {
  return (
    <div className="row">
      <div className="col-xl-12">
        {/* Main Row */}
        <div className="row">
          {/* To-Do List Section */}
          <div className="col-xl-12 mb-4">
            <Todolist />
          </div>
        </div>
        <div className="col-xl-12">
          <div className="row">
            <div className="col-xl-4 h-75">
              <div className="card p-0">
                <div className="card-header p-0 py-2 px-3 d-flex justify-content-between">
                  <h4 className="fs-15 text-center">January Sales Revenue</h4>
                </div>
                <SalesRevenue />
              </div>
            </div>
            <div className="col-xl-4 h-75">
              <div className="card p-0">
                <div className="card-header p-0 py-2 px-3 d-flex justify-content-between">
                  <h4 className="fs-15 text-center">Sales Pipeline</h4>
                </div>
                <Salespipeline />
              </div>
            </div>
            <div className="col-xl-4 h-75">
              <div className="card p-0">
                <div className="card-header p-0 py-2 px-3 d-flex justify-content-between">
                  <h4 className="fs-15 text-center">
                    Top Query Destination Wise
                  </h4>
                </div>
                <Topdestination />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-12">
          <div className="row">
            {/* To-Do List Section */}
            <div className="col-xl-12 mb-2">
              <SearchDate />
              <Saleslist />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesaGraph;
