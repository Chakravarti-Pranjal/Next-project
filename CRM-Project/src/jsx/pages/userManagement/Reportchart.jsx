import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import shazim from "../assets/images/Shazim.jpg";
// import image1 from "../assets/images/image1.webp";
// import image2 from "../assets/images/image2.jpg";
// import image3 from "../assets/images/images3.jpg";
// import image4 from "../assets/images/image4.jpg";
// import image5 from "../assets/images/images5.jpg";
// import image6 from "../assets/images/image6.jpg";
import reportchartdemo from "../../../images/reportchart/reportchartdemo.webp"
// import "./TeamManagement.css"

function Reportchart() {

  return (
    <>
      <div className="tm-main-upper">
        <div className="tm-main">
          {/* Director */}
          <div className="tm-director">
            <div className="tm-director-inner">
              <div className="tm-main-img">
                <img src={reportchartdemo} alt="Shazim" height={90} width={90} />
              </div>
              <div className="btn btn-success btn-custom-size text-align-center" >
                <p className="tm-director-rank-para pt-0" >Naved Ashraf</p>
                <p className="tm-sub-director-ranked tm-ranked pb-0 mb-1 ">Director</p>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="tm-director-arrow-max-lenght">
            <svg width="700" height="200" viewBox="0 0 500 200">
              {/* <!-- Left Arrow (Longer) --> */}
              <line x1="250" y1="0" x2="-50" y2="130" stroke="gray" stroke-width="2" marker-end="url(#arrow)" />

              {/* <!-- Middle Arrow (Unchanged) --> */}
              <line x1="250" y1="0" x2="250" y2="190" stroke="gray" stroke-width="2" marker-end="url(#arrow)" />

              {/* <!-- Right Arrow (Longer) --> */}
              <line x1="250" y1="0" x2="550" y2="130" stroke="gray" stroke-width="2" marker-end="url(#arrow)" />

              {/* <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L10,5 L0,10 Z" fill="black" />
                </marker>
              </defs> */}
            </svg>
          </div>


          <div className="tm-director-arrow-md-lenght">
            <svg width="700" height="150" viewBox="0 0 500 200">
              <line x1="250" y1="0" x2="50" y2="170" stroke="gray" strokeWidth="2" markerEnd="url(#arrow)" /> {/* left-arrow */}
              <line x1="250" y1="0" x2="250" y2="190" stroke="gray" strokeWidth="2" markerEnd="url(#arrow)" /> {/* middle-arrow */}
              <line x1="250" y1="0" x2="450" y2="170" stroke="gray" strokeWidth="2" markerEnd="url(#arrow)" /> {/* right-arrow */}

              {/* <defs>
                <marker id="arrow" markerWidth="12" markerHeight="12" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L12,6 L0,12 Z" fill="black" />
                </marker>
              </defs> */}
            </svg>
          </div>
           {/* Sub-Directors */}
          <div className="tm-sub-director">
            <div className="tm-sub-director-inner-1">
              <div className="tm-sub-director-inner-1-main">
                <div className="tm-main-img">
                  <img src={reportchartdemo} alt="Shazim" height={90} width={90} />
                </div>
                <div className="btn btn-secondary btn-custom-size  ">
                  <p className="tm-sub-director-rank-para my-auto">Amit Kumar Pundir</p>
                  <p className="tm-sub-director-ranked tm-ranked mb-1">CBO</p>
                </div>
                <div className="">
                <svg width="150" height="100" viewBox="0 0 500 150">
                  {/* Increased the length of the arrow */}
                  <line x1="250" y1="50" x2="250" y2="180" stroke="gray" strokeWidth="5" markerEnd="url(#arrow)" />

                  <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
                      <path d="M0,0 L10,5 L0,10 Z" fill="gray" />
                    </marker>
                  </defs>
                </svg>
                </div>
              </div>
            </div>
            <div className="tm-sub-director-inner-2">
              <div className="tm-sub-director-inner-2-main">
                <div className="tm-main-img">
                  <img src={reportchartdemo} alt="Shazim" height={90} width={90} />
                </div>
                <div className="btn btn-secondary btn-custom-size">
                  <p className="tm-sub-director-rank-para px-3">Dinesh Khari</p>
                  <p className="tm-sub-director-ranked tm-ranked px-3 mb-1">Vice President</p>
                </div>
                <div className="">
                <svg width="150" height="100" viewBox="0 0 500 150">
                  {/* Increased the length of the arrow */}
                  <line x1="250" y1="50" x2="250" y2="180" stroke="gray" strokeWidth="5" markerEnd="url(#arrow)" />

                  <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
                      <path d="M0,0 L10,5 L0,10 Z" fill="gray" />
                    </marker>
                  </defs>
                </svg>
                </div>
              </div>
            </div>
            <div className="tm-sub-director-inner-3">
              <div className="tm-sub-director-inner-3-main">
                <div className="tm-main-img">
                  <img src={reportchartdemo} alt="Shazim" height={90} width={90} />
                </div>
                <div className="btn btn-secondary btn-custom-size " >
                  <p className="tm-sub-director-rank-para px-4">Syed Asim</p>
                  <p className="tm-sub-director-ranked tm-ranked px-4 mb-1">Director</p>
                </div>
                <div className="">
                <svg width="150" height="100" viewBox="0 0 500 150">
                  {/* Increased the length of the arrow */}
                  <line x1="250" y1="50" x2="250" y2="180" stroke="gray" strokeWidth="5" markerEnd="url(#arrow)" />

                  <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
                      <path d="M0,0 L10,5 L0,10 Z" fill="gray" />
                    </marker>
                  </defs>
                </svg>
                </div>
              

              </div>
            </div>
          </div>

          {/* Arrow */}

          {/* Department-Head */}
          <div className="tm-depart-head">
            <div className="tm-depart-head-inner-1">
              <div className="tm-depart-head-inner-1-main">
                <div className="tm-main-img">
                  <img src={reportchartdemo} alt="Shazim" height={90} width={90} />
                </div>

                <div className="btn btn-primary btn-custom-size" >
                  <p className="tm-depart-head-rank-para">Sarika Dua</p>
                  <p className="tm-depart-head-ranked tm-ranked mb-1">Sales Manager</p>
                </div>
              </div>
            </div>

            <div className="tm-depart-head-inner-2">
              <div className="tm-depart-head-inner-2-main">
                <div className="tm-main-img">
                  <img src={reportchartdemo} alt="Shazim" height={90} width={90} />
                </div>

                <div className="btn btn-primary btn-custom-size" >
                  <p className="tm-depart-head-rank-para ">Devesh Tiwari [1]</p>
                  <p className="tm-depart-head-ranked tm-ranked mb-1">Sales</p>
                </div>
              </div>
            </div>

            <div className="tm-depart-head-inner-3">
              <div className="tm-depart-head-inner-3-main">
                <div className="tm-main-img">
                  <img src={reportchartdemo} alt="Shazim" height={90} width={90} />
                </div>
                <div className="btn btn-primary btn-custom-size" >
                  <p className="tm-depart-head-rank-para">Amit Kumar Pundir</p>
                  <p className="tm-depart-head-ranked tm-ranked mb-1">CBO</p>
                </div>
                <div className="">
                <svg width="150" height="100" viewBox="0 0 500 150">
                  {/* Increased the length of the arrow */}
                  <line x1="250" y1="50" x2="250" y2="180" stroke="gray" strokeWidth="5" markerEnd="url(#arrow)" />

                  <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
                      <path d="M0,0 L10,5 L0,10 Z" fill="gray" />
                    </marker>
                  </defs>
                </svg>
                </div>
                
              </div>
            </div>
          </div>


          {/* Employess */}
          <div className="tm-employe">
            <div className="tm-employe-inner-1"></div>
            <div className="tm-employe-inner-2"></div>
            <div className="tm-employe-inner-3">
              <div className="tm-employe-inner-3-main">
                <div className="tm-main-img">
                  <img src={reportchartdemo} alt="Shazim" height={90} width={90} />
                </div>

                <div className="btn btn-warning btn-custom-size " >
                  <p className="tm-employe-rank-para pt-1">Devesh Tiwari [1]</p>
                  <p className="tm-employe-ranked tm-ranked mb-1">Sales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Reportchart;
