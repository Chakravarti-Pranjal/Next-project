import { axiosOther } from "../../../../../../http/axios_base_url";

export async function getHotelRateJson(
  service,
  hotelUniqueID,
  comapnyKey,
  queryDataApi
) {
  console.log(service, "HGFV877", queryDataApi);

  try {
    if (true) {
      const { data } = await axiosOther.post("priceEditHotelRatesJson", {
        Id: "",
        HotelID: hotelUniqueID,
        HotelName: "",
        DestinationID: service?.DestinationUniqueId,
        CompanyId: comapnyKey,
        Date: "",
        Year: queryDataApi?.TravelDateInfo?.SeasonYear,
        MealPlanId: queryDataApi?.MealPlan,
        CurrencyId: "",
        TariffTypeId: "",
        RoomTypeId: "",
        MarketTypeId: "",
        HotelCategoryId: queryDataApi?.Hotel?.HotelCategory,
        SupplierID: "",
        PaxType: queryDataApi?.PaxInfo?.PaxType,
        ValidFrom: queryDataApi?.TravelDateInfo?.FromDate,
        ValidTo: queryDataApi?.TravelDateInfo?.ToDate,
        QueryId: "",
        QuatationNo: "",
      });

      if (data?.Status === 1) {
        const rateData = data?.Data?.[0]?.RateJson;
        const mealData = data?.Data?.[0]?.RateJson?.MealType?.map((meal) => {
          return {
            MealTypeId: meal?.MealTypeId,
            MealTypeName: meal?.MealTypeName,
            MealCost: meal?.MealCost,
          };
        });
        const roomBedTypeData = data?.Data?.[0]?.RateJson?.RoomBedType?.map(
          (room) => {
            return {
              RoomBedTypeId: room?.RoomBedTypeId,
              RoomBedTypeName: room?.RoomBedTypeName,
              RoomCost: room?.RoomCost,
            };
          }
        );
        return {
          PaxTypeId: rateData?.PaxTypeId,
          PaxTypeName: rateData?.PaxTypeName,
          MealType: mealData,
          RoomBedType: roomBedTypeData,
          RoomTypeId: rateData?.RoomTypeId,
          RoomTypeName: rateData?.RoomTypeName,
        };
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getHotelTypeList() {
  try {
    const { data } = await axiosOther.post("roomtypelist", {
      name: "",
      id: "",
      status: 1,
    });
    if (data?.Status === 200) {
      return data?.DataList;
    }
  } catch (error) {
    console.log(error);
  }
}

export const getHotelMealPlanList = async () => {
  try {
    const { data } = await axiosOther.post("hotelmealplanlist");
    if (data?.Status === 200) {
      const updatedData = data?.DataList?.map((m) => {
        return {
          id: m.id,
          Name: m.Name,
        };
      });

      return updatedData;
    }
  } catch (error) {
    console.log(error);
  }
};

// Get all services

// Activity master list
export const getActivityServiceList = async (destinationId) => {
  try {
    const { data } = await axiosOther.post("activitymasterlist", {
      ServiceName: "",
      id: "",
      Status: "",
      DestinationId: destinationId,
      page: "",
      perPage: "",
    });
    if (data?.Status === 200) {
      console.log(data, "GFBVF98");
      const updatedList = data?.DataList.map((list) => {
        return {
          id: list?.id,
          Name: list?.ServiceName,
          UniqueId: list?.UniqueId,
        };
      });
      return updatedList;
    }
  } catch (error) {
    console.log(error);
  }
};

// Transport master list
export const getTransportServiceList = async (destinationId) => {
  try {
    const { data } = await axiosOther.post("transportmasterlist", {
      ServiceName: "",
      id: "",
      Status: "",
      DestinationId: destinationId,
      TransferType: "",
      page: "",
      perPage: "",
    });
    if (data?.Status === 200) {
      console.log(data, "HFVF877");
      const updatedData = data?.DataList?.map((service) => {
        return {
          id: service?.id,
          Name: service?.Name,
          UniqueId: service?.UniqueId,
        };
      });
      return updatedData;
    }
  } catch (error) {
    console.log(error);
  }
};

// Transport Vehicle list
export const getTransportVehicleList = async () => {
  try {
    const { data } = await axiosOther.post("vehicletypemasterlist");

    if (data?.Status === 200) {
      const updatedList = data?.DataList.map((list) => {
        return {
          id: list?.id,
          Name: list?.Name,
        };
      });
      return updatedList;
    }
  } catch (error) {
    console.log(error);
  }
};

// transport vehicle rate api

export const getTransportVehicleRateJson = async (
  DestinationUniqueId,
  UniqueId,
  CompanyUniqueId,
  queryData,
  qoutationData
) => {
  try {
    const { data } = await axiosOther.post("transportsearchlist", {
      id: "",
      TransportUID: UniqueId,
      Destination: DestinationUniqueId,
      SupplierUID: "",
      CurrencyId: "",
      CompanyId: CompanyUniqueId,
      Date: "",
      Year: queryData?.TravelDateInfo.SeasonYear,
      ValidFrom: queryData?.TravelDateInfo.FromDate,
      ValidTo: queryData?.TravelDateInfo.ToDate,
      QueryId: queryData?.id,
      QuatationNo: qoutationData?.QuotationNumber,
    });

    console.log(data, "transportsearchlist");
    if (data?.Status === 1) {
      console.log(data?.Data[0]?.RateJson?.VehicleType, "HDHFGGFGF8877");

      return data?.Data[0]?.RateJson?.VehicleType;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getRestaurentServiceList = async (destinationId) => {
  try {
    const { data } = await axiosOther.post("restaurantmasterlist");
    if (data?.Status === 200) {
      const updatedList = data?.DataList.map((list) => {
        return {
          id: list?.Id,
          Name: list?.Name,
        };
      });
      return updatedList;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getMonumentServiceList = async (destinationId) => {
  try {
    const { data } = await axiosOther.post("monument-package-list", {
      Destination: destinationId,
      Default: "Yes",
    });

    console.log(data, "HFBCGC*77");
    if (data?.Status === 200) {
      const updatedList = data?.DataList?.map((list) => {
        return {
          id: list.id,
          Name: list?.PackageName,
        };
      });

      return updatedList;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getFlightServiceList = async () => {
  try {
    const { data } = await axiosOther.post("airlinemasterlist");
    console.log(data, "GBCG87");

    if (data?.Status === 200) {
      const updatedList = data?.DataList.map((list) => {
        return {
          id: list?.id,
          Name: list?.Name,
        };
      });
      return updatedList;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getTrainServiceList = async () => {
  try {
    const { data } = await axiosOther.post("trainMasterlist");

    if (data?.Status === 200) {
      console.log(data, "GFBVC877");
      const updatedList = data?.DataList.map((list) => {
        return {
          id: list?.id,
          Name: list?.Name,
        };
      });
      return updatedList;
    }
  } catch (error) {}
};

// Monument rate
export const getMonumentRateJson = async (serviceId) => {
  console.log(serviceId, "serviceId7464");

  try {
    const { data } = await axiosOther.post("monument-package-list", {
      id: serviceId,
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

// Guide Rate Json

// destinationId,
//   queryData,
//   qoutationData,
//   destinationUniqueId,
//   dayType

export const getGuideRateJson = async (
  destinationId,
  queryData,
  qoutationData,
  destinationUniqueId,
  dayType,
  CompanyUniqueId
) => {
  const GuideUID = await getGuideServiceList(destinationId);
  console.log(GuideUID, "guideUniqueId65454");

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
