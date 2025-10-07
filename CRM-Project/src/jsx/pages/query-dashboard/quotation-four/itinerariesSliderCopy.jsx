import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import RightNewArrow from "../../../../images/quotationFour/rightNewArrow.svg";
import LeftNewArrow from "../../../../images/quotationFour/leftNewArrow.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ItinerariesDayBox from "./ItinerariesDayBox";
import { useSelector } from "react-redux";

const CustomArrow = ({ onClick, direction, disabled }) => (
  <button
    onClick={onClick}
    className="sliderButtons"
    disabled={disabled}
    style={{
      border: "none",
      background: "transparent",
      position: "absolute",
      transform: "translateY(-50%)",
      padding: "2px",
      top: "50%",
      [direction === "left" ? "left" : "right"]: "-20px",
      zIndex: 2,
      opacity: disabled ? 0.4 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
    }}
  >
    {direction === "left" ? (
      <img src={LeftNewArrow} alt="LeftNewArrow" />
    ) : (
      <img src={RightNewArrow} alt="RightNewArrow" />
    )}
  </button>
);

const ItinerarySlider = ({
  editMode,
  dayWiseFormValue,
  setDayWiseFormValue,
  setSelectedCard,
  selectedCard,
  setSelectedDestinationId,
  setSelectedRestaurantIcons,
  selectedRestaurantIcons,
  setSelectedIcons,
  selectedIcons,
  setEditMode,
  handleFinalSave,
}) => {
  const { queryQuotationData } = useSelector(
    (state) => state.queryQuotationFourReducer
  );

  const [dayWiseServiceName, setDayWiseServiceName] = useState([]);

  useEffect(() => {
    if (queryQuotationData?.length > 0) {
      const dayWiseData = queryQuotationData?.[0]?.Days?.map((list) => {
        return {
          DayUniqueId: list?.DayUniqueId,
          Days: list?.Day,
          DestinationName: list?.DestinationName,
          DestinationId: list?.DestinationId,
        };
      });
      console.log(dayWiseData, "dayWiseData");
      setDayWiseServiceName(dayWiseData);
    }
  }, [queryQuotationData]);

  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = queryQuotationData?.[0]?.Days?.length;
  console.log(totalSlides, "totalSlides", currentSlide);

  const settings = {
    dots: false,
    infinite: false,
    arrows: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: (
      <CustomArrow
        direction="right"
        disabled={currentSlide >= totalSlides - 4}
      />
    ),
    prevArrow: <CustomArrow direction="left" disabled={currentSlide === 0} />,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  // Handler to select a card
  const handleCardClick = (dayKey, destinationId) => {
    setSelectedCard(dayKey); // Set the selected card
    setSelectedDestinationId(destinationId); // Set the DestinationId
  };

  // Cancel handler
  const handleCancel = () => {
    setEditMode(false);
  };

  const handleNext = async () => {
    // await handleFinalSave();
    navigate("/query/quotation-four/final-qoutation");
  };

  return (
    <div
      className="container py-3 position-relative EditSlider"
      style={{ marginTop: "-50px" }}
    >
      <Slider {...settings}>
        {dayWiseFormValue.map((dayObj, idx) => {
          const [dayKey, dayData] = Object.entries(dayObj)[0];
          // Find the day information from queryQuotationData
          const dayInfo = queryQuotationData?.[0]?.Days?.find(
            (day) => day.DayUniqueId === dayKey
          );
          console.log(dayInfo, "dayKey");
          return (
            <div
              className={`p-2 custom-card ${
                selectedCard === dayKey ? "selectedCard" : ""
              }`}
              onClick={() => handleCardClick(dayKey, dayInfo?.DestinationId)} // Add click handler
              key={idx}
              style={{
                cursor: "pointer",
                border: selectedCard === dayKey ? "3px solid #008080" : "none", // Highlight selected card
              }}
            >
              <ItinerariesDayBox
                DayUniqueId={dayKey}
                data={dayData}
                setDayWiseFormValue={setDayWiseFormValue}
                editMode={editMode}
                dayWiseFormValue={dayWiseFormValue}
                setSelectedRestaurantIcons={setSelectedRestaurantIcons}
                selectedRestaurantIcons={selectedRestaurantIcons}
                setSelectedIcons={setSelectedIcons}
                selectedIcons={selectedIcons}
              />
            </div>
          );
        })}
      </Slider>
      <div className="d-flex align-items-center justify-content-end gap-2 mt-3">
        <button onClick={handleCancel} className="btn btn-dark btn-custom-size">
          Cancel
        </button>
        <button
          className="btn btn-primary btn-custom-size d-flex flex-shrink-0 flex-grow-0"
          onClick={() => handleNext()}
        >
          Next
          <i
            className="fa-solid fa-backward text-red bg-white p-1 rounded ms-1"
            style={{ transform: "rotate(180deg)" }}
          ></i>
        </button>
      </div>
    </div>
  );
};

export default ItinerarySlider;
