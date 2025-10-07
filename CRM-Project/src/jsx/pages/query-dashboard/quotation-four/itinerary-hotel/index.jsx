import React, { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDraggable } from "@dnd-kit/core";
import InfiniteScroll from "react-infinite-scroll-component";
import { axiosOther } from "../../../../../http/axios_base_url";
import { removeServiceId } from "../utils/helper.method";

// DraggableTag component
const DraggableTag = ({ id, item, editMode }) => {
  console.log(removeServiceId(item.text), "item7464");
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        text: item.text,
        type: item.type === "hotel" ? "hotels" : "",
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

    return {
      ...base,
      color: color || "#008080",
      borderColor: color || "#008080",
    };
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

  console.log(item, "HBBDH&7");

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
  hotelCategoryColors, // Receive hotel category colors
}) => {
  const [hotelData, setHotelData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 20;

  console.log(hotelCategoryColors, "selectedDestinationId");

  const fetchHotelData = async (
    page = 1,
    query = "",
    selectedDestinationId = ""
  ) => {
    try {
      setIsLoading(true);
      const { data } = await axiosOther.post("hotellist", {
        HotelName: query,
        id: "",
        Status: "",
        DestinationId: selectedDestinationId || "",
        HotelCategoryId: "",
        page: page,
        perPage: perPage,
      });

      const newData =
        data?.DataList?.map((hotel, index) => {
          const categoryName =
            hotel.HotelBasicDetails?.HotelCategory?.CategoryName;
          const color = hotelCategoryColors[categoryName] || "#008080"; // Match CategoryId with hotelCategoryColors
          return {
            id: `hotel-${page}-${index}`,
            text: `${hotel?.id}-${hotel.HotelName}`,
            color: color,
            type: "hotel",
            categoryName: categoryName, // Store CategoryName for color updates
          };
        }) || [];

      if (page === 1) {
        setHotelData(newData);
      } else {
        setHotelData((prev) => [...prev, ...newData]);
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
  }, [selectedDestinationId, hotelCategoryColors]);

  useEffect(() => {
    if (searchClicked) {
      setCurrentPage(1);
      fetchHotelData(1, searchQuery, selectedDestinationId);
      setSearchClicked(false);
    }
  }, [searchClicked, searchQuery, selectedDestinationId, hotelCategoryColors]);

  const loadMoreData = () => {
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchHotelData(nextPage, searchQuery, selectedDestinationId);
    }
  };

  useEffect(() => {
    if (hotelData.length > 0) {
      setHotelData((prevData) =>
        prevData.map((hotel) => {
          const newColor = hotelCategoryColors[hotel.categoryName] || "#008080";
          return { ...hotel, color: newColor };
        })
      );
    }
  }, [hotelCategoryColors]);

  return (
    <InfiniteScroll
      dataLength={hotelData.length}
      next={loadMoreData}
      hasMore={hasMore}
      // endMessage={<p style={{ textAlign: "center" }}>No more hotels to load</p>}
      scrollableTarget="scrollableDiv"
    >
      <PerfectScrollbar
        options={{ suppressScrollX: true }}
        id="scrollableDiv"
        className="p-3 resizeableTagContainer"
      >
        <div className="d-flex flex-wrap justify-content-start gap-2">
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : hotelData.length > 0 ? (
            hotelData.map((tag, index) => (
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
