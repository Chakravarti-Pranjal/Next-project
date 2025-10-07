import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { axiosOther } from "../../../../../http/axios_base_url";
import { localEscortChargesInitialValue } from "../qoutation_initial_value";
import { notifyError, notifySuccess } from "../../../../../helper/notify";

const TourEscort = () => {
  // ===============================================================

  const [scortFormValue, setScortFormValue] = useState([]);
  const [QoutationData, setQoutationData] = useState({});
  const { qoutationData, queryData } = useSelector(
    (data) => data?.queryReducer
  );

  console.log(QoutationData?.TourSummary?.PaxTypeName, "BCVUDJ8777");

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

      console.log(data?.data[0], "listqueryquotation852");

      setQoutationData(data?.data[0]);
    } catch (error) {
      console.log(error, "error occurred");
    }
  }

  console.log(UpdateLocalEscortCharges, "updateLocalEscortCharges152");

  useEffect(() => {
    fetchQueryQuotation();
  }, [UpdateLocalEscortCharges]);

  // Call the function

  // ===============================================================

  const getServiceCosts = (data) => {
    let activityCost = null;
    let hotelCost = null;
    let flightAdultCost = null;
    let breakfastCost = null;
    let TrainCost = null;
    let AdditionalCost = null;

    // Navigate to ExcortDays where Type is "Local"
    const LocalDays = data.ExcortDays?.find(
      (escort) => escort.Type === "Local"
    );

    console.log(LocalDays, "LocalDays456");

    if (LocalDays && LocalDays.Days) {
      // Iterate through each day
      for (const day of LocalDays.Days) {
        // Check DayServices for Activity, Hotel, and Flight services
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
            service.ServiceType === "Flight" &&
            flightAdultCost === null
          ) {
            flightAdultCost =
              Number(
                (service.TotalCosting?.ServiceAdultCost || 0) +
                  (service.TotalCosting?.ServiceChildCost || 0) +
                  (service?.ServiceCharges || 0) +
                  (service?.HandlingCharges || 0) +
                  (service?.GuideCharges || 0)
              ) ?? 0;
          } else if (service.ServiceType === "Train" && TrainCost === null) {
            TrainCost =
              Number(
                (service.TotalCosting?.ServiceAdultCost || 0) +
                  (service.TotalCosting?.ServiceChildCost || 0) +
                  (service?.ServiceCharges || 0) +
                  (service?.HandlingCharges || 0) +
                  (service?.GuideCharges || 0)
              ) ?? 0;
          } else if (
            service.ServiceType === "Restaurant" &&
            breakfastCost === null
          ) {
            if (service.TotalCosting) {
              const breakfastCosting = service.TotalCosting.find(
                (costing) => costing.MealType === "Breakfast"
              );
              if (breakfastCosting) {
                breakfastCost = Number(breakfastCosting.TotalServiceCost) ?? 0;
              }
            }
          } else if (
            service.ServiceType === "Additional" &&
            AdditionalCost === null
          ) {
            AdditionalCost = Number(service.TotalCosting?.AdditionalCost) ?? 0;
          }
          // Break if all costs are found
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

  // Get the costs
  const {
    activityCost,
    hotelCost,
    flightAdultCost,
    TrainCost,
    breakfastCost,
    AdditionalCost,
  } = getServiceCosts(QoutationData);

  // ===============================================================

  console.log(QoutationData, "QoutationData658");

  const updateScortFormValue = async () => {
    let Verify = QoutationData?.ExcortDays?.find(
      (escort) => escort.Type === "Local"
    );
    // Check if Verify?.FeeCharges exists and has data
    if (Verify?.FeeCharges && Verify.FeeCharges.length > 0) {
      const updatedData = Verify.FeeCharges.map((item) => ({
        ...item,
        QueryId: queryData?.QueryAlphaNumId,
        QuotationNumber: QoutationData?.QuotationNumber,
        ExcortType: "Local",
        Flight: flightAdultCost || item.Flight || 0,
        Acmmomdation: hotelCost || item.Acmmomdation || 0,
        Meals: breakfastCost || item.Meals || 0,
        Activities: activityCost || item.Activities || 0,
        Trains: TrainCost || item.Trains || 0,
        Misc: AdditionalCost || item.Misc || 0,
        // also recalc Total
        Total:
          Number(item.ExcortFee || 0) +
          Number(hotelCost || item.Acmmomdation || 0) +
          Number(breakfastCost || item.Meals || 0) +
          Number(flightAdultCost || item.Flight || 0) +
          Number(activityCost || item.Activities || 0) +
          Number(TrainCost || item.Trains || 0) +
          Number(AdditionalCost || item.Misc || 0),
        Particular: "",
      }));
      console.log(updatedData, "updatedData123");
      setScortFormValue(updatedData);
    } else {
      console.log(QoutationData?.TourSummary?.PaxTypeName, "BCVHD8777");
      if (QoutationData?.TourSummary?.PaxTypeName == undefined) return;
      try {
        const { data } = await axiosOther.post("localescortslab", {
          PaxSlab: QoutationData?.TourSummary?.PaxTypeName,
          Default: "Yes",
        });
        const updatedData = data?.Data.map((item) => ({
          ...item,
          QueryId: queryData?.QueryAlphaNumId,
          QuotationNumber: QoutationData?.QuotationNumber,
          ExcortType: "Local",
          FromDay: 1,
          ToDay: 1,
          ExcortFee: 1 * item.Fee,
          AmountPerDay: item.Fee,
          Flight: flightAdultCost || 0,
          Acmmomdation: hotelCost || 0,
          Meals: breakfastCost || 0,
          Activities: activityCost || 0,
          Trains: TrainCost || 0,
          Misc: AdditionalCost || 0,
          TotalDays: 1,
          Total:
            item.Fee +
            (hotelCost || 0) +
            (breakfastCost || 0) +
            (flightAdultCost || 0) +
            (activityCost || 0) +
            (TrainCost || 0) +
            (AdditionalCost || 0),
          Particular: "",
        }));
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

  const handleEscortIncrement = () => {
    setScortFormValue((prevArr) => {
      const lastRow = prevArr[prevArr.length - 1];
      const newRow = {
        ...localEscortChargesInitialValue,
        QuotationNumber: QoutationData?.QuotationNumber,
        QueryId: queryData?.QueryAlphaNumId,
        // Copy Accommodation, Meals, etc. from last row
        Acmmomdation: lastRow?.Acmmomdation || 0,
        Meals: lastRow?.Meals || 0,
        Trains: lastRow?.Trains || 0,
        Flight: lastRow?.Flight || 0,
        Activities: lastRow?.Activities || 0,
        Misc: lastRow?.Misc || 0,
        // AmountPerDay: lastRow?.AmountPerDay || 0,
      };
      return [...prevArr, newRow];
    });
  };

  // ===============================================================

  const handleEscortDecrement = (ind) => {
    const filteredScort = scortFormValue?.filter((item, index) => index != ind);
    setScortFormValue(filteredScort);
  };

  // ===============================================================

  const handleEscortChange = (index, e) => {
    const { name, value } = e.target;

    setScortFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };

      // Clear any existing timeout for this index
      if (newArr[index].calcTimeout) {
        clearTimeout(newArr[index].calcTimeout);
      }

      // Debounce the calculation
      newArr[index].calcTimeout = setTimeout(() => {
        // Handle FromDay or ToDay changes
        if (name === "FromDay" || name === "ToDay") {
          const fromDay = parseInt(newArr[index].FromDay) || 0;
          const toDay = parseInt(newArr[index].ToDay) || 0;

          // Validate ToDay is not earlier than FromDay
          if (toDay < fromDay) {
            notifyError("To Day cannot be earlier than From Day.");
            return;
          }

          // Calculate TotalDays
          newArr[index].TotalDays = toDay >= fromDay ? toDay - fromDay + 1 : 0;

          // Recalculate ExcortFee based on AmountPerDay
          const amountPerDay = parseFloat(newArr[index].AmountPerDay) || 0;
          newArr[index].ExcortFee = newArr[index].TotalDays * amountPerDay;
        }

        // Handle AmountPerDay changes
        if (name === "AmountPerDay") {
          const amountPerDay = parseFloat(value) || 0;
          const totalDays = parseInt(newArr[index].TotalDays) || 0;
          newArr[index].ExcortFee = totalDays * amountPerDay;
        }

        // Handle ExcortFee changes
        if (name === "ExcortFee") {
          const excortFee = parseFloat(value) || 0;
          const totalDays = parseInt(newArr[index].TotalDays) || 0;
          newArr[index].AmountPerDay =
            totalDays > 0 ? excortFee / totalDays : 0;
        }

        // Calculate Total
        newArr[index].Total =
          Number(newArr[index].ExcortFee || 0) +
          Number(newArr[index].Acmmomdation || 0) +
          Number(newArr[index].Meals || 0) +
          Number(newArr[index].Flight || 0) +
          Number(newArr[index].Trains || 0) +
          Number(newArr[index].Activities || 0) +
          Number(newArr[index].Misc || 0);

        // Update state after calculations
        setScortFormValue([...newArr]);
      }, 300); // 300ms debounce delay

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
          <table class="table table-bordered itinerary-table">
            <thead>
              <tr>
                <th>Start Pax</th>
                <th>End Pax</th>
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
              {scortFormValue.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div className="d-flex gap-2 justify-content-center align-items-center">
                        <div>
                          {index > 0 ? (
                            <span onClick={() => handleEscortDecrement(index)}>
                              <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                          ) : (
                            <span onClick={handleEscortIncrement}>
                              <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                          )}
                        </div>
                        <div>
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
                      </div>
                    </td>{" "}
                    <td>
                      <div>
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
                      </div>
                    </td>
                    <td>
                      <div>
                        <select
                          name="FromDay"
                          className="formControl1 "
                          value={scortFormValue[index]?.FromDay}
                          onChange={(e) => handleEscortChange(index, e)}
                        >
                          {/* {QoutationData?.Days?.map((day, index) => {
                            return (
                              <option value={day?.Day} key={index}>
                                Day {day?.Day}
                              </option>
                            );
                          })} */}
                          {[
                            ...new Set(
                              qoutationData?.Days?.map((day) => day?.Day)
                            ),
                          ].map((uniqueDay, index) => {
                            return (
                              <option value={uniqueDay} key={index}>
                                Day {uniqueDay}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>
                          <select
                            name="ToDay"
                            className="formControl1 "
                            value={scortFormValue[index]?.ToDay}
                            onChange={(e) => handleEscortChange(index, e)}
                          >
                            {[
                              ...new Set(
                                qoutationData?.Days?.map((day) => day?.Day)
                              ),
                            ].map((uniqueDay, index) => {
                              return (
                                <option value={uniqueDay} key={index}>
                                  Day {uniqueDay}
                                </option>
                              );
                            })}
                            {/* {QoutationData?.Days?.map((day, index) => {
                              return (
                                <option value={day?.Day} key={index}>
                                  Day {day?.Day}
                                </option>
                              );
                            })} */}
                          </select>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>
                          <input
                            type="number"
                            id="TotalDays"
                            name="TotalDays"
                            className="formControl1 width50px"
                            value={scortFormValue[index]?.TotalDays}
                            // readOnly
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>
                          <input
                            type="number"
                            id="AmountPerDay"
                            name="AmountPerDay"
                            className="formControl1 width50px"
                            value={parseInt(
                              scortFormValue[index]?.AmountPerDay
                            )}
                            onChange={(e) => handleEscortChange(index, e)}
                            // readOnly
                          />
                        </div>
                      </div>
                    </td>{" "}
                    <td>
                      <div>
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
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>
                          <input
                            type="number"
                            id="Acmmomdation"
                            name="Acmmomdation"
                            className="formControl1 width50px"
                            value={parseInt(
                              scortFormValue[index]?.Acmmomdation
                            )}
                            onChange={(e) => handleEscortChange(index, e)}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
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
                      </div>
                    </td>
                    <td>
                      <div>
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
                      </div>
                    </td>
                    <td>
                      <div>
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
                      </div>
                    </td>
                    <td>
                      <div>
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
                      </div>
                    </td>
                    <td>
                      <div>
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
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>
                          <input
                            type="number"
                            id="Total"
                            name="Total"
                            className="formControl1 width50px"
                            value={parseInt(scortFormValue[index]?.Total)}
                            // onChange={(e) => handleEscortChange(index, e)}
                            readOnly
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
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
                      </div>
                    </td>
                    {/* <td>
                      <div>
                        <select
                          name="LanguageID"
                          id=""
                          className="formControl1 width50px"
                          value={scortFormValue[index]?.LanguageID}
                          onChange={(e) => handleEscortChange(index, e)}
                        >
                          <option value="">Select</option>
                          {languageList?.length > 0 &&
                            languageList?.map((language) => {
                              return (
                                <option value={language?.id}>
                                  {language?.Name}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                    </td> */}
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
