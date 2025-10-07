import React, { useEffect, useState } from "react";
import MiniClose from "../../../../images/quotationFour/sliderInnerClose.svg";
import M from "../../../../images/quotationFour/m.svg";
import S from "../../../../images/quotationFour/s.svg";
import { useDroppable } from "@dnd-kit/core";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";

function ItinerariesDayBox({ id, data, setData, editMode, dayService }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const [selectedIcons, setSelectedIcons] = useState({});

  console.log(data, "DATA665");

  const handleIconSelect = (itemText, iconType) => {
    setSelectedIcons((prev) => ({
      ...prev,
      [itemText]: iconType,
    }));
  };

  const handleRemove = (type, itemText) => {
    console.log("Removing:", { type, itemText, id, data });
    if (setData && typeof setData === "function") {
      setData((prev) => {
        console.log("Prev state:", prev);
        if (!prev[id] || typeof prev[id] !== "object") {
          console.warn("Invalid day data for", id, "using default");
          prev[id] = {
            hotels: [],
            monuments: [],
            guide: [],
            activity: [],
            transport: [],
            flight: [],
            train: [],
            additional: [],
          };
        }
        const updatedDayData = {
          ...prev[id],
          [type]: prev[id][type].filter((t) => t !== itemText),
        };
        console.log("Updated day data:", updatedDayData);
        return {
          ...prev,
          [id]: updatedDayData,
        };
      });
    } else {
      console.error("setData not available for:", id);
    }
  };

  const style = {
    border: editMode
      ? isOver
        ? "3px solid #008080"
        : "2px dashed #ccc"
      : isOver
      ? "3px solid #008080"
      : "2px solid #ddd",
    borderRadius: "10px",
    minWidth: "200px",
  };

  return (
    <div ref={setNodeRef} className="sliderCard" style={style}>
      <div
        className="sliderCard-head text-center px-2 py-3"
        style={{
          backgroundColor: isOver
            ? "#008080"
            : editMode
            ? "#2C2C3D"
            : "#2C2C3D",
          color: editMode ? "#ffffff" : "#ffffff",
        }}
      >
        <h4 className="mb-0">{`Day ${dayService?.Days} | ${dayService?.DestinationName}`}</h4>
      </div>

      {(data.hotels || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 border-bottom px-3">Hotels</h6>
          {(data.hotels || []).map((item, i) => (
            <div key={i} className="d-flex align-items-start gap-2 mb-2 px-3">
              {editMode && (
                <img
                  src={MiniClose}
                  alt="close"
                  className="mt-1"
                  onClick={() => handleRemove("hotels", item)}
                  style={{ cursor: "pointer" }}
                />
              )}
              <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                <span className="d-block">{item}</span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "M"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <img
                      src={S}
                      alt="S"
                      onClick={() => handleIconSelect(item, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[item] === "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[item] === "S" ? (
                  <img src={S} alt="S" className="mt-1" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.monuments || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 px-3 border-bottom">Monuments</h6>
          {(data.monuments || []).map((item, i) => (
            <div key={i} className="d-flex align-items-start gap-2 mb-2 px-3">
              {editMode && (
                <img
                  src={MiniClose}
                  alt="close"
                  className="mt-1"
                  onClick={() => handleRemove("monuments", item)}
                  style={{ cursor: "pointer" }}
                />
              )}
              <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                <span className="d-block">{item}</span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "M"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <img
                      src={S}
                      alt="S"
                      onClick={() => handleIconSelect(item, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[item] === "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[item] === "S" ? (
                  <img src={S} alt="S" className="mt-1" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.guide || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 px-3 border-bottom">Guide</h6>
          {(data.guide || []).map((item, i) => (
            <div key={i} className="d-flex align-items-start gap-2 mb-2 px-3">
              {editMode && (
                <img
                  src={MiniClose}
                  alt="close"
                  className="mt-1"
                  onClick={() => handleRemove("guide", item)}
                  style={{ cursor: "pointer" }}
                />
              )}
              <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                <span className="d-block">{item}</span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "M"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <img
                      src={S}
                      alt="S"
                      onClick={() => handleIconSelect(item, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[item] === "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[item] === "S" ? (
                  <img src={S} alt="S" className="mt-1" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.activity || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 px-3 border-bottom">Activity</h6>
          {(data.activity || []).map((item, i) => (
            <div key={i} className="d-flex align-items-start gap-2 mb-2 px-3">
              {editMode && (
                <img
                  src={MiniClose}
                  alt="close"
                  className="mt-1"
                  onClick={() => handleRemove("activity", item)}
                  style={{ cursor: "pointer" }}
                />
              )}
              <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                <span className="d-block">{item}</span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "M"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <img
                      src={S}
                      alt="S"
                      onClick={() => handleIconSelect(item, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[item] === "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[item] === "S" ? (
                  <img src={S} alt="S" className="mt-1" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.transport || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 px-3 border-bottom">Transport</h6>
          {(data.transport || []).map((item, i) => (
            <div key={i} className="d-flex align-items-start gap-2 mb-2 px-3">
              {editMode && (
                <img
                  src={MiniClose}
                  alt="close"
                  className="mt-1"
                  onClick={() => handleRemove("transport", item)}
                  style={{ cursor: "pointer" }}
                />
              )}
              <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                <span className="d-block">{item}</span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "M"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <img
                      src={S}
                      alt="S"
                      onClick={() => handleIconSelect(item, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[item] === "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[item] === "S" ? (
                  <img src={S} alt="S" className="mt-1" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.flight || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 px-3 border-bottom">Flight</h6>
          {(data.flight || []).map((item, i) => (
            <div key={i} className="d-flex align-items-start gap-2 mb-2 px-3">
              {editMode && (
                <img
                  src={MiniClose}
                  alt="close"
                  className="mt-1"
                  onClick={() => handleRemove("flight", item)}
                  style={{ cursor: "pointer" }}
                />
              )}
              <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                <span className="d-block">{item}</span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "M"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <img
                      src={S}
                      alt="S"
                      onClick={() => handleIconSelect(item, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[item] === "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[item] === "S" ? (
                  <img src={S} alt="S" className="mt-1" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.train || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 px-3 border-bottom">Train</h6>
          {(data.train || []).map((item, i) => (
            <div key={i} className="d-flex align-items-start gap-2 mb-2 px-3">
              {editMode && (
                <img
                  src={MiniClose}
                  alt="close"
                  className="mt-1"
                  onClick={() => handleRemove("train", item)}
                  style={{ cursor: "pointer" }}
                />
              )}
              <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                <span className="d-block">{item}</span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "M"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <img
                      src={S}
                      alt="S"
                      onClick={() => handleIconSelect(item, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[item] === "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[item] === "S" ? (
                  <img src={S} alt="S" className="mt-1" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.additional || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 px-3 border-bottom">Additional</h6>
          {(data.additional || []).map((item, i) => (
            <div key={i} className="d-flex align-items-start gap-2 mb-2 px-3">
              {editMode && (
                <img
                  src={MiniClose}
                  alt="close"
                  className="mt-1"
                  onClick={() => handleRemove("additional", item)}
                  style={{ cursor: "pointer" }}
                />
              )}
              <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                <span className="d-block">{item}</span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "M"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <img
                      src={S}
                      alt="S"
                      onClick={() => handleIconSelect(item, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[item] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[item] === "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[item] === "S" ? (
                  <img src={S} alt="S" className="mt-1" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItinerariesDayBox;
