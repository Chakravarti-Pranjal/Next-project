import React, { useRef } from "react";
// import { FaArrowCircleLeft } from "react-icons/fa";
// import { FaArrowCircleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";

const HorizontalScroll = ({ children }) => {
  const tableContainerRef = useRef(null);

  // Scroll function
  const scrollTable = (direction) => {
    const tableContainer = tableContainerRef.current;
    if (tableContainer) {
      const scrollAmount = direction === "left" ? -100 : 100;
      tableContainer.scrollLeft += scrollAmount;
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      {/* Left Button */}
      <button
        onClick={() => scrollTable("left")}
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          backgroundColor: " rgba(255, 0, 0, 0.19)",
          color: "rgba(255, 0, 0, 0.85)",
          border: "none",
          cursor: "pointer",
          height: "2rem",
          width: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "50%",
          fontSize: "1.4rem",
        }}
      >
        <FaAngleLeft />
      </button>

      {/* Table Container */}
      <div
        ref={tableContainerRef}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollBehavior: "smooth",
          whiteSpace: "nowrap",
          scrollbarWidth: "none", // Hide scrollbar for Firefox
          msOverflowStyle: "none", // Hide scrollbar for Internet Explorer and Edge
        }}
      >
        {children} {/* Table passed as children */}
      </div>

      {/* Right Button */}
      <button
        onClick={() => scrollTable("right")}
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          backgroundColor: " rgba(255, 0, 0, 0.19)",
          color: "rgba(255, 0, 0, 0.85)",
          height: "2rem",
          width: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "none",
          cursor: "pointer",
          borderRadius: "50%",
          fontSize: "1.4rem",
        }}
      >
        <FaAngleRight />
      </button>
    </div>
  );
};

export default HorizontalScroll;
