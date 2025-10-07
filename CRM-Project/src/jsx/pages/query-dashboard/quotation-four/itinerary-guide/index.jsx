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
      data: { text: item.text, type: item.type === "guide" ? "guide" : "" },
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
  };

  return editMode ? (
    <span ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {item.text}
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
  selectedCard,
  dayWiseFormValue,
  setGuideData,
  guideData,
  guideSelectedData,
}) => {
  // const [guideData, setGuideData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 20;

  const [guideFormValue, setGuideFormValue] = useState([]);

  console.log(guideSelectedData, "GUIDE7877");

  // useEffect(() => {
  //   const filteredData = dayWiseFormValue?.map((item) => {
  //     const key = Object.keys(item)[0];
  //     const dayData = item[key];
  //     return {
  //       monuments: dayData.monuments,
  //       Day: dayData.Day,
  //       DayUniqueId: dayData.DayUniqueId,
  //       DestinationName: dayData.DestinationName,
  //       DestinationId: dayData.DestinationId,
  //       DestinationUniqueId: dayData.DestinationUniqueId,
  //     };
  //   });
  //   setGuideFormValue(filteredData);
  //   console.log(filteredData, "filteredData");
  // }, [dayWiseFormValue]);

  // const getMonumentList = async (serviceId) => {
  //   try {
  //     const { data } = await axiosOther.post("monument-package-list", {
  //       id: serviceId,
  //       Default: "Yes",
  //     });
  //     if (data?.Status === 200) {
  //       console.log(data, "GFHHD877");
  //       const res = data?.DataList?.[0];
  //       return `${res?.id}-${res.DayType}`;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (selectedDestinationId && guideFormValue.length > 0) {
  //       const monumentData = guideFormValue.find(
  //         (item) => item.DayUniqueId === selectedCard
  //       );
  //       console.log(monumentData?.monuments, "OBJE676");

  //       if (monumentData?.monuments?.length) {
  //         const promises = monumentData.monuments.map((data) => {
  //           const serviceId = parseInt(data.split("-")[0]);
  //           return getMonumentList(serviceId);
  //         });

  //         const responseguideData = await Promise.all(promises);

  //         const page = 1;

  //         const newData =
  //           responseguideData?.map((guide, index) => ({
  //             id: `guide-${page}-${index}`,
  //             text: guide,
  //             color: getColorForIndex((page - 1) * perPage + index),
  //             type: "guide",
  //           })) || [];

  //         setGuideData(newData);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [selectedDestinationId]);

  const fetchGuideData = async (
    page = 1,
    query = "",
    selectedDestinationId = ""
  ) => {
    try {
      setIsLoading(true);
      // const { data } = await axiosOther.post("guideservicelist", {
      //   ServiceName: query,
      //   id: "",
      //   Status: "",
      //   Destination: selectedDestinationId || "",
      //   page: page,
      //   perPage: perPage,
      // });

      // console.log(data, "lksdafjlsdkj");

      const newData =
        guideSelectedData?.map((guide, index) => ({
          id: `guide-${page}-${index}`,
          text: guide,
          color: getColorForIndex((page - 1) * perPage + index),
          type: "guide",
        })) || [];

      if (page === 1) {
        setGuideData(newData); // overwrite on new search
      } else {
        setGuideData((prev) => [...prev, ...newData]);
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
  //   fetchGuideData(currentPage);
  // }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    fetchGuideData(1, searchQuery, selectedDestinationId);
  }, [selectedDestinationId]);

  useEffect(() => {
    if (searchClicked) {
      setCurrentPage(1); // reset page
      fetchGuideData(1, searchQuery); // ✅ pass query
      setSearchClicked(false);
    }
  }, [searchClicked, selectedDestinationId]);

  const loadMoreData = () => {
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchGuideData(nextPage, searchQuery); // ✅ carry search forward
    }
  };

  return (
    <InfiniteScroll
      dataLength={guideData.length}
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
          ) : guideData.length > 0 ? (
            guideData.map((tag, index) => (
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
//   { text: "English Speaking Guide – Delhi", color: "magenta", type: "guide" },
//   { text: "Local Historian Guide – Jaipur", color: "green", type: "guide" },
//   { text: "Cultural Expert – Varanasi", color: "magenta", type: "guide" },
//   { text: "French Speaking Guide – Pondicherry", color: "green", type: "guide" },
//   { text: "Nature Guide – Jim Corbett", color: "orange", type: "guide" },
//   { text: "Local Food Guide – Amritsar", color: "green", type: "guide" },
//   { text: "Archaeological Guide – Hampi", color: "orange", type: "guide" },
//   { text: "Wildlife Guide – Ranthambhore", color: "magenta", type: "guide" },
//   { text: "Photography Tour Guide – Ladakh", color: "orange", type: "guide" },
//   { text: "Spiritual Guide – Rishikesh", color: "magenta", type: "guide" },
//   { text: "Heritage Walk Guide – Ahmedabad", color: "green", type: "guide" },
//   { text: "Adventure Guide – Rishikesh", color: "orange", type: "guide" },
//   { text: "Temple Ritual Guide – Tamil Nadu", color: "magenta", type: "guide" },
//   { text: "Tea Garden Expert – Darjeeling", color: "green", type: "guide" },
//   { text: "Eco Tourism Guide – Kerala", color: "orange", type: "guide" },
//   { text: "Flora-Fauna Expert – Sikkim", color: "magenta", type: "guide" },
//   { text: "Tribal Culture Guide – Chhattisgarh", color: "green", type: "guide" },
//   { text: "Crafts & Handloom Guide – Odisha", color: "orange", type: "guide" },
//   { text: "Festival Tour Guide – Mathura", color: "magenta", type: "guide" },
//   { text: "Ghat Walk Narrator – Varanasi", color: "green", type: "guide" },
//   { text: "Regional Language Guide – Kolkata", color: "orange", type: "guide" },
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
//     data: { text: item.text, type: item.type === "monument" ? "monuments" : item.type === "guide" ? "guide" : "hotels" },
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
