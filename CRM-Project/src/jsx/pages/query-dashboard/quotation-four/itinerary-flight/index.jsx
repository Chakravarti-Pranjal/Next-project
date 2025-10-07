import React, { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDraggable } from "@dnd-kit/core";
import InfiniteScroll from "react-infinite-scroll-component";
import { axiosOther } from "../../../../../http/axios_base_url";
import { removeServiceId } from "../utils/helper.method";

// Function to assign colors to tags (cycling through a predefined list)
const getColorForIndex = (index) => {
  const colors = ["cyan", "orange", "magenta", "green"];
  return colors[index % colors.length];
};

// DraggableTag component
const DraggableTag = ({ id, item, editMode }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      // data: { text: item.text, type: item.type },
      data: { text: item.text, type: item.type === "flight" ? "flight" : "" },
    });

  const getColorStyle = (color) => {
    const base = {
      border: "1px solid",
      borderRadius: "6px",
      padding: "5px 10px",
      fontSize: "14px",
      whiteSpace: "nowrap",
      display: "inline-block",
    };

    switch (color) {
      case "cyan":
        return { ...base, color: "#00ffff", borderColor: "#00ffff" };
      case "orange":
        return { ...base, color: "#ffa500", borderColor: "#ffa500" };
      case "magenta":
        return { ...base, color: "#ff00ff", borderColor: "#ff00ff" };
      case "green":
        return { ...base, color: "#00cc00", borderColor: "#00cc00" };
      default:
        return base;
    }
  };

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    ...getColorStyle(item.color),
    cursor: editMode ? "grab" : "default",
    userSelect: "none",
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 9999 : "auto",
    width: isDragging ? "300px" : "",
  };

  return editMode ? (
    <span ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {removeServiceId(item.text)}
    </span>
  ) : (
    <span style={getColorStyle(item.color)}>{removeServiceId(item.text)}</span>
  );
};

const Index = ({
  editMode = true,
  searchQuery,
  searchClicked,
  setSearchClicked,
  selectedDestinationId,
}) => {
  const [flightData, setFlightData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 20; // Number of items per page

  const fetchFlightData = async (
    page = 1,
    query = "",
    selectedDestinationId = ""
  ) => {
    try {
      setIsLoading(true);
      const { data } = await axiosOther.post("airlinemasterlist", {
        // ServiceName: query,
        // id: "",
        // Status: "",
        // DestinationId: "",
        // page: page,
        // perPage: perPage,
      });

      console.log(data, "lksdafjlsdkj");

      const newData =
        data?.DataList?.map((flight, index) => ({
          id: `flight-${page}-${index}`,
          text: `${flight.id}-${flight.Name}`,
          color: getColorForIndex((page - 1) * perPage + index),
          type: "flight",
        })) || [];

      if (page === 1) {
        setFlightData(newData); // overwrite on new search
      } else {
        setFlightData((prev) => [...prev, ...newData]);
      }

      setTotalPages(data?.TotalPages || 1);
      setHasMore(page < (data?.TotalPages || 1));
    } catch (error) {
      console.error("Error fetching hotel list:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Initial fetch
  // useEffect(() => {
  //   fetchFlightData(currentPage);
  // }, [currentPage]);

  // Fetch flight when selectedDestinationId changes
  useEffect(() => {
    setCurrentPage(1); // Reset page on destination change
    fetchFlightData(1, searchQuery, selectedDestinationId);
  }, [selectedDestinationId]);

  useEffect(() => {
    if (searchClicked) {
      setCurrentPage(1); // reset page
      fetchFlightData(1, searchQuery); // ✅ pass query
      setSearchClicked(false);
    }
  }, [searchClicked, selectedDestinationId]);

  const loadMoreData = () => {
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchFlightData(nextPage, searchQuery); // ✅ carry search forward
    }
  };

  return (
    <InfiniteScroll
      dataLength={flightData.length}
      next={loadMoreData}
      hasMore={hasMore}
      // endMessage={<p style={{ textAlign: "center" }}>No more hotels to load</p>}
      scrollableTarget="scrollableDiv"
    >
      <PerfectScrollbar
        options={{
          suppressScrollX: true,
        }}
        id="scrollableDiv"
        className="p-3 resizeableTagContainer "
      >
        <div className="d-flex flex-wrap justify-content-start gap-2 ">
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : flightData.length > 0 ? (
            flightData.map((tag, index) => (
              <DraggableTag
                key={index}
                id={`tag-${index}`}
                item={tag}
                editMode={editMode}
              />
            ))
          ) : (
            <p style={{ width: "100%" }}>No data found</p>
          )}
        </div>
      </PerfectScrollbar>
    </InfiniteScroll>
  );
};

export default Index;

// import React from 'react';
// import PerfectScrollbar from "react-perfect-scrollbar";
// import { useDraggable } from "@dnd-kit/core";

// const tagData = [
//     { text: "Indigo – DEL to GOI", color: "cyan", type: "flight" },
//     { text: "Air India – BOM to DEL", color: "magenta", type: "flight" },
//     { text: "SpiceJet – HYD to BLR", color: "orange", type: "flight" },
//     { text: "Vistara – CCU to IXB", color: "green", type: "flight" },
//     { text: "GoFirst – DEL to SXR", color: "cyan", type: "flight" },
//     { text: "AirAsia – BLR to IXM", color: "magenta", type: "flight" },
//     { text: "Alliance Air – Local Hill Flights", color: "green", type: "flight" },
//     { text: "Charter Flight – Custom Route", color: "orange", type: "flight" },
//     { text: "Connecting Flight via Mumbai", color: "cyan", type: "flight" },
//     { text: "Early Morning Departure", color: "magenta", type: "flight" },
//     { text: "Evening Return Flight", color: "green", type: "flight" },
//     { text: "Mid-Day Business Class", color: "orange", type: "flight" },
//     { text: "Budget Airline Option", color: "cyan", type: "flight" },
//     { text: "One-Way Domestic Flight", color: "magenta", type: "flight" },
//     { text: "Round Trip Economy", color: "green", type: "flight" },
//     { text: "International Flight – DEL to DXB", color: "orange", type: "flight" },
//     { text: "Weekend Special Fare", color: "cyan", type: "flight" },
//     { text: "Flight with Meal Included", color: "magenta", type: "flight" },
//     { text: "Window Seat Booked", color: "green", type: "flight" },
//     { text: "Flight Change Assistance", color: "orange", type: "flight" },
// ];

// const getColorStyle = (color) => {
//     const base = {
//         border: "1px solid",
//         borderRadius: "6px",
//         padding: "5px 10px",
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//         display: "inline-block",
//     };

//     switch (color) {
//         case "cyan":
//             return { ...base, color: "#00ffff", borderColor: "#00ffff" };
//         case "orange":
//             return { ...base, color: "#ffa500", borderColor: "#ffa500" };
//         case "magenta":
//             return { ...base, color: "#ff00ff", borderColor: "#ff00ff" };
//         case "green":
//             return { ...base, color: "#00cc00", borderColor: "#00cc00" };
//         default:
//             return base;
//     }
// };

// const DraggableTag = ({ id, item, editMode }) => {
//     const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
//         id,
//         data: { text: item.text, type: item.type === "flight" ? "flight" : "hotels" },
//     });

//     const style = {
//         transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
//         ...getColorStyle(item.color),
//         cursor: editMode ? "grab" : "default",
//         userSelect: "none",
//         opacity: isDragging ? 0.5 : 1, // Visual feedback
//         zIndex: isDragging ? 9999 : "auto", // ✅ z-index on drag
//     };

//     return editMode ? (
//         <span
//             ref={setNodeRef}
//             style={style}
//             {...listeners}
//             {...attributes}
//         >
//             {item.text}
//         </span>
//     ) : (
//         <span style={getColorStyle(item.color)}>{item.text}</span>
//     );
// };

// const Index = ({ editMode = true }) => {
//     return (
//         <div className="p-3 resizeableTagContainer">
//             <div className="d-flex flex-wrap justify-content-start gap-2">
//                 {tagData.map((tag, index) => (
//                     <DraggableTag key={index} id={`tag-${index}`} item={tag} editMode={editMode} />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Index;
