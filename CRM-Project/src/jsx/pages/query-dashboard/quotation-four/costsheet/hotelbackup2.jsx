import React, { useEffect, useState } from "react";
import PaxSlab from "./PaxSlab";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getQuotationDataFromApi } from "../utils/helper.method";
import { setQueryQuotationFourData } from "../../../../../store/itineraryFourAction/QueryQuotation.action";
import { axiosOther } from "../../../../../http/axios_base_url";
import {
  getHotelMealPlanList,
  getHotelRateJson,
  getHotelTypeList,
} from "./helper/rate.helper";

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
  const [mealPlanList, setMealPlanList] = useState([]);

  // priceEditHotelRatesJson

  useEffect(() => {
    const runApi = async () => {
      const response = await getQuotationDataFromApi(QueryQuotation);
      const hotelType = await getHotelTypeList();
      const mealPlan = await getHotelMealPlanList();
      setMealPlanList(mealPlan);
      setHotelType(hotelType);
      if (response.length > 0) {
        setQuotationFourData(response[0]);
        dispatch(setQueryQuotationFourData(response));
        console.log(response, "response");
      }
    };

    runApi();
  }, []);

  console.log(hotelType, "hotelType");

  useEffect(() => {
    console.log(queryQuotationData?.[0], "KFHFB877");
    if (queryQuotationData.length > 0) {
      const initialFormValue = [];
      const dayWithoutEnroute = queryQuotationData?.[0]?.Days?.filter((day) => {
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

        const quotationData = queryQuotationData?.[0];
        const queryData = queryFourDataRedux;
        console.log(day, "day74664");

        hotelServices?.forEach((service) => {
          console.log(service, "GDBDGD76");
          initialFormValue.push({
            id: queryData?.id,
            QuatationNo: quotationData?.QuotationNumber,
            DayType: "Main",
            DayNo: day?.Day,
            DayUniqueId: day?.DayUniqueId,
            Escort: 1,
            ServiceMainType:
              service?.ServiceMainType === "Guest" ? "No" : "Yes",
            Destination: day?.DestinationId,
            Supplier:
              service?.ServiceDetails?.[0]?.ItemSupplierDetail
                ?.ItemSupplierId || "",
            Hike: 0,
            Date: queryData?.TravelDateInfo?.FromDate,
            DestinationUniqueId: day?.DestinationUniqueId,
            HotelCategory: queryData?.Hotel?.HotelCategory,
            RoomCategory: 704,
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
            MealType: [
              {
                MealTypeId: "1",
                MealCost: 0,
                MealTypePackage: "No",
              },
              {
                MealTypeId: "2",
                MealCost: 0,
                MealTypePackage: "No",
              },
              {
                MealTypeId: "3",
                MealCost: 0,
                MealTypePackage: "No",
              },
            ],
            PaxInfo: {
              Adults: quotationData?.Pax?.AdultCount || "",
              Child: quotationData?.Pax?.ChildCount || "",
              Escort: "",
            },
            ForiegnerPaxInfo: {
              Adults: "",
              Child: "",
              Infant: "",
              Escort: "",
            },
            EnrouteName: "",
            EnrouteId: "",
            HotelRoomBedType: [],
            HotelMealType: [],
          });
        });
      });

      console.log(initialFormValue, "initialFormValue");
      setHotelFormValue(initialFormValue);
    }
  }, [queryQuotationData]);

  const getHotelListFromApi = async (destinationId, index) => {
    // console.log(destinationId, "HFVB666", index);
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

  // useEffect(() => {
  //   if (hotelFormValue.length > 0) {
  //     hotelFormValue.forEach((list, index) => {
  //       console.log("CHAL8777", index);
  //     });
  //   }
  // }, [JSON.stringify(hotelFormValue.map((h) => h?.ServiceId))]);

  // handler
  const handleBack = () => {
    navigate("/query/quotation-four/final-qoutation");
  };

  const comapnyKey = JSON.parse(localStorage.getItem("token"))?.companyKey;

  const handleHotelChange = async (index, value, service) => {
    const updated = [...hotelFormValue];
    updated[index] = { ...updated[index], ServiceId: value };
    setHotelFormValue(updated);

    const hotelObject = hotelList[index].find((s) => s.id == value);
    console.log(hotelObject?.HotelUniqueID, "GFVC87", service);
    const rateData = await getHotelRateJson(
      service,
      hotelObject?.HotelUniqueID,
      comapnyKey,
      queryFourDataRedux
    );
    console.log(rateData, "rateData");
  };

  return (
    <div>
      <div className="d-flex mb-2 justify-content-end gap-2">
        <button className="btn btn-primary btn-custom-size d-flex flex-shrink-0 flex-grow-0">
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
            <th colSpan="2">FIT</th>
            <th colSpan="2">GIT</th>
          </tr>
          <tr>
            <th style={{ verticalAlign: "middle" }}>SGL</th>
            <th style={{ verticalAlign: "middle" }}>DBL</th>
            <th style={{ verticalAlign: "middle" }}>SGL</th>
            <th style={{ verticalAlign: "middle" }}>DBL</th>
          </tr>
        </thead>
        <tbody>
          {hotelFormValue?.map((service, idx) => (
            <tr key={idx}>
              <td>Day - {service?.DayNo}</td>
              <td>Delhi - Agra</td>
              <td>
                <select
                  value={service?.ServiceId || ""}
                  className="formControl1"
                  onChange={(e) =>
                    handleHotelChange(idx, e.target.value, service)
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
                <select className="formControl1">
                  <option value="">Select</option>
                  {hotelType?.length > 0 &&
                    hotelType.map((service, index) => (
                      <option key={index} value={service?.id}>
                        {service?.Name}
                      </option>
                    ))}
                </select>
              </td>

              <td>
                <select value={service?.MealPlan} className="formControl1">
                  <option value="">Select</option>
                  {mealPlanList.length > 0 &&
                    mealPlanList.map((meal) => (
                      <option value={meal.id}>{meal.Name}</option>
                    ))}
                </select>
              </td>
              <td>
                <input type="number" className="formControl1 width50px" />
              </td>
              <td>
                <input type="number" className="formControl1 width50px" />
              </td>
              <td>
                <input type="number" className="formControl1 width50px" />
              </td>
              <td>
                <input type="number" className="formControl1 width50px" />
              </td>
              <td>
                <input type="number" className="formControl1 width50px" />
              </td>
              <td>
                <input type="number" className="formControl1 width50px" />
              </td>
              <td>
                <input type="number" className="formControl1 width50px" />
              </td>
            </tr>
          ))}

          <tr style={{ background: "#2e2e40" }}>
            <td colSpan={4}>TOTAL</td>
            <td></td>
            <td>0.00</td>
            <td>0.00</td>
            <td>9,000.00</td>
            <td>0.00</td>
            <td>2,06,911.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Hotel;
