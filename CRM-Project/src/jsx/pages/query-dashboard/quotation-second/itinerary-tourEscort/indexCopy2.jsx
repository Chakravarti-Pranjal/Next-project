import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { axiosOther } from "../../../../../http/axios_base_url";
import { localEscortChargesInitialValue } from "../qoutation_initial_value";
import { notifyError, notifySuccess } from "../../../../../helper/notify";

// Assume localEscortChargesInitialValue includes Foc: 0
// Example: const localEscortChargesInitialValue = { ..., Foc: 0, ... };

const TourEscort = () => {
  // ===============================================================

  const [scortFormValue, setScortFormValue] = useState([]);
  const [QoutationData, setQoutationData] = useState({});
  const { qoutationData, queryData } = useSelector(
    (data) => data?.queryReducer
  );

  const { UpdateLocalEscortCharges } = useSelector(
    (data) => data?.activeTabOperationReducer
  );

  // ===============================================================

  const queryAndQuotationNo = JSON.parse(
    localStorage.getItem("Query_Qoutation")
  );

  async function fetchQueryQuotation() {
    try {
      const { data } = await axiosOther.post("listqueryquotation", {
        QueryId: queryAndQuotationNo?.QueryID,
        QuotationNo: queryAndQuotationNo?.QoutationNum,
      });
      setQoutationData(data?.data[0]);
    } catch (error) {
      console.log(error, "error occurred");
    }
  }

  useEffect(() => {
    fetchQueryQuotation();
  }, [UpdateLocalEscortCharges]);

  const getFightTrainCost = (flightTrainService) => {
    if (flightTrainService?.length > 0) {
      const totalCost = flightTrainService?.reduce((acc, service) => {
        const adultCost = service.ServiceDetails[0].ItemUnitCost.Adult || 0;
        const childCost = service.ServiceDetails[0].ItemUnitCost.Child || 0;
        const guideCharges = service.GuideCharges || 0;
        const handlingCharges = service.HandlingCharges || 0;
        const serviceCharges = service.ServiceCharges || 0;

        const serviceTotal =
          adultCost +
          childCost +
          guideCharges +
          handlingCharges +
          serviceCharges;

        return acc + serviceTotal;
      }, 0);
      return totalCost || 0;
    }
    return 0;
  };

  const getRestaurentTotalCost = (restaurentData) => {
    let totalBreakfast = 0;
    let totalLunch = 0;
    let totalDinner = 0;

    restaurentData?.forEach((item) => {
      const mealPlanMap = {};
      item.MealPlan.forEach((meal) => {
        mealPlanMap[meal.MealType] = meal.Supplement;
      });
      item.TotalCosting.forEach((cost) => {
        const mealType = cost.MealType;
        if (mealPlanMap[mealType] === "No") {
          if (mealType === "Breakfast") {
            totalBreakfast += cost.ServiceCost;
          } else if (mealType === "Lunch") {
            totalLunch += cost.ServiceCost;
          } else if (mealType === "Dinner") {
            totalDinner += cost.ServiceCost;
          }
        }
      });
    });

    const grandTotal = totalBreakfast + totalLunch + totalDinner;
    return grandTotal;
  };

  // ===============================================================

  const getServiceCosts = (data) => {
    let activityCost = null;
    let hotelCost = null;
    let flightAdultCost = null;
    let breakfastCost = null;
    let TrainCost = null;
    let AdditionalCost = null;

    const LocalDays = data.ExcortDays?.find(
      (escort) => escort.Type === "Local"
    );

    if (LocalDays && LocalDays?.Days) {
      const flightServices = LocalDays.Days?.reduce((acc, day) => {
        const flights = day.DayServices.filter(
          (service) => service.ServiceType === "Flight"
        );
        return [...acc, ...flights];
      }, []);
      const trainServices = LocalDays.Days?.reduce((acc, day) => {
        const trains = day.DayServices.filter(
          (service) => service.ServiceType === "Train"
        );
        return [...acc, ...trains];
      }, []);
      const restaurentServices = LocalDays.Days?.reduce((acc, day) => {
        const trains = day.DayServices.filter(
          (service) => service.ServiceType === "Restaurant"
        );
        return [...acc, ...trains];
      }, []);

      flightAdultCost = getFightTrainCost(flightServices);
      TrainCost = getFightTrainCost(trainServices);
      breakfastCost = getRestaurentTotalCost(restaurentServices);
    }

    if (LocalDays && LocalDays.Days) {
      for (const day of LocalDays.Days) {
        for (const service of day.DayServices) {
          if (service.ServiceType === "Activity" && activityCost === null) {
            activityCost = Number(service.TotalCosting?.ActivityCost) ?? 0;
          } else if (service.ServiceType === "Hotel" && hotelCost === null) {
            if (service.TotalCosting) {
              for (const costing of service.TotalCosting) {
                const dblRoom = costing.HotelRoomBedType.find(
                  (room) => room.RoomBedTypeName === "DBL Room"
                );
                if (dblRoom) {
                  hotelCost = Number(dblRoom.ServiceCost) / 2 ?? 0;
                  break;
                }
              }
            }
          } else if (
            service.ServiceType === "Additional" &&
            AdditionalCost === null
          ) {
            AdditionalCost = Number(service.TotalCosting?.AdditionalCost) ?? 0;
          }
          if (
            activityCost !== null &&
            hotelCost !== null &&
            TrainCost !== null &&
            flightAdultCost !== null &&
            breakfastCost !== null &&
            AdditionalCost !== null
          ) {
            break;
          }
        }
        if (
          activityCost !== null &&
          hotelCost !== null &&
          TrainCost !== null &&
          flightAdultCost !== null &&
          breakfastCost !== null &&
          AdditionalCost !== null
        ) {
          break;
        }
      }
    }

    return {
      activityCost,
      hotelCost,
      flightAdultCost,
      TrainCost,
      breakfastCost,
      AdditionalCost,
    };
  };

  const {
    activityCost,
    hotelCost,
    flightAdultCost,
    TrainCost,
    breakfastCost,
    AdditionalCost,
  } = getServiceCosts(QoutationData);

  // ===============================================================

  const updateScortFormValue = async () => {
    let Verify = QoutationData?.ExcortDays?.find(
      (escort) => escort.Type === "Local"
    );
    if (Verify?.FeeCharges && Verify.FeeCharges.length > 0) {
      const seenSlabs = new Set();
      const updatedData = Verify.FeeCharges.map((item) => {
        const slabKey = `${item.StartPax}-${item.EndPax}`;
        const isDuplicate = seenSlabs.has(slabKey);
        seenSlabs.add(slabKey);
        const foc = Number(item.Foc || 0);
        const baseMeals = item.Meals || breakfastCost || 0;
        const baseTrains = item.Trains || TrainCost || 0;
        const baseFlight = item.Flight || flightAdultCost || 0;
        const baseActivities = item.Activities || activityCost || 0;
        const baseMisc = item.Misc || AdditionalCost || 0;
        return {
          ...item,
          QueryId: queryData?.QueryAlphaNumId,
          QuotationNumber: QoutationData?.QuotationNumber,
          ExcortType: "Local",
          Foc: foc,
          BaseMeals: baseMeals, // Store base value
          BaseTrains: baseTrains,
          BaseFlight: baseFlight,
          BaseActivities: baseActivities,
          BaseMisc: baseMisc,
          Acmmomdation: isDuplicate ? 0 : item.Acmmomdation || hotelCost || 0, // No FOC multiplier
          Meals: isDuplicate ? 0 : foc > 0 ? baseMeals * foc : baseMeals,
          Trains: isDuplicate ? 0 : foc > 0 ? baseTrains * foc : baseTrains,
          Flight: isDuplicate ? 0 : foc > 0 ? baseFlight * foc : baseFlight,
          Activities: isDuplicate
            ? 0
            : foc > 0
            ? baseActivities * foc
            : baseActivities,
          Misc: isDuplicate ? 0 : foc > 0 ? baseMisc * foc : baseMisc,
          Total:
            Number(item.ExcortFee || 0) +
            Number(isDuplicate ? 0 : item.Acmmomdation || hotelCost || 0) + // No FOC multiplier
            Number(isDuplicate ? 0 : foc > 0 ? baseMeals * foc : baseMeals) +
            Number(isDuplicate ? 0 : foc > 0 ? baseFlight * foc : baseFlight) +
            Number(
              isDuplicate ? 0 : foc > 0 ? baseActivities * foc : baseActivities
            ) +
            Number(isDuplicate ? 0 : foc > 0 ? baseTrains * foc : baseTrains) +
            Number(isDuplicate ? 0 : foc > 0 ? baseMisc * foc : baseMisc),
          Particular: "",
        };
      });
      setScortFormValue(updatedData);
    } else {
      if (QoutationData?.TourSummary?.PaxTypeName == undefined) return;
      try {
        const { data } = await axiosOther.post("localescortslab", {
          PaxSlab: QoutationData?.TourSummary?.PaxTypeName,
          Default: "Yes",
        });
        const seenSlabs = new Set();
        const updatedData = data?.Data.map((item) => {
          const slabKey = `${item.StartPax}-${item.EndPax}`;
          const isDuplicate = seenSlabs.has(slabKey);
          seenSlabs.add(slabKey);
          const foc = 0; // Default Foc to 0
          const baseMeals = breakfastCost || 0;
          const baseTrains = TrainCost || 0;
          const baseFlight = flightAdultCost || 0;
          const baseActivities = activityCost || 0;
          const baseMisc = AdditionalCost || 0;
          return {
            ...item,
            QueryId: queryData?.QueryAlphaNumId,
            QuotationNumber: QoutationData?.QuotationNumber,
            ExcortType: "Local",
            FromDay: 1,
            ToDay: 1,
            ExcortFee: 1 * item.Fee,
            AmountPerDay: item.Fee,
            Foc: foc,
            BaseMeals: baseMeals,
            BaseTrains: baseTrains,
            BaseFlight: baseFlight,
            BaseActivities: baseActivities,
            BaseMisc: baseMisc,
            Acmmomdation: isDuplicate ? 0 : hotelCost || 0, // No FOC multiplier
            Meals: isDuplicate ? 0 : foc > 0 ? baseMeals * foc : baseMeals,
            Trains: isDuplicate ? 0 : foc > 0 ? baseTrains * foc : baseTrains,
            Flight: isDuplicate ? 0 : foc > 0 ? baseFlight * foc : baseFlight,
            Activities: isDuplicate
              ? 0
              : foc > 0
              ? baseActivities * foc
              : baseActivities,
            Misc: isDuplicate ? 0 : foc > 0 ? baseMisc * foc : baseMisc,
            TotalDays: 1,
            Total:
              item.Fee +
              (isDuplicate ? 0 : hotelCost || 0) + // No FOC multiplier
              (isDuplicate ? 0 : foc > 0 ? baseMeals * foc : baseMeals) +
              (isDuplicate ? 0 : foc > 0 ? baseFlight * foc : baseFlight) +
              (isDuplicate
                ? 0
                : foc > 0
                ? baseActivities * foc
                : baseActivities) +
              (isDuplicate ? 0 : foc > 0 ? baseTrains * foc : baseTrains) +
              (isDuplicate ? 0 : foc > 0 ? baseMisc * foc : baseMisc),
            Particular: "",
          };
        });
        setScortFormValue(updatedData);
      } catch (error) {
        notifyError("Failed to fetch escort slab data.");
      }
    }
  };

  useEffect(() => {
    updateScortFormValue();
  }, [
    QoutationData?.Days,
    flightAdultCost,
    hotelCost,
    activityCost,
    TrainCost,
    breakfastCost,
    AdditionalCost,
  ]);

  // ===============================================================

  const handleEscortIncrement = (index) => {
    setScortFormValue((prevArr) => {
      const lastRow = prevArr[index] || prevArr[prevArr.length - 1];
      const slabKey = `${lastRow?.StartPax}-${lastRow?.EndPax}`;
      const isDuplicate = prevArr.some(
        (item, idx) =>
          idx !== index && `${item.StartPax}-${item.EndPax}` === slabKey
      );
      const foc = Number(lastRow?.Foc || 0);
      const baseMeals = lastRow?.BaseMeals || breakfastCost || 0;
      const baseTrains = lastRow?.BaseTrains || TrainCost || 0;
      const baseFlight = lastRow?.BaseFlight || flightAdultCost || 0;
      const baseActivities = lastRow?.BaseActivities || activityCost || 0;
      const baseMisc = lastRow?.BaseMisc || AdditionalCost || 0;
      const newRow = {
        ...localEscortChargesInitialValue,
        ExcortType: "Local",
        QuotationNumber: QoutationData?.QuotationNumber,
        QueryId: queryData?.QueryAlphaNumId,
        StartPax: lastRow?.StartPax || 0,
        EndPax: lastRow?.EndPax || 0,
        Foc: foc,
        BaseMeals: baseMeals,
        BaseTrains: baseTrains,
        BaseFlight: baseFlight,
        BaseActivities: baseActivities,
        BaseMisc: baseMisc,
        Acmmomdation: isDuplicate ? 0 : lastRow?.Acmmomdation || hotelCost || 0, // No FOC multiplier
        Meals: isDuplicate ? 0 : foc > 0 ? baseMeals * foc : baseMeals,
        Trains: isDuplicate ? 0 : foc > 0 ? baseTrains * foc : baseTrains,
        Flight: isDuplicate ? 0 : foc > 0 ? baseFlight * foc : baseFlight,
        Activities: isDuplicate
          ? 0
          : foc > 0
          ? baseActivities * foc
          : baseActivities,
        Misc: isDuplicate ? 0 : foc > 0 ? baseMisc * foc : baseMisc,
        TotalDays: lastRow?.TotalDays || 1,
        AmountPerDay: lastRow?.AmountPerDay || 0,
        ExcortFee: lastRow?.ExcortFee || 0,
        Total:
          Number(lastRow?.ExcortFee || 0) +
          Number(isDuplicate ? 0 : lastRow?.Acmmomdation || hotelCost || 0) + // No FOC multiplier
          Number(isDuplicate ? 0 : foc > 0 ? baseMeals * foc : baseMeals) +
          Number(isDuplicate ? 0 : foc > 0 ? baseFlight * foc : baseFlight) +
          Number(
            isDuplicate ? 0 : foc > 0 ? baseActivities * foc : baseActivities
          ) +
          Number(isDuplicate ? 0 : foc > 0 ? baseTrains * foc : baseTrains) +
          Number(isDuplicate ? 0 : foc > 0 ? baseMisc * foc : baseMisc),
      };
      const newArr = [
        ...prevArr.slice(0, index + 1),
        newRow,
        ...prevArr.slice(index + 1),
      ];
      const seenSlabs = new Set();
      const updatedArr = newArr.map((item) => {
        const slabKey = `${item.StartPax}-${item.EndPax}`;
        const isDuplicateSlab = seenSlabs.has(slabKey);
        seenSlabs.add(slabKey);
        const foc = Number(item.Foc || 0);
        const baseMeals = item.BaseMeals || breakfastCost || 0;
        const baseTrains = item.BaseTrains || TrainCost || 0;
        const baseFlight = item.BaseFlight || flightAdultCost || 0;
        const baseActivities = item.BaseActivities || activityCost || 0;
        const baseMisc = item.BaseMisc || AdditionalCost || 0;
        return {
          ...item,
          Acmmomdation: isDuplicateSlab
            ? 0
            : item.Acmmomdation || hotelCost || 0, // No FOC multiplier
          Meals: isDuplicateSlab ? 0 : foc > 0 ? baseMeals * foc : baseMeals,
          Trains: isDuplicateSlab ? 0 : foc > 0 ? baseTrains * foc : baseTrains,
          Flight: isDuplicateSlab ? 0 : foc > 0 ? baseFlight * foc : baseFlight,
          Activities: isDuplicateSlab
            ? 0
            : foc > 0
            ? baseActivities * foc
            : baseActivities,
          Misc: isDuplicateSlab ? 0 : foc > 0 ? baseMisc * foc : baseMisc,
          Total:
            Number(item.ExcortFee || 0) +
            Number(isDuplicateSlab ? 0 : item.Acmmomdation || hotelCost || 0) + // No FOC multiplier
            Number(
              isDuplicateSlab ? 0 : foc > 0 ? baseMeals * foc : baseMeals
            ) +
            Number(
              isDuplicateSlab ? 0 : foc > 0 ? baseFlight * foc : baseFlight
            ) +
            Number(
              isDuplicateSlab
                ? 0
                : foc > 0
                ? baseActivities * foc
                : baseActivities
            ) +
            Number(
              isDuplicateSlab ? 0 : foc > 0 ? baseTrains * foc : baseTrains
            ) +
            Number(isDuplicateSlab ? 0 : foc > 0 ? baseMisc * foc : baseMisc),
        };
      });
      return updatedArr;
    });
  };

  // ===============================================================

  const handleEscortDecrement = (index) => {
    if (scortFormValue.length > 1) {
      const filteredScort = scortFormValue.filter((item, idx) => idx !== index);
      const seenSlabs = new Set();
      const updatedScort = filteredScort.map((item) => {
        const slabKey = `${item.StartPax}-${item.EndPax}`;
        const isDuplicate = seenSlabs.has(slabKey);
        seenSlabs.add(slabKey);
        const foc = Number(item.Foc || 0);
        const baseMeals = item.BaseMeals || breakfastCost || 0;
        const baseTrains = item.BaseTrains || TrainCost || 0;
        const baseFlight = item.BaseFlight || flightAdultCost || 0;
        const baseActivities = item.BaseActivities || activityCost || 0;
        const baseMisc = item.BaseMisc || AdditionalCost || 0;
        return {
          ...item,
          Acmmomdation: isDuplicate ? 0 : item.Acmmomdation || hotelCost || 0, // No FOC multiplier
          Meals: isDuplicate ? 0 : foc > 0 ? baseMeals * foc : baseMeals,
          Trains: isDuplicate ? 0 : foc > 0 ? baseTrains * foc : baseTrains,
          Flight: isDuplicate ? 0 : foc > 0 ? baseFlight * foc : baseFlight,
          Activities: isDuplicate
            ? 0
            : foc > 0
            ? baseActivities * foc
            : baseActivities,
          Misc: isDuplicate ? 0 : foc > 0 ? baseMisc * foc : baseMisc,
          Total:
            Number(item.ExcortFee || 0) +
            Number(isDuplicate ? 0 : item.Acmmomdation || hotelCost || 0) + // No FOC multiplier
            Number(isDuplicate ? 0 : foc > 0 ? baseMeals * foc : baseMeals) +
            Number(isDuplicate ? 0 : foc > 0 ? baseFlight * foc : baseFlight) +
            Number(
              isDuplicate ? 0 : foc > 0 ? baseActivities * foc : baseActivities
            ) +
            Number(isDuplicate ? 0 : foc > 0 ? baseTrains * foc : baseTrains) +
            Number(isDuplicate ? 0 : foc > 0 ? baseMisc * foc : baseMisc),
        };
      });
      setScortFormValue(updatedScort);
    }
  };

  // ===============================================================

  const handleEscortChange = (index, e) => {
    const { name, value } = e.target;

    setScortFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };

      if (newArr[index].calcTimeout) {
        clearTimeout(newArr[index].calcTimeout);
      }

      newArr[index].calcTimeout = setTimeout(() => {
        if (name === "FromDay" || name === "ToDay") {
          const fromDay = parseInt(newArr[index].FromDay) || 0;
          const toDay = parseInt(newArr[index].ToDay) || 0;

          if (toDay < fromDay) {
            notifyError("To Day cannot be earlier than From Day.");
            return;
          }

          newArr[index].TotalDays = toDay >= fromDay ? toDay - fromDay + 1 : 0;
          const amountPerDay = parseFloat(newArr[index].AmountPerDay) || 0;
          newArr[index].ExcortFee = newArr[index].TotalDays * amountPerDay;
        }

        if (name === "AmountPerDay") {
          const amountPerDay = parseFloat(value) || 0;
          const totalDays = parseInt(newArr[index].TotalDays) || 0;
          newArr[index].ExcortFee = totalDays * amountPerDay;
        }

        if (name === "ExcortFee") {
          const excortFee = parseFloat(value) || 0;
          const totalDays = parseInt(newArr[index].TotalDays) || 0;
          newArr[index].AmountPerDay =
            totalDays > 0 ? excortFee / totalDays : 0;
        }

        // Handle FOC changes or other field updates
        const seenSlabs = new Set();
        const updatedArr = newArr.map((item, idx) => {
          const slabKey = `${item.StartPax}-${item.EndPax}`;
          const isDuplicate = seenSlabs.has(slabKey);
          seenSlabs.add(slabKey);
          const foc = Number(item.Foc || 0);
          const baseMeals = item.BaseMeals || breakfastCost || 0;
          const baseTrains = item.BaseTrains || TrainCost || 0;
          const baseFlight = item.BaseFlight || flightAdultCost || 0;
          const baseActivities = item.BaseActivities || activityCost || 0;
          const baseMisc = item.BaseMisc || AdditionalCost || 0;
          return {
            ...item,
            Acmmomdation: isDuplicate ? 0 : item.Acmmomdation || hotelCost || 0, // No FOC multiplier
            Meals: isDuplicate ? 0 : foc > 0 ? baseMeals * foc : baseMeals,
            Trains: isDuplicate ? 0 : foc > 0 ? baseTrains * foc : baseTrains,
            Flight: isDuplicate ? 0 : foc > 0 ? baseFlight * foc : baseFlight,
            Activities: isDuplicate
              ? 0
              : foc > 0
              ? baseActivities * foc
              : baseActivities,
            Misc: isDuplicate ? 0 : foc > 0 ? baseMisc * foc : baseMisc,
            Total:
              Number(item.ExcortFee || 0) +
              Number(isDuplicate ? 0 : item.Acmmomdation || hotelCost || 0) + // No FOC multiplier
              Number(isDuplicate ? 0 : foc > 0 ? baseMeals * foc : baseMeals) +
              Number(
                isDuplicate ? 0 : foc > 0 ? baseFlight * foc : baseFlight
              ) +
              Number(
                isDuplicate
                  ? 0
                  : foc > 0
                  ? baseActivities * foc
                  : baseActivities
              ) +
              Number(
                isDuplicate ? 0 : foc > 0 ? baseTrains * foc : baseTrains
              ) +
              Number(isDuplicate ? 0 : foc > 0 ? baseMisc * foc : baseMisc),
          };
        });

        setScortFormValue([...updatedArr]);
      }, 300);

      return newArr;
    });
  };

  // ===============================================================

  const handleFinalSave = async () => {
    try {
      const { data } = await axiosOther.post(
        "add-feesCharge-excort-days",
        scortFormValue
      );
      if (data?.status == 1 || data?.Status == 1) {
        notifySuccess(data?.Message);
      }
    } catch (error) {
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
      }
    }
  };

  return (
    <div className="row mt-3 m-0">
      <div className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg">
        <div className="d-flex gap-2 align-items-center">
          <p className="m-0 text-dark">Local Escort Charges</p>
        </div>
      </div>
      <div className="col-12 px-0 mt-2">
        <PerfectScrollbar>
          <table className="table table-bordered itinerary-table">
            <thead>
              <tr>
                <th>Start Pax</th>
                <th>End Pax</th>
                <th>No.</th>
                <th>From day</th>
                <th>To</th>
                <th>Total Days</th>
                <th>Perday</th>
                <th>Escort Fees</th>
                <th>Accommodation</th>
                <th>Meals</th>
                <th>Trains</th>
                <th>Flight</th>
                <th>Activities</th>
                <th>Misc</th>
                <th>Total</th>
                <th>Particular</th>
              </tr>
            </thead>
            <tbody>
              {scortFormValue?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div className="d-flex gap-2 justify-content-center align-items-center">
                        <div>
                          <span onClick={() => handleEscortIncrement(index)}>
                            <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                          </span>
                        </div>
                        <div>
                          <span onClick={() => handleEscortDecrement(index)}>
                            <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                          </span>
                        </div>
                        <div>
                          <input
                            type="number"
                            id="StartPax"
                            name="StartPax"
                            className="formControl1 width50px"
                            value={scortFormValue[index]?.StartPax}
                            onChange={(e) => handleEscortChange(index, e)}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          id="EndPax"
                          name="EndPax"
                          className="formControl1 width50px"
                          value={scortFormValue[index]?.EndPax}
                          onChange={(e) => handleEscortChange(index, e)}
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          id="Foc"
                          name="Foc"
                          className="formControl1 width50px"
                          value={scortFormValue[index]?.Foc || 0}
                          onChange={(e) => handleEscortChange(index, e)}
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <select
                          name="FromDay"
                          className="formControl1"
                          value={scortFormValue[index]?.FromDay}
                          onChange={(e) => handleEscortChange(index, e)}
                        >
                          {[
                            ...new Set(
                              qoutationData?.Days?.map((day) => day?.Day)
                            ),
                          ].map((uniqueDay, index) => (
                            <option value={uniqueDay} key={index}>
                              Day {uniqueDay}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>
                      <div>
                        <select
                          name="ToDay"
                          className="formControl1"
                          value={scortFormValue[index]?.ToDay}
                          onChange={(e) => handleEscortChange(index, e)}
                        >
                          {[
                            ...new Set(
                              qoutationData?.Days?.map((day) => day?.Day)
                            ),
                          ].map((uniqueDay, index) => (
                            <option value={uniqueDay} key={index}>
                              Day {uniqueDay}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          id="TotalDays"
                          name="TotalDays"
                          className="formControl1 width50px"
                          value={scortFormValue[index]?.TotalDays}
                          readOnly
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          id="AmountPerDay"
                          name="AmountPerDay"
                          className="formControl1 width50px"
                          value={parseInt(scortFormValue[index]?.AmountPerDay)}
                          onChange={(e) => handleEscortChange(index, e)}
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          id="ExcortFee"
                          name="ExcortFee"
                          className="formControl1 width50px"
                          value={parseInt(scortFormValue[index]?.ExcortFee)}
                          onChange={(e) => handleEscortChange(index, e)}
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          id="Acmmomdation"
                          name="Acmmomdation"
                          className="formControl1 width50px"
                          value={parseInt(scortFormValue[index]?.Acmmomdation)}
                          onChange={(e) => handleEscortChange(index, e)}
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          id="Meals"
                          name="Meals"
                          className="formControl1 width50px"
                          value={parseInt(scortFormValue[index]?.Meals)}
                          onChange={(e) => handleEscortChange(index, e)}
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          id="Trains"
                          name="Trains"
                          className="formControl1 width50px"
                          value={parseInt(scortFormValue[index]?.Trains)}
                          onChange={(e) => handleEscortChange(index, e)}
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          id="Flight"
                          name="Flight"
                          className="formControl1 width50px"
                          value={parseInt(scortFormValue[index]?.Flight)}
                          onChange={(e) => handleEscortChange(index, e)}
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          id="Activities"
                          name="Activities"
                          className="formControl1 width50px"
                          value={parseInt(scortFormValue[index]?.Activities)}
                          onChange={(e) => handleEscortChange(index, e)}
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          id="Misc"
                          name="Misc"
                          className="formControl1 width50px"
                          value={parseInt(scortFormValue[index]?.Misc)}
                          onChange={(e) => handleEscortChange(index, e)}
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          id="Total"
                          name="Total"
                          className="formControl1 width50px"
                          value={parseInt(scortFormValue[index]?.Total)}
                          readOnly
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="text"
                          id="Particular"
                          name="Particular"
                          className="formControl1 width50px"
                          value={scortFormValue[index]?.Particular}
                          onChange={(e) => handleEscortChange(index, e)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </PerfectScrollbar>
      </div>
      <div className="col-12 d-flex justify-content-end align-items-end">
        <button
          className="btn btn-primary py-1 px-2 radius-4 d-flex align-items-center gap-1"
          onClick={handleFinalSave}
        >
          <i className="fa-solid fa-floppy-disk fs-4"></i>Save
        </button>
      </div>
    </div>
  );
};

export default TourEscort;
