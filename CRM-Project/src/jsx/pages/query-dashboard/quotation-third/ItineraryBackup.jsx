import React, { useEffect, useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector } from "react-redux";
import { axiosOther } from "../../../../http/axios_base_url";
import AOS from "aos";
import "aos/dist/aos.css";

const Itineraries = () => {
  const [checkBoxes, setCheckBoxes] = useState([]);
  const [monumentData, setMonumentData] = useState([
    "guide",
    "meal",
    "activity",
    "transfer",
    "escorts",
  ]);
  const [hotelCheckBox, setHotelCheckBox] = useState([]);
  const [hotelTable, setHotelTable] = useState([1]);
  const [hotelFormValue, setHotelFormValue] = useState([
    {
      Days: "",
      City: "",
      HotelName: "",
      Overnight: "",
      RoomCategory: "",
      FIT: {},
      GIT: {},
      Extrabed: "",
      Mealplan: "",
      Breakfast: "",
      Lunch: "",
      Dinner: "",
    },
  ]);
  const [monumentFromValue, setMonumentFormValue] = useState([
    {
      Days: "",
      City: "",
      Program: "",
      MonumentName: [],
    },
  ]);
  const [trainFormValue, setTrainFormValue] = useState([
    {
      Days: "",
      From: "",
      To: "",
      Number: "",
      Type: "",
      Class: "",
      DepartureTime: "",
      ArrivalTime: "",
      Adults: "",
      Child: "",
      Fare: {
        First: "",
        Second: "",
      },
      HandlingCharge: "",
      Remarks: "",
    },
  ]);
  const [activityFormValue, setActivityFormValue] = useState([
    {
      Days: "",
      City: "",
      ServiceType: "",
      Service: "",
      Supplier: "",
      PaxRange: "",
      NoOfActivity: "",
      Cost: "",
    },
  ]);
  const [restaurantFormValue, setRestaurantFormValue] = useState([
    {
      Days: "",
      Destination: "",
      Restaurant: "",
      Supplier: "",
      AdultCost: "",
      ChildCost: "",
      StartTime: "",
      EndTime: "",
    },
  ]);
  const [additionaFormValue, setAdditionalValue] = useState([
    {
      Days: "",
      From: "",
      Particulars: "",
      UpTo: "",
      Amount: "",
      Supplier: "",
      Package: "",
      Description: "",
    },
  ]);
  const [guideFormValue, setGuideFormValue] = useState([
    {
      Days: "",
      City: "",
      Program: "",
      Language: "",
      LanguageAllowence: "",
    },
  ]);
  const [transportFormValue, setTransportFormValue] = useState([
    {
      Days: "",
      From: "",
      To: "",
      ProgramType: "",
      Program: "",
      ProgramDetails: "",
      Mode: "",
      Supplier: "",
      Remarks: "",
      VehicleType: "",
      CostType: "",
      NoOfDays: "",
      NoOfVehicle: "",
    },
  ]);
  const [flightFormValue, setFlightFormValue] = useState([
    {
      Days: "",
      From: "",
      To: "",
      ProgramType: "",
      Program: "",
      ProgramDetails: "",
      Mode: "",
      Supplier: "",
      Remarks: "",
      VehicleType: "",
      CostType: "",
      NoOfDays: "",
      NoOfVehicle: "",
    },
  ]);

  const { qoutationData, queryData } = useSelector(
    (data) => data?.queryReducer
  );

  const [hotelCategoryList, setHotelCategoryList] = useState([]);
  const [mealPlanList, setMealPlanList] = useState([]);
  const [monumentPackageList, setMonumentPackageList] = useState([]);
  const [headerActivityList, setHeaderActivityList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [overnightList, setOvernightList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [trainClassList, setTrainClassList] = useState([]);
  const [flightClassList, setFlightClassList] = useState([]);
  const [multipleMonument, setMultipleMonument] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [transferTypeList, setTransferTypeList] = useState([]);
  const [transportList, setTransportList] = useState([]);
  const [transportSupplierList, setTransportSupplierList] = useState([]);
  const [activitySupplierList, setActivitySupplierList] = useState([]);
  const [restaurantSupplierList, setRestaurantSupplierList] = useState([]);
  const [restaurantList, setRestaurantList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [headerDropdown, setHeaderDropdown] = useState({
    Hotel: "",
    MealPlan: "",
    MonumentPkg: "",
    Activity: "",
    Transfer: "",
    Guide: "",
  });

  // creating hotel table form initial value
  useEffect(() => {
    if (qoutationData?.Days) {
      const initialFormValue = qoutationData.Days.map((day, ind) => ({
        Day: day.Day,
        City: day.DestinationId || "",
        HotelName:
          hotelList[ind] != undefined ||
          (hotelList[ind] != null && hotelList?.length > 0)
            ? hotelList[ind][0]?.id
            : "",
        Overnight: overnightList?.length > 0 ? overnightList[0]?.Id : "",
        RoomCategory: roomList?.length > 0 ? roomList[0]?.id : "",
        FIT: {},
        GIT: {},
        Extrabed: "",
        Mealplan: mealPlanList?.length > 0 ? mealPlanList[0]?.id : "",
        Breakfast: false,
        Lunch: false,
        Dinner: false,
      }));
      setHotelFormValue(initialFormValue);
    }
  }, [qoutationData, overnightList, roomList, mealPlanList, hotelList]);

  // monument table form initial value
  useEffect(() => {
    if (qoutationData?.Days) {
      const restaurantIntialValue = qoutationData?.Days?.map((day, ind) => {
        return {
          Days: day.Day,
          City: day.DestinationId || "",
          Program:
            monumentPackageList[ind] != undefined ||
            (monumentPackageList[ind] != null &&
              monumentPackageList?.length > 0)
              ? monumentPackageList[ind][0]?.id
              : "",
          MonumentName: [],
        };
      });
      setMonumentFormValue(restaurantIntialValue);
    }
  }, [qoutationData, monumentPackageList]);

  // guide table form initial value
  useEffect(() => {
    if (qoutationData?.Days) {
      const guideInitialValue = qoutationData?.Days?.map((day, ind) => {
        return {
          Days: day?.Day,
          City: day.DestinationId || "",
          Program: "",
          Language: "",
          LanguageAllowence: "",
        };
      });
      setGuideFormValue(guideInitialValue);
    }
  }, [qoutationData]);

  // transport table form initial value
  useEffect(() => {
    if (qoutationData?.Days) {
      const transportInitialValue = qoutationData?.Days?.map((day, ind) => {
        return {
          Days: day?.Day,
          From: day.DestinationId || "",
          To: "",
          ProgramType: "",
          Program: "",
          ProgramDetails: "",
          Mode: "",
          Supplier: "",
          Remarks: "",
          VehicleType: "",
          CostType: "",
          NoOfDays: "",
          NoOfVehicle: "",
        };
      });
      setTransportFormValue(transportInitialValue);
    }
  }, [qoutationData]);

  // train table form initial value
  useEffect(() => {
    if (qoutationData?.Days) {
      const trainInitialValue = qoutationData?.Days?.map((day, ind) => {
        return {
          Days: day?.Day,
          From: day.DestinationId || "",
          To: "",
          Number: "",
          Type: "",
          Class: "",
          DepartureTime: "",
          ArrivalTime: "",
          Adults: "",
          Child: "",
          Fare: {
            First: "",
            Second: "",
          },
          HandlingCharge: "",
          Remarks: "",
        };
      });
      setTrainFormValue(trainInitialValue);
    }
  }, [qoutationData]);

  // flight table form initial value
  useEffect(() => {
    if (qoutationData?.Days) {
      const flightInitialValue = qoutationData?.Days?.map((day, ind) => {
        return {
          Days: day?.Day,
          From: day.DestinationId || "",
          To: "",
          Number: "",
          Type: "",
          Class: "",
          DepartureTime: "",
          ArrivalTime: "",
          Adults: "",
          Child: "",
          Fare: {
            First: "",
            Second: "",
          },
          HandlingCharge: "",
          Remarks: "",
        };
      });
      setFlightFormValue(flightInitialValue);
    }
  }, [qoutationData]);

  // activity table form initial value
  useEffect(() => {
    if (qoutationData?.Days) {
      const activityInitialValue = qoutationData?.Days?.map((day, ind) => {
        return {
          Days: day?.Day,
          City: day.DestinationId || "",
          ServiceType: "",
          Service: "",
          Supplier: "",
          PaxRange: "",
          NoOfActivity: "",
          Cost: "",
        };
      });
      setActivityFormValue(activityInitialValue);
    }
  }, [qoutationData]);

  // restaurant table form initial value
  useEffect(() => {
    if (qoutationData?.Days) {
      const restaurantInitialValue = qoutationData?.Days?.map((day, ind) => {
        return {
          Days: day?.Day,
          Destination: day.DestinationId || "",
          Restaurant: "",
          Supplier: "",
          AdultCost: "",
          ChildCost: "",
          StartTime: "",
          EndTime: "",
        };
      });
      setRestaurantFormValue(restaurantInitialValue);
    }
  }, [qoutationData]);

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("hotelcategorylist");
      setHotelCategoryList(data?.DataList);
      if (data?.DataList?.length > 0) {
        const firstId = data?.DataList[0]?.id;
        setHeaderDropdown((prev) => ({ ...prev, Hotel: firstId }));
      }
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("hotelmealplanlist");
      setMealPlanList(data?.DataList);
      if (data?.DataList?.length > 0) {
        const firstId = data?.DataList[0]?.id;
        setHeaderDropdown((prev) => ({ ...prev, MealPlan: firstId }));
      }
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("activitymasterlist");
      setHeaderActivityList(data?.DataList);
      if (data?.DataList?.length > 0) {
        const firstId = data?.DataList[0]?.id;
        setHeaderDropdown((prev) => ({ ...prev, Activity: firstId }));
      }
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("vehiclemasterlist");
      setVehicleList(data?.DataList);
      if (data?.DataList?.length > 0) {
        const firstId = data?.DataList[0]?.id;
        setHeaderDropdown((prev) => ({ ...prev, Transfer: firstId }));
      }
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("destinationlist");
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("overnight-master-list");
      setOvernightList(data?.Data);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("roomlist");
      setRoomList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("trainclasslist");
      setTrainClassList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("flightclasslist");
      setFlightClassList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("languagelist");
      setLanguageList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("transfertypemasterlist");
      setTransferTypeList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    postDataToServer();
  }, []);

  // This is the function where i fetched hotelList api and called inside useEffect
  const getHotelListDependently = async (city, hotelCategory, index) => {
    try {
      const { data } = await axiosOther.post("hotellist", {
        DestinationId: city,
        HotelCategoryId: hotelCategory,
        Default: "Yes",
      });
      setHotelList((prevList) => {
        const newList = [...prevList];
        newList[index] = data?.DataList;
        return newList;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  // here i am handling getHotelListDependently function calling with useEffect dependencies
  // dynamically onChange of hotelFormValue.City and headerDropwdown.Hotel
  useEffect(() => {
    hotelFormValue.forEach((row, index) => {
      if (row.City && headerDropdown?.Hotel) {
        getHotelListDependently(row.City, headerDropdown?.Hotel, index);
      }
    });
  }, [headerDropdown?.Hotel]);

  useEffect(() => {
    hotelFormValue.forEach((row, index) => {
      if (row.City && headerDropdown?.Hotel) {
        getHotelListDependently(row.City, headerDropdown?.Hotel, index);
      }
    });
  }, [hotelFormValue.map((row) => row.City).join(","), headerDropdown?.Hotel]);

  // getting supplier for transport list with and without dependently it's dependent on transport city
  const getTransportSupplierList = async (index, id) => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        DefaultDestination: parseInt(id),
      });
      setTransportSupplierList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    transportFormValue?.forEach((item, index) => {
      getTransportSupplierList(index, item?.From);
    });
  }, [transportFormValue?.map((item) => item?.City)?.join(",")]);

  // getting supplier for activity list with and without dependently it's dependent on transport city
  const getActivitySupplierList = async (index, id) => {
    // console.log('activity-city', id);
    try {
      const { data } = await axiosOther.post("supplierlist", {
        DefaultDestination: parseInt(id),
      });
      setActivitySupplierList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    activityFormValue?.forEach((item, index) => {
      getActivitySupplierList(index, item?.City);
    });
  }, [activityFormValue?.map((item) => item?.City)?.join(",")]);

  // getting supplier for restaurant list with and without dependently it's dependent on transport city
  const getRestaurantSupplierList = async (index, id) => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        DefaultDestination: parseInt(id),
      });

      setRestaurantSupplierList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    restaurantFormValue?.forEach((item, index) => {
      getRestaurantSupplierList(index, item?.Destination);
    });
  }, [restaurantFormValue?.map((item) => item?.Destination)?.join(",")]);

  //getting transport master with and without dependency of transfer list
  const getTransportList = async (index, transferid) => {
    try {
      const { data } = await axiosOther.post("transportmasterlist", {
        Name: "",
        Status: "",
        id: "",
        DestinationId: "",
        Default: "Yes",
        TransferType: transferid,
      });
      setTransportList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    transportFormValue?.forEach((item, index) => {
      getTransportList(index, item?.ProgramType);
    });
  }, [transportFormValue?.map((item) => item?.ProgramType)?.join(",")]);

  // getting program details text for transport table
  const getTransportPorgramDetails = async (index, id) => {
    if (Array.isArray(transportList[index])) {
      const details = transportList[index]?.filter((item) => item?.id == id);
      setTransportFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = {
          ...newArr[index],
          ProgramDetails: details.length > 0 ? details[0]?.Detail : "",
        };
        return newArr;
      });
    } else {
      setTransportFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = {
          ...newArr[index],
          ProgramDetails: "",
        };
        return newArr;
      });
    }
  };
  useEffect(() => {
    transportFormValue?.forEach((item, index) => {
      getTransportPorgramDetails(index, item?.Program);
    });
  }, [transportFormValue?.map((item) => item?.Program).join(",")]);

  // getting restauarnt list with and without dependencies of destination for restaurant table form
  const getRestaurantList = async (id, index) => {
    try {
      const { data } = await axiosOther.post("restaurantmasterlist", {
        Destination: id,
      });
      setRestaurantList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    restaurantFormValue.forEach((item, index) => {
      getRestaurantList(item?.Destination, index);
    });
  }, [restaurantFormValue?.map((item) => item?.Destination).join(",")]);

  // getting activity with and without dependencies of activity type

  const getActivityList = async (type, index) => {
    try {
      const { data } = await axiosOther.post("activitymasterlist", {
        Type: type,
      });

      setActivityList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    activityFormValue?.forEach((item, index) => {
      getActivityList(item?.ServiceType, index);
    });
  }, [activityFormValue?.map((item) => item?.ServiceType).join(",")]);

  // monument package dependently
  const getMonumentPackageListDependently = async (cityId, index) => {
    try {
      const { data } = await axiosOther.post("monument-package-list", {
        Destination: cityId,
        Default: "Yes",
      });

      setMonumentPackageList((prevList) => {
        const newList = [...prevList];
        newList[index] = data?.DataList;
        return newList;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    monumentFromValue.forEach((row, index) => {
      getMonumentPackageListDependently(row.City, index);
    });
  }, [monumentFromValue.map((row) => row.City).join(",")]);

  // handling transport dropdown value
  const handlingTransportDropdownValue = (index) => {
    const transport =
      transportList[index] != undefined ||
      (transportList[index] != null && transportList?.length > 0)
        ? transportList[index][0]?.id
        : "";

    const supplier =
      transportSupplierList[index] != undefined ||
      (transportSupplierList[index] != null &&
        transportSupplierList?.length > 0)
        ? transportSupplierList[index][0]?.id
        : "";

    setTransportFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        Program: transport,
        Supplier: supplier,
      };
      return newArr;
    });
  };
  useEffect(() => {
    transportFormValue?.map((item, index) => {
      handlingTransportDropdownValue(index);
    });
  }, [transportList, transportSupplierList]);

  // handlign activity dropdown value
  const handlingActivityDropdownValue = (index) => {
    const supplier =
      activitySupplierList[index] != undefined ||
      (activitySupplierList[index] != null && activitySupplierList?.length > 0)
        ? activitySupplierList[index][0]?.id
        : "";

    setActivityFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], Supplier: supplier };
      return newArr;
    });
  };
  useEffect(() => {
    activityFormValue?.map((item, index) => {
      handlingActivityDropdownValue(index);
    });
  }, [activitySupplierList]);

  // handling restaurant dropdown value

  const handlingRestaurantDropdownValue = (index) => {
    const supplier =
      restaurantSupplierList[index] != undefined ||
      (restaurantSupplierList[index] != null &&
        restaurantSupplierList?.length > 0)
        ? restaurantSupplierList[index][0]?.id
        : "";

    setRestaurantFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], Supplier: supplier };
      return newArr;
    });
  };

  useEffect(() => {
    restaurantFormValue?.map((item, index) => {
      handlingRestaurantDropdownValue(index);
    });
  }, [restaurantSupplierList]);

  // filtering monument on the base of monument package list
  const filterMonumentPackageList = (packageId, index) => {
    const filteredMonument = monumentPackageList[index]?.filter(
      (pckg) => pckg?.id == packageId
    );

    setMultipleMonument((prevList) => {
      const newList = [...prevList];
      newList[index] = filteredMonument;
      return newList;
    });
  };

  useEffect(() => {
    monumentFromValue.forEach((row, index) => {
      filterMonumentPackageList(row.Program, index);
    });
  }, [
    monumentPackageList,
    monumentFromValue.map((row) => row.Program).join(","),
  ]);

  const handleCheckboxes = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCheckBoxes([...checkBoxes, value]);
    }

    if (!checked) {
      const checkedValues = checkBoxes?.filter(
        (checkValue) => checkValue != value
      );
      setCheckBoxes(checkedValues);
    }
  };

  const handleHotelCheckBox = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setHotelCheckBox([...hotelCheckBox, value]);
    }

    if (!checked) {
      const checkedValues = hotelCheckBox?.filter(
        (checkValue) => checkValue != value
      );
      setHotelCheckBox(checkedValues);
    }
  };

  const removeMonument = (item, index) => {
    const filteredMonument = monumentData?.filter((value) => value != item);
    setMonumentData(filteredMonument);
  };

  const handleHotelTableIncrement = () => {
    setHotelTable([...hotelTable, hotelTable + 1]);
  };

  const handleHotelTableDecrement = (index) => {
    const filteredTable = hotelTable?.filter((item, ind) => ind != index);
    setHotelTable(filteredTable);
  };

  const handleHeaderDropdown = (e) => {
    const { name, value } = e.target;
    setHeaderDropdown({ ...headerDropdown, [name]: value });
  };

  // getting program type name from transport
  const getProgramTypeForTransport = () => {
    transferTypeList?.forEach((transfer) => {
      if (transfer?.Name == "Arrival") {
        setTransportFormValue((prevForm) => {
          const newForm = [...prevForm];
          newForm[0] = { ...newForm[0], ProgramType: transfer?.id };
          return newForm;
        });
      }
      if (transfer?.Name == "Departure") {
        setTransportFormValue((prevForm) => {
          const newForm = [...prevForm];
          newForm[transportFormValue.length - 1] = {
            ...newForm[transportFormValue.length - 1],
            ProgramType: transfer?.id,
          };
          return newForm;
        });
      }
    });
  };

  useEffect(() => {
    getProgramTypeForTransport();
  }, [transferTypeList]);

  // getting half/full day for guide program that dependent on monument program
  useEffect(() => {
    multipleMonument?.forEach((value, index) => {
      setGuideFormValue((prevValue) => {
        const newValue = [...prevValue];
        newValue[index] = {
          ...newValue[index],
          Program:
            value != undefined && value.length > 0 ? value[0]?.DayType : "",
        };
        return newValue;
      });
    });
  }, [multipleMonument]);

  // hotel table forms onchange handler
  const handleHotelFormChange = (ind, e) => {
    const { name, value, checked, type } = e.target;

    if (checked != "checkbox") {
      setHotelFormValue((prevValue) => {
        const newArr = [...prevValue];
        newArr[ind] = { ...hotelFormValue[ind], [name]: value };
        return newArr;
      });
    }

    if (type == "checkbox") {
      if (checked) {
        setHotelFormValue((prevValue) => {
          const newArr = [...prevValue];
          newArr[ind] = { ...hotelFormValue[ind], [name]: true };
          return newArr;
        });
      }

      if (!checked) {
        setHotelFormValue((prevValue) => {
          const newArr = [...prevValue];
          newArr[ind] = { ...hotelFormValue[ind], [name]: false };
          return newArr;
        });
      }
    }
  };

  // monument table form onchange handler
  const handleMonumentFormChange = (ind, e) => {
    const { name, value, checked, type } = e.target;
    setMonumentFormValue((prevValue) => {
      const newArr = [...prevValue];
      newArr[ind] = { ...monumentFromValue[ind], [name]: value };
      return newArr;
    });
  };

  const handleGuideFormChange = (ind, e) => {
    const { name, value } = e.target;
    setGuideFormValue((prevValue) => {
      const newArr = [...prevValue];
      newArr[ind] = { ...guideFormValue[ind], [name]: value };
      return newArr;
    });
  };

  const handleTransportChange = (ind, e) => {
    const { name, value } = e.target;
    setTransportFormValue((prevValue) => {
      const newArr = [...prevValue];
      newArr[ind] = { ...transportFormValue[ind], [name]: value };
      return newArr;
    });
  };

  const handleTrainFormChange = (ind, e) => {
    const { name, value } = e.target;

    setTrainFormValue((prevForm) => {
      const newArr = [...prevForm];
      newArr[ind] = { ...newArr[ind], [name]: value };
      return newArr;
    });
  };

  const handleFlightChange = (ind, e) => {
    const { name, value } = e.target;
    setFlightFormValue((prevForm) => {
      const newArr = [...prevForm];
      newArr[ind] = { ...newArr[ind], [name]: value };
      return newArr;
    });
  };

  const handleActivityFormChange = (ind, e) => {
    const { name, value } = e.target;
    setActivityFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[ind] = { ...newArr[ind], [name]: value };
      return newArr;
    });
  };

  const handleRestaurantFormChange = (ind, e) => {
    const { name, value } = e.target;

    setRestaurantFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[ind] = { ...newArr[ind], [name]: value };
      return newArr;
    });
  };

  const getHotelRateApi = async (destination, hotel) => {
    try {
      const { data } = await axiosOther.post("priceEditHotelRatesJson", {
        Id: "",
        HotelID: "",
        HotelName: hotel,
        DestinationID: destination,
        Date: "",
        ValidFrom: qoutationData?.TourSummary?.FromDate,
        ValidTo: qoutationData?.TourSummary?.ToDate,
        QueryId: queryData?.QueryId,
        QuatationNo: qoutationData?.QuotationNumber,
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    hotelFormValue?.forEach((form) => {
      getHotelRateApi(form?.City, form?.HotelName);
    });
  }, []);

  const getGuideRateApi = async (destination) => {
    try {
      const { data } = await axiosOther.post("filterGuideDataByDestination", {
        Destination: destination,
        DestinationType: "",
        QueryId: queryData?.QueryId,
        QuatationNo: qoutationData?.QuotationNumber,
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    guideFormValue?.forEach((form) => {
      getGuideRateApi(form?.City);
    });
  }, []);

  console.log("monument-list");

  const getMonumentRateApi = async (destination) => {
    try {
      const { data } = await axiosOther.post("monumentsearchlist", {
        id: "",
        MonumentUID: "",
        Destination: destination,
        Date: "",
        ValidFrom: qoutationData?.TourSummary?.FromDate,
        ValidTo: qoutationData?.TourSummary?.ToDate,
        QueryId: queryData?.QueryId,
        QuatationNo: qoutationData?.QuotationNumber,
      });
      console.log("monument-filter", data);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    monumentFromValue.forEach((form) => {
      getMonumentRateApi(form?.City);
    });
  }, []);

  const getTransportRateApi = async () => {
    try {
      const { data } = await axiosOther.post("transportsearchlist", {
        id: "",
        TransportUID: "",
        Destination: "",
        Date: "",
        ValidFrom: "",
        ValidTo: "",
        QueryId: "25",
        QuatationNo: "YO3N4AP6-A",
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  

  // animation initialization
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <Tab.Container defaultActiveKey="main-itinerary">
      <Nav as="ul" className="nav-pills light borderBottom">
        <Nav.Item as="li">
          <Nav.Link
            eventKey={"main-itinerary"}
            className="border-0 height25px d-flex justify-content-center align-items-center fontSize10px"
          >
            Main Itinerary
          </Nav.Link>
        </Nav.Item>
        {checkBoxes?.includes("escorts") && (
          <>
            <Nav.Item as="li" data-aos="zoom-in">
              <Nav.Link
                eventKey={"local"}
                className="border-0 height25px d-flex justify-content-center align-items-center fontSize10px"
              >
                Local
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li" data-aos="zoom-in">
              <Nav.Link
                eventKey={"foreigner"}
                className="border-0 height25px d-flex justify-content-center align-items-center fontSize10px"
              >
                Foreigner
              </Nav.Link>
            </Nav.Item>
          </>
        )}
      </Nav>
      <Tab.Content className="">
        <Tab.Pane eventKey="main-itinerary" className="pb-5">
          {/* top header row */}
          <div className="row borderBottom m-0">
            <div className="col-8 height40px ps-0">
              <div className=" d-flex align-items-center gap-2 h-100 ">
                <span className="borderPrimary p-1 rounded3px colorPrimary fontSize8px truncateTextOneLine cursor-pointer">
                  2N Dubai, 3D Abu Dhabi
                </span>
                <span className="borderPrimary p-1 rounded3px colorPrimary fontSize8px truncateTextOneLine cursor-pointer">
                  2N Dubai, 3D Abu Dhabi
                </span>
                <span className="borderPrimary p-1 rounded3px colorPrimary fontSize8px truncateTextOneLine cursor-pointer">
                  2N Dubai, 3D Abu Dhabi
                </span>
                <span className="borderPrimary p-1 rounded3px colorPrimary fontSize8px truncateTextOneLine cursor-pointer">
                  2N Dubai, 3D Abu Dhabi
                </span>
                <span className="borderPrimary p-1 rounded3px colorPrimary fontSize8px truncateTextOneLine cursor-pointer">
                  2N Dubai, 3D Abu Dhabi
                </span>
              </div>
            </div>
            <div className="col-4 ps-0 height40px d-flex align-items-center justify-content-end gap-2 pe-0">
              <div className=" position-relative">
                <input
                  type="text"
                  placeholder="Search Itinerary Template"
                  className="height30px SearchInput borderRadius15px"
                />
                <i className="fa-solid fa-magnifying-glass position-absolute searchIconPosition"></i>
              </div>
              <button className="height30px borderRadius15px fontSize11px width75px colorPrimary borderPrimary bg-white">
                Search
              </button>
            </div>
          </div>
          {/* header section all top dropdowns */}
          <div className="row py-2 shadow m-0">
            <div className="col-12 d-flex gap-3 flex-wrap form-row-gap px-1">
              <div className="d-flex gap-1 align-items-center">
                <div>
                  <input
                    type="checkbox"
                    className="form-check-input form-check-input-custom"
                    id="hotel"
                    value="hotel"
                    checked={checkBoxes?.includes("hotel")}
                    onChange={handleCheckboxes}
                  />
                  <label className="fontSize11px m-0 ms-1 " htmlFor="hotel">
                    Hotel
                  </label>
                </div>
                {checkBoxes?.includes("hotel") && (
                  <div data-aos="zoom-in">
                    <select
                      name="Hotel"
                      id=""
                      className="formControl1"
                      value={headerDropdown?.Hotel}
                      onChange={handleHeaderDropdown}
                    >
                      {hotelCategoryList?.map((category, index) => {
                        return (
                          <option value={category?.id} key={index + "a"}>
                            {category?.UploadKeyword}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>
              <div className="d-flex gap-1 align-items-center">
                <div>
                  <input
                    type="checkbox"
                    className="form-check-input form-check-input-custom"
                    id="mealplan"
                    checked={checkBoxes?.includes("mealplan")}
                    value="mealplan"
                    onChange={handleCheckboxes}
                  />
                  <label className="fontSize11px m-0 ms-1" htmlFor="mealplan">
                    Meal Plan
                  </label>
                </div>
                {checkBoxes?.includes("mealplan") && (
                  <div data-aos="zoom-in">
                    <select
                      name="MealPlan"
                      className="formControl1"
                      value={headerDropdown?.MealPlan}
                      onChange={handleHeaderDropdown}
                    >
                      {mealPlanList?.map((meal, index) => {
                        return (
                          <option value={meal?.id} key={index + "b"}>
                            {meal?.ShortName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>
              <div className="d-flex gap-1 align-items-center">
                <div>
                  <input
                    type="checkbox"
                    className="form-check-input form-check-input-custom"
                    id="monumentpkg"
                    value="monument"
                    checked={checkBoxes?.includes("monument")}
                    onChange={handleCheckboxes}
                  />
                  <label
                    className="fontSize11px m-0 ms-1"
                    htmlFor="monumentpkg"
                  >
                    Monument PKG
                  </label>
                </div>
              </div>
              <div className="d-flex gap-1 align-items-center">
                <div>
                  <input
                    type="checkbox"
                    className="form-check-input form-check-input-custom"
                    id="activities"
                    value="activity"
                    checked={checkBoxes?.includes("activity")}
                    onChange={handleCheckboxes}
                  />
                  <label className="fontSize11px m-0 ms-1" htmlFor="activities">
                    Activity
                  </label>
                </div>
                {checkBoxes?.includes("activity") && (
                  <div data-aos="zoom-in">
                    <select
                      name="Activity"
                      className="formControl1"
                      value={headerDropdown?.Activity}
                      onChange={handleHeaderDropdown}
                    >
                      {headerActivityList?.map((activity, index) => {
                        return (
                          <option value={activity?.id} key={index + "c"}>
                            {activity?.ServiceName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>
              <div className="d-flex gap-1 align-items-center">
                <div>
                  <input
                    type="checkbox"
                    className="form-check-input form-check-input-custom"
                    id="transfer"
                    value="transfer"
                    checked={checkBoxes?.includes("transfer")}
                    onChange={handleCheckboxes}
                  />
                  <label className="fontSize11px m-0 ms-1" htmlFor="transfer">
                    Transfer
                  </label>
                </div>
                {checkBoxes?.includes("transfer") && (
                  <div data-aos="zoom-in">
                    <select
                      name="Transfer"
                      id=""
                      className="formControl1"
                      value={headerDropdown?.Transfer}
                      onChange={headerDropdown}
                    >
                      {vehicleList?.map((vehicle, index) => {
                        return (
                          <option value={vehicle?.id} key={index + "d"}>
                            {vehicle?.VehicleTypeName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>
              <div className="d-flex gap-1 align-items-center">
                <div>
                  <input
                    type="checkbox"
                    className="form-check-input form-check-input-custom"
                    id="guide"
                    value="guide"
                    checked={checkBoxes?.includes("guide")}
                    onChange={handleCheckboxes}
                  />
                  <label className="fontSize11px m-0 ms-1" htmlFor="guide">
                    Guide
                  </label>
                </div>
                {checkBoxes?.includes("guide") && (
                  <div>
                    <select
                      name="Guide"
                      className="formControl1"
                      value={headerDropdown?.Guide}
                      onChange={handleHeaderDropdown}
                    >
                      <option value="">PKG</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="d-flex gap-1 align-items-center">
                <div>
                  <input
                    type="checkbox"
                    className="form-check-input form-check-input-custom"
                    id="escorts"
                    value="escorts"
                    checked={checkBoxes?.includes("escorts")}
                    onChange={handleCheckboxes}
                  />
                  <label className="fontSize11px m-0 ms-1" htmlFor="escorts">
                    Escorts
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* hotel form table  */}
          <div className="row mt-3 m-0">
            <div
              className="col-12 px-1 py-2 d-flex justify-content-between"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M15.0344 2.37286H20.2909C21.075 2.37286 21.7256 2.98257 21.9236 3.80757C21.9762 4.03071 21.9841 4.21771 21.8497 4.4165C21.7857 4.51291 21.6988 4.59199 21.5968 4.64669C21.4948 4.70139 21.3809 4.73001 21.2652 4.73H21.2023V22H0.773719V4.73H0.695147C0.576747 4.72986 0.460297 4.69983 0.356596 4.6427C0.252895 4.58556 0.1653 4.50316 0.101933 4.40314C-0.0316386 4.19571 -0.0143529 3.99457 0.0430043 3.76514C0.24179 2.96136 0.883719 2.37286 1.65372 2.37286H6.91015C7.3171 1.6536 7.90743 1.05507 8.62101 0.638245C9.33458 0.221418 10.1459 0.00119095 10.9723 0C11.7987 0.00119095 12.61 0.221418 13.3236 0.638245C14.0372 1.05507 14.6275 1.6536 15.0344 2.37286ZM6.27372 21.7014C6.27372 21.4343 6.49372 21.2143 6.76165 21.2143H7.05943V4.73H6.27372V21.7014ZM15.2144 21.2143H14.9166V4.73H15.7023V21.7014C15.7023 21.4343 15.4823 21.2143 15.2144 21.2143ZM10.9802 0.785714H10.9841C10.9828 0.785714 10.9815 0.785714 10.9802 0.785714ZM3.13086 15.169V17.0414C3.13086 17.1749 3.02086 17.2857 2.87943 17.2857H1.803C1.66943 17.2857 1.55943 17.1757 1.55943 17.0421V15.169C1.55943 15.0354 1.66943 14.9254 1.803 14.9254H2.88729C3.02086 14.9254 3.13086 15.0354 3.13086 15.169ZM5.48801 15.169V17.0414C5.48801 17.1749 5.37801 17.2857 5.23658 17.2857H4.16015C4.02658 17.2857 3.91658 17.1757 3.91658 17.0421V15.169C3.91658 15.0354 4.02658 14.9254 4.16015 14.9254H5.24443C5.37801 14.9254 5.48801 15.0354 5.48801 15.169ZM3.13086 11.2341V13.1073C3.13086 13.2409 3.02086 13.3509 2.87943 13.3509H1.803C1.66943 13.3509 1.55943 13.2409 1.55943 13.1073V11.2341C1.55943 11.1006 1.66943 10.9906 1.803 10.9906H2.88729C3.02086 10.9906 3.13086 11.1006 3.13086 11.2341ZM5.48801 11.2341V13.1073C5.48801 13.2409 5.37801 13.3509 5.23658 13.3509H4.16015C4.02658 13.3509 3.91658 13.2409 3.91658 13.1073V11.2341C3.91658 11.1006 4.02658 10.9906 4.16015 10.9906H5.24443C5.37801 10.9906 5.48801 11.1006 5.48801 11.2341ZM3.13086 7.31579V9.18814C3.13086 9.32171 3.02086 9.43171 2.87943 9.43171H1.803C1.66943 9.43171 1.55943 9.32171 1.55943 9.18814V7.315C1.55943 7.18143 1.66943 7.07143 1.803 7.07143H2.88729C3.02086 7.07143 3.13086 7.18221 3.13086 7.31579ZM5.48801 7.315V9.18736C5.48801 9.32093 5.37801 9.43093 5.23658 9.43093H4.16015C4.02658 9.43093 3.91658 9.32093 3.91658 9.18736V7.315C3.91658 7.18143 4.02658 7.07143 4.16015 7.07143H5.24443C5.37801 7.07143 5.48801 7.18143 5.48801 7.315ZM18.0547 15.1682V17.0406C18.0547 17.1741 17.9447 17.2849 17.8112 17.2849H16.7316C16.667 17.2847 16.6051 17.259 16.5593 17.2134C16.5135 17.1678 16.4876 17.106 16.4872 17.0414V15.1682C16.4872 15.0346 16.5972 14.9246 16.7308 14.9246H17.8096C17.9432 14.9246 18.0547 15.0346 18.0547 15.1682ZM20.4158 15.1682V17.0406C20.4158 17.1741 20.3058 17.2849 20.1722 17.2849H19.0934C19.0288 17.2847 18.9669 17.259 18.9212 17.2134C18.8754 17.1678 18.8495 17.106 18.8491 17.0414V15.1682C18.8491 15.0346 18.9591 14.9246 19.0927 14.9246H20.1714C20.305 14.9246 20.4158 15.0346 20.4158 15.1682ZM18.0539 11.2334V13.1065C18.0539 13.2401 17.9439 13.3501 17.8104 13.3501H16.7316C16.667 13.3499 16.6051 13.3242 16.5593 13.2786C16.5135 13.2329 16.4876 13.1711 16.4872 13.1065V11.2334C16.4872 11.0998 16.5972 10.9898 16.7308 10.9898H17.8096C17.9432 10.9898 18.0539 11.0998 18.0539 11.2334ZM20.4158 11.2334V13.1065C20.4158 13.2401 20.3058 13.3501 20.1722 13.3501H19.0934C19.0288 13.3499 18.9669 13.3242 18.9212 13.2786C18.8754 13.2329 18.8495 13.1711 18.8491 13.1065V11.2334C18.8491 11.0998 18.9591 10.9898 19.0927 10.9898H20.1714C20.305 10.9898 20.4158 11.0998 20.4158 11.2334ZM18.0539 7.315V9.18736C18.0539 9.32093 17.9439 9.43093 17.8104 9.43093H16.7316C16.667 9.43072 16.6051 9.40502 16.5593 9.35941C16.5135 9.3138 16.4876 9.25196 16.4872 9.18736V7.315C16.4872 7.18143 16.5972 7.07143 16.7308 7.07143H17.8096C17.9432 7.07143 18.0539 7.18143 18.0539 7.315ZM20.4158 7.315V9.18736C20.4158 9.32093 20.3058 9.43093 20.1722 9.43093H19.0934C19.0288 9.43072 18.9669 9.40502 18.9212 9.35941C18.8754 9.3138 18.8495 9.25196 18.8491 9.18736V7.315C18.8491 7.18143 18.9591 7.07143 19.0927 7.07143H20.1714C20.305 7.07143 20.4158 7.18143 20.4158 7.315ZM10.2023 8.88643V10.7564C10.2023 10.89 10.0923 11 9.95715 11H8.87601C8.81126 11 8.74915 10.9744 8.70322 10.9288C8.65729 10.8831 8.63128 10.8212 8.63086 10.7564V8.88643C8.63086 8.75286 8.74086 8.64286 8.87601 8.64286H9.95715C10.0915 8.64286 10.2023 8.75286 10.2023 8.88643ZM10.3099 19.6429H8.91608C8.87822 19.6427 8.84077 19.635 8.8059 19.6202C8.77103 19.6055 8.73942 19.5839 8.71291 19.5569C8.68639 19.5299 8.66549 19.4979 8.65141 19.4627C8.63733 19.4276 8.63034 19.39 8.63086 19.3521V15.7159H10.5951V19.3529C10.5951 19.5179 10.4639 19.6429 10.3099 19.6429ZM11.3809 14.9301V14.9286H10.5951V14.9301H8.63086V14.9286H7.80901C7.76231 14.929 7.716 14.9201 7.67273 14.9026C7.62947 14.885 7.59013 14.859 7.55696 14.8261C7.52379 14.7933 7.49747 14.7541 7.4795 14.711C7.46154 14.6679 7.45229 14.6217 7.45229 14.575C7.45229 14.5121 7.47586 14.4571 7.49944 14.41C7.50415 14.4053 7.50651 14.4037 7.50729 14.4014V14.3943C7.86584 13.7883 8.37616 13.2862 8.98792 12.9377C9.59968 12.5891 10.2918 12.406 10.9959 12.4064C11.7 12.406 12.392 12.5891 13.0038 12.9377C13.6156 13.2862 14.1259 13.7883 14.4844 14.3943C14.4884 14.3982 14.4884 14.4037 14.4884 14.41C14.4884 14.4163 14.4884 14.4218 14.4923 14.4257C14.5159 14.465 14.5237 14.52 14.5237 14.575C14.5237 14.6217 14.5145 14.6679 14.4965 14.711C14.4785 14.7541 14.4522 14.7933 14.4191 14.8261C14.3859 14.859 14.3465 14.885 14.3033 14.9026C14.26 14.9201 14.2137 14.929 14.167 14.9286H13.3452V14.9301H11.3809ZM11.3809 15.7159V19.3529C11.3809 19.5179 11.5121 19.6429 11.6661 19.6429H13.0599C13.2139 19.6429 13.3452 19.5171 13.3452 19.3521V15.7159H11.3809ZM13.3452 10.7564V8.88643C13.3452 8.75286 13.2352 8.64286 13.1 8.64286H12.0189C11.9542 8.64306 11.8922 8.66874 11.8463 8.71433C11.8004 8.75992 11.7743 8.82175 11.7737 8.88643V10.7564C11.7737 10.89 11.8837 11 12.0189 11H13.1C13.2344 11 13.3452 10.89 13.3452 10.7564ZM12.1752 3.14286H12.1595C12.0577 3.14327 11.9601 3.18402 11.8883 3.25618C11.8164 3.32833 11.7761 3.42602 11.7761 3.52786V4.71429H10.2007V3.52786C10.2007 3.42575 10.1602 3.32782 10.088 3.25562C10.0158 3.18342 9.91783 3.14286 9.81572 3.14286H9.80001C9.69817 3.14327 9.60065 3.18402 9.52879 3.25618C9.45692 3.32833 9.41658 3.42602 9.41658 3.52786V6.68643C9.41658 6.89857 9.58944 7.07143 9.80079 7.07143H9.81651C9.91848 7.07122 10.0162 7.03057 10.0882 6.95839C10.1603 6.88621 10.2007 6.7884 10.2007 6.68643V5.50786H11.7761V6.68643C11.7761 6.89857 11.9481 7.07143 12.1595 7.07143H12.1752C12.2772 7.07122 12.3749 7.03057 12.447 6.95839C12.519 6.88621 12.5594 6.7884 12.5594 6.68643V3.52786C12.5594 3.42588 12.519 3.32808 12.447 3.2559C12.3749 3.18372 12.2772 3.14307 12.1752 3.14286Z"
                      fill="#EC5B0A"
                    />
                  </svg>
                </div>
                <p className="m-0 text-dark">HOTEL</p>
              </div>
              <div className="d-flex gap-4 align-items-center">
                <div>
                  <input
                    type="checkbox"
                    className="form-check-input form-check-input-custom"
                    id="extrabed"
                    value="extrabed"
                    checked={hotelCheckBox?.includes("extrabed")}
                    onChange={handleHotelCheckBox}
                  />
                  <label className="fontSize11px m-0 ms-1 " htmlFor="extrabed">
                    Extra Bed
                  </label>
                </div>

                <div>
                  <input
                    type="checkbox"
                    className="form-check-input form-check-input-custom"
                    id="breakfast"
                    value="breakfast"
                    checked={hotelCheckBox?.includes("breakfast")}
                    onChange={handleHotelCheckBox}
                  />
                  <label className="fontSize11px m-0 ms-1 " htmlFor="breakfast">
                    Break Fast
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    className="form-check-input form-check-input-custom"
                    id="lunch"
                    value="lunch"
                    checked={hotelCheckBox?.includes("lunch")}
                    onChange={handleHotelCheckBox}
                  />
                  <label className="fontSize11px m-0 ms-1 " htmlFor="lunch">
                    Lunch
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    className="form-check-input form-check-input-custom"
                    id="dinner"
                    value="dinner"
                    checked={hotelCheckBox?.includes("dinner")}
                    onChange={handleHotelCheckBox}
                  />
                  <label className="fontSize11px m-0 ms-1 " htmlFor="dinner">
                    Dinner
                  </label>
                </div>
              </div>
            </div>
            <div className="col-12 px-0 mt-2">
              <PerfectScrollbar className="dlabnav-scroll d-flex flex-column justify-content-between">
                <table class="table table-bordered itinerary-table">
                  <thead>
                    <tr className="its-table">
                      <th rowSpan={2} className="py-1 align-middle">
                        Days
                      </th>
                      <th rowSpan={2} className="py-1 align-middle">
                        Destination
                      </th>
                      <th rowSpan={2} className="py-1 align-middle">
                        Hotel Name
                      </th>
                      <th rowSpan={2} className="py-1 align-middle">
                        Overnight
                      </th>
                      <th rowSpan={2} className="py-1 align-middle">
                        Room Category
                      </th>
                      {qoutationData?.TourSummary?.PaxTypeName == "FIT" && (
                        <th colSpan={2} className="py-1 align-middle">
                          FIT
                        </th>
                      )}
                      {qoutationData?.TourSummary?.PaxTypeName == "GIT" && (
                        <th colSpan={2} className="py-1 align-middle">
                          GIT
                        </th>
                      )}
                      <th rowSpan={2} className="py-1 align-middle">
                        Meal Plan
                      </th>
                      {hotelCheckBox?.includes("extrabed") && (
                        <th rowSpan={2} className="py-1 align-middle">
                          Extra Bed
                        </th>
                      )}
                      {hotelCheckBox?.includes("breakfast") && (
                        <th rowSpan={2} className="py-1 align-middle">
                          Break Fast
                        </th>
                      )}
                      {hotelCheckBox?.includes("lunch") && (
                        <th rowSpan={2} className="py-1 align-middle">
                          Lunch
                        </th>
                      )}
                      {hotelCheckBox?.includes("dinner") && (
                        <th rowSpan={2} className="py-1 align-middle">
                          Dinner
                        </th>
                      )}
                    </tr>
                    <tr>
                      {qoutationData?.TourSummary?.PaxTypeName == "FIT" && (
                        <th className="py-1">SGL</th>
                      )}
                      {qoutationData?.TourSummary?.PaxTypeName == "FIT" && (
                        <th className="py-1">DBL</th>
                      )}
                      {qoutationData?.TourSummary?.PaxTypeName == "GIT" && (
                        <th className="py-1">SGL</th>
                      )}
                      {qoutationData?.TourSummary?.PaxTypeName == "GIT" && (
                        <th className="py-1">DBL</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {hotelFormValue?.map((item, index) => {
                      return (
                        <tr key={index + 1 + "e"}>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <div>
                                {index > 0 ? (
                                  <span
                                    onClick={() =>
                                      handleHotelTableDecrement(index)
                                    }
                                  >
                                    <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                ) : (
                                  <span onClick={handleHotelTableIncrement}>
                                    <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                )}
                              </div>
                              <div>{`Day ${item?.Day}`}</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="City"
                                id=""
                                className="formControl1"
                                value={hotelFormValue[index]?.City}
                                onChange={(e) =>
                                  handleHotelFormChange(index, e)
                                }
                              >
                                <option value="">Select</option>;
                                {destinationList?.map((city, index) => {
                                  return (
                                    <option value={city?.id} key={index + "f"}>
                                      {city?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="HotelName"
                                id=""
                                className="formControl1"
                                value={hotelFormValue[index]?.HotelName}
                                onChange={(e) =>
                                  handleHotelFormChange(index, e)
                                }
                              >
                                <option value="">Select</option>;
                                {hotelList[index]?.map((hotel, index) => {
                                  return (
                                    <option key={index} value={hotel?.id + "g"}>
                                      {hotel?.HotelName}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="Overnight"
                                id=""
                                className="formControl1"
                                value={hotelFormValue[index]?.Overnight}
                                onChange={(e) =>
                                  handleHotelFormChange(index, e)
                                }
                              >
                                <option value="">Select</option>
                                {overnightList?.map((overnight, index) => {
                                  return (
                                    <option
                                      value={overnight?.Id}
                                      key={index + "g"}
                                    >
                                      {overnight?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="RoomCategory"
                                id=""
                                className="formControl1"
                                value={hotelFormValue[index]?.RoomCategory}
                                onChange={(e) =>
                                  handleHotelFormChange(index, e)
                                }
                              >
                                <option value="">Select</option>
                                {roomList?.map((room, index) => {
                                  return (
                                    <option value={room?.id} key={index + "h"}>
                                      {room?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          {qoutationData?.TourSummary?.PaxTypeName == "FIT" && (
                            <>
                              <td>
                                <div>
                                  <input
                                    id=""
                                    name=""
                                    className="formControl1 width50px"
                                  />
                                </div>
                              </td>
                              <td>
                                <div>
                                  <input
                                    id=""
                                    name=""
                                    className="formControl1 width50px"
                                  />
                                </div>
                              </td>
                            </>
                          )}
                          {qoutationData?.TourSummary?.PaxTypeName == "GIT" && (
                            <>
                              <td>
                                <div>
                                  <input
                                    id=""
                                    name=""
                                    className="formControl1 width50px"
                                  />
                                </div>
                              </td>
                              <td>
                                <div>
                                  <input
                                    id=""
                                    name=""
                                    className="formControl1 width50px"
                                  />
                                </div>
                              </td>
                            </>
                          )}
                          <td>
                            <div>
                              <select
                                name="Mealplan"
                                id=""
                                className="formControl1"
                                value={hotelFormValue[index]?.Mealplan}
                                onChange={(e) =>
                                  handleHotelFormChange(index, e)
                                }
                              >
                                <option value="">Select</option>
                                {mealPlanList?.map((meal, index) => {
                                  return (
                                    <option value={meal?.id} key={index + "h"}>
                                      {meal?.ShortName}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          {hotelCheckBox?.includes("extrabed") && (
                            <td data-aos="fade-up">
                              <div>
                                <input
                                  id=""
                                  name="Extrabed"
                                  className="formControl1 width50px"
                                  value={hotelFormValue[index]?.Extrabed}
                                  onChange={(e) =>
                                    handleHotelFormChange(index, e)
                                  }
                                />
                              </div>
                            </td>
                          )}
                          {hotelCheckBox?.includes("breakfast") && (
                            <td data-aos="zoom-in">
                              <div>
                                <input
                                  type="checkbox"
                                  className="form-check-input form-check-input-custom"
                                  name="Breakfast"
                                  id={`breakfast${index}`}
                                  value="breakfast"
                                  checked={hotelFormValue[index]?.Breakfast}
                                  onChange={(e) =>
                                    handleHotelFormChange(index, e)
                                  }
                                />
                                <label
                                  className="fontSize11px m-0 ms-1 "
                                  htmlFor={`breakfast${index}`}
                                ></label>
                              </div>
                            </td>
                          )}
                          {hotelCheckBox?.includes("lunch") && (
                            <td data-aos="zoom-in">
                              <div>
                                <div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input form-check-input-custom"
                                    id={`lunch${index}`}
                                    value="lunch"
                                    name="Lunch"
                                    checked={hotelFormValue[index]?.Lunch}
                                    onChange={(e) =>
                                      handleHotelFormChange(index, e)
                                    }
                                  />
                                  <label
                                    className="fontSize11px m-0 ms-1 "
                                    htmlFor={`lunch${index}`}
                                  ></label>
                                </div>
                              </div>
                            </td>
                          )}
                          {hotelCheckBox?.includes("dinner") && (
                            <td data-aos="zoom-in">
                              <div>
                                <div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input form-check-input-custom"
                                    id={`dinner${index}`}
                                    value="dinner"
                                    name="Dinner"
                                    checked={hotelFormValue[index]?.Dinner}
                                    onChange={(e) =>
                                      handleHotelFormChange(index, e)
                                    }
                                  />
                                  <label
                                    className="fontSize11px m-0 ms-1 "
                                    htmlFor={`dinner${index}`}
                                  ></label>
                                </div>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </PerfectScrollbar>
            </div>
          </div>
          {/* monument form table */}
          <div className="row mt-3 m-0">
            <div
              className="col-12 px-1 py-2 d-flex justify-content-between"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <path d="M0 0H24V24H0V0Z" fill="url(#pattern0_242_1456)" />
                    <defs>
                      <pattern
                        id="pattern0_242_1456"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlink:href="#image0_242_1456"
                          transform="scale(0.0208333)"
                        />
                      </pattern>
                      <image
                        id="image0_242_1456"
                        width="48"
                        height="48"
                        xlink:href="data:image/png;base64,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"
                      />
                    </defs>
                  </svg>
                </div>
                <p className="m-0 text-dark">Monument</p>
              </div>
            </div>
            <div className="col-12 px-0 mt-2">
              <PerfectScrollbar className="dlabnav-scroll d-flex flex-column justify-content-between">
                <table class="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      <th rowSpan={2}>Days</th>
                      <th rowSpan={2}>City</th>
                      <th rowSpan={2}>Program</th>
                      <th rowSpan={2}>Monuments Name</th>
                      <th colSpan={2}>Foreigner</th>
                      <th colSpan={2}>Indian</th>
                    </tr>
                    <tr>
                      <th>Adults</th>
                      <th>Childs</th>
                      <th>Adults</th>
                      <th>Childs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monumentFromValue?.map((item, index) => {
                      return (
                        <tr key={index + 1 + "i"}>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <div>
                                {index > 0 ? (
                                  <span
                                    onClick={(e) =>
                                      handleHotelTableDecrement(index.e)
                                    }
                                  >
                                    <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                ) : (
                                  <span onClick={handleHotelTableIncrement}>
                                    <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                )}
                              </div>
                              <div>{`Day ${item?.Days}`}</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="City"
                                id=""
                                className="formControl1"
                                value={monumentFromValue[index]?.City}
                                onChange={(e) =>
                                  handleMonumentFormChange(index, e)
                                }
                              >
                                <option value="">Select</option>
                                {destinationList?.map((city, index) => {
                                  return (
                                    <option value={city?.id} key={"j" + index}>
                                      {city?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="Program"
                                id=""
                                className="formControl1"
                                onChange={(e) =>
                                  handleMonumentFormChange(index, e)
                                }
                                value={monumentFromValue[index]?.Program}
                              >
                                <option value="">Select</option>
                                {monumentPackageList[index]?.map(
                                  (pckg, index) => {
                                    return (
                                      <option
                                        value={pckg?.id}
                                        key={index + "k"}
                                      >
                                        {pckg?.PackageName}
                                      </option>
                                    );
                                  }
                                )}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                              {multipleMonument[index]?.map((item, index) => {
                                return item?.MultipleMonument?.map(
                                  (monument) => {
                                    return (
                                      <div
                                        className="p-1 border d-inline-block"
                                        key={index + 1 + "l"}
                                      >
                                        {monument?.name}
                                        <span
                                          className=""
                                          onClick={() => removeMonument(item)}
                                        >
                                          <i className="fa-solid fa-circle-xmark ms-2 cursor-pointer text-primary"></i>
                                        </span>
                                      </div>
                                    );
                                  }
                                );
                              })}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                              <input type="number" className="formControl1" />
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                              <input type="number" className="formControl1" />
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                              <input type="number" className="formControl1" />
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                              <input type="number" className="formControl1" />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </PerfectScrollbar>
            </div>
          </div>
          {/* guide form table */}
          <div className="row mt-3 m-0">
            <div
              className="col-12 px-1 py-2 d-flex justify-content-between"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <path d="M0 0H24V24H0V0Z" fill="url(#pattern0_242_1456)" />
                    <defs>
                      <pattern
                        id="pattern0_242_1456"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlink:href="#image0_242_1456"
                          transform="scale(0.0208333)"
                        />
                      </pattern>
                      <image
                        id="image0_242_1456"
                        width="48"
                        height="48"
                        xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHLUlEQVR4nO2We1BU5xnGT6btH22aTjutBFiW5baRXc4ue2F3gb1fWC4LLCuuriwgLAuKKLBmtRLRdQg0yWgiJPFCMA1N0lGnGiQQ06JN7DidhAnW25hiJ9PGmlSFRMFGRZA+ne+kEGICBHtAnfGd+c18c773ec77fOebnaWoB/WgHtSDuu8KFPUQqlPto1Up3f+ptuL/YbTaemW02vonVKfK5mT4kZVmy60V5g9uVVhAyMvMhNyUDokuBSK1CUKVDtk6DbM3ken6RlaYR0dWWJrhSX5kdgb3Gk0jZabjI2UmTGSJzfbNwbRq3GnfcKnxnyNlRivrAYaK9IM3iwyYC4aK9IOsB7jh1sGdVwqrbztSfC8ipfoFWKqeh3nlVhiXb4G29Cloip9EUsFGqPJqkG21g2gIeYs9MJVvgWHZ09CXNkDrqYOmKAB14UYkutdD5VoHxaI1kC9cjSxLJqNhPcD1RRqk+Zvh/m0fg+uV83C+9BEcL55B9nN/ge2Z95D25BFYNvwBxnXtkDmqQTQEMnzWlg+YnvRfHWX6rJsOw7Lh9zA90QnjLw9A//g+aKv3QmKvZDSsB/jCkYzUx3di8a/PYeHOv8HxwmlkPduDjKf+jNS6d2CpfRuGtQeg9e1FcsWriLeVg2gIhrKnkd5wFKl178IaOMT0mmo6YFjb9r/B90C96nUkrWgd17Ee4N82FSyrmpDTdIo5TXKS5BTN69+CYc0b0FTtRlJ5K5TeZsgLnwdt9YBoCDpPPVI2dsG8/iBM696EYU0bdKt/x2jUK19DUvkrUJW1QFGyE6K0UkbDeoBBqwJLHIXMMOqlG5HsfgIq11ooFvogd1RCklUOcXopRKkloK3FsGmtIBrC4mw3kvNrkZi3DomuNVA6VyMht5rRSbMrIMlcDnF6GehUz7iO9QBXjHLMJRTbdVktxWQMmOQYLjZgeJkJQyVGDHlvo8SIwXwt+p2JOL9AiX+kyXBJI5nUj8B6gM+U8fgaKgmuZqgwvMyIm14jrjnVuJqhxBWTgjnB80oaJ/g8nBZG4dMkMT7Xy9Cnl+KCQYqPjRKcMdDoTo7FhwoB+hXir3sr49kP0C8VgUDMh1wajCw34Ua+DtfsyRhIScBniRL0JYjQJ/uSHi4HA/usGNhnwV/FMePPL8lFuJggxjkVjd4EAbqlfBwU8tAVE45P4oXMOwisB7islmHYa8TNEhNuuDS4mqnCFZ0c/cp49Mu/GnyMU49F4PKuWAy8LMTfVcJv7PfJaFyU0zgnFeIEzcc7MTzs4QTh9aBf4MPHYtgPMLLcjC9ykzCYosTnain6FOJvGeoreuP5OKnk46whDp/qJ++9JBPhgpTGx2IhTsRG43AkF68G/Zz9ALhYCpwxAUd5QAc1LZf883C9MwNDb2XgWv1306CDwvUmCv1l1N0PMLAhFDd2x+PmXiluPRt9/wW49drDGGkMB7ZFAnseufsBruWq0Sef+t6zwQUpjcMRYXMf4FRbG04faJt2wJNv7Mfp9vZ7L8D7L+/C+7tapg0wXd+FuxXgvr9CffdygPT0dEzFSbcI/yqMnREn3KIpPQlzFmC2oNis+QIB5hKK7aIlYsyEDg3N/A8idGjpGWlpiZj9AII4IcYoKMgfX0/GewIuygryGch6un7Bbb6sB+DP52MMjSZ5fD0ZB3/2U1jUSQxkPV0//zZf1gNw53NDOWEh4IaHghcRhqjoiCl57sc/wf4f/JCBrKfqjYziISIyHNxwDrjcUPD54VHUbJRCIYdIFAc+Pwo8Xhg4nBBwOMHghIUywcJ5Yd8JMmgYN/RLLSeEGTo6OhJxcbGQyWTsn/5YuVyL4HA4kJlpg9VqgV6vhVKpYELFxEQxg5ChQkLmITh4HkJCgsYJDg5CaOijCAvjIDqaxwybkCCFVpsMs9kMmy0NOTnZcLmcsxcgNzdna2FhPjyeonGWLi3AkiUkWA7S0lKh0+mgUMhA0wLExEQykHVCggx6vQZWawrs9iw4nQtBvIqLl07wyofTuWDrrAWgKOohg8HwG4+nGFVVld/KqlUV8Hq9cLvdWLDAgdxcB/Lz3fB6PaioqJhU5/V6YDQadpN3zGYAyumkvkfTgv00LQS7CDr0ev33qbmqzs7OZ1pbW4/7/X74/f53Z6onGr/fD+LR2dkZoGa7GhsbH21qarra1NSE7du349ChQ6irq0NNTQ02b94M8nwmEE1NTQ3j0dXVhW3bto3tfdLc3Pwj1gPY7fYcu90Owo4dO9DS0oLa2lr4fD7m2Z3g8/kYD+JFhp+wJ6Fmq3p6ekTd3d2jDQ0NxwOBAAKBgOFOvQKBgIF4EK/u7u7hY8eOxVCzUY2NjX8c+/RHjhxBe3s7Nm3ahPr6+hlfndupr69nvIgnuZYT9nawFmDiJz979izz2clLyU/lnV6fMdxuN+NFPHt7e1FZWck8z87O/oi1APdy/RfTvkPRBDTuSAAAAABJRU5ErkJggg=="
                      />
                    </defs>
                  </svg>
                </div>
                <p className="m-0 text-dark">Guide</p>
              </div>
            </div>
            <div className="col-12 px-0 mt-2">
              <PerfectScrollbar className="dlabnav-scroll d-flex flex-column justify-content-between">
                <table class="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      <th>Days</th>
                      <th>City</th>
                      <th>Program</th>
                      <th>Language</th>
                      <th>Language Allowence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guideFormValue?.map((item, index) => {
                      return (
                        <tr key={index + 1 + "m"}>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <div>
                                {index > 0 ? (
                                  <span
                                    onClick={(e) =>
                                      handleGuideFormChange(index, e)
                                    }
                                  >
                                    <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                ) : (
                                  <span onClick={handleHotelTableIncrement}>
                                    <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                )}
                              </div>
                              <div>{`Day ${item?.Days}`}</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="City"
                                id=""
                                className="formControl1"
                                value={guideFormValue[index]?.City}
                                onChange={(e) =>
                                  handleGuideFormChange(index, e)
                                }
                              >
                                <option value="">Select</option>
                                {destinationList?.map((city, index) => {
                                  return (
                                    <option value={city?.id} key={index + "m"}>
                                      {city?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="Program"
                                id=""
                                className="formControl1"
                                onChange={(e) =>
                                  handleGuideFormChange(index, e)
                                }
                                value={guideFormValue[index]?.Program}
                              >
                                <option value="">Select</option>
                                <option value="Half Day">Half Day</option>
                                <option value="Full Day">Full Day</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="Language"
                                id=""
                                className="formControl1"
                                onChange={(e) =>
                                  handleGuideFormChange(index, e)
                                }
                                value={guideFormValue[index]?.Language}
                              >
                                <option value="">Select</option>
                                {languageList?.map((language, index) => {
                                  return (
                                    <option
                                      value={language?.id}
                                      key={index + "n"}
                                    >
                                      {language?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                              <input
                                name="LanguageAllowence"
                                className="formControl1 width100px"
                                value={guideFormValue[index]?.LanguageAllowence}
                                onChange={(e) =>
                                  handleGuideFormChange(index, e)
                                }
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
          </div>
          {/* transport form table */}
          <div className="row mt-3 m-0">
            <div
              className="col-12 px-1 py-2 d-flex justify-content-between"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <path d="M0 0H24V24H0V0Z" fill="url(#pattern0_242_1456)" />
                    <defs>
                      <pattern
                        id="pattern0_242_1456"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlink:href="#image0_242_1456"
                          transform="scale(0.0208333)"
                        />
                      </pattern>
                      <image
                        id="image0_242_1456"
                        width="48"
                        height="48"
                        xlink:href="data:image/png;base64,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"
                      />
                    </defs>
                  </svg>
                </div>
                <p className="m-0 text-dark">Transport</p>
              </div>
            </div>
            <div className="col-12 px-0 mt-2">
              <PerfectScrollbar className="dlabnav-scroll d-flex flex-column justify-content-between">
                <table class="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      <th>Days</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Program Type</th>
                      <th>Program</th>
                      <th>Program Details</th>
                      <th>Mode</th>
                      <th>Supplier</th>
                      <th>Remarks</th>
                      <th>Vehicle Type</th>
                      <th>Cost Type</th>
                      <th>No Of Days</th>
                      <th>No Of Vehicle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transportFormValue?.map((item, index) => {
                      return (
                        <tr key={index + 1 + "o"}>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <div>
                                {index > 0 ? (
                                  <p
                                    onClick={() =>
                                      handleHotelTableDecrement(index)
                                    }
                                  >
                                    <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                  </p>
                                ) : (
                                  <p onClick={handleHotelTableIncrement}>
                                    <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                  </p>
                                )}
                              </div>
                              <div>{`Day ${item?.Days}`}</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="From"
                                id=""
                                className="formControl1"
                                value={transportFormValue[index]?.From}
                                onChange={(e) =>
                                  handleTransportChange(index, e)
                                }
                              >
                                <option value="">Select</option>
                                {qoutationData?.Days?.map((qout, index) => {
                                  return (
                                    <option
                                      value={qout?.DestinationId}
                                      key={index + "q"}
                                    >
                                      {qout?.DestinationName}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="To"
                                id=""
                                className="formControl1"
                                value={transportFormValue[index]?.To}
                                onChange={(e) =>
                                  handleTransportChange(index, e)
                                }
                              >
                                <option value="">Select</option>
                                {qoutationData?.Days?.map((qout, index) => {
                                  return (
                                    <option
                                      value={qout?.DestinationId}
                                      key={index + 1 + "r"}
                                    >
                                      {qout?.DestinationName}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="ProgramType"
                                id=""
                                className="formControl1"
                                value={transportFormValue[index]?.ProgramType}
                                onChange={(e) =>
                                  handleTransportChange(index, e)
                                }
                              >
                                <option value="">Select</option>
                                {transferTypeList?.map((transfer, index) => {
                                  return (
                                    <option
                                      value={transfer?.id}
                                      key={index + "s"}
                                    >
                                      {transfer?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="Program"
                                id=""
                                className="formControl1"
                                value={transportFormValue[index]?.Program}
                                onChange={(e) =>
                                  handleTransportChange(index, e)
                                }
                              >
                                <option value="">Select</option>
                                {transportList[index]?.map(
                                  (transport, index) => {
                                    return (
                                      <option
                                        value={transport?.id}
                                        key={index + 1 + "t"}
                                      >
                                        {transport?.Name}
                                      </option>
                                    );
                                  }
                                )}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="text"
                                className="width50px formControl1"
                                name="ProgramDetails"
                                value={
                                  transportFormValue[index]?.ProgramDetails
                                }
                                onChange={(e) =>
                                  handleTransportChange(index, e)
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="Mode"
                                id=""
                                className="formControl1"
                                value={transportFormValue[index]?.Mode}
                                onChange={(e) =>
                                  handleTransportChange(index, e)
                                }
                              >
                                <option value="flight">Flight</option>
                                <option value="train">Train</option>
                                <option value="surface">Surface</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="Supplier"
                                id=""
                                className="formControl1"
                                value={transportFormValue[index]?.Supplier}
                                onChange={(e) =>
                                  handleTransportChange(index, e)
                                }
                              >
                                <option value="">Select</option>
                                {transportSupplierList[index]?.map(
                                  (supplier, index) => {
                                    return (
                                      <option
                                        value={supplier?.id}
                                        key={index + 1 + "tu"}
                                      >
                                        {supplier?.Name}
                                      </option>
                                    );
                                  }
                                )}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name="Remarks"
                                className="formControl1 width50px"
                                value={transportFormValue[index].Remarks}
                                onChange={(e) =>
                                  handleTransportChange(index, e)
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name="VehicleType"
                                className="formControl1 width50px"
                                value={transportFormValue[index]?.VehicleType}
                                onChange={(e) =>
                                  handleTransportChange(index, e)
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name="CostType"
                                className="formControl1 width50px"
                                value={transportFormValue[index]?.CostType}
                                onChange={(e) =>
                                  handleTransportChange(index, e)
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name="NoOfDays"
                                className="formControl1 width50px"
                                value={transportFormValue[index]?.NoOfDays}
                                onChange={(e) =>
                                  handleTransportChange(index, e)
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name="NoOfVehicle"
                                className="formControl1 width50px"
                                value={transportFormValue[index]?.NoOfVehicle}
                                onChange={(e) =>
                                  handleTransportChange(index, e)
                                }
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
          </div>
          {/* Activity form table */}
          <div className="row mt-3 m-0">
            <div
              className="col-12 px-1 py-2 d-flex justify-content-between"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <path d="M0 0H24V24H0V0Z" fill="url(#pattern0_242_1456)" />
                    <defs>
                      <pattern
                        id="pattern0_242_1456"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlink:href="#image0_242_1456"
                          transform="scale(0.0208333)"
                        />
                      </pattern>
                      <image
                        id="image0_242_1456"
                        width="48"
                        height="48"
                        xlink:href="data:image/png;base64,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"
                      />
                    </defs>
                  </svg>
                </div>
                <p className="m-0 text-dark">Activity</p>
              </div>
            </div>
            <div className="col-12 px-0 mt-2">
              <PerfectScrollbar className="dlabnav-scroll d-flex flex-column justify-content-between">
                <table class="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      {[
                        "Days",
                        "Destination",
                        "Service Type",
                        "Service",
                        "Supplier",
                        "Pax Range",
                        "No Of Activity",
                        "Cost",
                      ]?.map((head, index) => {
                        return <th key={index + 1 + "v"}>{head}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {activityFormValue?.map((item, index) => {
                      return (
                        <tr key={index + 1 + "x"}>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <div>
                                {index > 0 ? (
                                  <span
                                    onClick={(e) =>
                                      handleActivityFormChange(index, e)
                                    }
                                  >
                                    <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                ) : (
                                  <span onClick={handleHotelTableIncrement}>
                                    <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                )}
                              </div>
                              <div>{`Day ${item?.Days}`}</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="City"
                                id=""
                                className="formControl1"
                                value={activityFormValue[index]?.City}
                                onChange={(e) =>
                                  handleActivityFormChange(index, e)
                                }
                              >
                                <option value="">Select</option>
                                {destinationList?.map((city, index) => {
                                  return (
                                    <option value={city?.id} key={index + "y"}>
                                      {city?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="ServiceType"
                                id=""
                                className="formControl1"
                                onChange={(e) =>
                                  handleActivityFormChange(index, e)
                                }
                                value={activityFormValue[index]?.ServiceType}
                              >
                                <option value="">Select</option>
                                <option value="Activity">Activity</option>
                                <option value="Experience">Experience</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="Service"
                                id=""
                                className="formControl1"
                                onChange={(e) =>
                                  handleActivityFormChange(index, e)
                                }
                                value={activityFormValue[index]?.Service}
                              >
                                <option value="">Select</option>
                                {activityList[index]?.map((activity, index) => {
                                  return (
                                    <option
                                      value={activity?.id}
                                      key={index + "z"}
                                    >
                                      {activity?.ServiceName}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="Supplier"
                                id=""
                                className="formControl1"
                                onChange={(e) =>
                                  handleActivityFormChange(index, e)
                                }
                                value={activityFormValue[index]?.Supplier}
                              >
                                <option value="">Select</option>
                                {activitySupplierList[index]?.map(
                                  (supplier, index) => {
                                    return (
                                      <option
                                        value={supplier?.id}
                                        key={index + "ab"}
                                      >
                                        {supplier?.Name}
                                      </option>
                                    );
                                  }
                                )}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="text"
                                name="PaxRange"
                                className="formControl1"
                                value={activityFormValue[index]?.PaxRange}
                                onChange={(e) =>
                                  handleActivityFormChange(index, e)
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="text"
                                name="NoOfActivity"
                                className="formControl1"
                                value={activityFormValue[index]?.NoOfActivity}
                                onChange={(e) =>
                                  handleActivityFormChange(index, e)
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="text"
                                name="Cost"
                                className="formControl1"
                                value={activityFormValue[index]?.Cost}
                                onChange={(e) =>
                                  handleActivityFormChange(index, e)
                                }
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
          </div>
          {/* Restaurant form table */}
          <div className="row mt-3 m-0">
            <div
              className="col-12 px-1 py-2 d-flex justify-content-between"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <path d="M0 0H24V24H0V0Z" fill="url(#pattern0_242_1456)" />
                    <defs>
                      <pattern
                        id="pattern0_242_1456"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlink:href="#image0_242_1456"
                          transform="scale(0.0208333)"
                        />
                      </pattern>
                      <image
                        id="image0_242_1456"
                        width="48"
                        height="48"
                        xlink:href="data:image/png;base64,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"
                      />
                    </defs>
                  </svg>
                </div>
                <p className="m-0 text-dark">Restaurant</p>
              </div>
            </div>
            <div className="col-12 px-0 mt-2">
              <PerfectScrollbar className="dlabnav-scroll d-flex flex-column justify-content-between">
                <table class="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      {[
                        "Days",
                        "Destination",
                        "Restaurant",
                        "Supplier",
                        "Adult Cost",
                        "Child Cost",
                        "Start Time",
                        "End Time",
                      ]?.map((head, index) => {
                        return <th key={index + 1 + "ac"}>{head}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {restaurantFormValue?.map((item, index) => {
                      return (
                        <tr key={index + 1 + "ae"}>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <div>
                                {index > 0 ? (
                                  <span
                                    onClick={(e) =>
                                      handleHotelTableDecrement(index.e)
                                    }
                                  >
                                    <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                ) : (
                                  <span onClick={handleHotelTableIncrement}>
                                    <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                )}
                              </div>
                              <div>{`Day ${item?.Days}`}</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="Destination"
                                id=""
                                className="formControl1"
                                value={restaurantFormValue[index]?.Destination}
                                onChange={(e) =>
                                  handleRestaurantFormChange(index, e)
                                }
                              >
                                <option value="">Select</option>
                                {destinationList?.map((city, index) => {
                                  return (
                                    <option value={city?.id} key={index + "ab"}>
                                      {city?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="Restaurant"
                                id=""
                                className="formControl1"
                                onChange={(e) =>
                                  handleRestaurantFormChange(index, e)
                                }
                                value={restaurantFormValue[index]?.Restaurant}
                              >
                                <option value="">Select</option>
                                {restaurantList[index]?.map((rest, index) => {
                                  return (
                                    <option
                                      value={rest?.id}
                                      key={index + 1 + "jk"}
                                    >
                                      {rest?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="Supplier"
                                id=""
                                className="formControl1"
                                onChange={(e) =>
                                  handleRestaurantFormChange(index, e)
                                }
                                value={restaurantFormValue[index]?.Supplier}
                              >
                                <option value="">Select</option>
                                {restaurantSupplierList[index]?.map(
                                  (supplier, index) => {
                                    return (
                                      <option
                                        value={supplier?.id}
                                        key={index + 1 + "lm"}
                                      >
                                        {supplier?.Name}
                                      </option>
                                    );
                                  }
                                )}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="text"
                                className="formControl1"
                                name="AdultCost"
                                onChange={(e) =>
                                  handleRestaurantFormChange(index, e)
                                }
                                value={restaurantFormValue[index]?.AdultCost}
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="text"
                                className="formControl1"
                                name="ChildCost"
                                onChange={(e) =>
                                  handleRestaurantFormChange(index, e)
                                }
                                value={restaurantFormValue[index]?.ChildCost}
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="time"
                                id=""
                                className="formControl1 width50px"
                                name="StartTime"
                                onChange={(e) =>
                                  handleRestaurantFormChange(index, e)
                                }
                                value={restaurantFormValue[index]?.StartTime}
                              />
                              {/* <TimePicker  value="10:10" /> */}
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="time"
                                id=""
                                name="EndTime"
                                onChange={(e) =>
                                  handleRestaurantFormChange(index, e)
                                }
                                value={restaurantFormValue[index]?.EndTime}
                                className="formControl1 width50px"
                              />
                              {/* <TimePicker  value="10:10" /> */}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </PerfectScrollbar>
            </div>
          </div>
          {/* train form table */}
          <div className="row mt-3 m-0">
            <div
              className="col-12 px-1 py-2 d-flex justify-content-between"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <path d="M0 0H24V24H0V0Z" fill="url(#pattern0_242_1456)" />
                    <defs>
                      <pattern
                        id="pattern0_242_1456"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlink:href="#image0_242_1456"
                          transform="scale(0.0208333)"
                        />
                      </pattern>
                      <image
                        id="image0_242_1456"
                        width="48"
                        height="48"
                        xlink:href="data:image/png;base64,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"
                      />
                    </defs>
                  </svg>
                </div>
                <p className="m-0 text-dark">TRAIN</p>
              </div>
            </div>
            <div className="col-12 px-0 mt-2">
              <PerfectScrollbar className="dlabnav-scroll d-flex flex-column justify-content-between">
                <table class="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      {[
                        "Days",
                        "From",
                        "To",
                        "Number",
                        "Type",
                        "Class",
                        " Departure Time",
                        "Arrival Time",
                        "Adults",
                        "Childs",
                        "Fare",
                        "Handling Charge",
                        "Remarks",
                      ]?.map((head, index) => {
                        return (
                          <th
                            key={index + 1 + "mn"}
                            colSpan={head == "Fare" && 2}
                          >
                            {head}
                          </th>
                        );
                      })}
                    </tr>
                    {/* <tr>
                      <th>Days</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Number</th>
                      <th>Type</th>
                      <th>Class</th>
                      <th>
                        Departure <br></br>Time
                      </th>
                      <th>Arrival Time</th>
                      <th>Adults</th>
                      <th>Child</th>
                      <th colSpan={2}>Fare</th>
                      <th>
                        Handling <br></br>Charge
                      </th>
                      <th>Remarks</th>
                    </tr> */}
                  </thead>
                  <tbody>
                    {trainFormValue?.map((item, index) => {
                      return (
                        <tr key={index + 1 + "ky"}>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <div>
                                {index > 0 ? (
                                  <span
                                    onClick={() =>
                                      handleHotelTableDecrement(index)
                                    }
                                  >
                                    <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                ) : (
                                  <span onClick={handleHotelTableIncrement}>
                                    <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                )}
                              </div>
                              <div>{`Day ${item?.Days}`}</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="From"
                                id=""
                                className="formControl1"
                                value={trainFormValue[index]?.From}
                                onChange={(e) =>
                                  handleTrainFormChange(index, e)
                                }
                              >
                                <option value="">Select</option>
                                {qoutationData?.Days?.map((qout, index) => {
                                  return (
                                    <option
                                      value={qout?.DestinationId}
                                      key={index + 1 + "dl"}
                                    >
                                      {qout?.DestinationName}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="To"
                                id=""
                                className="formControl1"
                                value={trainFormValue[index]?.To}
                                onChange={(e) =>
                                  handleTrainFormChange(index, e)
                                }
                              >
                                <option value="">Select</option>
                                {qoutationData?.Days?.map((qout, index) => {
                                  return (
                                    <option
                                      value={qout?.DestinationId}
                                      key={index + ","}
                                    >
                                      {qout?.DestinationName}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="number"
                                id=""
                                className="formControl1 width50px"
                                name="Number"
                                value={trainFormValue[index]?.Number}
                                onChange={(e) =>
                                  handleTrainFormChange(index, e)
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="Type"
                                value={trainFormValue[index]?.Type}
                                onChange={(e) =>
                                  handleTrainFormChange(index, e)
                                }
                                id=""
                                className="formControl1"
                              >
                                <option value="">Day Journey</option>
                                <option value="">Overnight Journey</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="Class"
                                value={trainFormValue[index]?.Class}
                                onChange={(e) =>
                                  handleTrainFormChange(index, e)
                                }
                                className="formControl1"
                              >
                                <option value="">Select</option>
                                {trainClassList?.map((item, index) => {
                                  return (
                                    <option value="" key={index + "-a"}>
                                      {item?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="time"
                                id=""
                                name="DepartureTime"
                                value={trainFormValue[index]?.DepartureTime}
                                onChange={(e) =>
                                  handleTrainFormChange(index, e)
                                }
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="time"
                                id=""
                                name="ArrivalTime"
                                value={trainFormValue[index]?.ArrivalTime}
                                onChange={(e) =>
                                  handleTrainFormChange(index, e)
                                }
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                className="formControl1 width50px"
                                name="Adults"
                                value={trainFormValue[index]?.Adults}
                                onChange={(e) =>
                                  handleTrainFormChange(index, e)
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name="Child"
                                value={trainFormValue[index]?.Child}
                                onChange={(e) =>
                                  handleTrainFormChange(index, e)
                                }
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                className="formControl1 width50px"
                                name="Fare.First"
                                value={trainFormValue[index]?.Fare?.First}
                                onChange={(e) =>
                                  handleTrainFormChange(index, e)
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                className="formControl1 width50px"
                                name="Fare.Second"
                                value={trainFormValue[index]?.Fare?.Second}
                                onChange={(e) =>
                                  handleTrainFormChange(index, e)
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                className="formControl1 width50px"
                                name="HandlingCharge"
                                value={trainFormValue[index]?.HandlingCharge}
                                onChange={(e) =>
                                  handleTrainFormChange(index, e)
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                className="formControl1 width50px"
                                name="Remarks"
                                value={trainFormValue[index]?.Remarks}
                                onChange={(e) =>
                                  handleTrainFormChange(index, e)
                                }
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
          </div>
          {/* flight form table */}
          <div className="row mt-3 m-0">
            <div
              className="col-12 px-1 py-2 d-flex justify-content-between"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <path d="M0 0H24V24H0V0Z" fill="url(#pattern0_242_1461)" />
                    <defs>
                      <pattern
                        id="pattern0_242_1461"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlink:href="#image0_242_1461"
                          transform="scale(0.0166667)"
                        />
                      </pattern>
                      <image
                        id="image0_242_1461"
                        width="60"
                        height="60"
                        xlink:href="data:image/png;base64,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"
                      />
                    </defs>
                  </svg>
                </div>
                <p className="m-0 text-dark">FLIGHT</p>
              </div>
            </div>
            <div className="col-12 px-0 mt-2">
              <PerfectScrollbar className="dlabnav-scroll d-flex flex-column justify-content-between">
                <table class="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      <th>Days</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Number</th>
                      <th>Type</th>
                      <th>Class</th>
                      <th>
                        Departure <br></br>Time
                      </th>
                      <th>Arrival Time</th>
                      <th>Adults</th>
                      <th>Child</th>
                      <th colSpan={2}>Fare</th>
                      <th>
                        Handling <br></br>Charge
                      </th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flightFormValue?.map((item, index) => {
                      return (
                        <tr key={index + 1}>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <div>
                                {index > 0 ? (
                                  <span
                                    onClick={() =>
                                      handleHotelTableDecrement(index)
                                    }
                                  >
                                    <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                ) : (
                                  <span onClick={handleHotelTableIncrement}>
                                    <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                )}
                              </div>
                              <div>{`Day ${item?.Days}`}</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                id=""
                                className="formControl1"
                                name="From"
                                value={flightFormValue[index].From}
                                onChange={(e) => handleFlightChange(index, e)}
                              >
                                <option value="">Select</option>
                                {qoutationData?.Days?.map((qout, index) => {
                                  return (
                                    <option
                                      value={qout?.DestinationId}
                                      key={index + 1}
                                    >
                                      {qout?.DestinationName}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="To"
                                value={flightFormValue[index].To}
                                onChange={(e) => handleFlightChange(index, e)}
                                id=""
                                className="formControl1"
                              >
                                <option value="">Select</option>
                                {qoutationData?.Days?.map((qout, index) => {
                                  return (
                                    <option
                                      value={qout?.DestinationId}
                                      key={index + 1}
                                    >
                                      {qout?.DestinationName}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="number"
                                id=""
                                name="Number"
                                value={flightFormValue[index]?.Number}
                                onChange={(e) => handleFlightChange(index, e)}
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                id=""
                                className="formControl1"
                                name="Type"
                                value={flightFormValue[index]?.Type}
                                onChange={(e) => handleFlightChange(index, e)}
                              >
                                <option value="">Day Journey</option>
                                <option value="">Overnight Journey</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="Class"
                                value={flightFormValue[index]?.Class}
                                onChange={(e) => handleFlightChange(index, e)}
                                id=""
                                className="formControl1"
                              >
                                <option value="">Select</option>
                                {flightClassList?.map((item, index) => {
                                  return (
                                    <option value="" key={index + 1}>
                                      {item?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="time"
                                id=""
                                name="DepartureTime"
                                value={flightFormValue[index]?.DepartureTime}
                                onChange={(e) => handleFlightChange(index, e)}
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="time"
                                id=""
                                name="ArrivalTime"
                                value={flightFormValue[index]?.ArrivalTime}
                                onChange={(e) => handleFlightChange(index, e)}
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name="Adults"
                                value={flightFormValue[index]?.Adults}
                                onChange={(e) => handleFlightChange(index, e)}
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name="Child"
                                value={flightFormValue[index]?.Child}
                                onChange={(e) => handleFlightChange(index, e)}
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name="Fare.First"
                                value={flightFormValue[index]?.Fare?.First}
                                onChange={(e) => handleFlightChange(index, e)}
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name="Fare.Second"
                                value={flightFormValue[index]?.Fare?.Second}
                                onChange={(e) => handleFlightChange(index, e)}
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name="HandlingCharge"
                                value={flightFormValue[index]?.HandlingCharge}
                                onChange={(e) => handleFlightChange(index, e)}
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name="Remarks"
                                value={flightFormValue[index]?.Remarks}
                                onChange={(e) => handleFlightChange(index, e)}
                                className="formControl1 width50px"
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
          </div>
          {/* additional form table */}
          <div className="row mt-3 m-0">
            <div
              className="col-12 px-1 py-2 d-flex justify-content-between"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <path d="M0 0H24V24H0V0Z" fill="url(#pattern0_242_1461)" />
                    <defs>
                      <pattern
                        id="pattern0_242_1461"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlink:href="#image0_242_1461"
                          transform="scale(0.0166667)"
                        />
                      </pattern>
                      <image
                        id="image0_242_1461"
                        width="60"
                        height="60"
                        xlink:href="data:image/png;base64,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"
                      />
                    </defs>
                  </svg>
                </div>
                <p className="m-0 text-dark">ADDITIONAL SERVICE</p>
              </div>
            </div>
            <div className="col-12 px-0 mt-2">
              <PerfectScrollbar className="dlabnav-scroll d-flex flex-column justify-content-between">
                <table class="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      <th>Days</th>
                      <th>From</th>
                      <th>Particulars</th>
                      <th>Up to</th>
                      <th>Amount</th>
                      <th>Supplier</th>
                      <th>Package</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qoutationData?.Days?.map((item, index) => {
                      return (
                        <tr key={index + 1}>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <div>
                                <span>
                                  <i className="la la-plus p-1 border cursor-pointer text-success rounded-pill"></i>
                                </span>
                              </div>
                              <div>
                                <select name="" id="" className="formControl1">
                                  <option value="">1 Star</option>
                                </select>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select name="" id="" className="formControl1">
                                <option value="">Agra</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select name="" id="" className="formControl1">
                                <option value="">Taj Hotel</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select name="" id="" className="formControl1">
                                <option value="">Enroute</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="text"
                                id=""
                                name=""
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <select name="" id="" className="formControl1">
                                <option value="">Delux</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select name="" id="" className="formControl1">
                                <option value="">Delux</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <textarea
                                id=""
                                name=""
                                className="formControl1 width50px"
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
          </div>
          {/* local escort form table */}
          <div className="row mt-3 m-0">
            <div
              className="col-12 px-1 py-2 d-flex justify-content-between"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <path d="M0 0H24V24H0V0Z" fill="url(#pattern0_242_1461)" />
                    <defs>
                      <pattern
                        id="pattern0_242_1461"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlink:href="#image0_242_1461"
                          transform="scale(0.0166667)"
                        />
                      </pattern>
                      <image
                        id="image0_242_1461"
                        width="60"
                        height="60"
                        xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGUElEQVR4nO2ZaUxUVxiGX0YRhFqXukVFXFCrZlyjVkQEKwrIMjOWuLRat5Kq5QfCBXfcqwVFk4oL1iXuwMxoatuY1tZom7TWLnGJxRqtrVWjte6iwPA2Z7jQUQdmBu4MQuZJvj+Ee+957nfmO+d8F3Djxo0bN27cuHFjP103s3nAOib6pzPbbzUP+62mwT+DmwMyObV3JpugTpBGVYc1XN50CW+rUklI1qNeKtkxnedRm+m8lgm+C/ikIsmy8Eghu60nNXqWgPRAbUOdxaZtPuRJIWJL1ncBGbyT1BlJrcF0G7UNjYED+2/hVVuiSCE7ryVj9aWyOiMZuf36BdQW4nLYQGvkcp2BRWLw/h9VLOuzgBy6439RnRwh6Sc/q/5IEugFidMhMQpz2QpOYMwh9tIZ+avl4GPyyBbLX5TtkEFG574oqzOS6snpC6o3khQGQuK55x56Dcn8FBIXI4nRSGLLqt5+2DesrzUyVWfgE2sCGj3ZbxPZbnXp9A3dZV1UZySjdt+5Vr++97CqjSSVjSFxPZJpsvlbsvYS5vA1W4/Q5fF1rYHfVyTgaPT/YFsWgC6Oy4oBS/zTTlH7XkIyRyCJvub7kx46I+O1Bj5USnbUxounAIwF0NBxYTG4F6exElH8yiJeGLGbN5QSFTF6582Ljdur3wMwCFXEA027qRF3ZA9mFxYoIptCdswoLURKyoZnXznt0yZgqqh7AHyqKjwAwHhztAueiSlnj0NiSVVlveeRgz9RVlRrMBUHLT2ap/L0fhvAOAB+qCYdAWjLxfsmzMfMGxcdlW27ioyqYAmpakTtvvN3x4iZ8+SxCdlOUAhPAP3kYjAeKs8JiNiehcSCe7ZEveaRb1Qjq9oK/j5i/dnjPi38JsuysQCcsi9oBCCkPNvNe07HxJNfINlkdclqvZKMPKBsVjUHCu6rp2ZmlI8BCALgBSfTFkB0+UN7xc/BjGvny0Q955B9NymXzfLCtOXKmRbqkFnyc98CEAAXUg9AD7H1LRcPWZPeeunjexEKZ1WrLy4MXPj5XpX4KZU+a6Q822oEHwCDfVp1mvJm5i9HdQaWKFqYdt76o33IuykWhak3ABVqEl0eh2jyii4pKVpamM6c8PRpMlGWjQHQQpkRJ7OP+RSUSjXiKKaqXcTlsKHOwFVaI01Ky8bsf3QXKlXZFB4krxTVJI31ITEVyXxqUV0fQuK38oFhElLY09qlYw5ykNbA35QWLYvgZccOyoXJH4qQSjUknnJ0899AoiYqz5zVYmfJigiITpxWnS3is0gMhcRCR3dLr6aRwys5hypWqHb9e9m8j1eMBHPnonzdtBWigdZ1HakxOF+2tFidXQ+F8UJY1ix7DgKNFlXeXVA8DCwJXvqlWmnhZuY1beq5ExVmVSK7ZJKxLspqWYzeeescnER/tOwXj8SC+8/L+i4UncASl4qWT+d1p5c5S9hTtH4xem/2s4dzkykmz+TUClzZ2Xbg/EPiOOo0/ADVBMy4es57rqkoeOvD20pLRO978I+9/xu57fqPcAHB3n0mJcfkFDxQUlSTW/hkoJS7PWjJV3p7rxme8ZPYMzsdH7FLFDsbpWQjt13PbxMYN1tsC0X7xa4XpC8qHJykr3Jf21G6ezZqNkk0sKuVVX1R6TGutL9k7kSEZpzaYc+1Edl/HYML8QAQ3mPc4hVVPd5Fbr/+u1/QWHNW5RgCoEHYhvwse64ftvqH9+Fimom1eeiK44ccyqqh2LJrOF5u+ImOiBl7hGNznz4OlA7WyIG+vxj48IxTR+yRHb3j5qX2oROl57NqeUN7hMM3Xz6MGsITQJQYfO9p69ZE775z1doAY/Y/ujMoVb9D5e37jiyqscyqo8LDVn4n7lFjNJG79+as+Y+MnzMgcc9mUYzEMtNVk5JmMX1FBD6fVUeEY3MK7vZIy6nwelfRSBQxCylrIbLaztaNbAmP2nhxP14SPAC0BzBUlhNNeB2AUPlTpF2tIFvCwUuPRaIuEVaJcMy+hzeRllazHUhXCo/8OH8r6hphlQgHLflaLGN1W1iT+/TR8DU/Hw2ISUpEXSRsQ36W1mAqidx2LX9g0r5sr2Ztyr74Kd7GeSnoFb9hbKu+4QlWlrXGqKOoLSTHysuaS7/6uZru8louWjc1vqNy4wa1n/8ABKzA8tIU9SYAAAAASUVORK5CYII="
                      />
                    </defs>
                  </svg>
                </div>
                <p className="m-0 text-dark">LOCAL ESCORT CHARGE</p>
              </div>
            </div>
            <div className="col-12 px-0 mt-2">
              <PerfectScrollbar className="dlabnav-scroll d-flex flex-column justify-content-between">
                <table class="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      <th>Day From</th>
                      <th>Day To</th>
                      <th>Total Days</th>
                      <th>Particulars</th>
                      <th>Amount/Day</th>
                      <th>Total Amount</th>
                      <th>Remarks</th>
                      <th>Escort Language</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qoutationData?.Days?.map((item, index) => {
                      return (
                        <tr key={index + 1}>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <div>
                                <span>
                                  <i className="la la-plus p-1 border cursor-pointer text-success rounded-pill"></i>
                                </span>
                              </div>
                              <div>
                                <select name="" id="" className="formControl1">
                                  <option value="">1 Star</option>
                                </select>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select name="" id="" className="formControl1">
                                <option value="">Agra</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select name="" id="" className="formControl1">
                                <option value="">Taj Hotel</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select name="" id="" className="formControl1">
                                <option value="">Enroute</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="text"
                                id=""
                                name=""
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <select name="" id="" className="formControl1">
                                <option value="">Delux</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select name="" id="" className="formControl1">
                                <option value="">Delux</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <textarea
                                id=""
                                name=""
                                className="formControl1 width50px"
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
          </div>
          {/* cost summary form table */}
          <div className="row mt-3 m-0">
            <div
              className="col-12 px-1 py-2 d-flex justify-content-between"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <path d="M0 0H24V24H0V0Z" fill="url(#pattern0_242_1461)" />
                    <defs>
                      <pattern
                        id="pattern0_242_1461"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlink:href="#image0_242_1461"
                          transform="scale(0.0166667)"
                        />
                      </pattern>
                      <image
                        id="image0_242_1461"
                        width="60"
                        height="60"
                        xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGUElEQVR4nO2ZaUxUVxiGX0YRhFqXukVFXFCrZlyjVkQEKwrIMjOWuLRat5Kq5QfCBXfcqwVFk4oL1iXuwMxoatuY1tZom7TWLnGJxRqtrVWjte6iwPA2Z7jQUQdmBu4MQuZJvj+Ee+957nfmO+d8F3Djxo0bN27cuHFjP103s3nAOib6pzPbbzUP+62mwT+DmwMyObV3JpugTpBGVYc1XN50CW+rUklI1qNeKtkxnedRm+m8lgm+C/ikIsmy8Eghu60nNXqWgPRAbUOdxaZtPuRJIWJL1ncBGbyT1BlJrcF0G7UNjYED+2/hVVuiSCE7ryVj9aWyOiMZuf36BdQW4nLYQGvkcp2BRWLw/h9VLOuzgBy6439RnRwh6Sc/q/5IEugFidMhMQpz2QpOYMwh9tIZ+avl4GPyyBbLX5TtkEFG574oqzOS6snpC6o3khQGQuK55x56Dcn8FBIXI4nRSGLLqt5+2DesrzUyVWfgE2sCGj3ZbxPZbnXp9A3dZV1UZySjdt+5Vr++97CqjSSVjSFxPZJpsvlbsvYS5vA1W4/Q5fF1rYHfVyTgaPT/YFsWgC6Oy4oBS/zTTlH7XkIyRyCJvub7kx46I+O1Bj5USnbUxounAIwF0NBxYTG4F6exElH8yiJeGLGbN5QSFTF6582Ljdur3wMwCFXEA027qRF3ZA9mFxYoIptCdswoLURKyoZnXznt0yZgqqh7AHyqKjwAwHhztAueiSlnj0NiSVVlveeRgz9RVlRrMBUHLT2ap/L0fhvAOAB+qCYdAWjLxfsmzMfMGxcdlW27ioyqYAmpakTtvvN3x4iZ8+SxCdlOUAhPAP3kYjAeKs8JiNiehcSCe7ZEveaRb1Qjq9oK/j5i/dnjPi38JsuysQCcsi9oBCCkPNvNe07HxJNfINlkdclqvZKMPKBsVjUHCu6rp2ZmlI8BCALgBSfTFkB0+UN7xc/BjGvny0Q955B9NymXzfLCtOXKmRbqkFnyc98CEAAXUg9AD7H1LRcPWZPeeunjexEKZ1WrLy4MXPj5XpX4KZU+a6Q822oEHwCDfVp1mvJm5i9HdQaWKFqYdt76o33IuykWhak3ABVqEl0eh2jyii4pKVpamM6c8PRpMlGWjQHQQpkRJ7OP+RSUSjXiKKaqXcTlsKHOwFVaI01Ky8bsf3QXKlXZFB4krxTVJI31ITEVyXxqUV0fQuK38oFhElLY09qlYw5ykNbA35QWLYvgZccOyoXJH4qQSjUknnJ0899AoiYqz5zVYmfJigiITpxWnS3is0gMhcRCR3dLr6aRwys5hypWqHb9e9m8j1eMBHPnonzdtBWigdZ1HakxOF+2tFidXQ+F8UJY1ix7DgKNFlXeXVA8DCwJXvqlWmnhZuY1beq5ExVmVSK7ZJKxLspqWYzeeescnER/tOwXj8SC+8/L+i4UncASl4qWT+d1p5c5S9hTtH4xem/2s4dzkykmz+TUClzZ2Xbg/EPiOOo0/ADVBMy4es57rqkoeOvD20pLRO978I+9/xu57fqPcAHB3n0mJcfkFDxQUlSTW/hkoJS7PWjJV3p7rxme8ZPYMzsdH7FLFDsbpWQjt13PbxMYN1tsC0X7xa4XpC8qHJykr3Jf21G6ezZqNkk0sKuVVX1R6TGutL9k7kSEZpzaYc+1Edl/HYML8QAQ3mPc4hVVPd5Fbr/+u1/QWHNW5RgCoEHYhvwse64ftvqH9+Fimom1eeiK44ccyqqh2LJrOF5u+ImOiBl7hGNznz4OlA7WyIG+vxj48IxTR+yRHb3j5qX2oROl57NqeUN7hMM3Xz6MGsITQJQYfO9p69ZE775z1doAY/Y/ujMoVb9D5e37jiyqscyqo8LDVn4n7lFjNJG79+as+Y+MnzMgcc9mUYzEMtNVk5JmMX1FBD6fVUeEY3MK7vZIy6nwelfRSBQxCylrIbLaztaNbAmP2nhxP14SPAC0BzBUlhNNeB2AUPlTpF2tIFvCwUuPRaIuEVaJcMy+hzeRllazHUhXCo/8OH8r6hphlQgHLflaLGN1W1iT+/TR8DU/Hw2ISUpEXSRsQ36W1mAqidx2LX9g0r5sr2Ztyr74Kd7GeSnoFb9hbKu+4QlWlrXGqKOoLSTHysuaS7/6uZru8louWjc1vqNy4wa1n/8ABKzA8tIU9SYAAAAASUVORK5CYII="
                      />
                    </defs>
                  </svg>
                </div>
                <p className="m-0 text-dark">COST SUMMARY</p>
              </div>
            </div>
            <div className="col-12 px-0 mt-2">
              <PerfectScrollbar className="dlabnav-scroll d-flex flex-column justify-content-between">
                <table class="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      <th>Days</th>
                      <th>City</th>
                      <th>Hotel Name</th>
                      <th>Overnight</th>
                      <th>Room Category</th>
                      <th colSpan={2}>FIT</th>
                      <th colSpan={2}>GIT</th>
                      <th>Meal Plan</th>
                      <th>Extra Bed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qoutationData?.Days?.map((item, index) => {
                      return (
                        <tr key={index + 1}>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <div>
                                <span>
                                  <i className="la la-plus border cursor-pointer text-success rounded-pill"></i>
                                </span>
                              </div>
                              <div>
                                <select name="" id="" className="formControl1">
                                  <option value="">1 Star</option>
                                </select>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select name="" id="" className="formControl1">
                                <option value="">Agra</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select name="" id="" className="formControl1">
                                <option value="">Taj Hotel</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select name="" id="" className="formControl1">
                                <option value="">Enroute</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select name="" id="" className="formControl1">
                                <option value="">Delux</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name=""
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name=""
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name=""
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name=""
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <select name="" id="" className="formControl1">
                                <option value="">Delux</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                id=""
                                name=""
                                className="formControl1 width50px"
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
          </div>
        </Tab.Pane>
        {
          <>
            <Tab.Pane eventKey="local">
              <h1>Local Tab</h1>
            </Tab.Pane>
            <Tab.Pane eventKey="foreigner">
              <h1>Foreigner Tab</h1>
            </Tab.Pane>
          </>
        }
      </Tab.Content>
    </Tab.Container>
  );
};

export default Itineraries;