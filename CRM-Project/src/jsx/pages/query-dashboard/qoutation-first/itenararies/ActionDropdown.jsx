import React, { useState } from "react";
import ItenarayModal from "./ItenarayModal";
import { act } from "react";

const ActionDropdown = ({ action }) => {
  const [openModal, setOpenModal] = useState(null);

  const handleModalOpening = () => {
    switch (action) {
      case "activity":
        setOpenModal("#activityModal");
        break;
      case "monument":
        setOpenModal("#monumentModal");
        break;
      case "departure":
        setOpenModal("#departureModal");
        break;
      case "arrival":
        setOpenModal("#arrivalModal");
        break;
      case "train":
        setOpenModal("#trainModal");
        break;
      case "transfer":
        setOpenModal("#transferModal");
        break;
      case "transportation":
        setOpenModal("#transportationModal");
        break;
      case "enroute":
        setOpenModal("#enrouteModal");
        break;
      case "additional":
        setOpenModal("#additionalModal");
        break;
    }
  };

  const handleTimeModalOpening = () => {
    switch (action) {
      case "departure":
        setOpenModal("#departureTimeModal");
        break;
      case "arrival":
        setOpenModal("#arrivalTimeModal");
        break;
      case "monument":
        setOpenModal("#monumentTimeModal");
        break;
      case "activity":
        setOpenModal("#activityTimeModal");
        break;
      case "train":
        setOpenModal("#trainTimeModal");
        break;
    }
  };

  return (
    <>
      <div>
        {action === "hotel" && (
          <>
            <p
              className="dropdown-item m-0"
              data-toggle="modal"
              data-target=".hotel-delete-modal"
            >
              <span>
                <i className="fa-solid fa-trash font-size-12 text-danger pr-2"></i>
              </span>
              DELETE
            </p>
            <p
              className="dropdown-item m-0"
              data-toggle="modal"
              data-target="#hotelModal"
            >
              <span>
                <i className="fa-solid fa-pen-to-square text-success pr-2 font-size-12"></i>
              </span>
              EDIT
            </p>
            <p
              className="dropdown-item m-0"
              data-toggle="modal"
              data-target="#hotelMealModal"
            >
              <span>
                <i className="fa-solid fa-plate-wheat text-primary pr-2 font-size-12"></i>
              </span>
              MEALS
            </p>
            <p
              className="dropdown-item m-0"
              data-toggle="modal"
              data-target=".hotel-room-supplement"
            >
              <span>
                <i className="fa-solid fa-bed pr-2 font-size-12 text-warning"></i>
              </span>
              ROOM SUPPLEMENT
            </p>
            <p className="dropdown-item m-0">
              <span>
                <i className="fa-solid fa-bed pr-2 font-size-12 text-warning"></i>
              </span>
              HOTEL SUPPLEMENT
            </p>
          </>
        )}
        {(action === "activity" ||
          action === "departure" ||
          action === "arrival" ||
          action === "monument" ||
          action === "train") && (
          <>
            <p className="dropdown-item m-0">
              <span>
                <i className="fa-solid fa-trash font-size-12 text-danger pr-2"></i>
              </span>
              DELETE
            </p>
            <p
              className="dropdown-item m-0"
              onClick={handleModalOpening}
              data-toggle="modal"
              data-target={openModal}
            >
              <span>
                <i className="fa-solid fa-pen-to-square text-success pr-2 font-size-12"></i>
              </span>
              EDIT
            </p>
            <p
              className="dropdown-item m-0"
              data-toggle="modal"
              data-target={openModal}
              onClick={handleTimeModalOpening}
            >
              <span>
                <i className="fa-solid fa-hourglass-start text-primary pr-2 font-size-12"></i>
              </span>
              TIMING
            </p>
          </>
        )}
        {(action === "transfer" || action === "transportation") && (
          <>
            <p className="dropdown-item m-0">
              <span>
                <i className="fa-solid fa-trash font-size-12 text-danger pr-2"></i>
              </span>
              DELETE
            </p>
            <p
              className="dropdown-item m-0"
              onClick={handleModalOpening}
              data-toggle="modal"
              data-target={openModal}
            >
              <span>
                <i className="fa-solid fa-pen-to-square text-success pr-2 font-size-12"></i>
              </span>
              EDIT
            </p>
            <p className="dropdown-item m-0">
              <span>
                <i className="fa-solid fa-plus text-primary pr-2 font-size-12"></i>
              </span>
              ADD
            </p>
          </>
        )}
        {(action === "enroute" || action === "additional") && (
          <>
            <p className="dropdown-item m-0">
              <span>
                <i className="fa-solid fa-trash font-size-12 text-danger pr-2"></i>
              </span>
              DELETE
            </p>
            <p
              className="dropdown-item m-0"
              onClick={handleModalOpening}
              data-toggle="modal"
              data-target={openModal}
            >
              <span>
                <i className="fa-solid fa-pen-to-square text-success pr-2 font-size-12"></i>
              </span>
              EDIT
            </p>
          </>
        )}
        {action === "guide" && (
          <>
            <p className="dropdown-item m-0">
              <span>
                <i className="fa-solid fa-trash font-size-12 text-danger pr-2"></i>
              </span>
              DELETE
            </p>
            <p
              className="dropdown-item m-0"
              data-toggle="modal"
              data-target="#guideModal"
            >
              <span>
                <i className="fa-solid fa-pen-to-square text-success pr-2 font-size-12"></i>
              </span>
              EDIT
            </p>
          </>
        )}
        {action === "restaurant" && (
          <>
            <p className="dropdown-item m-0">
              <span>
                <i className="fa-solid fa-trash font-size-12 text-danger pr-2"></i>
              </span>
              DELETE
            </p>
            <p
              className="dropdown-item m-0"
              data-toggle="modal"
              data-target="#restaurantModal"
            >
              <span>
                <i className="fa-solid fa-pen-to-square text-success pr-2 font-size-12"></i>
              </span>
              EDIT
            </p>
            <p
              className="dropdown-item m-0"
              data-toggle="modal"
              data-target=".restaurant-supplement"
            >
              <span>
                <i className="fa-solid fa-bed font-size-12 text-danger pr-2"></i>
              </span>
              SUPPLEMENT
            </p>
            <p
              className="dropdown-item m-0"
              data-toggle="modal"
              data-target="#restaurantTimeModal"
            >
              <span>
                <i className="fa-solid fa-hourglass-start text-success pr-2 font-size-12"></i>
              </span>
              TIMING
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default ActionDropdown;
