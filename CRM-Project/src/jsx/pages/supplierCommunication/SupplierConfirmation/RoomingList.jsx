import { useEffect, useState } from "react";
import { axiosOther } from "../../../../http/axios_base_url";

export default function RoomingList() {
  const [selectedGuests, setSelectedGuests] = useState({});
  const [QoutationData, setQoutationData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryAndQuotationNo =
    JSON.parse(localStorage.getItem("Query_Qoutation")) || {};

  async function fetchQueryQuotation() {
    try {
      setLoading(true);
      const { data } = await axiosOther.post("listqueryquotation", {
        QueryId: queryAndQuotationNo?.QueryID,
        QuotationNo: queryAndQuotationNo?.QoutationNum,
      });
      setQoutationData(data?.data[0] || {});
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quotation:", error);
      setError("Failed to load quotation data");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQueryQuotation();
  }, []);

  const getHotelCostsByDay = (data) => {
    const hotelCostsByDay = [];

    if (data.Days && Array.isArray(data.Days)) {
      data.Days.forEach((day) => {
        const dayHotelData = {
          day: day.Day,
          destination: day.DestinationName || "Unknown",
          hotelDetails: {
            hotelName: "Unknown",
            hotelCategory: "Unknown",
            mealPlan: "Unknown",
          },
          rooms: [],
        };

        if (day.DayServices && Array.isArray(day.DayServices)) {
          const hotelService = day.DayServices.find(
            (service) => service.ServiceType === "Hotel"
          );

          if (hotelService && hotelService.TotalCosting) {
            // Update hotel details
            dayHotelData.hotelDetails = {
              hotelName:
                hotelService.ServiceDetails?.[0]?.ItemName || "Unknown",
              hotelCategory: hotelService.HotelCategoryName || "Unknown",
              mealPlan: hotelService.MealPlanName || "Unknown",
            };

            // Collect room data
            hotelService.TotalCosting.forEach((costing) => {
              costing.HotelRoomBedType.forEach((room) => {
                dayHotelData.rooms.push({
                  roomBedTypeName: room.RoomBedTypeName,
                  totalServiceCost: Number(room.TotalServiceCost) || 0,
                  pax: room.RoomBedTypeName.includes("DBL") ? 2 : 1, // Assume DBL Room has 2 pax
                });
              });
            });
          }
        }

        if (dayHotelData.rooms.length > 0) {
          hotelCostsByDay.push(dayHotelData);
        }
      });
    }

    return hotelCostsByDay;
  };

  const hotelCostsByDay = getHotelCostsByDay(QoutationData);
  console.log(hotelCostsByDay, "Hotel Costs by Day for UI");

  const handleGuestSelect = (roomId, guest) => {
    setSelectedGuests((prev) => ({
      ...prev,
      [roomId]: guest,
    }));
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        padding: "20px",
        // backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          // backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            // backgroundColor: "#2c3e50",
            color: "white",
            padding: "15px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          HOTEL ROOMING LIST
        </div>

        {hotelCostsByDay.map((dayData, dayIndex) => (
          <div key={`day-${dayData.day}`}>
            {/* Day and Hotel Info */}
            <div
              style={{
                // backgroundColor: "#3498db",
                color: "white",
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Day {dayData.day} | {dayData.destination} |{" "}
              {dayData.hotelDetails.hotelName} |{" "}
              {dayData.hotelDetails.hotelCategory} Star
            </div>

            {/* Room Type and Cost */}
            <div
              style={{
                // backgroundColor: "#ecf0f1",
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: "500",
                color: "white",
              }}
            >
              Room Type:{" "}
              <span style={{ fontWeight: "bold" }}>
                {dayData.rooms[0]?.roomBedTypeName || "Unknown"}
              </span>{" "}
              | Cost: ₹
              {dayData.rooms[0]?.totalServiceCost.toLocaleString() || "0"}
            </div>

            {/* Table Container */}
            <div
              style={{
                overflowX: "auto",
                padding: "0 20px 20px 20px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "10px",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #6f7174",
                        padding: "12px 8px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: "white",
                        minWidth: "80px",
                      }}
                    >
                      Room
                    </th>
                    <th
                      style={{
                        border: "1px solid #6f7174",
                        padding: "12px 8px",
                        textAlign: "center",
                        fontWeight: "600",
                        color: "white",
                        width: "60px",
                      }}
                    >
                      Pax
                    </th>
                    <th
                      style={{
                        border: "1px solid #6f7174",
                        padding: "12px 8px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: "white",
                        minWidth: "150px",
                      }}
                    >
                      Guest
                    </th>
                    <th
                      style={{
                        border: "1px solid #6f7174",
                        padding: "12px 8px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: "white",
                        minWidth: "120px",
                      }}
                    >
                      Room Category
                    </th>
                    <th
                      style={{
                        border: "1px solid #6f7174",
                        padding: "12px 8px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: "white",
                        minWidth: "140px",
                      }}
                    >
                      Meal Preference
                    </th>
                    <th
                      style={{
                        border: "1px solid #6f7174",
                        padding: "12px 8px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: "white",
                        minWidth: "150px",
                      }}
                    >
                      Special Preference
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dayData.rooms.map((room, roomIndex) => (
                    <tr
                      key={`room-${dayData.day}-${roomIndex}`}
                      // style={{
                      //   backgroundColor:
                      //     roomIndex % 2 === 0 ? "#ffffff" : "#f8f9fa",
                      // }}
                    >
                      <td
                        style={{
                          border: "1px solid #6f7174",
                          padding: "12px 8px",
                          color: "white",
                        }}
                      >
                        Room {roomIndex + 1}
                      </td>
                      <td
                        style={{
                          border: "1px solid #6f7174",
                          padding: "12px 8px",
                          textAlign: "center",
                          color: "white",
                        }}
                      >
                        {room.pax}
                      </td>
                      <td
                        style={{
                          border: "1px solid #6f7174",
                          padding: "8px",
                        }}
                      >
                        <select
                          value={
                            selectedGuests[
                              `room-${dayData.day}-${roomIndex}`
                            ] || "Select"
                          }
                          onChange={(e) =>
                            handleGuestSelect(
                              `room-${dayData.day}-${roomIndex}`,
                              e.target.value
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #6f7174",
                            borderRadius: "4px",
                            backgroundColor: "#2e2e40",
                            fontSize: "14px",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          <option value="Select">Select</option>
                          <option value="Guest 1">Guest 1</option>
                          <option value="Guest 2">Guest 2</option>
                          <option value="Guest 3">Guest 3</option>
                        </select>
                      </td>
                      <td
                        style={{
                          border: "1px solid #6f7174",
                          padding: "12px 8px",
                          color: "white",
                        }}
                      >
                        {room.roomBedTypeName}
                      </td>
                      <td
                        style={{
                          border: "1px solid #6f7174",
                          padding: "12px 8px",
                          color: "white",
                        }}
                      >
                        {dayData.hotelDetails.mealPlan}
                      </td>
                      <td
                        style={{
                          border: "1px solid #6f7174",
                          padding: "12px 8px",
                          color: "white",
                        }}
                      >
                        None
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Fallback if no hotel data */}
        {hotelCostsByDay.length === 0 && (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "white",
            }}
          >
            No hotel data available for this quotation.
          </div>
        )}
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          table {
            font-size: 12px !important;
          }
          th,
          td {
            padding: 8px 4px !important;
            min-width: auto !important;
          }
          select {
            font-size: 12px !important;
            padding: 6px 8px !important;
          }
        }

        @media (max-width: 480px) {
          table {
            font-size: 11px !important;
          }
          th,
          td {
            padding: 6px 3px !important;
          }
          select {
            font-size: 11px !important;
            padding: 4px 6px !important;
          }
        }
      `}</style>
    </div>
  );
}
