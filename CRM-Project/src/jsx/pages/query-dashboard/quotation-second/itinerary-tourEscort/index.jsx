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
  const [languageList, setLanguageList] = useState([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState("");
  const { qoutationData, queryData } = useSelector(
    (data) => data?.queryReducer
  );
  // console.log(QoutationData?.ExcortDays, "QoutationData12345");

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

  async function fetchLanguageList() {
    try {
      const { data } = await axiosOther.post("languagelist");
      setLanguageList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    fetchLanguageList();
  }, []);

  useEffect(() => {
    if (QoutationData?.ExcortDays?.[0]?.FeeCharges?.[0]?.LanguageID) {
      setSelectedLanguageId(
        QoutationData.ExcortDays[0].FeeCharges[0].LanguageID
      );
    }
  }, [QoutationData]);

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
    console.log(restaurentData, "WATFSGSGS");
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

      console.log(LocalDays, "WATSTTDTD", restaurentServices);

      const additionalService = LocalDays.Days?.reduce((acc, day) => {
        const trains = day.DayServices.filter(
          (service) => service.ServiceType === "Additional"
        );
        return [...acc, ...trains];
      }, []);

      if (additionalService?.length > 0) {
        AdditionalCost = additionalService?.reduce((total, item) => {
          if (item.AdditionalCost && item.AdditionalCost.length > 0) {
            return (
              total +
              item.AdditionalCost.reduce((subTotal, cost) => {
                return subTotal + (parseFloat(cost.Amount) || 0);
              }, 0)
            );
          }
          return total;
        }, 0);
      }

      flightAdultCost = getFightTrainCost(flightServices);
      TrainCost = getFightTrainCost(trainServices);
      breakfastCost = getRestaurentTotalCost(restaurentServices);
    }

    console.log(breakfastCost, "breakfastCost27");

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

  // Compute maxDay
  const maxDay =
    QoutationData?.Days?.length > 0
      ? Math.max(...QoutationData.Days.map((d) => d.Day))
      : 1;

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
        const multiplier = foc > 0 ? foc : 1;
        const baseMeals = Number(item.Meals || 0) / multiplier;
        const baseTrains = Number(item.Trains || 0) / multiplier;
        const baseFlight = Number(item.Flight || 0) / multiplier;
        const baseActivities = Number(item.Activities || 0) / multiplier;
        const baseMisc = Number(item.Misc || 0) / multiplier;
        const baseExcortFee = Number(item.ExcortFee || 0) / multiplier;
        const baseAcmmomdation = Number(item.Acmmomdation || 0);
        return {
          ...item,
          QueryId: queryData?.QueryAlphaNumId,
          QuotationNumber: QoutationData?.QuotationNumber,
          ExcortType: "Local",
          Foc: foc,
          BaseMeals: baseMeals,
          BaseTrains: baseTrains,
          BaseFlight: baseFlight,
          BaseActivities: baseActivities,
          BaseMisc: baseMisc,
          BaseExcortFee: baseExcortFee,
          BaseAcmmomdation: baseAcmmomdation,
          Acmmomdation: isDuplicate ? 0 : baseAcmmomdation,
          Meals: isDuplicate ? 0 : baseMeals * multiplier,
          Trains: isDuplicate ? 0 : baseTrains * multiplier,
          Flight: isDuplicate ? 0 : baseFlight * multiplier,
          Activities: isDuplicate ? 0 : baseActivities * multiplier,
          Misc: isDuplicate ? 0 : baseMisc * multiplier,
          ExcortFee: baseExcortFee * multiplier,
          Total:
            Number(baseExcortFee * multiplier) +
            Number(isDuplicate ? 0 : baseAcmmomdation) +
            Number(isDuplicate ? 0 : baseMeals * multiplier) +
            Number(isDuplicate ? 0 : baseFlight * multiplier) +
            Number(isDuplicate ? 0 : baseActivities * multiplier) +
            Number(isDuplicate ? 0 : baseTrains * multiplier) +
            Number(isDuplicate ? 0 : baseMisc * multiplier),
          Particular: item.Particular || "",
          LanguageID: selectedLanguageId || item.LanguageID || "",
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
          const multiplier = foc > 0 ? foc : 1;
          const baseMeals = Number(breakfastCost || 0);
          const baseTrains = Number(TrainCost || 0);
          const baseFlight = Number(flightAdultCost || 0);
          const baseActivities = Number(activityCost || 0);
          const baseMisc = Number(AdditionalCost || 0);
          const baseExcortFee = Number(item.Fee * (maxDay - 1 + 1));
          const baseAcmmomdation = Number(hotelCost || 0);
          const totalDays = maxDay - 1 + 1;
          return {
            ...item,
            QueryId: queryData?.QueryAlphaNumId,
            QuotationNumber: QoutationData?.QuotationNumber,
            ExcortType: "Local",
            FromDay: 1,
            ToDay: maxDay,
            ExcortFee: baseExcortFee * multiplier,
            AmountPerDay: item.Fee,
            Foc: foc,
            BaseMeals: baseMeals,
            BaseTrains: baseTrains,
            BaseFlight: baseFlight,
            BaseActivities: baseActivities,
            BaseMisc: baseMisc,
            BaseExcortFee: baseExcortFee,
            BaseAcmmomdation: baseAcmmomdation,
            Acmmomdation: isDuplicate ? 0 : baseAcmmomdation,
            Meals: isDuplicate ? 0 : baseMeals * multiplier,
            Trains: isDuplicate ? 0 : baseTrains * multiplier,
            Flight: isDuplicate ? 0 : baseFlight * multiplier,
            Activities: isDuplicate ? 0 : baseActivities * multiplier,
            Misc: isDuplicate ? 0 : baseMisc * multiplier,
            TotalDays: totalDays,
            Total:
              Number(baseExcortFee * multiplier) +
              Number(isDuplicate ? 0 : baseAcmmomdation) +
              Number(isDuplicate ? 0 : baseMeals * multiplier) +
              Number(isDuplicate ? 0 : baseFlight * multiplier) +
              Number(isDuplicate ? 0 : baseActivities * multiplier) +
              Number(isDuplicate ? 0 : baseTrains * multiplier) +
              Number(isDuplicate ? 0 : baseMisc * multiplier),
            Particular: "",
            LanguageID: selectedLanguageId || "",
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
      const foc = Number(lastRow?.Foc || 0);
      const multiplier = foc > 0 ? foc : 1;
      const newRow = {
        ...localEscortChargesInitialValue,
        ExcortType: "Local",
        QuotationNumber: QoutationData?.QuotationNumber,
        QueryId: queryData?.QueryAlphaNumId,
        StartPax: lastRow?.StartPax || 0,
        EndPax: lastRow?.EndPax || 0,
        FromDay: lastRow?.FromDay || 1,
        ToDay: lastRow?.ToDay || maxDay,
        Foc: foc,
        BaseMeals: lastRow?.BaseMeals || Number(breakfastCost || 0),
        BaseTrains: lastRow?.BaseTrains || Number(TrainCost || 0),
        BaseFlight: lastRow?.BaseFlight || Number(flightAdultCost || 0),
        BaseActivities: lastRow?.BaseActivities || Number(activityCost || 0),
        BaseMisc: lastRow?.BaseMisc || Number(AdditionalCost || 0),
        BaseExcortFee: lastRow?.BaseExcortFee || 0,
        BaseAcmmomdation: lastRow?.BaseAcmmomdation || Number(hotelCost || 0),
        TotalDays: lastRow?.TotalDays || maxDay - 1 + 1,
        AmountPerDay: lastRow?.AmountPerDay || 0,
        Particular: lastRow?.Particular || "",
        LanguageID: selectedLanguageId || "",
      };
      const newArr = [
        ...prevArr.slice(0, index + 1),
        newRow,
        ...prevArr.slice(index + 1),
      ];
      const seenSlabs = new Set();
      const updatedArr = newArr.map((item) => {
        const slabKey = `${item.StartPax}-${item.EndPax}`;
        const isDuplicate = seenSlabs.has(slabKey);
        seenSlabs.add(slabKey);
        const foc = Number(item.Foc || 0);
        const multiplier = foc > 0 ? foc : 1;
        const meals = isDuplicate ? 0 : item.BaseMeals * multiplier;
        const trains = isDuplicate ? 0 : item.BaseTrains * multiplier;
        const flight = isDuplicate ? 0 : item.BaseFlight * multiplier;
        const activities = isDuplicate ? 0 : item.BaseActivities * multiplier;
        const misc = isDuplicate ? 0 : item.BaseMisc * multiplier;
        const excortFee = item.BaseExcortFee * multiplier;
        const acmmomdation = isDuplicate ? 0 : item.BaseAcmmomdation;
        return {
          ...item,
          Acmmomdation: acmmomdation,
          Meals: meals,
          Trains: trains,
          Flight: flight,
          Activities: activities,
          Misc: misc,
          ExcortFee: excortFee,
          Total:
            Number(excortFee) +
            Number(acmmomdation) +
            Number(meals) +
            Number(flight) +
            Number(activities) +
            Number(trains) +
            Number(misc),
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
        const multiplier = foc > 0 ? foc : 1;
        const meals = isDuplicate ? 0 : item.BaseMeals * multiplier;
        const trains = isDuplicate ? 0 : item.BaseTrains * multiplier;
        const flight = isDuplicate ? 0 : item.BaseFlight * multiplier;
        const activities = isDuplicate ? 0 : item.BaseActivities * multiplier;
        const misc = isDuplicate ? 0 : item.BaseMisc * multiplier;
        const excortFee = item.BaseExcortFee * multiplier;
        const acmmomdation = isDuplicate ? 0 : item.BaseAcmmomdation;
        return {
          ...item,
          Acmmomdation: acmmomdation,
          Meals: meals,
          Trains: trains,
          Flight: flight,
          Activities: activities,
          Misc: misc,
          ExcortFee: excortFee,
          Total:
            Number(excortFee) +
            Number(acmmomdation) +
            Number(meals) +
            Number(flight) +
            Number(activities) +
            Number(trains) +
            Number(misc),
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

      const foc = Number(newArr[index].Foc || 0);
      const multiplier = foc > 0 ? foc : 1;

      if (
        [
          "Meals",
          "Trains",
          "Flight",
          "Activities",
          "Misc",
          "ExcortFee",
        ].includes(name)
      ) {
        newArr[index][`Base${name}`] = Number(value) / multiplier || 0;
      } else if (name === "Acmmomdation") {
        newArr[index].BaseAcmmomdation = Number(value) || 0;
      }

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

          const oldTotalDays = newArr[index].TotalDays;
          newArr[index].TotalDays = toDay >= fromDay ? toDay - fromDay + 1 : 0;
          // Keep AmountPerDay fixed, update BaseExcortFee
          newArr[index].BaseExcortFee =
            (newArr[index].AmountPerDay || 0) * newArr[index].TotalDays;
        }

        if (name === "AmountPerDay") {
          const amountPerDay = parseFloat(value) || 0;
          const totalDays = parseInt(newArr[index].TotalDays) || 0;
          newArr[index].BaseExcortFee = amountPerDay * totalDays;
        }

        if (name === "ExcortFee") {
          const totalDays = parseInt(newArr[index].TotalDays) || 0;
          newArr[index].AmountPerDay =
            totalDays > 0 ? newArr[index].BaseExcortFee / totalDays : 0;
        }

        // Handle FOC changes or other field updates
        const seenSlabs = new Set();
        const updatedArr = newArr.map((item, idx) => {
          const slabKey = `${item.StartPax}-${item.EndPax}`;
          const isDuplicate = seenSlabs.has(slabKey);
          seenSlabs.add(slabKey);
          const foc = Number(item.Foc || 0);
          const multiplier = foc > 0 ? foc : 1;
          const meals = isDuplicate
            ? 0
            : Number(item.BaseMeals || 0) * multiplier;
          const trains = isDuplicate
            ? 0
            : Number(item.BaseTrains || 0) * multiplier;
          const flight = isDuplicate
            ? 0
            : Number(item.BaseFlight || 0) * multiplier;
          const activities = isDuplicate
            ? 0
            : Number(item.BaseActivities || 0) * multiplier;
          const misc = isDuplicate
            ? 0
            : Number(item.BaseMisc || 0) * multiplier;
          const excortFee = Number(item.BaseExcortFee || 0) * multiplier;
          const acmmomdation = isDuplicate
            ? 0
            : Number(item.BaseAcmmomdation || hotelCost || 0);
          return {
            ...item,
            Acmmomdation: acmmomdation,
            Meals: meals,
            Trains: trains,
            Flight: flight,
            Activities: activities,
            Misc: misc,
            ExcortFee: excortFee,
            Total:
              Number(excortFee) +
              Number(acmmomdation) +
              Number(meals) +
              Number(flight) +
              Number(activities) +
              Number(trains) +
              Number(misc),
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
      <div className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg localEscort-head-bg">
        <div className="d-flex gap-2 align-items-center">
          <p className="m-0 text-dark">Local Escort Charges</p>
          <select
            name="Language"
            id=""
            className="formControl1"
            value={selectedLanguageId}
            onChange={(e) => {
              const languageId = e.target.value;
              setSelectedLanguageId(languageId);
              // Update LanguageID in all scortFormValue rows
              setScortFormValue((prevArr) =>
                prevArr.map((item) => ({
                  ...item,
                  LanguageID: languageId,
                }))
              );
            }}
          >
            <option value="">Select</option>
            {languageList?.map((language, index) => {
              return (
                <option value={language?.id} key={index + "n"}>
                  {language?.Name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="col-12 px-0 mt-2">
        <PerfectScrollbar>
          <table className="table table-bordered itinerary-table">
            <thead>
              <tr>
                <th>Start Pax</th>
                <th>End Pax</th>
                <th>L.No.</th>
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
