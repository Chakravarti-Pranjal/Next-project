// LoadingOverlay.jsx
import React from "react";
import "../../css/LoadingOverlay.css"; // or use inline styles / Tailwind
import loadinggif from "/assets/icons/loadernew.gif";


const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-popup">
        {/* <span className="loader"></span> */}
        <img src={loadinggif}/>
        <p>Please wait...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
