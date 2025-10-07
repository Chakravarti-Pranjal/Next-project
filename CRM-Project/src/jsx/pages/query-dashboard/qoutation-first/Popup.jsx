import React, { useContext, useState } from "react";
import QoutationModal from "./QoutationModal";
import HotelModal from "./quotationForm/HotelModal";
import ItineraryModal from "./quotationForm/ItinerarayModal";
import TransferModal from "./quotationForm/TransferModal";
import MonumentModal from "./quotationForm/MonumnetModal";
import EnrouteModal from "./quotationForm/EnrouteModal";
import RestaurantModal from "./quotationForm/RestaurantModal";
import ActivityModal from "./quotationForm/ActivityModal";
import GuideModal from "./quotationForm/GuideModal";
import TransportationModal from "./quotationForm/TransportationModal";
import TrainModal from "./quotationForm/TrainModal";
import AddonsModal from "./quotationForm/AddonsModal";
import FlightModal from "./quotationForm/FlightModal";

const Popup = () => {
  const [transportationModal, setTransportationModal] = useState(false);
  const [restaurantModal, setRestaurantModal] = useState(false);
  const [itineraryModal, setItineraryModal] = useState(false);
  const [monumentModal, setMonumentModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [activityModal, setActivityModal] = useState(false);
  const [enrouteModal, setEnrouteModal] = useState(false);
  const [trainsModal, setTrainsModal] = useState(false);
  const [flightModal, setFlightModal] = useState(false);
  const [addonsModal, setAddonsModal] = useState(false);
  const [hotelModal, setHotelModal] = useState(false);
  const [guideModal, setGuideModal] = useState(false);

  // console.log('basicModal', basicModal)

  return (
    <div className="col-12 p-0 mt-2">
      <div className="row justify-content-center">
        <div className="col-12 border rounded-pill shadow sticky py-3">
          <div className="row py-1">
            {/* itenarary info */}
            <div
              className="col d-flex flex-column align-items-center pt-1"
              variant="primary"
              onClick={() => setItineraryModal(true)}
            >
              <img
                className="image-hw cursor-pointer"
                src="\assets\qoutation\itenary.png"
                alt="activity"
              />
              <span className="span-font-size cursor-pointer">
                Itenary Info
              </span>
            </div>
            {/* Flight */}
            <div
              className="col d-flex flex-column align-items-center pt-1"
              variant="primary"
              onClick={() => setFlightModal(true)}
            >
              <img
                className="image-hw cursor-pointer"
                src="\assets\qoutation\flight.png"
                alt="activity"
              />
              <span className="span-font-size cursor-pointer">Flight</span>
            </div>
            {/* hotel */}
            <div
              className="col d-flex flex-column align-items-center pt-1"
              variant="primary"
              onClick={() => setHotelModal(true)}
            >
              <img
                className="image-hw cursor-pointer"
                src="\assets\qoutation\hotel.png"
                alt="activity"
              />
              <span className="span-font-size cursor-pointer">Hotel</span>
            </div>
            {/* transfer */}
            <div
              className="col d-flex flex-column align-items-center pt-1"
              variant="primary"
              onClick={() => setTransferModal(true)}
            >
              <img
                className="image-hw cursor-pointer"
                src="\assets\qoutation\transfer.png"
                alt="activity"
              />
              <span className="span-font-size cursor-pointer">Transfer</span>
            </div>
            {/* monument */}
            <div
              className="col d-flex flex-column align-items-center pt-1"
              variant="primary"
              onClick={() => setMonumentModal(true)}
            >
              <img
                className="image-hw cursor-pointer"
                src="\assets\qoutation\monument.png"
                alt="activity"
              />
              <span className="span-font-size cursor-pointer">Monument</span>
            </div>
            {/* enroute */}
            <div
              className="col d-flex flex-column align-items-center pt-1"
              variant="primary"
              onClick={() => setEnrouteModal(true)}
            >
              <img
                className="image-hw cursor-pointer"
                src="\assets\qoutation\enroute.png"
                alt="activity"
              />
              <span className="span-font-size cursor-pointer">Enroute</span>
            </div>
            {/* restaurant */}
            <div
              className="col d-flex flex-column align-items-center pt-1"
              variant="primary"
              onClick={() => setRestaurantModal(true)}
            >
              <img
                className="image-hw cursor-pointer"
                src="\assets\qoutation\restaurant.png"
                alt="activity"
              />
              <span className="span-font-size cursor-pointer">Restaurant</span>
            </div>
            {/* activity */}
            <div
              className="col d-flex flex-column align-items-center pt-1"
              variant="primary"
              onClick={() => setActivityModal(true)}
            >
              <img
                className="image-hw cursor-pointer"
                src="\assets\qoutation\activity.png"
                alt="activity"
              />
              <span className="span-font-size  cursor-pointer">Activity</span>
            </div>
            {/* guide */}
            <div
              className="col d-flex flex-column align-items-center pt-1"
              variant="primary"
              onClick={() => setGuideModal(true)}
            >
              <img
                className="image-hw cursor-pointer"
                src="\assets\qoutation\guide.png"
                alt="activity"
              />
              <span className="span-font-size cursor-pointer">Guide</span>
            </div>
            {/* transportation */}
            <div
              className="col d-flex flex-column align-items-center pt-1"
              variant="primary"
              onClick={() => setGuideModal(true)}
            >
              <img
                className="image-hw cursor-pointer"
                src="\assets\qoutation\transportation.png"
                alt="activity"
              />
              <span className="span-font-size cursor-pointer">
                Tranportation
              </span>
            </div>
            {/* trains */}
            <div
              className="col d-flex flex-column align-items-center pt-1"
              variant="primary"
              onClick={() => setTrainsModal(true)}
            >
              <img
                className="image-hw cursor-pointer"
                src="\assets\qoutation\train.png"
                alt="activity"
              />
              <span className="span-font-size cursor-pointer">Trains</span>
            </div>
            {/* add ons */}
            <div
              className="col d-flex flex-column align-items-center pt-1"
              variant="primary"
              onClick={() => setAddonsModal(true)}
            >
              <img
                className="image-hw cursor-pointer"
                src="\assets\qoutation\add.png"
                alt="activity"
              />
              <span className="span-font-size cursor-pointer">Add Ons</span>
            </div>
          </div>
        </div>

        {/* all modals */}
        <QoutationModal
          basicModal={itineraryModal}
          setBasicModal={setItineraryModal}
          Title="Itinerary Title"
        >
          <ItineraryModal />
        </QoutationModal>
        <QoutationModal
          basicModal={flightModal}
          setBasicModal={setFlightModal}
          Title="Flight Title"
        >
          <FlightModal />
        </QoutationModal>
        <QoutationModal
          basicModal={hotelModal}
          setBasicModal={setHotelModal}
          Title="Guest Hotel | Thu 22 Aug 2024  |  Pax Type: FIT"
        >
          <HotelModal />
        </QoutationModal>
        <QoutationModal
          basicModal={transferModal}
          setBasicModal={setTransferModal}
          Title="Transfer Title"
        >
          <TransferModal />
        </QoutationModal>
        <QoutationModal
          basicModal={monumentModal}
          setBasicModal={setMonumentModal}
          Title="Monument"
        >
          <MonumentModal />
        </QoutationModal>
        <QoutationModal
          basicModal={enrouteModal}
          setBasicModal={setEnrouteModal}
          Title="Enroute"
        >
          <EnrouteModal />
        </QoutationModal>
        <QoutationModal
          basicModal={restaurantModal}
          setBasicModal={setRestaurantModal}
          Title="Restaurant"
        >
          <RestaurantModal />
        </QoutationModal>
        <QoutationModal
          basicModal={activityModal}
          setBasicModal={setActivityModal}
          Title="Activity | Experiences | Thu 22 Aug 2024 "
        >
          <ActivityModal />
        </QoutationModal>
        <QoutationModal
          basicModal={guideModal}
          setBasicModal={setGuideModal}
          Title="Guide | Fri 23 Aug 2024 "
        >
          <GuideModal />
        </QoutationModal>
        <QoutationModal
          basicModal={transportationModal}
          setBasicModal={setTransportationModal}
          Title="Transportation"
        >
          <TransportationModal />
        </QoutationModal>
        <QoutationModal
          basicModal={trainsModal}
          setBasicModal={setTrainsModal}
          Title="Train"
        >
          <TrainModal />
        </QoutationModal>
        <QoutationModal
          basicModal={addonsModal}
          setBasicModal={setAddonsModal}
          Title="Add Ons Title"
        >
          <AddonsModal />
        </QoutationModal>
      </div>
    </div>
  );
};

export default Popup;
