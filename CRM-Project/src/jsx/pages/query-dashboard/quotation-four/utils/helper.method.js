import { axiosOther } from "../../../../../http/axios_base_url";

const CompanyUniqueId = JSON.parse(
  localStorage.getItem("token")
)?.CompanyUniqueId;

export const getQuotationDataFromApi = async (QueryQuotation) => {
  try {
    const { data } = await axiosOther.post("listqueryquotation", {
      QueryId: QueryQuotation?.QueryID,
      QuotationNo: QueryQuotation?.QoutationNum,
    });
    if (data?.success) {
      return data?.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getQueryDataFromApi = async (QueryQuotation) => {
  try {
    const { data } = await axiosOther.post("querymasterlist", {
      QueryId: QueryQuotation?.QueryID,
    });
    if (data?.Status === 200) {
      return data?.DataList;
    }
    // console.log()
  } catch (error) {
    console.log(error);
  }
};

export const getSupplierList = async (service) => {
  try {
    const { data } = await axiosOther.post("supplierlist", {
      Name: "",
      id: "",
      SupplierService: [5],
      DestinationId: [service?.DestinationId],
    });

    if (data?.Status === 200) {
      console.log(data?.DataList, "GGF&88");
      // const updatedSupplier = data?.DataList?.map((sup) => {
      //   return {
      //     id: sup?.id,
      //     UniqueID: sup?.UniqueID,
      //     Name: sup?.Name,
      //   };
      // });

      // return {
      //   Day: service?.Day,
      //   Supplier: updatedSupplier,
      // };
      return {
        id: data?.DataList?.[0]?.id,
        Name: data?.DataList?.[0]?.Name,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export const getHotelSupplierList = async (hotelName, destinationId) => {
  const cleanName = hotelName.split("-").slice(1).join("-");
  console.log(cleanName, "HOTEL7877", hotelName);
  try {
    const { data } = await axiosOther.post("supplierlistforselect", {
      Name: cleanName,
      id: "",
      SupplierService: [12],
      DestinationId: [parseInt(destinationId)],
    });
    if (data?.Status === 200) {
      const firstObject = data?.DataList[0];
      return {
        id: firstObject?.id,
        UniqueID: firstObject?.UniqueID,
        Name: firstObject?.Name,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

// ============================== Hotel Payload
export const getServicePayload = async (
  queryData,
  quotationData,
  dayWiseFormValue,
  selectedRestaurantIcons,
  selectedIcons
) => {
  console.log(queryData, "queryData66", quotationData);
  const hotelPayload = [];
  const monumentPayload = [];
  const activityPayload = [];
  const transportPayload = [];
  const flightPayload = [];
  const trainPayload = [];
  const additionalPayload = [];
  const guidePayload = [];
  const restaurantPayload = [];

  for (const dayObj of dayWiseFormValue) {
    const dayKey = Object.keys(dayObj)[0];
    const dayData = dayObj[dayKey];

    const supplierByDestination = await getSupplierList(dayData);
    console.log(supplierByDestination, "GFHDYD7766");

    const {
      hotels,
      monuments,
      activity,
      transport,
      flight,
      train,
      additional,
      guide,
      restaurant,
    } = dayData;

    console.log(dayKey, "DHDHHD", dayData);
    // For Hotel
    if (hotels?.length > 0) {
      for (const hotel of hotels) {
        const serviceId = getServiceId(hotel);
        const cleanHotelName = getHotelName(hotel);
        const supplierId = await getHotelSupplierList(
          cleanHotelName,
          dayData?.DestinationId
        );

        const isMatchTypeIcon = `${dayData?.Day}-${cleanHotelName}`;
        const iconTypeData = selectedIcons[isMatchTypeIcon];

        console.log(iconTypeData, "iconTypeData", selectedIcons);

        console.log(cleanHotelName, "GHHHD877", supplierId);
        hotelPayload.push({
          id: queryData?.id,
          QuatationNo: quotationData?.QuotationNumber,
          DayType: "Main",
          DayNo: dayData?.Day,
          DayUniqueId: dayKey,
          Escort: 1,
          ServiceMainType: iconTypeData === "M" ? "No" : "Yes",
          Destination: dayData?.DestinationId,
          Supplier: parseInt(supplierId?.id),
          Hike: 0,
          Date: queryData?.TravelDateInfo?.FromDate,
          DestinationUniqueId: dayData?.DestinationUniqueId,
          HotelCategory: queryData?.Hotel?.HotelCategory,
          RoomCategory: 704,
          MealPlan: queryData?.MealPlan,
          OverNight: queryData?.TravelDateInfo?.TotalNights,
          FromDay: "",
          ToDay: "",
          ServiceId: parseInt(serviceId),
          ItemFromDate: queryData?.TravelDateInfo?.FromDate,
          ItemFromTime: "",
          ItemToDate: queryData?.TravelDateInfo?.ToDate,
          InfantCost: "",
          ItemToTime: "",
          PaxSlab: "",
          RateUniqueId: "",
          RoomBedType: getRoomBedType(
            quotationData?.QueryInfo?.Accomondation?.RoomInfo
          ),
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
      }
    }

    // For Monument
    if (monuments?.length > 0) {
      for (const monument of monuments) {
        const cleanMonumentName = getHotelName(monument);
        const isMatchTypeIcon = `${dayData?.Day}-${cleanMonumentName}`;
        const iconTypeData = selectedIcons[isMatchTypeIcon];

        monumentPayload.push({
          id: queryData?.id,
          QuatationNo: quotationData?.QuotationNumber,
          DayType: "Main",
          Escort: 1,
          DayNo: dayData?.Day,
          Sector: "",
          Hike: "",
          MonumentDayType: "",
          MonumentTime: "",
          DayUniqueId: dayKey,
          SupplierId: supplierByDestination?.id,
          Destination: dayData?.DestinationId,
          Date: "",
          Leasure: "",
          Include: "No",
          DestinationUniqueId: dayData?.DestinationUniqueId,
          ServiceIdMonument: await getMonumentPackegeArray(monument),
          FromDay: "",
          ToDay: "",
          ServiceId: getServiceId(monument),
          ItemFromDate: "",
          ItemFromTime: "",
          ItemToDate: "",
          ItemToTime: "",
          ServiceMainType: "No",
          ItemUnitCost: {
            FAdult: 0,
            Adult: "",
          },
          RateUniqueId: "",
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
          SupplierName: supplierByDestination?.Name,
          TotalCosting: {
            ServiceAdultCost: 0,
            ServiceChildCost: 0,
            AdultMarkupValue: 0,
            ChildMarkupValue: 0,
            AdultMarkupTotal: 0,
            ChildMarkupTotal: 0,
            TotalAdultServiceCost: 0,
            TotalChildServiceCost: 0,
          },
        });
      }
    }

    // For Activity
    if (activity?.length > 0) {
      for (const activityData of activity) {
        const serviceId = getServiceId(activityData);
        console.log(activityData, "FGDEE87", serviceId);
        const activitySupplier = await getActivitySupplier(
          serviceId,
          dayData?.DestinationId
        );
        // const activityRateList = await getActivityRateJson(
        //   activitySupplier?.uId,
        //   dayData?.DestinationUniqueId,
        //   queryData,
        //   quotationData
        // );
        console.log(activitySupplier, "HFGFG77");

        const cleanActivityName = getHotelName(activityData);
        const isMatchTypeIcon = `${dayData?.Day}-${cleanActivityName}`;
        const iconTypeData = selectedIcons[isMatchTypeIcon];
        console.log(iconTypeData, "cleanActivityName");

        activityPayload.push({
          id: queryData?.id,
          QuatationNo: quotationData?.QuotationNumber,
          DayType: "Main",
          DayNo: dayData?.Day,
          Hike: 0,
          Date: "",
          Escort: "No",
          Destination: dayData?.DestinationId,
          ActivityTime: "None",
          Supplier: activitySupplier?.SupplierId,
          DestinationUniqueId: dayData?.DestinationUniqueId,
          DayUniqueId: dayKey,
          ServiceId: serviceId,
          Description: "",
          PaxRange: "",
          Cost: "",
          NoOfActivity: 1,
          ServiceType: "Activity",
          ItemFromDate: "",
          ItemFromTime: "",
          ItemToDate: "",
          ItemToTime: "",
          RateUniqueId: "",
          ServiceMainType: iconTypeData === "M" ? "No" : "Yes",
          Supplement: "No",
          Package: "No",
          Highlights: "No",
          BeforeSS: "No",
          PaxInfo: {
            Adults: quotationData?.Pax?.AdultCount || "",
            Child: quotationData?.Pax?.ChildCount || "",
            Infant: quotationData?.Pax?.InfantCount || "",
            Escort: "",
          },
          ForiegnerPaxInfo: {
            Adults: "",
            Child: "",
            Infant: "",
            Escort: "",
          },
          AdditionalCost: [],
          Sector: "",
          TotalCosting: {
            ActivityCost: "",
            ActivityCostMarkupValue: "",
            TotalActivityCostMarkup: "",
            TotalActivityCost: "",
          },
        });
      }
    }

    // For Transport
    if (transport?.length > 0) {
      for (const transportData of transport) {
        const serviceId = getServiceId(transportData);

        const transportDetails = await getTransportDetails(serviceId);

        const cleanTransportName = getHotelName(transportData);
        const isMatchTypeIcon = `${dayData?.Day}-${cleanTransportName}`;
        const iconTypeData = selectedIcons[isMatchTypeIcon];

        transportPayload.push({
          id: queryData?.id,
          QuatationNo: quotationData?.QuotationNumber,
          DayType: "Main",
          DayNo: dayData?.Day,
          DayUniqueId: dayKey,
          Hike: "",
          Date: "",
          DestinationUniqueId: dayData?.DestinationUniqueId,
          ServiceMainType: iconTypeData === "M" ? "No" : "Yes",
          Escort: 1,
          FromDay: "",
          ToDay: "",
          FromDestination: "",
          ToDestination: "",
          TransferType: transportDetails?.TransferType?.id,
          Mode: "",
          MainVehicleTypeId: "",
          Supplier: supplierByDestination?.id,
          TransportDetails: transportDetails?.Detail,
          Remarks: transportDetails?.Name,
          // c: [],
          CostType: "",
          NoOfVehicle: "",
          Cost: "",
          AlternateVehicle: "",
          AlternateVehicleCost: "",
          NoOfDay: "",
          ServiceId: serviceId,
          ItemFromDate: "",
          ItemFromTime: "",
          ItemToDate: "",
          ItemToTime: "",
          RateUniqueId: "",
          PaxInfo: {
            Adults: quotationData?.Pax?.AdultCount || "",
            Child: quotationData?.Pax?.ChildCount || "",
            Infant: "",
            Escort: "",
          },
          ForiegnerPaxInfo: {
            Adults: "",
            Child: "",
            Infant: "",
            Escort: "",
          },
          Assitance: "",
          Sector: "",
          VehicleType: [],
          TotalVehicleType: [],
        });
      }
    }

    // Flight
    if (flight?.length > 0) {
      for (const flightData of flight) {
        const serviceId = getServiceId(flightData);

        const cleanFlightName = getHotelName(flightData);
        const isMatchTypeIcon = `${dayData?.Day}-${cleanFlightName}`;
        const iconTypeData = selectedIcons[isMatchTypeIcon];
        console.log(iconTypeData, "FLIGHT877");

        flightPayload.push({
          id: queryData?.id,
          QuatationNo: quotationData?.QuotationNumber,
          DayNo: dayData?.Day,
          ServiceId: serviceId,
          Type: "",
          DayType: "Main",
          Hike: 0,
          TypeName: "",
          SupplierId: "",
          Escort: 1,
          ServiceCharges: "",
          HandlingCharges: "",
          GuideCharges: "",
          ServiceMainType: iconTypeData === "M" ? "No" : "Yes",
          DepartureTime: "",
          Supplier: supplierByDestination?.id,
          ArrivalTime: "",
          Remarks: "",
          FlightNumber: "",
          FlightClass: "",
          FromDestination: "",
          ToDestination: "",
          AdultCost: "",
          ChildCost: "",
          InfantCost: "",
          ItemFromDate: "",
          ItemFromTime: "",
          ItemToDate: "",
          ItemToTime: "",
          RateUniqueId: "",
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
          Date: "",
          DestinationUniqueId: dayData?.DestinationUniqueId,
          DayUniqueId: dayKey,
          Sector: "",
          TotalCosting: {
            ServiceAdultCost: 0,
            ServiceChildCost: 0,
            AdultMarkupValue: 0,
            ChildMarkupValue: 0,
            AdultMarkupTotal: 0,
            ChildMarkupTotal: 0,
            TotalAdultServiceCost: 0,
            TotalChildServiceCost: 0,
          },
        });
      }
    }

    // Train
    if (train?.length > 0) {
      for (const trainData of train) {
        const serviceId = getServiceId(trainData);
        const cleanTrainName = getHotelName(trainData);
        const isMatchTypeIcon = `${dayData?.Day}-${cleanTrainName}`;
        const iconTypeData = selectedIcons[isMatchTypeIcon];
        console.log(iconTypeData, "TRAIN988", selectedIcons);

        trainPayload.push({
          id: queryData?.id,
          QuatationNo: quotationData?.QuotationNumber,
          DayNo: dayData?.Day,
          Type: "",
          DayType: "Main",
          Hike: "",
          Sector: "",
          ServiceCharges: "",
          HandlingCharges: "",
          GuideCharges: "",
          ServiceMainType: iconTypeData === "M" ? "No" : "Yes",
          DepartureTime: "",
          SupplierId: "",
          Escort: 1,
          Date: "",
          DestinationUniqueId: dayData?.DestinationUniqueId,
          AdultCost: "",
          ChildCost: "",
          ArrivalTime: "",
          Remarks: "",
          TrainNumber: "",
          FromDestination: "",
          ToDestination: "",
          DayUniqueId: dayKey,
          ItemFromDate: "",
          ItemToDate: "",
          RateUniqueId: "",
          PaxInfo: {
            Adults: quotationData?.Pax?.AdultCount || "",
            Child: quotationData?.Pax?.ChildCount || "",
            Infant: "",
            Escort: "",
          },
          ForiegnerPaxInfo: {
            Adults: "",
            Child: "",
            Infant: "",
            Escort: "",
          },
          ServiceId: serviceId,
          TypeName: "",
          Supplier: supplierByDestination?.id,
          TrainClass: "",
          hike: 0,
          TotalCosting: {
            ServiceAdultCost: 0,
            ServiceChildCost: 0,
            AdultMarkupValue: 0,
            ChildMarkupValue: 0,
            AdultMarkupTotal: 0,
            ChildMarkupTotal: 0,
            TotalAdultServiceCost: 0,
            TotalChildServiceCost: 0,
          },
        });
      }
    }

    // Additional
    if (additional?.length > 0) {
      for (const additionalData of additional) {
        const cleanAdditionalName = getHotelName(additionalData);
        const isMatchTypeIcon = `${dayData?.Day}-${cleanAdditionalName}`;
        const iconTypeData = selectedIcons[isMatchTypeIcon];
        console.log(iconTypeData, "Additional", selectedIcons);

        const serviceId = getServiceId(additionalData);
        additionalPayload.push({
          id: queryData?.id,
          QuatationNo: quotationData?.QuotationNumber,
          DayNo: dayData?.Day,
          DayUniqueId: dayKey,
          DayType: "Main",
          ServiceMainType: iconTypeData === "M" ? "No" : "Yes",
          Suppliment: "No",
          Hike: 0,
          Sector: "",
          ServiceId: serviceId,
          CostType: "",
          Destination: dayData?.DestinationId,
          SupplierId: supplierByDestination?.id,
          DestinationUniqueId: dayData?.DestinationUniqueId,
          Date: "",
          PaxUpTo: "",
          AdultCost: "",
          ChildCost: "",
          ItemFromDate: "",
          ItemToDate: "",
          RateUniqueId: "",
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
          AdditionalCost: [
            {
              UpToPax: "",
              Rounds: "",
              Class: "",
              Duration: "",
              Amount: "",
              Remarks: "",
            },
          ],
          TotalCosting: {
            AdditionalCost: 0,
            AdditionalCostMarkupValue: 0,
            TotalAdditionalCostMarkup: 0,
            TotalAdditionalCost: 0,
          },
        });
      }
    }

    // Guide
    if (guide.length > 0) {
      for (const guideData of guide) {
        const dayType = getNameFromData(guideData);
        const serviceId = getServiceId(guideData);
        // const guideRateJson = await getGuideRateJson(
        //   dayData?.DestinationId,
        //   queryData,
        //   quotationData,
        //   dayData?.DestinationUniqueId,
        //   dayType
        // );

        const cleanGuideName = getHotelName(guideData);
        const isMatchTypeIcon = `${dayData?.Day}-${cleanGuideName}`;
        const iconTypeData = selectedIcons[isMatchTypeIcon];
        console.log(iconTypeData, "GUIDE87766", selectedIcons);

        guidePayload.push({
          id: queryData?.id,
          QuatationNo: quotationData?.QuotationNumber,
          DayNo: dayData?.Day,
          Hike: 0,
          Type: "Main",
          Sector: "",
          DayType: dayType,
          Escort: "1",
          Language: "",
          LanguageAllowance: 0,
          ServiceMainType: iconTypeData === "M" ? "No" : "Yes",
          GuideFee: 0,
          Suppliment: "No",
          Supplier: supplierByDestination?.id,
          OtherCost: 0,
          Destination: dayData?.DestinationId,
          DayUniqueId: dayKey,
          FromDay: "",
          ToDay: "",
          ServiceId: serviceId,
          ItemFromDate: "",
          ItemFromTime: "",
          ItemToDate: "",
          ItemToTime: "",
          PaxSlab: "",
          RateUniqueId: "",
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
          TotalCostingMealPlan: [
            {
              MealType: "",
              ServiceCost: "",
              Markupvalue: "",
              MarkupTotalValue: "",
              TotalServiceCost: "",
            },
          ],
          Date: "",
          DestinationUniqueId: dayData?.DestinationUniqueId,
          Rates: [],
          TotalCosting: [],
        });
      }
    }

    // Restaurent
    if (restaurant.length > 0) {
      for (const restaurantData of restaurant) {
        const serviceId = getServiceId(restaurantData);
        const serviceName = getNameFromData(restaurantData);
        const matchkeyName = `${dayData.Day}-${serviceName}`;
        const mealData = selectedRestaurantIcons[matchkeyName];

        const mealPackageData = getMealPackageData(mealData, serviceId);
        console.log(selectedRestaurantIcons, "restaurantData", mealData);

        restaurantPayload.push({
          id: queryData?.id,
          QuatationNo: quotationData?.QuotationNumber,
          DayNo: dayData?.Day,
          DayType: "Main",
          ServiceMainType: "No",
          Sector: "Delhi",
          Hike: "",
          DayUniqueId: dayKey,
          ServiceId: serviceId,
          ItemFromDate: "",
          Escort: 1,
          ItemToDate: "",
          SupplierId: "",
          RateUniqueId: "",
          DestinationUniqueId: "",
          Date: "",
          Destination: dayData?.DestinationId,
          Supplier: supplierByDestination.id,
          AdultCost: "",
          ChildCost: "",
          StartTime: "",
          EndTime: "",
          MealPlan: mealPackageData,
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
          TotalCostingMealPlan: [],
        });
      }
    }
  }

  return {
    hotelPayload: hotelPayload,
    monumentPayload: monumentPayload,
    activityPayload: activityPayload,
    transportPayload: transportPayload,
    flightPayload: flightPayload,
    trainPayload: trainPayload,
    additionalPayload: additionalPayload,
    guidePayload: guidePayload,
    restaurantPayload: restaurantPayload,
  };
};

const getServiceId = (service) => {
  const id = service.split("-")[0];
  return parseInt(id);
};

const getNameFromData = (service) => {
  const name = service.split("-")[1];
  return name;
};

const getHotelName = (hotelName) => {
  const cleanName = hotelName.split("-").slice(1).join("-");
  return cleanName;
};

export const removeServiceId = (name) => {
  const cleanName = name.split("-").slice(1).join("-");
  return cleanName;
};

const getRoomBedType = (roomInfo) => {
  const RoomBedType = roomInfo
    .filter((item) => item.NoOfPax !== null)
    .map((item) => ({
      RoomBedTypeId: item.id,
      RoomCost: 0,
    }));

  return RoomBedType;
};

// ========================================= Monument ==========

const getMonumentList = async (id) => {
  try {
    const { data } = await axiosOther.post("monument-package-list", {
      id: id,
      Default: "Yes",
    });
    if (data?.Status === 200) {
      const result = data?.DataList?.[0]?.MultipleMonument?.map((item) => ({
        MonumentId: item.id,
        MonumentName: item.name,
        IAdultPrice:
          item.RateJson.length > 0 ? item.RateJson[0].IndianAdultEntFee : "",
        FAdultPrice:
          item.RateJson.length > 0 ? item.RateJson[0].ForeignerAdultEntFee : "",
      }));
      return result;
    }
  } catch (error) {
    console.log(error);
  }
};

const getMonumentPackegeArray = async (monumentPackageList) => {
  const serviceId = monumentPackageList.split("-")[0];
  const list = await getMonumentList(parseInt(serviceId));
  return list;
};

// ================= Activity

const getActivitySupplier = async (serviceId, destinationId) => {
  const { data } = await axiosOther.post("activitymasterlist", {
    ServiceName: "",
    id: serviceId,
    Status: "",
    DestinationId: destinationId,
    page: "",
    perPage: "",
  });

  console.log(data?.DataList?.[0], "ACTIFHFG766");

  if (data?.Status === 200) {
    return {
      SupplierId: data?.DataList?.[0]?.SupplierId,
      SupplierName: data?.DataList?.[0]?.SupplierName,
      uId: data?.DataList?.[0]?.UniqueId,
    };
  }
};

const getActivityRateJson = async (
  activtiyUID,
  destinationId,
  queryData,
  qoutationData
) => {
  try {
    // console.log("GFHHD7666877");
    const { data } = await axiosOther.post("activitysearchlist", {
      id: "",
      ActivityUID: activtiyUID,
      CompanyId: CompanyUniqueId,
      Destination: destinationId,
      Date: "",
      Year: "",
      ValidFrom: queryData?.TravelDateInfo?.FromDate,
      ValidTo: queryData?.TravelDateInfo?.ToDate,
      TotalActivity: "",
      QueryId: queryData?.id,
      QuatationNo: qoutationData?.QuotationNumber,
      Type: "",
    });

    if (data?.Status === 1 || data?.Status === 0) {
      const emptyRow = {
        UpToPax: "",
        Rounds: "",
        Class: "",
        Duration: "",
        Amount: "",
        Remarks: "",
      };
      const result = Array.isArray(data?.Data?.[0]?.RateJson?.ServiceCost)
        ? data?.Data?.[0]?.RateJson?.ServiceCost?.map((item) => ({
            UpToPax: item.UpToPax || "",
            Rounds: item.Rounds || "",
            Class: item.Class || "",
            Duration: item.Duration || "",
            Amount: item.Amount || "",
            Remarks: item.Remarks?.toString() || "",
          }))
        : [emptyRow];

      return result;
    }
  } catch (error) {
    console.log(error);
  }
};

// ============================== Transport

const getTransportDetails = async (serviceId) => {
  try {
    const { data } = await axiosOther.post("transportmasterlist", {
      ServiceName: "",
      id: serviceId,
      Status: "",
      DestinationId: "",
      TransferType: "",
      page: "",
      perPage: "",
    });

    if (data?.Status === 200) {
      // console.log(data?.DataList[0], "GFFFKDHDH");
      return data?.DataList[0];
    }
  } catch (error) {
    console.log(error);
  }
};

// ======================= Guide ================

const getGuideRateJson = async (
  destinationId,
  queryData,
  qoutationData,
  destinationUniqueId,
  dayType
) => {
  const GuideUID = await getGuideServiceList(destinationId);
  const isFullDay = dayType === "Full Day" ? true : false;

  try {
    const { data } = await axiosOther.post("filter-guiderate-data", {
      id: "",
      GuideUID: GuideUID,
      CompanyId: CompanyUniqueId,
      date: "",
      QueryId: queryData?.id,
      QuatationNo: qoutationData?.QuotationNumber,
      ServiceType: "",
      StartPax: "",
      Destination: destinationUniqueId,
      GuideServiceName: "",
      DestinationType: "",
    });

    if (data?.Status === 1) {
      const updateRate = data?.Data?.[0]?.RateJson?.ServiceCost.map((item) => ({
        StartPax: String(item.StartPax),
        EndPax: String(item.EndPax),
        GuideFee: String(
          isFullDay ? item.GuideFullDayFee : item.GuideHalfDayFee
        ),
        LAFee: String(isFullDay ? item.LAFullDayFee : item.LAHalfDayFee),
        OthersFee: String(
          isFullDay ? item.OthersFullDayFee : item.OthersHalfDayFee
        ),
        Remarks: item.Remarks,
      }));
      console.log(updateRate, "GFHHDG666");
      return updateRate;
    }
  } catch (error) {
    console.log(error);
  }
};

const getGuideServiceList = async (destinationId) => {
  try {
    const { data } = await axiosOther.post("guideservicelist", {
      Destination: destinationId,
    });

    if (data?.Status === 200) {
      return data?.DataList[0]?.UniqueID;
    }
  } catch (error) {
    console.log(error);
  }
};

// ========================= Restaurent ================

const getMealPackageData = (meal, serviceId) => {
  const updatedMeal = meal?.map((list) => {
    return {
      MealType: list,
      ServiceID: serviceId,
      ServiceType: "Restaurant",
      Supplement: "No",
      Amount: "",
    };
  });
  return updatedMeal;
};

// ====================== Find Sector ==================

export const getSectorData = async (quotationData) => {
  const days = quotationData?.Days || [];
  const sectors = [];

  for (let i = 0; i < days.length; i++) {
    const current = days[i];

    if (i === 0) {
      sectors.push(`Arrival at ${current.DestinationName}`);
    } else if (i === days.length - 1) {
      sectors.push(`Departure at ${current.DestinationName}`);
    } else {
      const prev = days[i - 1];
      if (current.EnrouteName) {
        sectors.push(`${prev.DestinationName} to ${current.EnrouteName}`);
        sectors.push(
          `${current.EnrouteName} to ${current.MainDestinationName}`
        );
      } else {
        sectors.push(`${prev.DestinationName} to ${current.DestinationName}`);
      }
    }
  }
  console.log(sectors, "GCVCH8777");
  return sectors;
};

export const getSectorByDestination = (quotationData, service) => {
  console.log(quotationData, "GAGDFST87", service);
  const itinerary = quotationData?.Days || [];
  const matchedDayIndex = itinerary.findIndex(
    (day) => day.DayUniqueId === service
  );

  console.log(matchedDayIndex, "HDHDHDHD");

  if (matchedDayIndex === -1) {
    return "-";
  }

  const matchedDay = itinerary[matchedDayIndex];
  const destinationName = matchedDay.DestinationName;

  // Case 1: If matched day is the first object
  if (matchedDayIndex === 0) {
    return `Arrival at ${destinationName}`;
  }

  // Case 2: If matched day is the last object
  if (matchedDayIndex === itinerary.length - 1) {
    return `Departure at ${destinationName}`;
  }

  // Case 3: If matched day is in between (e.g., second day)
  const nextDay = itinerary[matchedDayIndex + 1];
  const nextDestinationName = nextDay.DestinationName;
  return `${destinationName} to ${nextDestinationName}`;
};
