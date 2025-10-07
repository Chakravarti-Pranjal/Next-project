import React, { useState } from "react";
import data from "../quotationdata";
import { quotationLabel } from "../quotationdata";
// import ActivityImg from "/global_assets/images/qoutation/activity.png";
import ActionDropdown from "./ActionDropdown";
import ItenarayModal from "./ItenarayModal";
import Hotel from "./ModalForm/Hotel";
import Activity from "./ModalForm/Activity";
import Monument from "./ModalForm/Monument";
import Guide from "./ModalForm/Guide";
import Departure from "./ModalForm/Departure";
import Arrival from "./ModalForm/Arrival";
import Restaurant from "./ModalForm/Restaurant";
import Train from "./ModalForm/Train";
import Transfer from "./ModalForm/Transfer";
import Transportation from "./ModalForm/Transportation";
import HotelMeal from "./ModalForm/HotelMeal";
import DepartureTime from "./ModalForm/DepartureTime";
import ArrivalTime from "./ModalForm/ArrivalTime";
import MonumentTime from "./ModalForm/MonumentTime";
import ActivityTime from "./ModalForm/ActivityTime";
import RestaurantTime from "./ModalForm/RestaurantTime";
import TrainTime from "./ModalForm/TrainTime";
import HotelRoomSupplement from "./ModalForm/HotelRoomSupplement";
import RestaurantSuppliment from "./ModalForm/RestaurantSuppliment";

const DayWiseItinerary = ({ dayWiseData }) => {
  const [serviceList, setServiceList] = useState(data);
  const [activeCard, setActiveCard] = useState(null);

  console.log('day-wise-itinararies', dayWiseData);

  const handleDropServiceCard = (position) => {
    // console.log(`${activeCard} is going to place at the ${position}`);

    if (activeCard == null || activeCard === undefined) return null;

    const serviceToMove = serviceList[activeCard];

    const updatedService = serviceList.filter(
      (service, index) => index != activeCard
    );
    updatedService.splice(position, 0, { ...serviceToMove });
    setServiceList(updatedService);
  };

  return (
    <div className="col-12 col-lg-10">
      <div className="light-primary-bg mt-2 d-inline-block px-1 rounded">
        <p className="m-0 font-size-12 font-weight-medium">{`Day ${dayWiseData?.Day} | ${dayWiseData?.DestinationName} | ${dayWiseData?.DayTotal}`}</p>
      </div>
      <div className="col-12 border mt-1 p-0 ">
        <p className="border-bottom m-0 px-1 font-size-12 font-weight-bold">
          First Day Delhi
        </p>
        <p className="font-size-12 px-1 py-1 m-0 font-weight-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
          eaque dolorum ducimus ut quis, repellendus magni maiores officiis esse
          in, quaerat doloremque? Distinctio totam sit corrupti corporis
          voluptas vero quis itaque inventore in. Tenetur ad praesentium quasi
          dolores? Dolore ex iure, velit sed impedit eaque unde est a, ut nihil
          consectetur! Ratione dicta ullam molestiae dolor quis totam enim esse
          adipisci
        </p>
      </div>
      <div className="col-12 p-0 mt-2 gap-1">
        {dayWiseData?.DayServices?.map((Servicevalue, index) => {
          return (
            <div
              key={index + 1}
              className="row border-bottom row-gap-1 service-drag-card grab-cursor"
              draggable
              onDragStart={() => setActiveCard(index)}
              onDrop={() => handleDropServiceCard(index)}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="col-md-1 col-12 p-0">
                <div className="row">
                  <div className="col-12 d-flex flex-column align-items-md-center">
                    <p className="font-weight-bold font-size-11 m-0">
                      {Servicevalue?.ServiceType}
                    </p>
                    <img className="icon-img" src={ActivityImg} alt="arrival" />
                  </div>
                </div>
              </div>
              <div className="col-10 d-flex  flex-column gap-1 py-0">
                <div className="row">
                  {quotationLabel
                    .filter(
                      (labelValue) =>
                        labelValue?.ServiceType?.toLowerCase() ==
                        Servicevalue?.ServiceType?.toLowerCase()
                    )[0]
                    ?.Label?.map((label, index) => {
                      return (
                        <div className="col-md col-sm-3 col-6" key={index}>
                          <p className="font-size-10 text-secondary text-flow m-0">
                            {label}
                          </p>
                        </div>
                      );
                    })}
                </div>
                {Servicevalue?.ServiceDetails?.map((item, index) => {
                  return (
                    <div key={index}>
                      {Servicevalue?.ServiceType?.toLowerCase() == "hotel" && (
                        <div className="row" key={Servicevalue?.ServiceType}>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow m-0">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow m-0">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow m-0">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow m-0">
                              {item?.ItemName}
                            </p>
                          </div>
                        </div>
                      )}
                      {Servicevalue?.ServiceType?.toLowerCase() ==
                        "arrival" && (
                        <div className="row" key={Servicevalue?.ServiceType}>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                        </div>
                      )}
                      {Servicevalue?.ServiceType?.toLowerCase() ==
                        "departure" && (
                        <div className="row" key={Servicevalue?.ServiceType}>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                        </div>
                      )}
                      {Servicevalue?.ServiceType?.toLowerCase() ==
                        "monument" && (
                        <div className="row" key={Servicevalue?.ServiceType}>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                        </div>
                      )}
                      {Servicevalue?.ServiceType?.toLowerCase() ==
                        "activity" && (
                        <div className="row" key={Servicevalue?.ServiceType}>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                        </div>
                      )}
                      {Servicevalue?.ServiceType?.toLowerCase() == "guide" && (
                        <div className="row" key={Servicevalue?.ServiceType}>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                        </div>
                      )}
                      {Servicevalue?.ServiceType?.toLowerCase() ==
                        "restaurant" && (
                        <div className="row" key={Servicevalue?.ServiceType}>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                        </div>
                      )}
                      {Servicevalue?.ServiceType?.toLowerCase() ==
                        "transportation" && (
                        <div className="row" key={Servicevalue?.ServiceType}>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                        </div>
                      )}
                      {Servicevalue?.ServiceType?.toLowerCase() == "train" && (
                        <div className="row" key={Servicevalue?.ServiceType}>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                        </div>
                      )}
                      {Servicevalue?.ServiceType?.toLowerCase() ==
                        "enroute" && (
                        <div className="row" key={Servicevalue?.ServiceType}>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                        </div>
                      )}
                      {Servicevalue?.ServiceType?.toLowerCase() ==
                        "transfer" && (
                        <div className="row" key={Servicevalue?.ServiceType}>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                        </div>
                      )}
                      {Servicevalue?.ServiceType?.toLowerCase() ==
                        "itenarary" && (
                        <div className="row" key={Servicevalue?.ServiceType}>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                          <div className="col-md col-sm-3 col-6">
                            <p className="font-size-10 font-weight-bold text-flow">
                              {item?.ItemName}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="col-1 py-0">
                <div className="row cursor-pointer">
                  <div className="col pr-0 d-flex justify-content-md-end">
                    <div className="d-flex flex-column">
                      <p className="font-size-10 font-weight-bold m-0">
                        Action
                      </p>
                      <p
                        className="m-0 text-center bg-primary rounded"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="fa-solid fa-hand-pointer text-light"></i>
                      </p>
                      <div
                        className="dropdown-menu dropdown-menu-left"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <ActionDropdown
                          action={Servicevalue?.ServiceType?.toLowerCase()}
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" p-0 my-1 d-flex justify-content-md-end width-30px">
                    <div className="d-flex flex-column bg-primary vertical-text p-0 py-1">
                      DRAG
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ItenarayModal tabId={"hotelModal"}>
        <Hotel />
      </ItenarayModal>
      <ItenarayModal tabId={"activityModal"}>
        <Activity />
      </ItenarayModal>
      <ItenarayModal tabId={"monumentModal"}>
        <Monument />
      </ItenarayModal>
      <ItenarayModal tabId={"guideModal"}>
        <Guide />
      </ItenarayModal>
      <ItenarayModal tabId={"departureModal"}>
        <Departure />
      </ItenarayModal>
      <ItenarayModal tabId={"arrivalModal"}>
        <Arrival />
      </ItenarayModal>
      <ItenarayModal tabId={"restaurantModal"}>
        <Restaurant />
      </ItenarayModal>
      <ItenarayModal tabId={"transferModal"}>
        <Transfer />
      </ItenarayModal>
      <ItenarayModal tabId={"transportationModal"}>
        <Transportation />
      </ItenarayModal>
      <ItenarayModal tabId={"trainModal"}>
        <Train />
      </ItenarayModal>
      <ItenarayModal tabId={"enrouteModal"}>
        <Monument />
      </ItenarayModal>
      <ItenarayModal tabId={"additionalModal"}>
        <Monument />
      </ItenarayModal>
      <ItenarayModal tabId={"hotelMealModal"}>
        <HotelMeal />
      </ItenarayModal>
      <ItenarayModal tabId={"departureTimeModal"}>
        <DepartureTime />
      </ItenarayModal>
      <ItenarayModal tabId={"arrivalTimeModal"}>
        <ArrivalTime />
      </ItenarayModal>
      <ItenarayModal tabId={"monumentTimeModal"}>
        <MonumentTime />
      </ItenarayModal>
      <ItenarayModal tabId={"activityTimeModal"}>
        <ActivityTime />
      </ItenarayModal>
      <ItenarayModal tabId={"restaurantTimeModal"}>
        <RestaurantTime />
      </ItenarayModal>
      <ItenarayModal tabId={"trainTimeModal"}>
        <TrainTime />
      </ItenarayModal>
      <HotelRoomSupplement />
      <RestaurantSuppliment />
    </div>
  );
};

export default DayWiseItinerary;
