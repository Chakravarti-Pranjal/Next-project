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
        type: item.type === "additional" ? "additional" : "",
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
  const [additionalData, setAdditionalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 20; // Number of items per page

  const fetchAdditionalData = async (
    page = 1,
    query = "",
    selectedDestinationId = ""
  ) => {
    try {
      setIsLoading(true);
      const { data } = await axiosOther.post(
        "additionalrequirementmasterlist",
        {
          // ServiceName: query,
          // id: "",
          // Status: "",
          // DestinationId: "",
          // page: page,
          // perPage: perPage,
        }
      );

      console.log(data, "lksdafjlsdkj");

      const newData =
        data?.DataList?.map((additional, index) => ({
          id: `additional-${page}-${index}`,
          text: `${additional.id}-${additional.Name}`,
          color: getColorForIndex((page - 1) * perPage + index),
          type: "additional",
        })) || [];

      if (page === 1) {
        setAdditionalData(newData); // overwrite on new search
      } else {
        setAdditionalData((prev) => [...prev, ...newData]);
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
  //   fetchAdditionalData(currentPage);
  // }, [currentPage]);

  // Fetch additional when selectedDestinationId changes
  useEffect(() => {
    setCurrentPage(1); // Reset page on destination change
    fetchAdditionalData(1, searchQuery, selectedDestinationId);
  }, [selectedDestinationId]);

  useEffect(() => {
    if (searchClicked) {
      setCurrentPage(1); // reset page
      fetchAdditionalData(1, searchQuery); // ✅ pass query
      setSearchClicked(false);
    }
  }, [searchClicked, selectedDestinationId]);

  const loadMoreData = () => {
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchAdditionalData(nextPage, searchQuery); // ✅ carry search forward
    }
  };

  return (
    <InfiniteScroll
      dataLength={additionalData.length}
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
          ) : additionalData.length > 0 ? (
            additionalData.map((tag, index) => (
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
//   { text: "Bottled Water Daily", color: "cyan", type: "additional" },
//   { text: "Travel Insurance", color: "orange", type: "additional" },
//   { text: "Toll Taxes & Parking", color: "green", type: "additional" },
//   { text: "Airport Meet & Greet", color: "magenta", type: "additional" },
//   { text: "Room Upgrade on Request", color: "cyan", type: "additional" },
//   { text: "Tour Coordinator Support", color: "orange", type: "additional" },
//   { text: "Wheelchair Assistance", color: "green", type: "additional" },
//   { text: "Festival Entry Tickets", color: "magenta", type: "additional" },
//   { text: "Complimentary Dinner", color: "cyan", type: "additional" },
//   { text: "First Aid Kit in Vehicle", color: "orange", type: "additional" },
//   { text: "Visa Processing Fee", color: "green", type: "additional" },
//   { text: "24x7 Customer Helpline", color: "magenta", type: "additional" },
//   { text: "Souvenir Gifts", color: "cyan", type: "additional" },
//   { text: "Entry Pass for Monument", color: "orange", type: "additional" },
//   { text: "COVID Safety Kit", color: "green", type: "additional" },
//   { text: "Tips & Gratuities", color: "magenta", type: "additional" },
//   { text: "City Map & Brochures", color: "cyan", type: "additional" },
//   { text: "Child Seat in Vehicle", color: "orange", type: "additional" },
//   { text: "Umbrella in Monsoon Season", color: "green", type: "additional" },
//   { text: "Mobile SIM on Arrival", color: "magenta", type: "additional" },
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
//     data: { text: item.text, type: item.type === "additional" ? "additional" : "hotels"  },
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
