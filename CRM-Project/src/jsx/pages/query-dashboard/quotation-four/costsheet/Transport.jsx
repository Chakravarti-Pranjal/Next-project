import React, { useEffect, useState } from "react";
import TourManager from "./TourManager";
import { useSelector } from "react-redux";
import {
  getQueryDataFromApi,
  getQuotationDataFromApi,
} from "../utils/helper.method";
import {
  getActivityServiceList,
  getFlightServiceList,
  getGuideRateJson,
  getMonumentRateJson,
  getMonumentServiceList,
  getRestaurentServiceList,
  getTrainServiceList,
  getTransportServiceList,
  getTransportVehicleList,
  getTransportVehicleRateJson,
} from "./helper/rate.helper";
import PerfectScrollbar from "react-perfect-scrollbar";

const Transport = ({ handleNext }) => {
  const { queryQuotationData, queryFourDataRedux } = useSelector(
    (state) => state.queryQuotationFourReducer
  );
  const QueryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const CompanyUniqueId = JSON.parse(
    localStorage.getItem("token")
  )?.CompanyUniqueId;

  const [quotationData, setQuotationData] = useState({});
  const [queryData, setQueryData] = useState({});
  const [transportServiceList, setTransportServiceList] = useState({});
  const [restaurentServiceList, setRestaurentServiceList] = useState({});
  const [monumenServicetList, setMonumentServiceList] = useState({});
  const [activityServiceList, setActivityServiceList] = useState({});
  const [flightServiceList, setFlightServiceList] = useState({});
  const [trainServiceList, setTrainServiceList] = useState([]);
  const [transportVehicleList, setTransportVehicleList] = useState([]);
  const [vehicleListCost, setVehicleListCost] = useState({});
  const [editedCosts, setEditedCosts] = useState({});
  const [monumentRateJson, setMonumentRateJson] = useState({});
  const [guideRateJson, setGuideRateJson] = useState({});

  useEffect(() => {
    const runApi = async () => {
      const response = await getQuotationDataFromApi(QueryQuotation);
      const queryRes = await getQueryDataFromApi(QueryQuotation);
      const restaurentList = await getRestaurentServiceList();
      const flightList = await getFlightServiceList();
      const trainList = await getTrainServiceList();
      const vehicleList = await getTransportVehicleList();

      setTransportVehicleList(vehicleList);
      setRestaurentServiceList(restaurentList);
      setFlightServiceList(flightList);
      setTrainServiceList(trainList);
      setQueryData(queryRes[0]);
      if (response.length > 0) {
        setQuotationData(response[0]);
      }
    };

    runApi();
  }, []);

  useEffect(() => {
    const fetchApiData = async () => {
      if (quotationData?.Days?.length > 0) {
        for (const day of quotationData?.Days) {
          const hasTransport = day?.DayServices?.some(
            (service) => service.ServiceType === "Transport"
          );
          const hasMonument = day?.DayServices?.some(
            (service) => service.ServiceType === "Monument"
          );
          const hasActivity = day?.DayServices?.some(
            (service) => service.ServiceType === "Activity"
          );
          const hasGuide = day?.DayServices?.some(
            (service) => service.ServiceType === "Guide"
          );

          const transportService = day?.DayServices?.filter(
            (s) => s.ServiceType === "Transport"
          );
          const monumnetService = day?.DayServices?.filter(
            (s) => s.ServiceType === "Monument"
          );
          const guideService = day?.DayServices?.filter(
            (s) => s.ServiceType === "Guide"
          );

          if (hasGuide) {
            for (const guide of guideService) {
              const rateJson = await getGuideRateJson(
                day?.DestinationId,
                queryData,
                quotationData,
                day?.DestinationUniqueId,
                guide?.DayType,
                CompanyUniqueId
              );

              const totalPax = queryData?.PaxInfo?.TotalPax;

              const matched = rateJson?.find(
                (item) =>
                  totalPax >= Number(item.StartPax) &&
                  totalPax <= Number(item.EndPax)
              );

              setGuideRateJson((prev) => ({
                ...prev,
                [guide?.ServiceId]: matched,
              }));
            }
          }

          if (hasActivity) {
            const activityList = await getActivityServiceList(
              day?.DestinationId
            );
            setActivityServiceList((prev) => ({
              ...prev,
              [day?.DestinationId]: activityList || [],
            }));
          }

          if (hasMonument) {
            const monumentList = await getMonumentServiceList(
              day?.DestinationId
            );

            setMonumentServiceList((prev) => ({
              ...prev,
              [day?.DestinationId]: monumentList || [],
            }));

            for (const service of monumnetService) {
              const monumentRate = await getMonumentRateJson(
                service?.ServiceId
              );

              if (monumentRate?.length > 0) {
                setMonumentRateJson((prev) => ({
                  ...prev,
                  [service?.ServiceId]: monumentRate,
                }));
              }
            }
          }

          if (hasTransport) {
            const transportList = await getTransportServiceList(
              day?.DestinationId
            );

            for (const service of transportService) {
              const transport = transportList?.find(
                (u) => u.id == service?.ServiceId
              );

              const prizeJson = await getTransportVehicleRateJson(
                day?.DestinationUniqueId,
                transport?.UniqueId,
                CompanyUniqueId,
                queryData,
                quotationData
              );

              if (prizeJson?.length > 0) {
                setVehicleListCost((prev) => ({
                  ...prev,
                  [service?.ServiceId]: prizeJson,
                }));
              }
            }

            setTransportServiceList((prev) => ({
              ...prev,
              [day?.DestinationId]: transportList || [],
            }));
          }
        }
      }
    };

    fetchApiData();
  }, [quotationData?.Days]);

  const handleCostChange = (serviceUniqueId, field, value) => {
    setEditedCosts((prev) => ({
      ...prev,
      [serviceUniqueId]: {
        ...prev[serviceUniqueId],
        [field]: value === "" ? "" : Math.ceil(parseFloat(value)) || 0,
      },
    }));
  };

  const calculateMonumentEntrCost = (serviceId) => {
    const rates = monumentRateJson[serviceId] || [];
    return rates.reduce((sum, monument) => {
      const price = parseFloat(monument.IAdultPrice) || 0;
      return sum + price;
    }, 0);
  };

  const calculateGuideFitCost = (serviceId) => {
    const guideData = guideRateJson[serviceId];
    if (guideData) {
      const guideFee = parseFloat(guideData.GuideFee) || 0;
      const laFee = parseFloat(guideData.LAFee) || 0;
      const othersFee = parseFloat(guideData.OthersFee) || 0;
      return Math.ceil(guideFee + laFee + othersFee);
    }
    return 0;
  };

  const renderTableRows = () => {
    const rows = [];
    const totals = {
      entr: 0,
      miscPP: 0,
      guideFIT: 0,
      vehicles: transportVehicleList.reduce((acc, vehicle) => {
        acc[vehicle.id] = 0;
        return acc;
      }, {}),
    };

    quotationData?.Days?.forEach((day) => {
      const destinationName = day.DestinationName;
      const filterServices = day?.DayServices?.filter(
        (s) => s.ServiceType !== "Hotel"
      );

      const transportService = transportServiceList[day?.DestinationId];
      const monumentService = monumenServicetList[day?.DestinationId];
      const activityService = activityServiceList[day?.DestinationId];

      const rowSpan = filterServices.length || 1;

      filterServices.forEach((service, index) => {
        let matchVehicleCost;
        let monumentEntrCost = 0;
        let guideFitCost = 0;

        if (service?.ServiceType === "Transport") {
          matchVehicleCost = vehicleListCost[service?.ServiceId] || [];
          matchVehicleCost.forEach((cost) => {
            if (totals.vehicles.hasOwnProperty(cost.VehicleTypeId)) {
              const editedValue =
                editedCosts[service?.ServiceUniqueId]?.[cost.VehicleTypeId];
              totals.vehicles[cost.VehicleTypeId] +=
                editedValue === ""
                  ? 0
                  : editedValue !== undefined
                  ? editedValue
                  : Math.ceil(cost.TotalCost || 0);
            }
          });
        }

        if (service?.ServiceType === "Monument") {
          monumentEntrCost = calculateMonumentEntrCost(service?.ServiceId);
        }

        if (service?.ServiceType === "Guide") {
          guideFitCost = calculateGuideFitCost(service?.ServiceId);
        }

        const isFirstService = index === 0;

        const editedEntr = editedCosts[service?.ServiceUniqueId]?.entr;
        const editedMiscPP = editedCosts[service?.ServiceUniqueId]?.miscPP;
        const editedGuideFIT = editedCosts[service?.ServiceUniqueId]?.guideFIT;

        totals.entr +=
          editedEntr === ""
            ? 0
            : editedEntr !== undefined
            ? editedEntr
            : service?.ServiceType === "Monument"
            ? monumentEntrCost
            : 0;
        totals.miscPP +=
          editedMiscPP === ""
            ? 0
            : editedMiscPP !== undefined
            ? editedMiscPP
            : 0;
        totals.guideFIT +=
          editedGuideFIT === ""
            ? 0
            : editedGuideFIT !== undefined
            ? editedGuideFIT
            : service?.ServiceType === "Guide"
            ? guideFitCost
            : 0;

        rows.push(
          <tr key={service.ServiceUniqueId}>
            {isFirstService && <td rowSpan={rowSpan}>{destinationName}</td>}
            <td>{service.ServiceType}</td>
            <td>
              {service.ServiceType === "Transport" && (
                <select
                  value={service?.ServiceId}
                  className="formControl1 width60px"
                >
                  <option value="">Select</option>
                  {transportService?.length > 0 &&
                    transportService?.map((s, idx) => (
                      <option key={idx} value={s.id}>
                        {s.Name}
                      </option>
                    ))}
                </select>
              )}
              {service.ServiceType === "Restaurant" && (
                <select
                  value={service?.ServiceId}
                  className="formControl1 width60px"
                >
                  <option value="">Select</option>
                  {restaurentServiceList?.length > 0 &&
                    restaurentServiceList?.map((s, idx) => (
                      <option key={idx} value={s.id}>
                        {s.Name}
                      </option>
                    ))}
                </select>
              )}
              {service.ServiceType === "Monument" && (
                <select
                  value={service?.ServiceId}
                  className="formControl1 width60px"
                >
                  <option value="">Select</option>
                  {monumentService?.length > 0 &&
                    monumentService?.map((s, idx) => (
                      <option key={idx} value={s.id}>
                        {s.Name}
                      </option>
                    ))}
                </select>
              )}
              {service.ServiceType === "Activity" && (
                <select
                  value={service?.ServiceId}
                  className="formControl1 width60px"
                >
                  <option value="">Select</option>
                  {activityService?.length > 0 &&
                    activityService?.map((s, idx) => (
                      <option key={idx} value={s.id}>
                        {s.Name}
                      </option>
                    ))}
                </select>
              )}
              {service.ServiceType === "Flight" && (
                <select
                  value={service?.ServiceId}
                  className="formControl1 width60px"
                >
                  <option value="">Select</option>
                  {flightServiceList?.length > 0 &&
                    flightServiceList?.map((s, idx) => (
                      <option key={idx} value={s.id}>
                        {s.Name}
                      </option>
                    ))}
                </select>
              )}
              {service.ServiceType === "Train" && (
                <select
                  value={service?.ServiceId}
                  className="formControl1 width60px"
                >
                  <option value="">Select</option>
                  {trainServiceList?.length > 0 &&
                    trainServiceList?.map((s, idx) => (
                      <option key={idx} value={s.id}>
                        {s.Name}
                      </option>
                    ))}
                </select>
              )}
              {service.ServiceType === "Guide" && (
                <select
                  value={service?.ServiceId}
                  className="formControl1 width60px"
                >
                  <option value="">Select</option>
                  <option value="">Full Day</option>
                  <option value="">Half Day</option>
                </select>
              )}
            </td>
            <td>
              <input
                type="number"
                className="formControl1 width50px"
                value={
                  editedCosts[service?.ServiceUniqueId]?.entr ??
                  (service?.ServiceType === "Monument" ? monumentEntrCost : "")
                }
                onChange={(e) =>
                  handleCostChange(
                    service.ServiceUniqueId,
                    "entr",
                    e.target.value
                  )
                }
              />
            </td>
            <td>
              <input
                type="number"
                className="formControl1 width50px"
                value={editedCosts[service?.ServiceUniqueId]?.miscPP ?? ""}
                onChange={(e) =>
                  handleCostChange(
                    service.ServiceUniqueId,
                    "miscPP",
                    e.target.value
                  )
                }
              />
            </td>
            <td>
              <input
                type="number"
                className="formControl1 width50px"
                value={
                  editedCosts[service?.ServiceUniqueId]?.guideFIT ??
                  (service?.ServiceType === "Guide" ? guideFitCost : "")
                }
                onChange={(e) =>
                  handleCostChange(
                    service.ServiceUniqueId,
                    "guideFIT",
                    e.target.value
                  )
                }
              />
            </td>
            {transportVehicleList.map((vehicle) => {
              const vehicleCost = matchVehicleCost?.find(
                (cost) => cost.VehicleTypeId === vehicle.id
              );
              const editedValue =
                editedCosts[service?.ServiceUniqueId]?.[vehicle.id];
              return (
                <td key={vehicle.id}>
                  <input
                    type="number"
                    className="formControl1 width50px"
                    value={
                      service.ServiceType === "Transport"
                        ? editedValue !== undefined
                          ? editedValue
                          : vehicleCost
                          ? Math.ceil(vehicleCost.TotalCost)
                          : ""
                        : editedValue ?? ""
                    }
                    onChange={(e) =>
                      handleCostChange(
                        service.ServiceUniqueId,
                        vehicle.id,
                        e.target.value
                      )
                    }
                  />
                </td>
              );
            })}
          </tr>
        );
      });
    });

    // Add service tax contributions to totals
    const serviceTaxEntr =
      editedCosts["service-tax"]?.entr === ""
        ? 0
        : editedCosts["service-tax"]?.entr ?? 0;
    const serviceTaxMiscPP =
      editedCosts["service-tax"]?.miscPP === ""
        ? 0
        : editedCosts["service-tax"]?.miscPP ?? 0;
    const serviceTaxGuideFIT =
      editedCosts["service-tax"]?.guideFIT === ""
        ? 0
        : editedCosts["service-tax"]?.guideFIT ?? 0;
    const serviceTaxVehicles = transportVehicleList.reduce((acc, vehicle) => {
      acc[vehicle.id] =
        editedCosts["service-tax"]?.[vehicle.id] === ""
          ? 0
          : editedCosts["service-tax"]?.[vehicle.id] ?? 0;
      return acc;
    }, {});

    totals.entr += serviceTaxEntr;
    totals.miscPP += serviceTaxMiscPP;
    totals.guideFIT += serviceTaxGuideFIT;
    Object.keys(totals.vehicles).forEach((vehicleId) => {
      totals.vehicles[vehicleId] += serviceTaxVehicles[vehicleId] || 0;
    });

    rows.push(
      <tr key="service-tax" style={{ color: "red" }}>
        <td colSpan="3">Service tax</td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            value={editedCosts["service-tax"]?.entr ?? ""}
            onChange={(e) =>
              handleCostChange("service-tax", "entr", e.target.value)
            }
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            value={editedCosts["service-tax"]?.miscPP ?? ""}
            onChange={(e) =>
              handleCostChange("service-tax", "miscPP", e.target.value)
            }
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            value={editedCosts["service-tax"]?.guideFIT ?? ""}
            onChange={(e) =>
              handleCostChange("service-tax", "guideFIT", e.target.value)
            }
          />
        </td>
        {transportVehicleList.map((vehicle) => (
          <td key={vehicle.id}>
            <input
              type="number"
              className="formControl1 width50px"
              value={editedCosts["service-tax"]?.[vehicle.id] ?? ""}
              onChange={(e) =>
                handleCostChange("service-tax", vehicle.id, e.target.value)
              }
            />
          </td>
        ))}
      </tr>,
      <tr key="total" style={{ background: "#2e2e40" }}>
        <td colSpan="3">TOTAL</td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            value={editedCosts["total"]?.entr ?? totals.entr}
            onChange={(e) => handleCostChange("total", "entr", e.target.value)}
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            value={editedCosts["total"]?.miscPP ?? totals.miscPP}
            onChange={(e) =>
              handleCostChange("total", "miscPP", e.target.value)
            }
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            value={editedCosts["total"]?.guideFIT ?? totals.guideFIT}
            onChange={(e) =>
              handleCostChange("total", "guideFIT", e.target.value)
            }
          />
        </td>
        {transportVehicleList.map((vehicle) => (
          <td key={vehicle.id}>
            <input
              type="number"
              className="formControl1 width50px"
              value={
                editedCosts["total"]?.[vehicle.id] ??
                totals.vehicles[vehicle.id]
              }
              onChange={(e) =>
                handleCostChange("total", vehicle.id, e.target.value)
              }
            />
          </td>
        ))}
      </tr>
    );

    return rows;
  };

  // Save Handler

  const handleFinalSubmit = () => {
    const serviceWiseData = [];

    // Process service rows
    quotationData?.Days?.forEach((day) => {
      const filterServices = day?.DayServices?.filter(
        (s) => s.ServiceType !== "Hotel"
      );

      filterServices.forEach((service) => {
        let monumentEntrCost = 0;
        let guideFitCost = 0;
        const vehicleCosts = {};

        if (service?.ServiceType === "Transport") {
          const matchVehicleCost = vehicleListCost[service?.ServiceId] || [];
          matchVehicleCost.forEach((cost) => {
            if (transportVehicleList.some((v) => v.id === cost.VehicleTypeId)) {
              const editedValue =
                editedCosts[service?.ServiceUniqueId]?.[cost.VehicleTypeId];
              vehicleCosts[cost.VehicleTypeId] =
                editedValue !== undefined
                  ? editedValue
                  : Math.ceil(cost.TotalCost || 0);
            }
          });
        }

        if (service?.ServiceType === "Monument") {
          monumentEntrCost = calculateMonumentEntrCost(service?.ServiceId);
        }

        if (service?.ServiceType === "Guide") {
          guideFitCost = calculateGuideFitCost(service?.ServiceId);
        }

        const editedEntr = editedCosts[service?.ServiceUniqueId]?.entr;
        const editedMiscPP = editedCosts[service?.ServiceUniqueId]?.miscPP;
        const editedGuideFIT = editedCosts[service?.ServiceUniqueId]?.guideFIT;

        const serviceData = {
          ServiceUniqueId: service.ServiceUniqueId,
          DestinationName: day.DestinationName,
          ServiceType: service.ServiceType,
          ServiceId: service.ServiceId,
          Costs: {
            Entr:
              editedEntr !== undefined
                ? editedEntr
                : service?.ServiceType === "Monument"
                ? monumentEntrCost
                : "",
            MiscPP: editedMiscPP !== undefined ? editedMiscPP : "",
            GuideFIT:
              editedGuideFIT !== undefined
                ? editedGuideFIT
                : service?.ServiceType === "Guide"
                ? guideFitCost
                : "",
            Vehicles: vehicleCosts,
          },
        };

        serviceWiseData.push(serviceData);
      });
    });

    // Process service tax row
    const serviceTaxData = {
      ServiceUniqueId: "service-tax",
      DestinationName: "N/A",
      ServiceType: "Service Tax",
      ServiceId: "N/A",
      Costs: {
        Entr: editedCosts["service-tax"]?.entr ?? "",
        MiscPP: editedCosts["service-tax"]?.miscPP ?? "",
        GuideFIT: editedCosts["service-tax"]?.guideFIT ?? "",
        Vehicles: transportVehicleList.reduce((acc, vehicle) => {
          acc[vehicle.id] = editedCosts["service-tax"]?.[vehicle.id] ?? "";
          return acc;
        }, {}),
      },
    };
    serviceWiseData.push(serviceTaxData);

    // Process total row
    const totals = {
      entr: 0,
      miscPP: 0,
      guideFIT: 0,
      vehicles: transportVehicleList.reduce((acc, vehicle) => {
        acc[vehicle.id] = 0;
        return acc;
      }, {}),
    };

    serviceWiseData.forEach((service) => {
      totals.entr +=
        service.Costs.Entr === "" ? 0 : Number(service.Costs.Entr) || 0;
      totals.miscPP +=
        service.Costs.MiscPP === "" ? 0 : Number(service.Costs.MiscPP) || 0;
      totals.guideFIT +=
        service.Costs.GuideFIT === "" ? 0 : Number(service.Costs.GuideFIT) || 0;
      Object.keys(service.Costs.Vehicles).forEach((vehicleId) => {
        totals.vehicles[vehicleId] +=
          service.Costs.Vehicles[vehicleId] === ""
            ? 0
            : Number(service.Costs.Vehicles[vehicleId]) || 0;
      });
    });

    const totalData = {
      ServiceUniqueId: "total",
      DestinationName: "N/A",
      ServiceType: "Total",
      ServiceId: "N/A",
      Costs: {
        Entr: editedCosts["total"]?.entr ?? totals.entr,
        MiscPP: editedCosts["total"]?.miscPP ?? totals.miscPP,
        GuideFIT: editedCosts["total"]?.guideFIT ?? totals.guideFIT,
        Vehicles: transportVehicleList.reduce((acc, vehicle) => {
          acc[vehicle.id] =
            editedCosts["total"]?.[vehicle.id] ?? totals.vehicles[vehicle.id];
          return acc;
        }, {}),
      },
    };
    serviceWiseData.push(totalData);

    console.log("Service-Wise Data:", serviceWiseData);

    const activityData = serviceWiseData?.filter(
      (service) => service?.ServiceType === "Activity"
    );

    console.log(activityData, "restaurentData");
  };

  // const handleBack = () => {
  //   navigate(-1);
  // };

  return (
    <div>
      <div className="d-flex mb-2 justify-content-end gap-2">
        <button
          onClick={handleFinalSubmit}
          className="btn btn-primary btn-custom-size d-flex flex-shrink-0 flex-grow-0"
        >
          <i className="fa-solid fa-floppy-disk fs-4 me-1" />
          Save
        </button>
        {/* <button
          className="btn btn-dark btn-custom-size"
          onClick={() => handleBack()}
        >
          Back
        </button> */}
        <button
          className="btn btn-primary btn-custom-size d-flex flex-shrink-0 flex-grow-0"
          onClick={() => handleNext("transport")}
        >
          Next
          <i
            className="fa-solid fa-backward text-red bg-white p-1 rounded ms-1"
            style={{ transform: "rotate(180deg)" }}
          ></i>
        </button>
      </div>
      <div className="d-flex align-items-center mb-3 mb-sm-0">
        <div className="ml-3">
          <span className="fs-5">
            <span className="querydetails text-grey">Tour Name :</span> Master
            Tours
          </span>
        </div>
      </div>
      <div className="d-flex align-items-center mb-3 mb-sm-0">
        <div className="ml-3">
          <span className="fs-5">
            <span className="querydetails text-grey">Costing Date :</span>{" "}
            09-05-2025
          </span>
        </div>
      </div>
      <PerfectScrollbar options={{ suppressScrollY: true }}>
        <table className="table table-bordered itinerary-table">
          <thead>
            <tr>
              <th style={{ width: "70px" }}>City</th>
              <th style={{ width: "120px" }}>Type</th>
              <th style={{ width: "120px" }}>Service</th>
              <th>Entr</th>
              <th>Misc P.P</th>
              <th>Guide FIT</th>
              {transportVehicleList.map((vehicle) => (
                <th style={{ whiteSpace: "wrap" }} key={vehicle.id}>
                  {vehicle.Name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </table>
      </PerfectScrollbar>
      <TourManager />
    </div>
  );
};

export default Transport;
