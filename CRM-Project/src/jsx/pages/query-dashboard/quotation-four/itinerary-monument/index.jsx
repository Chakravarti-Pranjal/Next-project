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
        type: item.type === "monument" ? "monuments" : "",
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
  const [monumentData, setMonumentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 20; // Number of items per page

  const fetchMonumentData = async (
    page = 1,
    query = "",
    selectedDestinationId = ""
  ) => {
    try {
      setIsLoading(true);
      const { data } = await axiosOther.post("monument-package-list", {
        Destination: selectedDestinationId,
        Default: "Yes",
      });

      console.log(data, "lksdafjlsdkj", selectedDestinationId);

      const newData =
        data?.DataList?.map((monument, index) => ({
          id: `monument-${page}-${index}`,
          text: `${monument?.id}-${monument.PackageName}`,
          color: getColorForIndex((page - 1) * perPage + index),
          type: "monument",
        })) || [];

      if (page === 1) {
        setMonumentData(newData);
      } else {
        setMonumentData((prev) => [...prev, ...newData]);
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
  //   fetchMonumentData(currentPage);
  // }, [currentPage]);

  // Fetch monuments when selectedDestinationId changes
  useEffect(() => {
    setCurrentPage(1);
    if (selectedDestinationId) {
      fetchMonumentData(1, searchQuery, selectedDestinationId);
    }
  }, [selectedDestinationId]);

  useEffect(() => {
    if (searchClicked) {
      setCurrentPage(1); // reset page
      fetchMonumentData(1, searchQuery); // ✅ pass query
      setSearchClicked(false);
    }
  }, [searchClicked, selectedDestinationId]);

  const loadMoreData = () => {
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchMonumentData(nextPage, searchQuery); // ✅ carry search forward
    }
  };

  return (
    <InfiniteScroll
      dataLength={monumentData.length}
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
          ) : monumentData.length > 0 ? (
            monumentData.map((tag, index) => (
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
//   { text: "India Gate, Delhi", color: "orange", type: "monument" },
//   { text: "Taj Mahal, Agra", color: "green", type: "monument" },
//   { text: "Qutub Minar", color: "magenta", type: "monument" },
//   { text: "Charminar, Hyderabad", color: "orange", type: "monument" },
//   { text: "Gateway of India", color: "green", type: "monument" },
//   { text: "Amber Fort", color: "magenta", type: "monument" },
//   { text: "Fatehpur Sikri", color: "orange", type: "monument" },
//   { text: "Sun Temple, Konark", color: "green", type: "monument" },
//   { text: "Sanchi Stupa", color: "magenta", type: "monument" },
//   { text: "Red Fort", color: "orange", type: "monument" },
//   { text: "Mehrangarh Fort", color: "green", type: "monument" },
//   { text: "Golconda Fort", color: "magenta", type: "monument" },
//   { text: "Chittorgarh Fort", color: "orange", type: "monument" },
//   { text: "Hampi Ruins", color: "green", type: "monument" },
//   { text: "Ajanta Caves", color: "magenta", type: "monument" },
//   { text: "Ellora Caves", color: "orange", type: "monument" },
//   { text: "Kumbhalgarh Fort", color: "green", type: "monument" },
//   { text: "Jaisalmer Fort", color: "magenta", type: "monument" },
//   // { text: "Victoria Memorial", color: "orange", type: "monument" },
//   // { text: "Rock Garden, Chandigarh", color: "green", type: "monument" },
//   // { text: "Kailasa Temple", color: "magenta", type: "monument" },
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
//     data: { text: item.text, type: item.type === "monument" ? "monuments" : item.type === "guide" ? "guide" : "hotels", },
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
