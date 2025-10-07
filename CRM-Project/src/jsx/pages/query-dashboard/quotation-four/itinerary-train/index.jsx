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
      data: { text: item.text, type: item.type === "train" ? "train" : "" },
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
  const [trainData, setTrainData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 20; // Number of items per page

  const fetchTrainData = async (
    page = 1,
    query = "",
    selectedDestinationId = ""
  ) => {
    try {
      setIsLoading(true);
      const { data } = await axiosOther.post("trainMasterlist", {
        // ServiceName: query,
        // id: "",
        // Status: "",
        // DestinationId: "",
        // page: page,
        // perPage: perPage,
      });

      console.log(data, "lksdafjlsdkj");

      const newData =
        data?.DataList?.map((train, index) => ({
          id: `train-${page}-${index}`,
          text: `${train.id}-${train.Name}`,
          color: getColorForIndex((page - 1) * perPage + index),
          type: "train",
        })) || [];

      if (page === 1) {
        setTrainData(newData); // overwrite on new search
      } else {
        setTrainData((prev) => [...prev, ...newData]);
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
  //   fetchTrainData(currentPage);
  // }, [currentPage]);

  // Fetch train when selectedDestinationId changes
  useEffect(() => {
    setCurrentPage(1); // Reset page on destination change
    fetchTrainData(1, searchQuery, selectedDestinationId);
  }, [selectedDestinationId]);

  useEffect(() => {
    if (searchClicked) {
      setCurrentPage(1); // reset page
      fetchTrainData(1, searchQuery); // ✅ pass query
      setSearchClicked(false);
    }
  }, [searchClicked, selectedDestinationId]);

  const loadMoreData = () => {
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchTrainData(nextPage, searchQuery); // ✅ carry search forward
    }
  };

  return (
    <InfiniteScroll
      dataLength={trainData.length}
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
          ) : trainData.length > 0 ? (
            trainData.map((tag, index) => (
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
//     { text: "Rajdhani Express – DEL to BCT", color: "cyan", type: "train" },
//     { text: "Shatabdi Express – LKO to NDLS", color: "magenta", type: "train" },
//     { text: "Vande Bharat – BPL to JBP", color: "orange", type: "train" },
//     { text: "Duronto Express – HWH to MAS", color: "green", type: "train" },
//     { text: "Toy Train – Kalka to Shimla", color: "cyan", type: "train" },
//     { text: "First AC with Meals", color: "green", type: "train" },
//     { text: "Luxury Palace on Wheels", color: "magenta", type: "train" },
//     { text: "Sleeper Class – Budget Option", color: "orange", type: "train" },
//     { text: "Overnight Train with Berth", color: "cyan", type: "train" },
//     { text: "Morning Local Train", color: "magenta", type: "train" },
//     { text: "Heritage Railway Ride", color: "green", type: "train" },
//     { text: "High-Speed Express", color: "orange", type: "train" },
//     { text: "Train Ticket Assistance", color: "cyan", type: "train" },
//     { text: "AC Chair Car Booking", color: "magenta", type: "train" },
//     { text: "Reserved Group Berths", color: "orange", type: "train" },
//     { text: "Pantry Car Available", color: "green", type: "train" },
//     { text: "2nd AC Mid-night Train", color: "cyan", type: "train" },
//     { text: "Window Side Seat", color: "magenta", type: "train" },
//     { text: "Onboard Bedding Provided", color: "green", type: "train" },
//     { text: "E-Ticket & SMS Confirmation", color: "orange", type: "train" },
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
//         data: { text: item.text, type: item.type === "train" ? "train" : "hotels" },
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
