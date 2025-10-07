import React, { useState, useEffect } from "react";
import { hotelRateAddInitialValue } from "../../../masters/masters_initial_value.js";
import { hotelRateAddValidationSchema } from "../../../masters/master_validation.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosOther } from "../../../../../http/axios_base_url.js";
import "../../../../../scss/main.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RateList from "./hotelList/index.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifyError, notifySuccess } from "../../../../../helper/notify.jsx";
import { currentDate } from "../../../../../helper/currentDate.js";
import { scrollToBottom } from "../../../../../helper/scrollToTop.js";
import { fetchProductList } from "../../../../../hooks/custom_hooks/fetchApi.js";
import styles from "./index.module.css";

const weekday = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialMealTypes = [
  { MealTypeId: "1", MealName: "Breakfast", MealCost: "" },
  { MealTypeId: "2", MealName: "Lunch", MealCost: "" },
  { MealTypeId: "3", MealName: "Dinner", MealCost: "" },
];

const RateHotel = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState(hotelRateAddInitialValue);
  const [isupdateData, setIsUpdateData] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [supplierList, setSupplierList] = useState([]);
  const [markettypemasterlist, setMarkettypemasterlist] = useState([]);
  const [paxTypeList, setPaxTypeList] = useState([]);
  const [bedTypeList, setBedTypeList] = useState([]);
  const [seasonList, setSeasonList] = useState([]);
  const [tarifTypeList, setTarifTypeList] = useState([]);
  const [roomTypeList, setRoomTypeList] = useState([]);
  const [mealPlanList, setMealPlanList] = useState([]);
  const [currencymasterlist, setCurrencymasterlist] = useState([]);
  const [taxSlab, setTaxSlab] = useState([]);
  const [rateInitialList, setRateInitialList] = useState([]);
  const [dataForUpdate, setDataForUpdate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [remarksEditorValue, setRemarksEditorValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bedTypeArr, setBedTypeArr] = useState([]);
  const [weekendList, setWeekendList] = useState([]);
  const [weekdayValue, setWeekendDaysValue] = useState([...weekday]);
  const [mealTypeArr, setMealTypeArr] = useState(initialMealTypes);
  const [loadingBtn, setLoadingBtn] = useState("");
  // const [hotelChainList, setHotelChainList] = useState([]);
  console.log(state, "state");
  // console.log(formValue, "statef");
  // "All" checkbox के लिए checked status
  const isAllDaysSelected = weekdayValue.length === weekday.length;

  const getDataToServer = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosOther.post("listHotelRatesJson", {
        id: id,
      });
      setIsLoading(false);
      setRateInitialList(data?.data);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("weekendlist");
      setWeekendList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataToServer();
  }, []);

  // WeekendDays select के change पर weekdayValue को update करने के लिए
  useEffect(() => {
    const selectedWeekend = weekendList.find(
      (week) => week?.id.toString() === formValue?.WeekendDays?.toString()
    );

    if (selectedWeekend) {
      setWeekendDaysValue(selectedWeekend?.WeekendDays || []);
    }
  }, [formValue?.WeekendDays, weekendList]);

  // Form submit के time पर weekdayValue को formValue में set करें
  useEffect(() => {
    setFormValue(prev => ({
      ...prev,
      DayList: weekdayValue
    }));
  }, [weekdayValue]);

  // useEffect(() => {
  //   const tarifId = formValue?.TarrifeTypeId;
  //   const weekId = weekendList?.find((week) => week?.id === 9);
  //   const weekId2 = weekendList?.find((week) => week?.id === 11);

  //   if (Number(tarifId) === 4) {
  //     setFormValue({
  //       ...formValue,
  //       WeekendDays: weekId?.id,
  //       DayList: weekId?.WeekendDays,
  //     });
  //     setWeekendDaysValue(weekId?.WeekendDays);
  //   }
  //   if (Number(tarifId) === 3) {
  //     setFormValue({
  //       ...formValue,
  //       WeekendDays: 11,
  //       DayList: weekId2?.WeekendDays,
  //     });
  //     setWeekendDaysValue(weekId2?.WeekendDays);
  //   }

  //   return () => {
  //     // cleanup function
  //     setFormValue({ ...formValue, WeekendDays: null, DayList: null });
  //     setWeekendDaysValue(null);
  //   };
  // }, [formValue?.TarrifeTypeId, weekendList]);

  // useEffect(() => {
  //   if (seasonList.length > 0) {
  //     if (formValue.SeasonTypeID == 18) {
  //       setFormValue((prev) => {
  //         return {
  //           ...prev,
  //           SeasonTypeID: seasonList[1]?.id,
  //           SeasonYear: seasonList[1]?.Year,
  //           ValidFrom: seasonList[1]?.FromDate,
  //           ValidTo: seasonList[1]?.ToDate,
  //         };
  //       });
  //     } else {
  //       setFormValue((prev) => {
  //         return {
  //           ...prev,
  //           SeasonTypeID: seasonList[0]?.id,
  //           SeasonYear: seasonList[0]?.Year,
  //           ValidFrom: seasonList[0]?.FromDate,
  //           ValidTo: seasonList[0]?.ToDate,
  //         };
  //       });
  //     }
  //   }
  // }, []);

  const getDataForDropdown = async () => {
    const productRes = await fetchProductList("Hotel");

    try {
      const res = await axiosOther.post("markettypemasterlist", {
        id: "",
        Name: "",
        Status: "",
      });
      setMarkettypemasterlist(res.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("paxlist", {
        PaxType: "",
      });
      setPaxTypeList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("seasonlist", {
        Search: "",
        Status: "",
      });
      if (data?.DataList?.length > 0) {
        setSeasonList(data?.DataList);
        setFormValue((prev) => {
          return {
            ...prev,
            SeasonTypeID: data?.DataList[0]?.id,
            SeasonYear: data?.DataList[0]?.Year,
            ValidFrom: data?.DataList[0]?.FromDate,
            ValidTo: data?.DataList[0]?.ToDate,
            // SeasonTypeID: data?.DataList[0]?.id,
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("tarifftypelist", {
        id: "",
        Search: "",
        Status: "",
      });
      setTarifTypeList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("roomtypelist", {
        Search: "",
        Status: "",
      });
      setRoomTypeList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("hotelmealplanlist", {
        Search: "",
        Status: "",
      });
      setMealPlanList(data?.DataList);
      console.log(data?.DataList, "data?.DataList");
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("roomsharingmasterlist", {
        Search: "",
        Status: "",
      });
      setBedTypeList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("taxmasterlist", {
        Search: "",
        Status: "",
        ServiceType: "19",
        Id: "",
      });
      if (data?.DataList?.length > 0) {
        setFormValue((prev) => {
          return {
            ...prev,
            // RoomTaxSlabId: data?.DataList[0]?.id,
            MealSlabId: data?.DataList[0]?.id,
          };
        });
        setTaxSlab(data.DataList);
      }
    } catch (error) {
      console.log(error);
    }
    try {
      const res = await axiosOther.post("currencymasterlist", {
        id: "",
        Name: "",
        Status: "",
      });
      setCurrencymasterlist(res.data.DataList);
    } catch (error) {
      console.log(error);
    }

    try {
      console.log(state?.Name, productRes?.id, state?.destinationId, "state?.destinationId");

      const { data } = await axiosOther.post("supplierlistforselect", {
        Name: state?.Name,
        id: "",
        SupplierService: [12],
        DestinationId: [state?.destinationId],
      });

      if (data?.DataList?.length > 0) {
        setSupplierList(data.DataList);

        const matchingSupplier = data?.DataList?.find(
          (supplier) =>
            supplier.Name.trim().toLowerCase() ===
            state?.Name?.trim().toLowerCase()
        );

        setFormValue((prev) => ({
          ...prev,
          SupplierId: matchingSupplier
            ? matchingSupplier.id
            : data?.DataList[0]?.id,
        }));
      }
    } catch (err) {
      console.log(err);
    }
    // try {
    //   const { data } = await axiosOther.post("hotelchainlist", {
    //     Search: "",
    //     Status: "",
    //   });
    //   setHotelChainList(data?.DataList);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  // initialization of room bed type
  useEffect(() => {
    if (bedTypeList && bedTypeList?.length > 0) {
      const bedInitial = bedTypeList?.map((bed) => ({
        RoomBedTypeId: bed?.id,
        BedName: bed?.Name,
        RoomCost: "",
      }));
      setBedTypeArr(bedInitial);
    }
  }, [bedTypeList]);

  // initialization of bead meal and room value on first render

  useEffect(() => {
    if (formValue) {
      setFormValue((pre) => ({ ...pre, RoomTaxSlabId: "TAXINC" }));
    }
  }, []);

  console.log(formValue, "111");

  const handleBedChangeForm = (ind, e) => {
    setBedTypeArr((prevArr) => {
      const newArr = [...prevArr];
      newArr[ind] = { ...newArr[ind], RoomCost: e.target.value };
      return newArr;
    });
  };

  const handleMealTypeChangeind = (ind, e) => {
    setMealTypeArr((prevArr) => {
      const newArr = [...prevArr];
      newArr[ind] = { ...newArr[ind], MealCost: e.target.value };
      return newArr;
    });
  };

  useEffect(() => {
    getDataForDropdown();
  }, []);
  const getYearForSeason = () => {
    const currentYear = new Date().getFullYear();
    const tenYearArr = [];

    for (let i = 0; i < 10; i++) {
      tenYearArr.push(currentYear + i);
    }
    return tenYearArr;
  };

  const YearList = getYearForSeason();

  const handleRemarksEditorChagne = (event, editor) => {
    const data = editor.getData();
    setRemarksEditorValue(data);
  };

  const getFromDate = () => {
    return formValue?.ValidFrom ? new Date(formValue?.ValidFrom) : null;
  };
  const getNextDate = () => {
    return formValue?.ValidTo ? new Date(formValue?.ValidTo) : null;
  };

  const handleNextCalender = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFormValue({
      ...formValue,
      ValidTo: formattedDate,
    });
  };

  const handleCalender = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFormValue({
      ...formValue,
      ValidFrom: formattedDate,
    });
  };
  const BlackoutDatetDate = () => {
    return formValue?.BlackoutDatesFrom
      ? new Date(formValue?.BlackoutDatesFrom)
      : null;
  };
  const BlackoutDatesFromCalender = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFormValue({
      ...formValue,
      BlackoutDatesFrom: formattedDate,
    });
  };
  const BlackoutDatetoDate = () => {
    return formValue?.BlackoutDatesTo
      ? new Date(formValue?.BlackoutDatesTo)
      : null;
  };

  const BlackoutDatesToCalender = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFormValue({
      ...formValue,
      BlackoutDatesTo: formattedDate,
    });
  };

  const BlackoutDatesRemarkCalender = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFormValue({
      ...formValue,
      // BlackoutDatesRemark: formattedDate,
    });
  };

  const handleReset = () => {
    setIsUpdateData(false);
    const updateInitialValue = {
      ...hotelRateAddInitialValue,
      HotelId: state?.HotelId,
      SupplierId: dataForUpdate?.SupplierId,
      GalaDinner: [{ Name: "", Price: "", Date: "", Meal: "" }],
      BlackoutDates: [
        {
          BlackoutDatesFrom: "",
          BlackoutDatesTo: "",
          BlackoutDatesRemark: "",
        },
      ],
    };
    setFormValue(updateInitialValue);
    setRemarksEditorValue("");
    setWeekendDaysValue([]);
    const updatedBedTypeArr = bedTypeArr.map((bed) => ({
      ...bed,
      RoomCost: "",
    }));
    const updatedMealTypeArrTypeArr = mealTypeArr.map((meal) => ({
      ...meal,
      MealCost: "",
    }));
    setBedTypeArr(updatedBedTypeArr);
    setMealTypeArr(updatedMealTypeArrTypeArr);
  };

  // Submit handler
  const handleSubmit = async (e, condition) => {

    e.preventDefault();
    const bedTypeJson = bedTypeArr?.map((bed) => ({
      RoomBedTypeId: bed?.RoomBedTypeId,
      RoomCost: bed?.RoomCost,
    }));

    const mealTypeJson = mealTypeArr?.map((meal) => ({
      MealTypeId: meal?.MealTypeId,
      MealCost: meal?.MealCost,
    }));

    try {
      setLoadingBtn(true)
      await hotelRateAddValidationSchema.validate(
        {
          ...formValue,
          HotelId: id,
        },
        { abortEarly: false }
      );

      setValidationErrors({});

      const { data } = await axiosOther.post(
        condition === "saveAndNew"
          ? "addhotelrates"
          : isUpdating
            ? "updatehotelratejson"
            : "addhotelrates",
        condition === "saveAndNew"
          ? {
            ...formValue,
            HotelId: id,
            HotelChainId: state?.HotelChainId, // Change to pass HotelChainId
            HotelTypeId: state?.hotelTypeId,
            UserId: state?.UserId, // Change to pass userid
            AddedDate: currentDate(),
            HotelCategoryId: state?.HotelCategoryId,
            DestinationID: state?.destinationId,
            RoomBedType: bedTypeJson,
            MealType: mealTypeJson,
            DayList: weekdayValue,
            CompanyId: state?.companydata,
          }
          : {
            ...formValue,
            HotelId: id,
            HotelChainId: state?.HotelChainId, // Change to pass HotelChainId
            UserId: state?.UserId, // Change to pass userid
            HotelTypeId: state?.hotelTypeId,
            HotelCategoryId: state?.HotelCategoryId,
            DestinationID: state?.destinationId,
            RoomBedType: bedTypeJson,
            MealType: mealTypeJson,
            DayList: weekdayValue,
            CompanyId: state?.companydata.toString(),
          }
      );
      if (data?.Status == 0 || data?.status == 0) {
        notifyError(data?.Message || data?.message);
      }
      if (data?.Status == 1 || data?.status == 1) {
        scrollToBottom();
        getDataToServer();
        setIsUpdating(false);
        if (condition === "saveAndNew") {
          setFormValue((pre) => ({ ...pre, MealPlanId: "" }));
          setRemarksEditorValue("");
          setWeekendDaysValue([]);
        }

        if (condition === "submit") {
          scrollToBottom();
          getDataToServer();
          setIsUpdating(false);

          const updateInitialValue = {
            ...hotelRateAddInitialValue,
            HotelId: state?.HotelId,
            SupplierId: dataForUpdate?.SupplierId,
            GalaDinner: [{ Name: "", Price: "", Date: "", Meal: "" }],
            BlackoutDates: [
              {
                BlackoutDatesFrom: "",
                BlackoutDatesTo: "",
                BlackoutDatesRemark: "",
              },
            ],
          };
          setFormValue(updateInitialValue);
          setRemarksEditorValue("");
          setWeekendDaysValue([]);
          setBedTypeArr((prev) =>
            prev.map((item) => ({
              ...item,
              RoomCost: "",
            }))
          );
          setMealTypeArr(initialMealTypes);
        }
        notifySuccess(data?.Message || data?.message);
      }
    } catch (error) {
      if (error.inner) {
        const errorMessages = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(errorMessages);
      }

      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.useEffectrrors
        );
        notifyError(data[0][1]);
      }
      console.log(error);
    } finally {
      setLoadingBtn(false)
    }
  };
  // console.log(formValue, "formvalue");
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "SeasonTypeID") {
      const selectedSeason = seasonList.find(
        (item) => item.id.toString() === value.toString()
      );
      // console.log(seasonList.find(item =>  item.id),"idd")

      if (selectedSeason) {
        setFormValue((prev) => ({
          ...prev,
          SeasonTypeID: selectedSeason.id,
          SeasonYear: selectedSeason.Year,
          ValidFrom: selectedSeason.FromDate,
          ValidTo: selectedSeason.ToDate,
        }));
        return;
      }
    }
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(currentDate());

  useEffect(() => {
    if (dataForUpdate != "") {
      console.log(dataForUpdate);
      console.log(state);
      setIsUpdating(true);
      setFormValue({
        HotelId: state?.HotelId || id,
        RateUniqueId: dataForUpdate?.UniqueID,
        MarketTypeId: dataForUpdate?.MarketTypeId,
        SupplierId: dataForUpdate?.SupplierId,
        HotelUUID: dataForUpdate?.HotelUUID,
        CompanyId:
          dataForUpdate?.CompanyId != null ||
            dataForUpdate?.CompanyId != undefined
            ? dataForUpdate?.CompanyId
            : "1",
        DestinationID: state?.destinationId,
        HotelTypeId: state?.hotelTypeId,
        HotelCategoryId: state?.HotelCategoryId,
        ValidFrom: dataForUpdate?.ValidFrom,
        ValidTo: dataForUpdate?.ValidTo,
        PaxTypeId: dataForUpdate?.PaxTypeId,
        TarrifeTypeId: dataForUpdate?.TarrifeTypeId,
        SeasonTypeID: dataForUpdate?.SeasonTypeID,
        SeasonYear: dataForUpdate?.SeasonYear,
        DayList: dataForUpdate?.DayList,
        WeekendDays: dataForUpdate?.WeekendDays,
        RoomCost: dataForUpdate?.RoomCost,
        MealCost: dataForUpdate?.MealCost,
        CurrencyId: +dataForUpdate?.CurrencyId,
        RoomTypeID: dataForUpdate?.RoomTypeID,
        MealPlanId: dataForUpdate?.MealPlanId,
        RoomBedType: dataForUpdate?.RoomBedType,
        RoomTaxSlabId: dataForUpdate?.RoomTaxSlabId,
        MealSlabId: dataForUpdate?.MealSlabId,
        MarkupType: dataForUpdate?.MarkupType,
        // BlackoutDatesFrom: dataForUpdate?.BlackoutDatesFrom,
        // BlackoutDatesTo: dataForUpdate?.BlackoutDatesTo,
        // BlackoutDatesRemark: dataForUpdate?.BlackoutDatesRemark,
        MarkupCost: dataForUpdate?.MarkupCost,
        MealType: dataForUpdate?.MealType,
        Remarks: dataForUpdate?.Remarks,
        Status: dataForUpdate?.Status,
        AddedBy: dataForUpdate?.AddedBy,
        UpdatedBy: dataForUpdate?.UpdatedBy,
        // GalaDinner: dataForUpdate?.GalaDinner,
        GalaDinner: dataForUpdate?.GalaDinner?.map((item) => ({
          Name: item?.Name || "",
          Price: item?.Price || "",
          Date: item?.Date || "",
          Meal: item?.Meal || "",
        })) || [{ Name: "", Price: "", Date: "", Meal: "" }],
        BlackoutDates: dataForUpdate?.BlackoutDates,
        UpdatedDate: currentDate(),
      });

      setWeekendDaysValue(dataForUpdate?.DayList || []);

      // Populate mealTypeArr with existing meal data
      if (dataForUpdate?.MealType && dataForUpdate?.MealType.length > 0) {
        const updatedMealTypeArr = mealTypeArr.map((meal) => {
          const existingMeal = dataForUpdate.MealType.find(
            (m) => m.MealTypeId === meal.MealTypeId
          );
          return {
            ...meal,
            MealCost: existingMeal ? existingMeal.MealCost : "",
          };
        });
        setMealTypeArr(updatedMealTypeArr);
      }

      // Populate bedTypeArr with existing room bed data
      if (dataForUpdate?.RoomBedType && dataForUpdate?.RoomBedType.length > 0) {
        const updatedBedTypeArr = bedTypeArr.map((bed) => {
          const existingBed = dataForUpdate.RoomBedType.find(
            (b) => b.RoomBedTypeId === bed.RoomBedTypeId
          );
          return {
            ...bed,
            RoomCost: existingBed ? existingBed.RoomCost : "",
          };
        });
        setBedTypeArr(updatedBedTypeArr);
      }

      // Set remarks editor value
      setRemarksEditorValue(
        dataForUpdate?.Remarks != null ? dataForUpdate?.Remarks : ""
      );
    }
  }, [dataForUpdate]);

  const handleWeekendDaysValue = (e) => {
    const { value, checked } = e.target;

    if (value === "All") {
      if (checked) {
        setWeekendDaysValue([...weekday]);
      } else {
        setWeekendDaysValue([]);
      }
      return;
    }

    if (value !== "All") {
      if (checked) {
        setWeekendDaysValue([...weekdayValue, value]);
      } else {
        const filteredDays = weekdayValue.filter((day) => day !== value);
        setWeekendDaysValue(filteredDays);
      }
    }
  };


  // const handleWeekendDaysValue = (e) => {
  //   const { value, checked } = e.target;

  //   if (value == "All") {
  //     if (checked) {
  //       setWeekendDaysValue(weekday);
  //     } else {
  //       setWeekendDaysValue([]);
  //     }
  //   }

  //   if (value != "All") {
  //     if (checked) {
  //       setWeekendDaysValue([...weekdayValue, value]);
  //     } else {
  //       const filteredDays = weekdayValue.filter((day) => day !== value);
  //       setWeekendDaysValue(filteredDays);
  //     }
  //   }
  // };

  // console.log(formValue);

  // console.log(formValue?.RoomTaxSlabId, "630");

  // useEffect(() => {
  //   console.log(taxSlab);
  //   const taxItem = taxSlab?.find(
  //     (list) => list?.id == formValue?.RoomTaxSlabId
  //   );
  //   if (taxItem) {
  //     setFormValue((prev) => {
  //       return {
  //         ...prev,
  //         CurrencyId: taxItem?.CurrencyID,
  //       };
  //     });
  //   } else {
  //     setFormValue((prev) => {
  //       return {
  //         ...prev,
  //         CurrencyId: "",
  //       };
  //     });
  //   }
  // }, [formValue?.RoomTaxSlabId]);

  // Blackout

  const handleBlackoutChange = (index, field, value) => {
    const updatedBlackouts = [...formValue.BlackoutDates];
    updatedBlackouts[index][field] = value;
    setFormValue({ ...formValue, BlackoutDates: updatedBlackouts });
  };

  const handleAddBlackout = () => {
    setFormValue((prev) => ({
      ...prev,
      BlackoutDates: [
        ...prev.BlackoutDates,
        { BlackoutDatesFrom: "", BlackoutDatesTo: "", BlackoutDatesRemark: "" },
      ],
    }));
  };

  const handleRemoveBlackout = (index) => {
    const updated = [...formValue.BlackoutDates];
    updated.splice(index, 1);
    setFormValue({ ...formValue, BlackoutDates: updated });
  };

  // Gala Dinner
  const handleGalaDinnerChange = (index, field, value) => {
    const updatedRates = [...formValue.GalaDinner];
    updatedRates[index][field] = value;
    setFormValue({ ...formValue, GalaDinner: updatedRates });
  };

  // const handleAddGalaDinner = () => {
  //   setFormValue({
  //     ...formValue,
  //     GalaDinner: [...formValue.GalaDinner, { Name: "", Price: "" }],
  //   });
  // };
  const handleAddGalaDinner = () => {
    setFormValue({
      ...formValue,
      GalaDinner: [
        ...formValue.GalaDinner,
        { Name: "", Price: "", Date: "", Meal: "" },
      ],
    });
  };

  const handleRemoveGalaDinner = (index) => {
    const updatedRates = [...formValue.GalaDinner];
    updatedRates.splice(index, 1);
    setFormValue({ ...formValue, GalaDinner: updatedRates });
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-22">
          <div className="card">
            <div className="card-header py-2 px-3 d-flex justify-content-between align-items-center">
              <div className="d-flex flex-column">
                <h4 className="m-0 rate-heading-h4">
                  {state?.Master}: {state?.Name} , {state?.Destination} , Pay
                  Type: {state?.PaymentType === "Cash" ? "Advance" : ""}
                </h4>
                <h5 className="m-0 text-dark">Add Tariff</h5>
              </div>

              <ToastContainer />
              <div className="d-flex gap-3">
                {/* <Link to={"/hotel"} className="btn btn-dark btn-custom-size">
                  Back
                </Link> */}
                <button
                  className="btn btn-dark btn-custom-size"
                  name="SaveButton"
                  onClick={() =>
                    navigate("/hotel", {
                      state: {
                        selectedDestination: state?.selectedDestination,
                        selecthotelname: state?.selecthotelname,
                        HotelCategoryId: state?.HotelCategoryId   // add this line 
                      },
                    })
                  }
                >
                  <span className="me-1">Back</span>
                  <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                </button>
                <button
                  onClick={(e) => handleSubmit(e, "saveAndNew")}
                  className="btn btn-primary btn-custom-size"
                >
                  Save <strong className="">And</strong> New
                </button>
                <button
                  onClick={handleReset}
                  className="btn btn-dark btn-custom-size"
                >
                  <span className="me-1">Reset</span>
                  <i className="fa-solid fa-refresh text-dark bg-white p-1 rounded"></i>
                </button>
                {/* <button
                  onClick={(e) => handleSubmit(e, "submit")}
                  className="btn btn-primary btn-custom-size"
                >
                  Submit
                </button> */}

                <button
                  type="button"
                  className="btn btn-primary btn-custom-size py-1 rounded-1 d-flex align-items-center gap-1"
                  style={{
                    cursor: loadingBtn ? "no-drop" : "pointer",
                    opacity: loadingBtn ? 0.7 : 1,
                  }}
                  disabled={loadingBtn}
                  onClick={(e) => handleSubmit(e, "submit")}
                >
                  {loadingBtn && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  {loadingBtn ? "Submitting..." : "Submit"}
                </button>


                {/* {isupdateData && (
                  <button
                    onClick={handleReset}
                    className="btn btn-primary btn-custom-size"
                  >
                    Reset
                  </button>
                )} */}
              </div>
            </div>
            <div className="card-body p-3">
              <div className="form-validation">
                <form
                  className="form-valide"
                  action="#"
                  method="post"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="row">
                    <div className="col-12">
                      <div className="row form-row-gap">
                        <div className="col-sm-6 col-md-3 col-lg-2">
                          <label className="m-0" htmlFor="status">
                            Market Type <span className="text-danger">*</span>
                          </label>
                          <select
                            name="MarketTypeId"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.MarketTypeId}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {markettypemasterlist &&
                              markettypemasterlist?.length > 0 &&
                              markettypemasterlist.map((data, index) => (
                                <option value={data?.id}>{data?.Name}</option>
                              ))}
                          </select>
                          {validationErrors?.MarketTypeId && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.MarketTypeId}
                            </div>
                          )}
                        </div>

                        <div className="col-sm-6 col-md-3 col-lg-2">
                          <label className="m-0" htmlFor="status">
                            Supplier Name <span className="text-danger">*</span>
                          </label>
                          <select
                            name="SupplierId"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.SupplierId}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {supplierList &&
                              supplierList?.length > 0 &&
                              supplierList.map((data, index) => (
                                <option value={data?.id}>{data?.Name}</option>
                              ))}
                          </select>
                          {validationErrors?.SupplierId && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.SupplierId}
                            </div>
                          )}
                        </div>
                        <div className="col-sm-6 col-md-3 col-lg-2">
                          <label className="m-0" htmlFor="status">
                            Pax Type
                          </label>
                          <select
                            name="PaxTypeId"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.PaxTypeId}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {paxTypeList &&
                              paxTypeList?.length > 0 &&
                              paxTypeList.map((data, index) => (
                                <option value={data?.id}>
                                  {data?.Paxtype}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="col-sm-6 col-md-3 col-lg-2">
                          <label className="m-0" htmlFor="status">
                            Tarif Type <span className="text-danger">*</span>
                          </label>
                          <select
                            name="TarrifeTypeId"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.TarrifeTypeId}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {tarifTypeList &&
                              tarifTypeList?.length > 0 &&
                              tarifTypeList.map((data, index) => (
                                <option value={data?.id}>{data?.Name}</option>
                              ))}
                          </select>
                          {validationErrors?.TarrifeTypeId && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.TarrifeTypeId}
                            </div>
                          )}
                        </div>
                        <div className="col-sm-6 col-md-3 col-lg-2">
                          <label className="m-0" htmlFor="status">
                            Season Type <span className="text-danger">*</span>
                          </label>
                          <select
                            name="SeasonTypeID"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.SeasonTypeID}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {seasonList &&
                              seasonList?.length > 0 &&
                              seasonList.map((data, index) => (
                                <option value={data?.id}>{data?.Name}</option>
                              ))}
                          </select>
                          {validationErrors?.SeasonTypeID && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.SeasonTypeID}
                            </div>
                          )}
                        </div>
                        <div className="col-sm-6 col-md-3 col-lg-2">
                          <label className="m-0" htmlFor="status">
                            Season Year <span className="text-danger">*</span>
                          </label>
                          <select
                            name="SeasonYear"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.SeasonYear}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {YearList &&
                              YearList?.length > 0 &&
                              YearList.map((data, index) => (
                                <option value={data}>{data}</option>
                              ))}
                          </select>
                          {validationErrors?.SeasonYear && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.SeasonYear}
                            </div>
                          )}
                        </div>
                        <div className="col-sm-6 col-md-3 col-lg-2">
                          <label className="m-0">Rate Valid From </label>
                          <DatePicker
                            className="form-control form-control-sm"
                            selected={getFromDate()}
                            name="FromDate"
                            onChange={(e) => handleCalender(e)}
                            dateFormat="dd-MM-yyyy"
                            isClearable
                            todayButton="Today"
                          />
                        </div>
                        <div className="col-sm-6 col-md-3 col-lg-2">
                          <label className="m-0">Rate Valid To</label>
                          <DatePicker
                            className="form-control form-control-sm"
                            selected={getNextDate()}
                            name="FromDate"
                            onChange={(e) => handleNextCalender(e)}
                            dateFormat="dd-MM-yyyy"
                            isClearable
                            todayButton="Today"
                          />
                        </div>
                        <div className="col-sm-6 col-md-3 col-lg-2">
                          <label className="m-0" htmlFor="status">
                            Currency <span className="text-danger">*</span>
                          </label>
                          <select
                            name="CurrencyId"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.CurrencyId}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {currencymasterlist &&
                              currencymasterlist?.length > 0 &&
                              currencymasterlist.map((data, index) => (
                                <option value={data?.id}>
                                  {data?.CurrencyName} ({data?.CountryCode})
                                </option>
                              ))}
                          </select>
                          {validationErrors?.CurrencyId && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.CurrencyId}
                            </div>
                          )}
                        </div>
                        <div className="col-sm-6 col-md-3 col-lg-2">
                          <label className="m-0" htmlFor="status">
                            Room Type<span className="text-danger">*</span>
                          </label>
                          <select
                            name="RoomTypeID"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.RoomTypeID}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {roomTypeList &&
                              roomTypeList?.length > 0 &&
                              roomTypeList.map((data, index) => (
                                <option value={data?.id}>{data?.Name}</option>
                              ))}
                          </select>
                          {validationErrors?.RoomTypeID && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.RoomTypeID}
                            </div>
                          )}
                        </div>
                        {/* <div className="col-sm-6 col-md-3 col-lg-2">
                          <label className="m-0" htmlFor="status">
                            Room Tax Slab <span className="text-danger">*</span>
                          </label>
                          <select
                            name="RoomTaxSlabId"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.RoomTaxSlabId}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {taxSlab &&
                              taxSlab?.length > 0 &&
                              taxSlab?.map((data, index) => (
                                <option value={data?.id}>
                                  {data?.TaxSlabName} {(`${data?.TaxValue}`)}
                                </option>
                              ))}
                          </select>
                          {validationErrors?.RoomTaxSlabId && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.RoomTaxSlabId}
                            </div>
                          )}
                        </div> */}
                        <div className="col-sm-6 col-md-3 col-lg-2">
                          <label className="m-0" htmlFor="status">
                            Meal Plan Type<span className="text-danger">*</span>
                          </label>
                          <select
                            name="MealPlanId"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.MealPlanId}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {mealPlanList &&
                              mealPlanList?.length > 0 &&
                              mealPlanList.map((data, index) => (
                                <option value={data?.id}>{data?.Name}</option>
                              ))}
                          </select>
                          {validationErrors?.MealPlanId && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.MealPlanId}
                            </div>
                          )}
                        </div>
                        {/* <div className="col-md-6 col-lg-2">
                          <label className="m-0">Hotel Chain</label>
                          <select
                            className="form-control form-control-sm"
                            name="HotelChainId"
                            value={formValue?.HotelChainId}
                            onChange={handleFormChange}
                          >
                            <option value={""}>Select</option>
                            {hotelChainList?.map((item, ind) => (
                              <option value={item?.Id} key={ind + 1}>
                                {item?.Name}
                              </option>
                            ))}
                          </select>
                        </div> */}

                        <div className="col-sm-6 col-md-3 col-lg-2">
                          <label className="m-0" htmlFor="status">
                            Markup Type
                          </label>
                          <select
                            name="MarkupType"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.MarkupType}
                            onChange={handleFormChange}
                          >
                            <option value="percentage">%</option>
                            <option value="flat">Flat</option>
                          </select>
                        </div>
                        <div className="col-sm-6 col-md-3 col-lg-2">
                          <label className="m-0"> Markup Cost</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            id="name"
                            name="MarkupCost"
                            value={formValue?.MarkupCost}
                            onChange={handleFormChange}
                            placeholder="Markup Cost"
                          />
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label className="m-0">Weekend Days</label>
                          <select
                            className="form-control form-control-sm"
                            component={"select"}
                            name="WeekendDays"
                            value={formValue?.WeekendDays}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {weekendList?.map((week, ind) => {
                              return (
                                <option value={week?.id} key={ind}>
                                  {week?.Name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="col-md-6 col-lg-3 d-flex flex-column gap-1">
                          <label className="mt-2 pt-1">DayList</label>
                          <div className="d-flex gap-3">
                            <div className="d-flex gap-1">
                              <label htmlFor={"All"} className="m-0">
                                All
                              </label>
                              <input
                                type="checkbox"
                                name={"All"}
                                value={"All"}
                                className="form-check-input height-em-1 width-em-1 me-1"
                                checked={weekday?.every((item) =>
                                  weekdayValue?.includes(item)
                                )}
                                onChange={handleWeekendDaysValue}
                                id={"All"}
                              />
                            </div>

                            {weekday?.map((day, index) => (
                              <div className="d-flex gap-1" key={index}>
                                <label htmlFor={day} className="m-0">
                                  {day.slice(0, 3)}
                                </label>
                                <input
                                  type="checkbox"
                                  name={day}
                                  value={day}
                                  className="form-check-input height-em-1 width-em-1 me-1"
                                  checked={weekdayValue?.includes(day)}
                                  onChange={handleWeekendDaysValue}
                                  id={day}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="col-sm-6 col-md-3 col-lg-2 ms-4">
                          <label className="m-0" htmlFor="status">
                            Status
                          </label>
                          <select
                            name="Status"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.Status}
                            onChange={handleFormChange}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                        </div>

                        {/* Blackout fields */}
                        {formValue?.BlackoutDates?.map((item, index) => (
                          <div key={index} className={styles.blackoutRow}>
                            <div className={styles.inputGroup}>
                              <label>Blackout Dates From</label>
                              <DatePicker
                                className={styles.input}
                                minDate={new Date()}
                                selected={
                                  item.BlackoutDatesFrom
                                    ? new Date(item.BlackoutDatesFrom)
                                    : null
                                }
                                onChange={(date) =>
                                  handleBlackoutChange(
                                    index,
                                    "BlackoutDatesFrom",
                                    date
                                      ? date
                                        .toLocaleDateString("en-GB") // dd/mm/yyyy
                                        .split("/")
                                        .reverse()
                                        .join("-") // Converts to yyyy-MM-dd
                                      : ""
                                  )
                                }
                                dateFormat="dd-MM-yyyy"
                                isClearable
                                todayButton="Today"
                              />
                            </div>
                            <div className={styles.inputGroup}>
                              <label>Blackout Dates To</label>
                              <DatePicker
                                className={styles.input}
                                minDate={new Date()}
                                selected={
                                  item.BlackoutDatesTo
                                    ? new Date(item.BlackoutDatesTo)
                                    : null
                                }
                                onChange={(date) =>
                                  handleBlackoutChange(
                                    index,
                                    "BlackoutDatesTo",
                                    date
                                      ? date
                                        .toLocaleDateString("en-GB") // dd/mm/yyyy
                                        .split("/")
                                        .reverse()
                                        .join("-") // Converts to yyyy-MM-dd
                                      : ""
                                  )
                                }
                                dateFormat="dd-MM-yyyy"
                                isClearable
                                todayButton="Today"
                              />
                            </div>

                            <div
                              className={`${styles.inputGroup} ${styles.textareaGroup}`}
                            >
                              <label>Blackout Dates Remark</label>
                              <textarea
                                className={styles.textarea}
                                value={item.BlackoutDatesRemark}
                                onChange={(e) =>
                                  handleBlackoutChange(
                                    index,
                                    "BlackoutDatesRemark",
                                    e.target.value
                                  )
                                }
                              ></textarea>
                            </div>

                            <div className={styles.actions}>
                              {index === 0 ? (
                                <button
                                  type="button"
                                  className={styles.addBtn}
                                  onClick={handleAddBlackout}
                                >
                                  +
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className={styles.removeBtn}
                                  onClick={() => handleRemoveBlackout(index)}
                                >
                                  -
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* END */}

                        {/* Gala Dinner */}

                        <div className="col-sm-12 col-md-12 col-lg-8 mt-1 mb-1">
                          <div className="border rounded pt-2 pb-3 position-relative pb-1 px-1">
                            <label
                              className="m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold"
                              htmlFor="status"
                            >
                              Add On
                            </label>
                            {/* Create here field */}
                            {/* {formValue?.GalaDinner?.map((item, index) => (

                              <div
                                key={index}
                                className="d-flex gap-2 ms-3 align-items-end"
                              >

                                <div className="col-sm-6 col-md-3 col-lg-4">
                                  <label className="m-0">Date</label>
                                  <DatePicker
                                    className="form-control form-control-sm"
                                    // selected={getFromDate()}
                                    name="FromDate"
                                    onChange={(e) => handleCalender(e)}
                                    dateFormat="yyyy-MM-dd"
                                    isClearable
                                    todayButton="Today"
                                    showMonthDropdown
                                    showYearDropdown
                                    yearDropdownItemNumber={100} 
                                    scrollableYearDropdown   
                                  />
                                </div>

                                <div className="col-sm-6 col-md-3 col-lg-4">
                                  <label className="m-0">Name</label>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    name="Name"
                                    value={item?.Name || ""}
                                    onChange={(e) =>
                                      handleGalaDinnerChange(
                                        index,
                                        "Name",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Gala Dinner Name"
                                  />
                                </div>

                                <div className="col-sm-6 col-md-3 col-lg-4">
                                  <label className="m-0">Price</label>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    name="Price"
                                    value={item?.Price || ""}
                                    onChange={(e) =>
                                      handleGalaDinnerChange(
                                        index,
                                        "Price",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Price"
                                  />
                                </div>

                                <div className="col-md-6 col-lg-2">
                                  <label>Meal</label>
                                  <div className="d-flex gap-3">
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="B"
                                        value="b"
                                        id="default_b"
                                        checked={formValue?.SetDefault === "1"}
                                        onChange={handleFormChange}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="default_b"
                                      >
                                        B
                                      </label>
                                    </div>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="L"
                                        value="l"
                                        id="default_l"
                                        checked={formValue?.SetDefault === "1"}
                                        onChange={handleFormChange}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="default_l"
                                      >
                                        L
                                      </label>
                                    </div>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="D"
                                        value="d"
                                        id="default_d"
                                        checked={formValue?.SetDefault === "0"}
                                        onChange={handleFormChange}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="default_d"
                                      >
                                        D
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className={styles.actions}>
                                  {index === 0 ? (
                                    <button
                                      type="button"
                                      className={styles.addBtn}
                                      onClick={handleAddGalaDinner}
                                    >
                                      +
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className={styles.removeBtn}
                                      onClick={() =>
                                        handleRemoveGalaDinner(index)
                                      }
                                    >
                                      -
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))} */}

                            {formValue?.GalaDinner?.map((item, index) => (
                              <div
                                key={index}
                                className="row ms-3 align-items-end gap-2 gap-lg-0"
                              >
                                {/* <div className="col-sm-6 col-md-3 col-lg-3">
                                  <label className="m-0">Date</label>
                                  <DatePicker
                                    className="form-control form-control-sm"
                                    selected={
                                      item.Date ? new Date(item.Date) : null
                                    }
                                    name={`GalaDinner[${index}].Date`}
                                    onChange={(date) =>
                                      handleGalaDinnerChange(
                                        index,
                                        "Date",
                                        date
                                          ? date
                                            .toLocaleDateString("en-GB") // Convert to dd/mm/yyyy
                                            .split("/")
                                            .reverse()
                                            .join("-") // Convert to yyyy-MM-dd
                                          : ""
                                      )
                                    }
                                    dateFormat="yyyy-MM-dd"
                                    isClearable
                                    todayButton="Today"
                                    yearDropdownItemNumber={100}
                                    scrollableYearDropdown
                                  />
                                </div> */}
                                <div className="col-sm-6 col-md-3 col-lg-3">
                                  <label className="m-0">Date</label>
                                  <DatePicker
                                    className="form-control form-control-sm"
                                    selected={item.Date ? new Date(item.Date) : null}
                                    name={`GalaDinner[${index}].Date`}
                                    onChange={(date) =>
                                      handleGalaDinnerChange(
                                        index,
                                        "Date",
                                        date
                                          ? date
                                            .toLocaleDateString("en-GB") // dd/MM/yyyy
                                            .split("/") // ["dd","MM","yyyy"]
                                            .reverse() // ["yyyy","MM","dd"]
                                            .join("-") // yyyy-MM-dd (API ke liye)
                                          : ""
                                      )
                                    }
                                    dateFormat="dd-MM-yyyy"  // UI me dd-MM-yyyy dikhega
                                    isClearable
                                    todayButton="Today"
                                    yearDropdownItemNumber={100}
                                    scrollableYearDropdown
                                  />
                                </div>
                                <div className="col-sm-6 col-md-3 col-lg-3">
                                  <label className="m-0">Name</label>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    name={`GalaDinner[${index}].Name`}
                                    value={item?.Name || ""}
                                    onChange={(e) =>
                                      handleGalaDinnerChange(
                                        index,
                                        "Name",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Gala Dinner Name"
                                  />
                                </div>
                                <div className="col-sm-6 col-md-3 col-lg-3">
                                  <label className="m-0">Price</label>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    name={`GalaDinner[${index}].Price`}
                                    value={item?.Price || ""}
                                    onChange={(e) =>
                                      handleGalaDinnerChange(
                                        index,
                                        "Price",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Price"
                                  />
                                </div>
                                <div className="col-md-2 col-lg-2">
                                  <label>Meal</label>
                                  <div className="d-flex gap-3">
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name={`GalaDinner[${index}].Meal`}
                                        value="B"
                                        id={`meal_b_${index}`}
                                        checked={item.Meal === "B"}
                                        onChange={(e) =>
                                          handleGalaDinnerChange(
                                            index,
                                            "Meal",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={`meal_b_${index}`}
                                      >
                                        B
                                      </label>
                                    </div>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name={`GalaDinner[${index}].Meal`}
                                        value="L"
                                        id={`meal_l_${index}`}
                                        checked={item.Meal === "L"}
                                        onChange={(e) =>
                                          handleGalaDinnerChange(
                                            index,
                                            "Meal",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={`meal_l_${index}`}
                                      >
                                        L
                                      </label>
                                    </div>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name={`GalaDinner[${index}].Meal`}
                                        value="D"
                                        id={`meal_d_${index}`}
                                        checked={item.Meal === "D"}
                                        onChange={(e) =>
                                          handleGalaDinnerChange(
                                            index,
                                            "Meal",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={`meal_d_${index}`}
                                      >
                                        D
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={`${styles.actions} col-md-1 col-lg-1`}
                                >
                                  {index === 0 ? (
                                    <button
                                      type="button"
                                      className={styles.addBtn}
                                      onClick={handleAddGalaDinner}
                                    >
                                      +
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className={styles.removeBtn}
                                      onClick={() =>
                                        handleRemoveGalaDinner(index)
                                      }
                                    >
                                      -
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* {validationErrors?.GalaDinnerRates?.[0]?.name && (
                            <div
                              id="val-galadinnername-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors.GalaDinnerRates[0].name}
                            </div>
                          )} */}
                        </div>
                        {/* END */}

                        <div className="col-sm-12 col-md-6 col-lg-7 mt-1">
                          <div className="border rounded position-relative pb-1 px-1 d-flex col-gap-2 flex-wrap">
                            <label
                              className="m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold"
                              htmlFor="status"
                            >
                              Room Bed Type
                            </label>
                            {bedTypeArr &&
                              bedTypeArr?.length > 0 &&
                              bedTypeArr?.map((bed, ind) => {
                                return (
                                  <div style={{ width: "7.4rem" }}>
                                    <div className="pt-2">
                                      <label htmlFor="" className="m-0">
                                        {bed?.BedName}
                                      </label>
                                      <input
                                        name="RoomBedType"
                                        id="status"
                                        className="form-control form-control-sm"
                                        value={bedTypeArr[ind]?.RoomCost}
                                        onChange={(e) =>
                                          handleBedChangeForm(ind, e)
                                        }
                                        placeholder="Price"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            <div style={{ width: "7.4rem" }}>
                              <div className="pt-2">
                                <label className="" htmlFor="status">
                                  Room Tax Slab
                                </label>
                                <span className="text-danger p-1">*</span>
                                <select
                                  name="RoomTaxSlabId"
                                  id="status"
                                  className="form-control form-control-sm"
                                  value={formValue?.RoomTaxSlabId}
                                  onChange={handleFormChange}
                                >
                                  <option value="">Select</option>
                                  <option value="TAXINC">TAX INC</option>
                                  <option value="GSTSLAB">GST SLAB</option>

                                  {/* {taxSlab &&
                                    taxSlab?.length > 0 &&
                                    taxSlab?.map((data, index) => (
                                      <option value={data?.id}>
                                        ( {data?.TaxSlabName}{" "}
                                        {`${data?.TaxValue}`})
                                      </option>
                                    ))} */}
                                </select>
                                {validationErrors?.RoomTaxSlabId && (
                                  <div
                                    id="val-username1-error"
                                    className="invalid-feedback animated fadeInUp"
                                    style={{ display: "block" }}
                                  >
                                    {validationErrors?.RoomTaxSlabId}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-5 mt-1">
                          <div className="border rounded position-relative pb-1 px-1 d-flex col-gap-2 flex-wrap">
                            <label
                              className="m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold"
                              htmlFor="status"
                            >
                              Meal Type
                            </label>
                            {mealTypeArr?.map((meal, ind) => {
                              return (
                                <div style={{ width: "9.5rem" }}>
                                  <div className="pt-2">
                                    <label htmlFor="" className="m-0">
                                      {meal?.MealName}
                                    </label>
                                    <input
                                      name="MealType"
                                      id="status"
                                      className="form-control form-control-sm"
                                      value={mealTypeArr[ind]?.MealCost}
                                      onChange={(e) =>
                                        handleMealTypeChangeind(ind, e)
                                      }
                                      placeholder="Price"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                            <div style={{ width: "8.5rem" }}>
                              <div className="pt-2">
                                <label className="m-0" htmlFor="status">
                                  Meal Tax Slab{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <select
                                  name="MealSlabId"
                                  id="status"
                                  className="form-control form-control-sm"
                                  value={formValue?.MealSlabId}
                                  onChange={handleFormChange}
                                >
                                  <option value="">Select</option>
                                  {taxSlab &&
                                    taxSlab?.length > 0 &&
                                    taxSlab.map((data, index) => (
                                      <option value={data?.id}>
                                        {data?.TaxSlabName}( {data?.TaxValue})
                                      </option>
                                    ))}
                                </select>
                                {validationErrors?.MealSlabId && (
                                  <div
                                    id="val-username1-error"
                                    className="invalid-feedback animated fadeInUp"
                                    style={{ display: "block" }}
                                  >
                                    {validationErrors?.MealSlabId}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-22 d-flex flex-column">
                          <label className="m-0">Remarks</label>
                          <textarea
                            name="Remarks"
                            value={formValue?.Remarks}
                            onChange={handleFormChange}
                            className="form-control form-control-sm"
                            id=""
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                {/*<HotelList id={id} editData={updateData} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <RateList
        setDataUpdate={setDataForUpdate}
        setIsUpdating={setIsUpdating}
        rateInitialList={rateInitialList}
        rateList={getDataToServer}
        isLoading={isLoading}
        state={state}
      />
    </>
  );
};

export default RateHotel;
