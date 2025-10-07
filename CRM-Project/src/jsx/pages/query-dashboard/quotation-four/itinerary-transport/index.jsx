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
      data: {
        text: item.text,
        type: item.type === "transport" ? "transport" : "",
      },
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
  const [transportData, setTransportData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 20; // Number of items per page

  const fetchTransportData = async (
    page = 1,
    query = "",
    selectedDestinationId = ""
  ) => {
    try {
      setIsLoading(true);
      const { data } = await axiosOther.post("transportmasterlist", {
        ServiceName: query,
        id: "",
        Status: "",
        DestinationId: selectedDestinationId || "",
        TransferType: "",
        // Destination: states,
        // HotelCategoryId: "",
        page: page,
        perPage: perPage,
      });

      console.log(data, "lksdafjlsdkj");

      // if (data?.Status === 0) {
      //   setTransportData("No data available");
      //   return;
      // }

      const newData =
        data?.DataList?.map((transport, index) => ({
          id: `transport-${page}-${index}`,
          text: `${transport?.id}-${transport.Name}`,
          color: getColorForIndex((page - 1) * perPage + index),
          type: "transport",
        })) || [];

      if (page === 1) {
        setTransportData(newData); // overwrite on new search
      } else {
        setTransportData((prev) => [...prev, ...newData]);
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
  //   fetchTransportData(currentPage);
  // }, [currentPage]);

  // Fetch transport when selectedDestinationId changes
  useEffect(() => {
    setCurrentPage(1);
    if (selectedDestinationId) {
      fetchTransportData(1, searchQuery, selectedDestinationId);
    }
  }, [selectedDestinationId]);

  useEffect(() => {
    if (searchClicked) {
      setCurrentPage(1); // reset page
      fetchTransportData(1, searchQuery); // ✅ pass query
      setSearchClicked(false);
    }
  }, [searchClicked, selectedDestinationId]);

  const loadMoreData = () => {
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchTransportData(nextPage, searchQuery); // ✅ carry search forward
    }
  };

  return (
    <InfiniteScroll
      dataLength={transportData.length}
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
          ) : transportData.length > 0 ? (
            transportData.map((tag, index) => (
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
//     { text: "Private AC Sedan Car", color: "cyan", type: "transport" },
//     { text: "SUV for Hill Travel", color: "orange", type: "transport" },
//     { text: "Tempo Traveller – 12 Seater", color: "magenta", type: "transport" },
//     { text: "Luxury AC Coach – 40 Seater", color: "green", type: "transport" },
//     { text: "Electric Auto for Local Ride", color: "cyan", type: "transport" },
//     { text: "Jeep Safari Vehicle", color: "orange", type: "transport" },
//     { text: "Boat Transfer – Kerala Backwaters", color: "magenta", type: "transport" },
//     { text: "Camel Cart in Desert", color: "green", type: "transport" },
//     { text: "Vintage Car for City Tour", color: "cyan", type: "transport" },
//     { text: "Shared AC Bus", color: "orange", type: "transport" },
//     { text: "Bicycle Rentals", color: "magenta", type: "transport" },
//     { text: "Rickshaw Ride – Old Delhi", color: "green", type: "transport" },
//     { text: "Luxury Caravan", color: "cyan", type: "transport" },
//     { text: "Shikara in Kashmir", color: "orange", type: "transport" },
//     { text: "Electric Tempo for Groups", color: "magenta", type: "transport" },
//     { text: "Horse Cart – Heritage Sites", color: "green", type: "transport" },
//     { text: "Trolley Service – Hill Stations", color: "cyan", type: "transport" },
//     { text: "Scooty for Local Exploration", color: "orange", type: "transport" },
//     { text: "Cable Car Ticket", color: "magenta", type: "transport" },
//     { text: "Helicopter Transfer", color: "green", type: "transport" },
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
//         data: { text: item.text, type: item.type === "transport" ? "transport" : "hotels" },
//     });

//     const style = {
//     transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
//     ...getColorStyle(item.color),
//     cursor: editMode ? "grab" : "default",
//     userSelect: "none",
//     opacity: isDragging ? 0.5 : 1, // Visual feedback
//     zIndex: isDragging ? 9999 : "auto", // ✅ z-index on drag
//   };

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
