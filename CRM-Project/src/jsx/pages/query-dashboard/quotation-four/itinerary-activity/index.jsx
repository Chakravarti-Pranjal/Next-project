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
        type: item.type === "activity" ? "activity" : "",
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
  const [activityData, setActivityData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 20; // Number of items per page

  const fetchActivityData = async (
    page = 1,
    query = "",
    selectedDestinationId = ""
  ) => {
    try {
      setIsLoading(true);
      const { data } = await axiosOther.post("activitymasterlist", {
        ServiceName: query,
        id: "",
        Status: "",
        DestinationId: selectedDestinationId,
        page: page,
        perPage: perPage,
      });

      // console.log(data, "lksdafjlsdkj");

      const newData =
        data?.DataList?.map((activity, index) => ({
          id: `activity-${page}-${index}`,
          text: `${activity.id}-${activity.ServiceName}`,
          color: getColorForIndex((page - 1) * perPage + index),
          type: "activity",
        })) || [];

      if (page === 1) {
        setActivityData(newData); // overwrite on new search
      } else {
        setActivityData((prev) => [...prev, ...newData]);
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
  //   fetchActivityData(currentPage);
  // }, [currentPage]);

  // Fetch Activity when selectedDestinationId changes
  useEffect(() => {
    setCurrentPage(1);
    if (selectedDestinationId) {
      fetchActivityData(1, searchQuery, selectedDestinationId);
    }
  }, [selectedDestinationId]);

  useEffect(() => {
    if (searchClicked) {
      setCurrentPage(1); // reset page
      fetchActivityData(1, searchQuery); // ✅ pass query
      setSearchClicked(false);
    }
  }, [searchClicked, selectedDestinationId]);

  const loadMoreData = () => {
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchActivityData(nextPage, searchQuery); // ✅ carry search forward
    }
  };

  return (
    <InfiniteScroll
      dataLength={activityData.length}
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
          ) : activityData.length > 0 ? (
            activityData.map((tag, index) => (
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
//   { text: "Camel Ride in Jaisalmer", color: "orange", type: "activity" },
//   { text: "River Rafting in Rishikesh", color: "green", type: "activity" },
//   { text: "Hot Air Balloon in Jaipur", color: "magenta", type: "activity" },
//   { text: "Scuba Diving in Andaman", color: "cyan", type: "activity" },
//   { text: "Skiing in Gulmarg", color: "green", type: "activity" },
//   { text: "Trekking in Manali", color: "orange", type: "activity" },
//   { text: "Backwater Boating in Kerala", color: "magenta", type: "activity" },
//   { text: "Snorkeling at Havelock", color: "green", type: "activity" },
//   { text: "Paragliding in Bir Billing", color: "orange", type: "activity" },
//   { text: "Wildlife Safari in Ranthambhore", color: "magenta", type: "activity" },
//   { text: "Temple Visit & Puja Ceremony", color: "cyan", type: "activity" },
//   { text: "Cooking Class in Udaipur", color: "green", type: "activity" },
//   { text: "Art Workshop in Jaipur", color: "orange", type: "activity" },
//   { text: "Yoga Session by Ganga", color: "magenta", type: "activity" },
//   { text: "Street Food Walk in Delhi", color: "green", type: "activity" },
//   { text: "Spice Market Tour", color: "orange", type: "activity" },
//   { text: "Evening Cultural Dance Show", color: "magenta", type: "activity" },
//   { text: "Village Interaction Visit", color: "green", type: "activity" },
//   { text: "Ayurvedic Massage Session", color: "orange", type: "activity" },
//   { text: "Night Safari Experience", color: "magenta", type: "activity" },
//   { text: "Bicycle Tour through Old Town", color: "cyan", type: "activity" },
// ];

// const getColorStyle = (color) => {
//   const base = {
//     border: "1px solid",
//     borderRadius: "6px",
//     padding: "5px 10px",
//     fontSize: "14px",
//     whiteSpace: "nowrap",
//     display: "inline-block",
//   };

//   switch (color) {
//     case "cyan":
//       return { ...base, color: "#00ffff", borderColor: "#00ffff" };
//     case "orange":
//       return { ...base, color: "#ffa500", borderColor: "#ffa500" };
//     case "magenta":
//       return { ...base, color: "#ff00ff", borderColor: "#ff00ff" };
//     case "green":
//       return { ...base, color: "#00cc00", borderColor: "#00cc00" };
//     default:
//       return base;
//   }
// };

// const DraggableTag = ({ id, item, editMode }) => {
//   const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
//     id,
//     data: { text: item.text, type: item.type === "activity" ? "activity" : "hotels"  },
//   });

//   const style = {
//     transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
//     ...getColorStyle(item.color),
//     cursor: editMode ? "grab" : "default",
//     userSelect: "none",
//     opacity: isDragging ? 0.5 : 1, // Visual feedback
//     zIndex: isDragging ? 9999 : "auto", // ✅ z-index on drag
//   };

//   return editMode ? (
//     <span
//       ref={setNodeRef}
//       style={style}
//       {...listeners}
//       {...attributes}
//     >
//       {item.text}
//     </span>
//   ) : (
//     <span style={getColorStyle(item.color)}>{item.text}</span>
//   );
// };

// const Index = ({ editMode = true }) => {
//   return (
//     <div className="p-3 resizeableTagContainer">
//       <div className="d-flex flex-wrap justify-content-start gap-2">
//         {tagData.map((tag, index) => (
//           <DraggableTag key={index} id={`tag-${index}`} item={tag} editMode={editMode} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Index;
