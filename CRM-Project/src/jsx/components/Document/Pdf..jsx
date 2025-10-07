import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
import './Document.css';
import avatar from "../../../images/avatar/a.avif";

 const Pdf = ()=>{
    return(
        <>
        <div className=" container mb-4">
        <h5 className="fw-bold">Folders</h5>
        <div className="row">
          {[1, 2, 3, 4].map((item, index) => (
            <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <i className="bi bi-folder-fill display-4 text-warning"></i>
                  <h6 className="mt-2">Project Details</h6>
                  <p className="text-muted">Project plan • 154 KB • 8 Files</p>
                  <div className="d-flex align-items-center">
                    <img
                      src={avatar}
                      alt="Member"
                      className="rounded-circle me-2"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    <small className="text-success">+2 Members</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
                <div className="mb-4">
                <h5 className="fw-bold">Files</h5>
                <div className="row">
                  {["PDF", "PDF", "XLS","PDF"].map((type, index) => (
                    <div key={index} className="col-sm-6 col-md-3 col-lg-3 mb-3">
                      <div className="card shadow-sm">
                        <div className="card-body">
                          <i
                            className={`bi bi-filetype-${type.toLowerCase()} display-4 text-danger`}
                          ></i>
                          <h6 className="mt-2">File {index + 1}</h6>
                          <p className="text-muted">14 Jul • 4 MB</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
             
              </>
    );
 };
 export default Pdf;