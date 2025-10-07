import React, { useState } from "react";
import "../../../css/shimmer.css";
// import Layout from "./Layout";

const QueryShimmer = () => {
  return (
    <>
     {/* <Layout> */}
        <div className="container-fluid p-3 mb-4">
          <div
            className="card shadow-none border"
            style={{ marginBottom: "0" }}
          >
            <div
              className="card-header header-elements-inline py-2 bg-secondary-color bg-shimmer"
              style={{ padding: "10px" }}
            >
              <div className="col-xl-10 d-flex align-items-center">
                <div className="first-shimmer-box"></div>
              </div>
              <div className="col-xl-2 d-flex justify-content-end">
                <div className="second-shimmer-box"></div>
              </div>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-lg-2 col-md-3 mt-2 mt-md-0">
                    <div className="third-shimmer-box"></div>
                </div>
                <div className="col-lg-2 col-md-3 mt-2 mt-md-0">
                    <div className="fourth-shimmer-box"></div>
                </div>
                <div className="col-lg-2 col-md-3 mt-2 mt-md-0">
                  <div className="fivth-shimmer-box"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12">
              <div className="table">
                <div className="table-row">
                  <div className="table-cell shimmer"></div>
                  <div className="table-cell shimmer"></div>
                  <div className="table-cell shimmer"></div>
                </div>
                <div className="table-row">
                  <div className="table-cell shimmer"></div>
                  <div className="table-cell shimmer"></div>
                  <div className="table-cell shimmer"></div>
                </div>
                <div className="table-row">
                  <div className="table-cell shimmer"></div>
                  <div className="table-cell shimmer"></div>
                  <div className="table-cell shimmer"></div>
                </div>
                <div className="table-row">
                  <div className="table-cell shimmer"></div>
                  <div className="table-cell shimmer"></div>
                  <div className="table-cell shimmer"></div>
                </div>
                <div className="table-row">
                  <div className="table-cell shimmer"></div>
                  <div className="table-cell shimmer"></div>
                  <div className="table-cell shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </Layout> */}
    </>
  );
}

export default QueryShimmer;