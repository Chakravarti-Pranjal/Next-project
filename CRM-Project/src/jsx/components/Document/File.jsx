import React, { Fragment } from 'react'
// import "bootstrap/dist/css/bootstrap.min.css";
 import "bootstrap-icons/font/bootstrap-icons.css";
import './Document.css';
import Pdf from './Pdf.';
import Video from './Video';
const File=()=> {
  const list=[{ name: "My Files", icon: "bi-folder" },
    { name: "Google Drive", icon: "bi-cloud-upload"},
    { name: "Dropbox", icon: "bi-box-arrow-in-down"},
    { name: "Shared With Me", icon: "bi-people"},
    { name: "Documents", icon: "bi-file-earmark-text"},
    { name: "Recent", icon: "bi-clock"},
    { name: "Favourites", icon: "bi-star"},
    { name: "Archived", icon: "bi-archive"}

  ]
  return (
   <Fragment>
    
    <div className="row ">
      <div className="col-md-4 col-lg-3 p-3 ">
        <h5 className="fw-bold" role="button">File Manager</h5>
        <button className="btn btn-danger w-100 mb-3">
          <i className="bi bi-plus-circle me-2" role="button"></i>New
        </button>
        <ul className="list-group">
            {list.map((item, index) => (
              <li key={index} className="list-group-item border-0" role="button">
                <i className={`bi ${item.icon} me-2`}></i> {item.name}
              </li>
            ))}
          </ul>
      </div>


      <div className="col-md-8 col-lg-9">
    
        <div className="d-flex justify-content-between align-items-center p-3">
          <div>
            <button className="btn btn-outline-secondary me-2">Sort by Date</button>
            <input
              type="text"
              className="form-control d-inline-block w-auto"
              placeholder="Search"
            />
          </div>
          <div>
            <select className="form-select d-inline-block w-auto me-2">
              <option>Recent</option>
              <option>Oldest</option>
            </select>
            <select className="form-select d-inline-block w-auto">
              <option>All File Types</option>
              <option>Images</option>
              <option>Videos</option>
              <option>Documents</option>
            </select>
          </div>
          <button className="btn btn-danger">
            <i className="bi bi-upload me-2"></i>Upload Files
          </button>
        </div>

        <div className="row text-center">
          <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-body bg-danger">
                <i className="bi bi-folder-fill display-4 text-warning" role="button"></i>
                <h5 className="mt-2 text-black" role="button">Folders</h5>
                <p className="text-black">300 Files</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-body bg-success">
                <i className="bi bi-filetype-pdf display-4 text-danger" role="button"></i>
                <h5 className="mt-2" role="button">PDF</h5>
                <p className="text-black">50 Files</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-body bg-secondary">
                <i className="bi bi-image-fill display-4 text-success"  role="button"></i>
                <h5 className="mt-2" role="button">Images</h5>
                <p className="text-black">240 Files</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-body bg-info">
                <i className="bi bi-play-circle-fill display-4 text-danger" role="button"></i>
                <h5 className="mt-2" role="button">Videos</h5>
                <p className="text-black">30 Files</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-body bg-warning">
                <i className="bi bi-music-note-beamed display-4 text-dark" role="button"></i>
                <h5 className="mt-2 " role="button">Audios</h5>
                <p className="text-black">100 Files</p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
    <Pdf />
    <Video />
  </Fragment>
  )
}

export default File;
