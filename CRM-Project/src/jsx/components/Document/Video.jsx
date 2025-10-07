import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
import './Document.css';
const Video = () => {
  const videos = [
    { name: "Demo_dw", date: "12 Jul", size: "5 MB" },
    { name: "Android_bike.mp4", date: "14 Jul", size: "23 MB" },
    { name: "Demoparticles.mp4", date: "14 Jul", size: "173 MB" },

  ];

  const files = [
    { name: "Digimed", type: "folder", modified: "Today 08:30 AM by Angel", size: "200 MB", owner: "Nolan Christopher" },
    { name: "Estimation", type: "xls", modified: "Today 09:20 AM", size: "140 MB", owner: "Nolan Harris" },
    { name: "Intro.pdf", type: "pdf", modified: "27 July 2023", size: "70 MB", owner: "Me" },
    { name: "Demoworking.mp4", type: "mp4", modified: "27 July 2023", size: "70 MB", owner: "Me" },
    { name: "voice.mp3", type: "mp3", modified: "27 July 2023", size: "70 MB", owner: "Me" },
];

  return (
    <div className="container my-4">
      
      <div className="mb-4">
        <h5 className="fw-bold">Videos</h5>
        <div className="row " >
          {videos.map((video, index) => (
            <div key={index} className="col-sm-6 col-md-4 mb-3">
              <div className="card shadow-sm embed-responsive embed-responsive-16by9 bg-light">
            
  <iframe className="embed-responsive-item" src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"></iframe>

                <div className="card-body" >
                  <h6 className="card-title  ">{video.name}</h6>
                  <p className="card-text">
                    {video.date} • {video.size}
                  </p>
                  <div className="d-flex justify-content-between">
                    <i className="bi bi-star"></i>
                    <i className="bi bi-three-dots"></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h5 className="fw-bold">All Files</h5>
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th scope="col">
                <input type="checkbox" />
              </th>
              <th scope="col">Name</th>
              <th scope="col">Last Modified</th>
              <th scope="col">Size</th>
              <th scope="col">Owned Member</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <i
                    className={`bi ${
                      file.type === "folder"
                        ? "bi-folder-fill text-warning"
                        : file.type === "xls"
                        ? "bi-filetype-xls text-success"
                        : "bi-filetype-pdf text-danger"

                    } me-2`}></i>
                  {file.name}
                </td>
                <td>{file.modified}</td>
                <td>{file.size}</td>
                <td>{file.owner}</td>
                <td>
                  <div className="d-flex justify-content-between">
                    <i className="bi bi-star"></i>
                    <i className="bi bi-three-dots"></i>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Video;
