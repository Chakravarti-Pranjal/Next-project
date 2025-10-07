import React, { useMemo } from "react";
import CostSummaryIcon from "../../../../../images/itinerary/money.svg";
import { useSelector } from "react-redux";

const CostSummary = () => {
  const {
    HotelPrice,
    MealPrice,
    FlightPrice,
    TrainPrice,
    ActivityPrice,
    TransportPrice,
    GuidePrice,
    MonumentPrice,
    RestaurantPrice,
  } = useSelector((price) => price?.priceReducer);

  const {localAirFormData,localTrainFormData,localMonumentFormData,localActivityFormData,localResturantFormData,localMealFormData,localHotelFormData} = useSelector((state) => state?.itineraryReducer);
  const totalHotelAmount = useMemo(() => {
  
      const flatData = localHotelFormData.flat();
  
  
      return flatData.reduce((total, room) => {
  
        if (room.RoomCost) {
  
          total += parseFloat(room.RoomCost);
        }
        return total;
      }, 0);
    }, [localHotelFormData]);
  const totalMealAmount = useMemo(() => {
  
      const flatData = localMealFormData.flat();
  
  
      return flatData.reduce((total, room) => {
  
        if (room.MealCost) {
  
          total += parseFloat(room.MealCost);
        }
        return total;
      }, 0);
    }, [localMealFormData]);
  
    const totalResturantAmount = useMemo(() => {
      return localResturantFormData.reduce((total, item) => {
        const adultTotal = item.AdultCost ? parseInt(item.AdultCost) : 0;
        const childTotal = item.ChildCost ? parseInt(item.ChildCost) : 0;
        return total + adultTotal + childTotal;
      }, 0);
    }, [localResturantFormData]);
  const totalActivityCost = useMemo(() => {
      return localActivityFormData?.reduce((acc, item) => acc + (parseFloat(item.Cost) || 0), 0) || 0;
    }, [localActivityFormData]);
  const totalCost = useMemo(() => {
      return localMonumentFormData.reduce((acc, item) => {
        const adultCost = item.ItemUnitCost?.Adult
          ? parseFloat(item.ItemUnitCost.Adult) 
          : 0;
        const childCost = item.ItemUnitCost?.Child
          ? parseFloat(item.ItemUnitCost.Child) 
          : 0;
  
        return acc + adultCost + childCost;
      }, 0);
    }, [localMonumentFormData]);
   const totalTrainCost = useMemo(() => {
      return localTrainFormData.reduce((total, item) => {
        const adultCost = item.AdultCost ? parseInt(item.AdultCost) : 0;
        const childCost = item.ChildCost ? parseInt(item.ChildCost) : 0;
        return total + adultCost + childCost;
      }, 0);
    }, [localTrainFormData]);

  const totalAirAmount = useMemo(() => {
      return localAirFormData.reduce((total, item) => {
        const adultTotal = item.AdultCost ? parseInt(item.AdultCost) : 0;
        const childTotal = item.ChildCost ? parseInt(item.ChildCost) : 0;
        return total + adultTotal + childTotal;
      }, 0);
    }, [localAirFormData]);

  // console.log( HotelPrice,
  //   MealPrice,
  //   FlightPrice,
  //   TrainPrice,
  //   ActivityPrice,
  //   TransportPrice,
  //   GuidePrice,
  //   MonumentPrice,
  //   RestaurantPrice,"26-costsummary")
  return (
    <div className="row mt-3 m-0">
      <div className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg">
        <div className="d-flex gap-2 align-items-center">
          <div>
            <img src={CostSummaryIcon} alt="CostSummaryIcon" />
          </div>
          <label className="fs-5">Cost Summary</label>
        </div>
      </div>
      <div className="col-6 px-0 mt-2">
        <table class="table table-bordered itinerary-table">
          <thead>
            <tr>
              <th className="py-1 align-middle">Hotel</th>
              <th className="py-1 align-middle">Meal</th>
              <th className="py-1 align-middle">Monument</th>
              <th className="py-1 align-middle">Guide</th>
              <th className="py-1 align-middle">Air</th>
              <th className="py-1 align-middle">Train</th>
              <th className="py-1 align-middle">Restaurant</th>
              <th className="py-1 align-middle">Activity</th>
              <th className="py-1 align-middle">Entrance Fee</th>
              <th className="py-1 align-middle">Total Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3">{totalHotelAmount}</td>
              <td className="py-3">{totalMealAmount}</td>
              <td className="py-3">{totalCost}</td>
              <td className="py-3">{GuidePrice}</td>
              <td className="py-3">{totalAirAmount}</td>
              <td className="py-3">{totalTrainCost}</td>
              <td className="py-3">{totalResturantAmount}</td>
              <td className="py-3">{totalActivityCost}</td>
              <td className="py-3">{totalCost}</td>
              <td className="py-3">
                {totalHotelAmount +
                  totalMealAmount +
                  totalAirAmount +
                  totalTrainCost +
                  totalActivityCost +
                  TransportPrice +
                  GuidePrice+
                  totalCost}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CostSummary;
