import { useState } from "react";
import styles from "./index.module.css";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import Hotel from "../itinerary-hotelThird/index";
import Monument1 from "../itinerary-monumentThird/index1";
import Guide from "../itinerary-guideThird/index";
import Activity from "../itinerary-activityThird/index";
import Additional from "../itinerary-additionalServiceThird/index";
import Transport from "../itinerary-transportThird/index";
import Flight from "../itinerary-flighThird/index";
import Train from "../itinerary-trainThird/index";
import RestauarantIcon from "../itinerary-restaurantThird/index";
import HotelIcon from "../../../../../../public/assets/quotation-third/iconHotel.svg";
import MonumentIcon from "../../../../../../public/assets/quotation-third/iconsMonument.svg";
import GuideIcon from "../../../../../images/itinerary/guide.svg";
import AdobeIcon from "../../../../../../public/assets/quotation-third/iconAdobeStock.svg";
import RoutineIcon from "../../../../../../public/assets/quotation-third/morning-routine.svg";
import ReataurantIcon from "../../../../../../public/assets/quotation-third/icons8-restaurant.svg";
import TrainIcon from "../../../../../../public/assets/quotation-third/iconTrain.svg";
import FlightIcon from "../../../../../../public/assets/quotation-third/icons8-flight.svg";
import AddIcon from "../../../../../../public/assets/quotation-third/addIcon.svg";

const svgArray = [
  { icon: HotelIcon, name: "Hotel" },
  { icon: MonumentIcon, name: "Monument" },
  { icon: GuideIcon, name: "Guide" },
  { icon: AdobeIcon, name: "Transport" },
  { icon: RoutineIcon, name: "Activity" },
  { icon: ReataurantIcon, name: "Restaurant" },
  { icon: TrainIcon, name: "Train" },
  { icon: FlightIcon, name: "Flight" },
  { icon: AddIcon, name: "Additional" }
];

const componentMap = {
  0: <Hotel />,
  1: <Monument1 />,
  2: <Guide />,
  3: <Transport />,
  4: <Activity />,
  5: <RestauarantIcon />,
  6: <Train />,
  7: <Flight />,
  8: <Additional />
};

const SortableItem = ({ id, Component, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "10px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    position:"relative"
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{flex:"none",width:"100%"}}>{Component}</div>
      <div style={{ display: "flex", gap: "8px",paddingTop:"16px",alignItems:"start",position:"absolute",top:0,right:"10px" }}>
        <button {...listeners} {...attributes} style={{ cursor: "grab", background: "#4caf50", color: "white", border: "none", padding: "2px 6px", borderRadius: "4px", fontSize: "0.7rem" }}>☰</button>
        <button onClick={onDelete} style={{ background: "rgb(226, 52, 40)", color: "white", border: "none", padding: "2px 6px", borderRadius: "4px",fontSize: "0.7rem" }}>✕</button>
      </div>
    </div>
  );
};

const Index = () => {
  const [openDays, setOpenDays] = useState(["Day 1"]);
  const [dayComponents, setDayComponents] = useState({
    "Day 1": [{ id: "hotel-default", component: <Hotel /> }],
    "Day 2": [{ id: "hotel-default", component: <Hotel /> }],
    "Day 3": [{ id: "hotel-default", component: <Hotel /> }],
    "Day 4": [{ id: "hotel-default", component: <Hotel /> }],
    "Day 5": [{ id: "hotel-default", component: <Hotel /> }],
    "Day 6": [{ id: "hotel-default", component: <Hotel /> }]
  });

  const toggleDay = (day) => {
    setOpenDays(openDays.includes(day) ? openDays.filter(d => d !== day) : [...openDays, day]);
  };

  const handleIconClick = (e, dayName, index) => {
    e.stopPropagation();
    const selectedComponent = componentMap[index];
    if (selectedComponent) {
      setDayComponents(prev => ({
        ...prev,
        [dayName]: [...prev[dayName], { id: `${dayName}-${Date.now()}-${index}`, component: selectedComponent }]
      }));
    }
  };

  const handleRemoveComponent = (dayName, id) => {
    setDayComponents(prev => ({
      ...prev,
      [dayName]: prev[dayName].filter(item => item.id !== id)
    }));
  };

  const handleDragEnd = (event, dayName) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const updatedComponents = [...dayComponents[dayName]];
      const oldIndex = updatedComponents.findIndex(item => item.id === active.id);
      const newIndex = updatedComponents.findIndex(item => item.id === over.id);

      setDayComponents(prev => ({
        ...prev,
        [dayName]: arrayMove(updatedComponents, oldIndex, newIndex)
      }));
    }
  };

  return (
    <ul className={styles.accordionContainer}>
      {Object.keys(dayComponents).map((day, dayIdx) => (
        <li className={styles.accordionItem} key={dayIdx}>
          <div className={styles.accordionHeader} onClick={() => toggleDay(day)}>
            <div className={styles.accordionHeading}>
              <span className={styles.accordionText}>{day}</span>
              <div className={styles.accordionIconWrap}>
                {svgArray.map((element, index) => (
                  <OverlayTrigger overlay={<Tooltip>{element.name}</Tooltip>} key={index}>
                    <span
                      onClick={(e) => handleIconClick(e, day, index)}
                      className={styles.accordionIcon}
                    >
                      <img src={element.icon} alt={element.name} />
                    </span>
                  </OverlayTrigger>
                ))}
              </div>
            </div>
            <span className={`${styles.arrow} ${openDays.includes(day) ? "rotate" : ""}`}>
            {!openDays.includes("Day 1") ? (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                className="text-primary"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 256C8 119 119 8 256 8s248 111 248 248-111 248-248 248S8 393 8 256zm231-113.9L103.5 277.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L256 226.9l101.6 101.6c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L273 142.1c-9.4-9.4-24.6-9.4-34 0z"></path>
              </svg>
            ) : (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                className="text-primary"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM273 369.9l135.5-135.5c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L256 285.1 154.4 183.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L239 369.9c9.4 9.4 24.6 9.4 34 0z"></path>
              </svg>
            )}
            </span>
          </div>

          {openDays.includes(day) && (
            <div className={styles.accordionContent}>
              <DndContext onDragEnd={(event) => handleDragEnd(event, day)}>
                <SortableContext
                  items={dayComponents[day].map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {dayComponents[day].map((item) => (
                    <SortableItem
                      key={item.id}
                      id={item.id}
                      Component={item.component}
                      onDelete={() => handleRemoveComponent(day, item.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Index;
