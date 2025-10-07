import React, { useEffect, useState } from "react";
import MiniClose from "../../../../images/quotationFour/sliderInnerClose.svg";
import M from "../../../../images/quotationFour/m.svg";
import S from "../../../../images/quotationFour/s.svg";
import BreakfastIcon from "../../../../images/quotationFour/Breakfast.svg";
import LunchIcon from "../../../../images/quotationFour/Lunch.svg";
import DinnerIcon from "../../../../images/quotationFour/Dinner.svg";
import BreakfastIconColor from "../../../../images/quotationFour/BreakfastC.svg";
import LunchIconColor from "../../../../images/quotationFour/LunchC.svg";
import DinnerIconColor from "../../../../images/quotationFour/DinnerC.svg";
import { useDroppable } from "@dnd-kit/core";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
import HotelIcon from "../../../../images/quotationFour/hotelNew.svg";
import MonumentIcon from "../../../../images/quotationFour/MonumentNew.svg";
import GuideIcon from "../../../../images/quotationFour/GuideNew.svg";
import ActivityIcon from "../../../../images/quotationFour/ActivityNew.svg";
import RestaurantIcon from "../../../../images/quotationFour/RestaurantNew.svg";
import TransportIcon from "../../../../images/quotationFour/TransportNew.svg";
import FlightIcon from "../../../../images/quotationFour/FlightNew.svg";
import TrainIcon from "../../../../images/quotationFour/TrainNew.svg";
import AdditionalIcon from "../../../../images/quotationFour/Additional.svg";

function ItinerariesDayBox({
  DayUniqueId,
  data,
  setDayWiseFormValue,
  editMode,
  dayWiseFormValue,
  setSelectedRestaurantIcons,
  selectedRestaurantIcons,
  setSelectedIcons,
  selectedIcons,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: DayUniqueId });
  // const [selectedIcons, setSelectedIcons] = useState({});
  const { queryQuotationData } = useSelector(
    (state) => state.queryQuotationFourReducer
  );

  // console.log(selectedIcons, "selectedIcons");
  // console.log(data, "DATA665");

  const handleIconSelect = (itemText, day, iconType) => {
    setSelectedIcons((prev) => ({
      ...prev,
      [`${day}-${removeServiceId(itemText)}`]: iconType,
    }));
  };

  const handleRemove = (type, itemText) => {
    console.log("Removing:", { type, itemText, DayUniqueId, data });
    if (setDayWiseFormValue && typeof setDayWiseFormValue === "function") {
      setDayWiseFormValue((prev) => {
        console.log("Prev state:", prev);
        const updatedFormValue = prev.map((dayObj) => {
          const [currentDayKey, dayData] = Object.entries(dayObj)[0];
          if (currentDayKey === DayUniqueId) {
            return {
              ...dayObj,
              [DayUniqueId]: {
                ...dayData,
                [type]: dayData[type].filter((t) => t !== itemText),
              },
            };
          }
          return dayObj;
        });
        console.log("Updated form value:", updatedFormValue);
        return updatedFormValue;
      });
    } else {
      console.error("setDayWiseFormValue not available for:", DayUniqueId);
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

  // Find the day information from queryQuotationData
  const dayInfo = queryQuotationData?.[0]?.Days?.find(
    (day) => day.DayUniqueId === DayUniqueId
  );

  let displayText;

  if (dayInfo) {
    displayText =
      dayInfo.EnrouteId !== ""
        ? `Day ${dayInfo.Day} | ${dayInfo.DestinationName} (Enroute)`
        : `Day ${dayInfo.Day} | ${dayInfo.DestinationName}`;
  }

  // let displayText = dayInfo
  //   ? `Day ${dayInfo.Day} | ${dayInfo.DestinationName}`
  //   : `Day 1 | Delhi`;

  console.log(dayInfo, "dayInfo12");

  const removeServiceId = (name) => {
    const cleanName = name.split("-").slice(1).join("-");
    return cleanName;
  };

  const [selectedMeals, setSelectedMeals] = useState({});

  console.log(selectedMeals, "selectedMeals");

  const handleMultiIconSelect = (item, icon) => {
    setSelectedRestaurantIcons((prev) => {
      const currentIcons = prev[item] || [];
      let updatedIcons;

      if (currentIcons.includes(icon)) {
        // Remove icon if already selected
        updatedIcons = currentIcons.filter((i) => i !== icon);
      } else {
        // Add icon
        updatedIcons = [...currentIcons, icon];
      }

      return { ...prev, [item]: updatedIcons };
    });
  };
  console.log(selectedRestaurantIcons, "selectedRestaurantIcons");

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
        <h4 className="mb-0">{displayText}</h4>
      </div>

      {(data.hotels || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 border-bottom px-3 d-flex align-items-center gap-2">
            {" "}
            <img
              src={HotelIcon}
              alt="HotelIcon"
              style={{ width: "14px" }}
            />{" "}
            Hotels
          </h6>
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
                {console.log(item, "HFGFG787")}
                <span className={`${editMode ? "" : "ps-4"} d-block`}>
                  {removeServiceId(item)}
                </span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, data.Day, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "M"
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
                      onClick={() => handleIconSelect(item, data.Day, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "S" ? (
                  <img src={S} alt="S" className="mt-1" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.monuments || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2">
            {" "}
            <img
              src={MonumentIcon}
              alt="MonumentIcon"
              style={{ width: "14px" }}
            />{" "}
            Monuments
          </h6>
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
                <span className={`${editMode ? "" : "ps-4"} d-block`}>
                  {removeServiceId(item)}
                </span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, data.Day, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "M"
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
                      onClick={() => handleIconSelect(item, data.Day, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "S" ? (
                  <img src={S} alt="S" className="mt-1" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.guide || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2">
            {" "}
            <img
              src={GuideIcon}
              alt="GuideIcon"
              style={{ width: "14px" }}
            />{" "}
            Guide
          </h6>
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
                <span className={`${editMode ? "" : "ps-4"} d-block`}>
                  {removeServiceId(item)}
                </span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, data.Day, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "M"
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
                      onClick={() => handleIconSelect(item, data.Day, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "S" ? (
                  <img src={S} alt="S" className="mt-1" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.activity || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2">
            {" "}
            <img
              src={ActivityIcon}
              alt="ActivityIcon"
              style={{ width: "14px" }}
            />{" "}
            Activity
          </h6>
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
                <span className={`${editMode ? "" : "ps-4"} d-block`}>
                  {removeServiceId(item)}
                </span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, data.Day, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "M"
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
                      onClick={() => handleIconSelect(item, data.Day, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "S" ? (
                  <img src={S} alt="S" className="mt-1" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.restaurant || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2">
            {" "}
            <img
              src={RestaurantIcon}
              alt="RestaurantIcon"
              style={{ width: "14px" }}
            />{" "}
            Restaurant
          </h6>
          {(data.restaurant || []).map((item, i) => (
            <div key={i} className="d-flex align-items-start gap-2 mb-2 px-3">
              {console.log(data, "GFBHD7766")}
              {editMode && (
                <img
                  src={MiniClose}
                  alt="close"
                  className="mt-1"
                  onClick={() => handleRemove("restaurant", item)}
                  style={{ cursor: "pointer" }}
                />
              )}
              <div className="d-flex align-items-start gap-1 justify-content-between w-100">
                <span className={`${editMode ? "" : "ps-4"} d-block`}>
                  {removeServiceId(item)}
                </span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    {/* Breakfast */}
                    <img
                      src={
                        selectedRestaurantIcons[
                          `${data.Day}-${removeServiceId(item)}`
                        ]?.includes("Breakfast")
                          ? BreakfastIconColor
                          : BreakfastIcon
                      }
                      alt="B"
                      onClick={() =>
                        handleMultiIconSelect(
                          `${data.Day}-${removeServiceId(item)}`,
                          "Breakfast"
                        )
                      }
                      className="mt-1"
                      style={{
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    {/* Lunch */}
                    <img
                      src={
                        selectedRestaurantIcons[
                          `${data.Day}-${removeServiceId(item)}`
                        ]?.includes("Lunch")
                          ? LunchIconColor
                          : LunchIcon
                      }
                      alt="L"
                      onClick={() =>
                        handleMultiIconSelect(
                          `${data.Day}-${removeServiceId(item)}`,
                          "Lunch"
                        )
                      }
                      className="mt-1"
                      style={{
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    {/* Dinner */}
                    <img
                      src={
                        selectedRestaurantIcons[
                          `${data.Day}-${removeServiceId(item)}`
                        ]?.includes("Dinner")
                          ? DinnerIconColor
                          : DinnerIcon
                      }
                      alt="D"
                      onClick={() =>
                        handleMultiIconSelect(
                          `${data.Day}-${removeServiceId(item)}`,
                          "Dinner"
                        )
                      }
                      className="mt-1"
                      style={{
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : (
                  <div className="d-flex gap-1">
                    {selectedRestaurantIcons[
                      `${data.Day}-${removeServiceId(item)}`
                    ]?.includes("Breakfast") && (
                      <img
                        src={BreakfastIconColor}
                        alt="B"
                        className="mt-1"
                        style={{
                          borderRadius: "25px",
                          cursor: "pointer",
                          width: "16px",
                          height: "16px",
                        }}
                      />
                    )}
                    {selectedRestaurantIcons[
                      `${data.Day}-${removeServiceId(item)}`
                    ]?.includes("Lunch") && (
                      <img
                        src={LunchIconColor}
                        alt="L"
                        className="mt-1"
                        style={{
                          borderRadius: "25px",
                          cursor: "pointer",
                          width: "16px",
                          height: "16px",
                        }}
                      />
                    )}
                    {selectedRestaurantIcons[
                      `${data.Day}-${removeServiceId(item)}`
                    ]?.includes("Dinner") && (
                      <img
                        src={DinnerIconColor}
                        alt="D"
                        className="mt-1"
                        style={{
                          borderRadius: "25px",
                          cursor: "pointer",
                          width: "16px",
                          height: "16px",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.transport || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2">
            {" "}
            <img
              src={TransportIcon}
              alt="TransportIcon"
              style={{ width: "14px" }}
            />{" "}
            Transport
          </h6>
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
                <span className={`${editMode ? "" : "ps-4"} d-block`}>
                  {removeServiceId(item)}
                </span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, data.Day, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "M"
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
                      onClick={() => handleIconSelect(item, data.Day, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "S" ? (
                  <img src={S} alt="S" className="mt-1" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.flight || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2">
            {" "}
            <img
              src={FlightIcon}
              alt="FlightIcon"
              style={{ width: "14px" }}
            />{" "}
            Flight
          </h6>
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
                <span className={`${editMode ? "" : "ps-4"} d-block`}>
                  {removeServiceId(item)}
                </span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, data.Day, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "M"
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
                      onClick={() => handleIconSelect(item, data.Day, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "S" ? (
                  <img src={S} alt="S" className="mt-1" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.train || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2">
            {" "}
            <img
              src={TrainIcon}
              alt="TrainIcon"
              style={{ width: "14px" }}
            />{" "}
            Train
          </h6>
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
                <span className={`${editMode ? "" : "ps-4"} d-block`}>
                  {removeServiceId(item)}
                </span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, data.Day, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "M"
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
                      onClick={() => handleIconSelect(item, data.Day, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "S" ? (
                  <img src={S} alt="S" className="mt-1" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.additional || []).length > 0 && (
        <div className="border-bottom">
          <h6 className="mb-2 px-3 border-bottom d-flex align-items-center gap-2">
            {" "}
            <img
              src={AdditionalIcon}
              alt="AdditionalIcon"
              style={{ width: "14px" }}
            />{" "}
            Additional
          </h6>
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
                <span className={`${editMode ? "" : "ps-4"} d-block`}>
                  {removeServiceId(item)}
                </span>
                {editMode ? (
                  <div className="d-flex gap-1">
                    <img
                      src={M}
                      alt="M"
                      onClick={() => handleIconSelect(item, data.Day, "M")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "M"
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
                      onClick={() => handleIconSelect(item, data.Day, "S")}
                      className="mt-1"
                      style={{
                        boxShadow:
                          selectedIcons[
                            `${data.Day}-${removeServiceId(item)}`
                          ] === "S"
                            ? "0 0 2px 2px #008080"
                            : "0 0 0 2px transparent",
                        borderRadius: "25px",
                        cursor: "pointer",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </div>
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "M" ? (
                  <img src={M} alt="M" className="mt-1" />
                ) : selectedIcons[`${data.Day}-${removeServiceId(item)}`] ===
                  "S" ? (
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
