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
  console.log(item, "item7464");
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        text: item.text,
        type: item.type === "restaurant" ? "restaurant" : "",
        color: item.color,
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
  selectedDestinationId, // Receive selectedDestinationId
}) => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 20; // Number of items per page

  console.log(selectedDestinationId, "selectedDestinationId");

  const fetchHotelData = async (
    page = 1,
    query = "",
    selectedDestinationId = ""
  ) => {
    try {
      setIsLoading(true);
      const { data } = await axiosOther.post("restaurantmasterlist");
      console.log(data?.DataList, "GFHHD&6");
      const newData =
        data?.DataList?.map((restaurant, index) => ({
          id: `restaurant-${page}-${index}`,
          text: `${restaurant?.Id}-${restaurant.Name}`,
          color: getColorForIndex((page - 1) * perPage + index),
          type: "restaurant",
        })) || [];

      if (page === 1) {
        setRestaurantData(newData); // overwrite on new search
      } else {
        setRestaurantData((prev) => [...prev, ...newData]);
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

  // Initial fetch
  // useEffect(() => {
  //   fetchHotelData(currentPage);
  // }, [currentPage]);

  // Fetch hotels when selectedDestinationId changes
  useEffect(() => {
    setCurrentPage(1); // Reset page on destination change
    fetchHotelData(1, searchQuery, selectedDestinationId);
  }, [selectedDestinationId]);

  useEffect(() => {
    if (searchClicked) {
      setCurrentPage(1); // reset page
      fetchHotelData(1, searchQuery); // pass query
      setSearchClicked(false);
    }
  }, [searchClicked, searchQuery, selectedDestinationId]);

  const loadMoreData = () => {
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchHotelData(nextPage, searchQuery); // carry search forward
    }
  };

  return (
    <InfiniteScroll
      dataLength={restaurantData.length}
      next={loadMoreData}
      hasMore={hasMore}
      //   endMessage={<p style={{ textAlign: "center" }}>No more Restaurant to load</p>}
      scrollableTarget="scrollableDiv"
    >
      <PerfectScrollbar
        options={{ suppressScrollX: true }}
        id="scrollableDiv"
        className="p-3 resizeableTagContainer"
      >
        <div className="d-flex flex-wrap justify-content-start gap-2">
          {console.log(restaurantData, "GFGFGF")}
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : restaurantData.length > 0 ? (
            restaurantData.map((tag, index) => (
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
