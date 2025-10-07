import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getQueryDataFromApi,
  getQuotationDataFromApi,
  getSectorByDestination,
} from "../utils/helper.method";
import { setQueryQuotationFourData } from "../../../../../store/itineraryFourAction/QueryQuotation.action";
import { axiosOther } from "../../../../../http/axios_base_url";
import {
  getHotelMealPlanList,
  getHotelRateJson,
  getHotelTypeList,
} from "./helper/rate.helper";
import PaxSlab from "./PaxSlab";

const Hotel = ({ handleNext }) => {
  const { queryQuotationData, queryFourDataRedux } = useSelector(
    (state) => state.queryQuotationFourReducer
  );
  const QueryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [hotelList, setHotelList] = useState([]);
  const [hotelFormValue, setHotelFormValue] = useState([]);
  const [hotelType, setHotelType] = useState([]);
  const [quotationFourData, setQuotationFourData] = useState([]);
  const [queryDataApi, setQueryDataApi] = useState({});
  const [mealPlanList, setMealPlanList] = useState([]);
  const [roomTypeInfo, setRoomTypeInfo] = useState([]);
  const [hotelRateData, setHotelRateData] = useState({});

  useEffect(() => {
    const runApi = async () => {
      const response = await getQuotationDataFromApi(QueryQuotation);
      const queryRes = await getQueryDataFromApi(QueryQuotation);
      console.log(queryRes, "GDBVC787");
      const hotelType = await getHotelTypeList();
      const mealPlan = await getHotelMealPlanList();
      setMealPlanList(mealPlan);
      setHotelType(hotelType);
      setQueryDataApi(queryRes[0]);
      if (response.length > 0) {
        setQuotationFourData(response[0]);
      }
    };

    runApi();
  }, []);

  useEffect(() => {
    console.log(quotationFourData, "KFHFB877");
    if (quotationFourData?.Days?.length > 0) {
      const initialFormValue = [];
      const dayWithoutEnroute = quotationFourData?.Days?.filter((day) => {
        const hasHotelService = day?.DayServices?.some(
          (service) => service.ServiceType === "Hotel"
        );
        const hasEnroute = day.EnrouteId !== "" || day.EnrouteName !== "";
        return hasHotelService && !hasEnroute;
      });

      dayWithoutEnroute?.forEach((day) => {
        const hotelServices = day?.DayServices?.filter(
          (service) => service?.ServiceType === "Hotel"
        );

        const quotationData = quotationFourData;
        const queryData = queryDataApi;
        console.log(queryData, "day74664");

        hotelServices?.forEach((service) => {
          console.log(service, "GDBDGD76");
          initialFormValue.push({
            id: queryData?.id,
            QuatationNo: quotationData?.QuotationNumber,
            DayType: "Main",
            DayNo: day?.Day,
            DayUniqueId: day?.DayUniqueId,
            Escort: 1,
            Sector:
              service?.Sector ||
              getSectorByDestination(quotationFourData, day?.DayUniqueId),
            ServiceMainType:
              service?.ServiceMainType === "Guest" ? "No" : "Yes",
            Destination: day?.DestinationId,
            DestinationName: day?.DestinationName,
            Supplier:
              service?.ServiceDetails?.[0]?.ItemSupplierDetail
                ?.ItemSupplierId || "",
            Hike: 0,
            Date: queryData?.TravelDateInfo?.FromDate,
            DestinationUniqueId: day?.DestinationUniqueId,
            HotelCategory: queryData?.Hotel?.HotelCategory,
            RoomCategory: service?.RoomCategoryId,
            RoomTypeName: service?.RoomCategoryName,
            MealPlan: queryData?.MealPlan,
            OverNight: queryData?.TravelDateInfo?.TotalNights,
            FromDay: "",
            ToDay: "",
            ServiceId: service?.ServiceId || "",
            ItemFromDate: queryData?.TravelDateInfo?.FromDate,
            ItemFromTime: "",
            ItemToDate: queryData?.TravelDateInfo?.ToDate,
            InfantCost: "",
            ItemToTime: "",
            PaxSlab: "",
            RateUniqueId: "",
            RoomBedType: service?.RoomCategoryId,
            PaxInfo: {
              Adults: quotationData?.Pax?.AdultCount || "",
              Child: quotationData?.Pax?.ChildCount || "",
              Escort: "",
            },
            EnrouteName: "",
            EnrouteId: "",
            MealCosts: { Breakfast: "", Lunch: "", Dinner: "" },
            RoomCosts: {},
          });
        });
      });

      const roomInfo =
        quotationFourData?.QueryInfo?.Accomondation?.RoomInfo?.filter(
          (room) => room.NoOfPax !== null
        );

      console.log(initialFormValue, "initialFormValue");
      setHotelFormValue(initialFormValue);
      setRoomTypeInfo(roomInfo);
    }
  }, [quotationFourData]);

  const getHotelListFromApi = async (destinationId, index) => {
    try {
      const { data } = await axiosOther.post("hotellist", {
        HotelName: "",
        id: "",
        Status: "",
        DestinationId: destinationId,
        HotelCategoryId: "",
        page: "",
        perPage: "",
      });

      const updatedList = data?.DataList?.map((hotel) => {
        return {
          id: hotel?.id,
          HotelName: hotel?.HotelName,
          HotelUniqueID: hotel?.HotelUniqueID,
        };
      });
      setHotelList((prev) => ({
        ...prev,
        [index]: updatedList,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (hotelFormValue.length > 0) {
      hotelFormValue.forEach((list, index) => {
        getHotelListFromApi(list?.Destination, index);
      });
    }
  }, [JSON.stringify(hotelFormValue.map((h) => h?.Destination))]);

  useEffect(() => {
    const fetchInitialRates = async () => {
      const updated = [...hotelFormValue];
      const companyKey = JSON.parse(localStorage.getItem("token"))?.companyKey;

      for (let index = 0; index < hotelFormValue.length; index++) {
        const service = hotelFormValue[index];
        if (service.ServiceId && hotelList[index]) {
          const hotelObject = hotelList[index].find(
            (s) => s.id === service.ServiceId
          );
          if (hotelObject?.HotelUniqueID) {
            const rateData = await getHotelRateJson(
              service,
              hotelObject.HotelUniqueID,
              companyKey,
              queryDataApi
            );
            console.log(rateData, `initial rateData for index ${index}`);

            if (rateData) {
              const mealCosts = {
                Breakfast: "",
                Lunch: "",
                Dinner: "",
              };
              rateData.MealType?.forEach((meal) => {
                if (meal.MealTypeName === "Breakfast")
                  mealCosts.Breakfast = meal.MealCost;
                if (meal.MealTypeName === "Lunch")
                  mealCosts.Lunch = meal.MealCost;
                if (meal.MealTypeName === "Dinner")
                  mealCosts.Dinner = meal.MealCost;
              });

              const roomCosts = {};
              rateData.RoomBedType?.forEach((room) => {
                roomCosts[room.RoomBedTypeName] = room.RoomCost;
              });

              updated[index] = {
                ...updated[index],
                MealCosts: mealCosts,
                RoomCosts: roomCosts,
                RoomCategory: rateData.RoomTypeId || "",
                RoomTypeName: rateData.RoomTypeName || "",
              };

              setHotelRateData((prev) => ({
                ...prev,
                [index]: rateData,
              }));
            }
          }
        }
      }

      setHotelFormValue(updated);
    };

    if (hotelFormValue.length > 0 && Object.keys(hotelList).length > 0) {
      fetchInitialRates();
    }
  }, [hotelFormValue.length, hotelList]);

  const handleBack = () => {
    navigate("/query/quotation-four");
  };

  const comapnyKey = JSON.parse(localStorage.getItem("token"))?.companyKey;

  const handleHotelChange = async (index, value, service) => {
    const updated = [...hotelFormValue];
    updated[index] = { ...updated[index], ServiceId: value };

    const hotelObject = hotelList[index].find((s) => s.id == value);
    console.log(hotelObject?.HotelUniqueID, "GFVC87", service);

    const rateData = await getHotelRateJson(
      service,
      hotelObject?.HotelUniqueID,
      comapnyKey,
      queryDataApi
    );
    console.log(rateData, "rateData");

    if (rateData) {
      const mealCosts = {
        Breakfast: "",
        Lunch: "",
        Dinner: "",
      };
      rateData.MealType?.forEach((meal) => {
        if (meal.MealTypeName === "Breakfast")
          mealCosts.Breakfast = meal.MealCost;
        if (meal.MealTypeName === "Lunch") mealCosts.Lunch = meal.MealCost;
        if (meal.MealTypeName === "Dinner") mealCosts.Dinner = meal.MealCost;
      });

      const roomCosts = {};
      rateData.RoomBedType?.forEach((room) => {
        roomCosts[room.RoomBedTypeName] = room.RoomCost;
      });

      updated[index] = {
        ...updated[index],
        MealCosts: mealCosts,
        RoomCosts: roomCosts,
        RoomCategory: rateData.RoomTypeId || "",
        RoomTypeName: rateData.RoomTypeName || "",
      };

      setHotelRateData((prev) => ({
        ...prev,
        [index]: rateData,
      }));
    } else {
      updated[index] = {
        ...updated[index],
        MealCosts: {
          Breakfast: "",
          Lunch: "",
          Dinner: "",
        },
        RoomCosts: {},
        RoomCategory: "",
        RoomTypeName: "",
      };

      setHotelRateData((prev) => ({
        ...prev,
        [index]: {},
      }));
    }

    setHotelFormValue(updated);
  };

  const handleHotelFormChange = (index, field, value) => {
    const updated = [...hotelFormValue];
    if (field === "ServiceId") {
      handleHotelChange(index, value, updated[index]);
    } else if (field === "RoomCategory") {
      updated[index] = {
        ...updated[index],
        RoomCategory: value,
      };
    } else if (field === "MealPlan") {
      updated[index] = {
        ...updated[index],
        MealPlan: value,
      };
    } else if (["Breakfast", "Lunch", "Dinner"].includes(field)) {
      updated[index] = {
        ...updated[index],
        MealCosts: {
          ...updated[index].MealCosts,
          [field]: value,
        },
      };
    } else {
      // Handle RoomCosts for room types
      updated[index] = {
        ...updated[index],
        RoomCosts: {
          ...updated[index].RoomCosts,
          [field]: value,
        },
      };
    }
    setHotelFormValue(updated);
  };

  const handleHotelSave = async () => {
    console.log("Updated hotelFormValue:", hotelFormValue);
  };

  return (
    <div>
      <div className="d-flex mb-2 justify-content-end gap-2">
        <button
          onClick={handleHotelSave}
          className="btn btn-primary btn-custom-size d-flex flex-shrink-0 flex-grow-0"
        >
          <i className="fa-solid fa-floppy-disk fs-4 me-1" />
          Save
        </button>
        <button
          className="btn btn-dark btn-custom-size"
          onClick={() => handleBack()}
        >
          Back
        </button>
        <button
          className="btn btn-primary btn-custom-size d-flex flex-shrink-0 flex-grow-0"
          onClick={() => handleNext("hotel")}
        >
          Next
          <i
            className="fa-solid fa-backward text-red bg-white p-1 rounded ms-1"
            style={{ transform: "rotate(180deg)" }}
          ></i>
        </button>
      </div>
      <table className="table table-bordered itinerary-table">
        <thead>
          <tr>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Days
            </th>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Sector
            </th>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Hotel
            </th>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Room type
            </th>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Meal Type
            </th>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Breakfast
            </th>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Lunch
            </th>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Dinner
            </th>
            <th colSpan={roomTypeInfo.length}>
              {queryDataApi?.PaxInfo?.PaxTypeName === "FIT" ? "FIT" : "GIT"}
            </th>
          </tr>
          <tr>
            {roomTypeInfo.map((room, index) => (
              <th key={index} style={{ verticalAlign: "middle" }}>
                {room.RoomType.split(" ")[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hotelFormValue?.map((service, idx) => (
            <tr key={idx}>
              <td>{service?.DestinationName}</td>
              <td>{service?.Sector}</td>
              <td>
                <select
                  name="ServiceId"
                  value={service?.ServiceId || ""}
                  className="formControl1"
                  onChange={(e) =>
                    handleHotelFormChange(idx, "ServiceId", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  {hotelList[idx]?.map((hotel, hIndex) => (
                    <option key={hIndex} value={hotel?.id}>
                      {hotel.HotelName}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  name="RoomType"
                  value={service?.RoomCategory || ""}
                  className="formControl1"
                  onChange={(e) =>
                    handleHotelFormChange(idx, "RoomCategory", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  {hotelType?.length > 0 &&
                    hotelType.map((type, index) => (
                      <option key={index} value={type?.id}>
                        {type?.Name}
                      </option>
                    ))}
                </select>
              </td>
              <td>
                <select
                  name="MealPlan"
                  value={service?.MealPlan || ""}
                  className="formControl1"
                  onChange={(e) =>
                    handleHotelFormChange(idx, "MealPlan", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  {mealPlanList.length > 0 &&
                    mealPlanList.map((meal) => (
                      <option key={meal.id} value={meal.id}>
                        {meal.Name.toUpperCase()}
                      </option>
                    ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  name="Breakfast"
                  className="formControl1 width50px"
                  value={service?.MealCosts?.Breakfast || ""}
                  onChange={(e) =>
                    handleHotelFormChange(idx, "Breakfast", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  name="Lunch"
                  className="formControl1 width50px"
                  value={service?.MealCosts?.Lunch || ""}
                  onChange={(e) =>
                    handleHotelFormChange(idx, "Lunch", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  name="Dinner"
                  className="formControl1 width50px"
                  value={service?.MealCosts?.Dinner || ""}
                  onChange={(e) =>
                    handleHotelFormChange(idx, "Dinner", e.target.value)
                  }
                />
              </td>
              {roomTypeInfo.map((room, roomIndex) => (
                <td key={roomIndex}>
                  <input
                    type="number"
                    className="formControl1 width50px"
                    name={`${room.RoomType}`}
                    value={service?.RoomCosts?.[room.RoomType] || ""}
                    onChange={(e) =>
                      handleHotelFormChange(idx, room.RoomType, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr style={{ background: "#2e2e40" }}>
            <td colSpan={4}>TOTAL</td>
            <td></td>
            <td>
              {hotelFormValue.reduce(
                (sum, service) =>
                  sum + Number(service?.MealCosts?.Breakfast || 0),
                0
              )}
            </td>
            <td>
              {hotelFormValue.reduce(
                (sum, service) => sum + Number(service?.MealCosts?.Lunch || 0),
                0
              )}
            </td>
            <td>
              {hotelFormValue.reduce(
                (sum, service) => sum + Number(service?.MealCosts?.Dinner || 0),
                0
              )}
            </td>
            {roomTypeInfo.map((room, index) => (
              <td key={index}>
                {hotelFormValue.reduce(
                  (sum, service) =>
                    sum + Number(service?.RoomCosts?.[room.RoomType] || 0),
                  0
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <PaxSlab />
    </div>
  );
};

export default Hotel;
