import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { axiosOther } from "../../../../http/axios_base_url";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  setPolicyData,
  setSubjectProgramName,
  setSummaryIncAndExc,
  setSummaryVisa,
} from "../../../../store/actions/queryAction";
import {
  select_customStyles,
  customStylesTheme,
} from "../../../../css/custom_style";
import { ThemeContext } from "../../../../context/ThemeContext";

const customStyles = {
  control: (provided) => ({
    width: "auto",
    minHeight: "20px",
    height: "25px",
    padding: "0px",
    border: "1px solid #d3d3d3",
    background: "#2e2e40",
    color: "#fff",
    borderRadius: "0.5rem",
    "&:hover": {
      border: "1px solid #aaa",
      background: "#2e2e40",
    },
  }),
  valueContainer: (provided) => ({
    padding: "0px",
    paddingLeft: "4px",
    height: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  placeholder: (provided) => ({
    margin: "0",
    fontSize: "0.76562rem",
    textAlign: "center",
    flex: 1,
  }),
  singleValue: (provided) => ({
    margin: "0",
    fontSize: "0.76562rem",
  }),
  dropdownIndicator: (provided) => ({
    display: "none",
  }),
  option: (provided) => ({
    ...provided,
    padding: "4px 1px",
    fontSize: "0.76562rem",
    overflow: "hidden",
    paddingLeft: "4px",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    overflowY: "hidden",
    overflowX: "hidden",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "150px",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      display: "none",
      width: "2px",
    },
  }),
};

function shiftUpFields(arr) {
  let newArr = [...arr];

  // Shift Inclusion up
  for (let i = 0; i < newArr.length - 1; i++) {
    if (!newArr[i]) continue;

    const curInclusion = String(newArr[i].Inclusion ?? "").trim();
    if (curInclusion === "") {
      for (let j = i + 1; j < newArr.length; j++) {
        if (!newArr[j]) continue;

        const nextInclusion = String(newArr[j].Inclusion ?? "").trim();
        if (nextInclusion !== "") {
          newArr[i].Inclusion = nextInclusion;
          newArr[j].Inclusion = "";
          break;
        }
      }
    }
  }

  // Shift Exclusion up
  for (let i = 0; i < newArr.length - 1; i++) {
    if (!newArr[i]) continue;

    const curExclusion = String(newArr[i].Exclusion ?? "").trim();
    if (curExclusion === "") {
      for (let j = i + 1; j < newArr.length; j++) {
        if (!newArr[j]) continue;

        const nextExclusion = String(newArr[j].Exclusion ?? "").trim();
        if (nextExclusion !== "") {
          newArr[i].Exclusion = nextExclusion;
          newArr[j].Exclusion = "";
          break;
        }
      }
    }
  }

  // Filter out completely empty rows
  newArr = newArr.filter((row) => {
    if (!row) return false;
    const inclusion = String(row.Inclusion ?? "").trim();
    const exclusion = String(row.Exclusion ?? "").trim();
    return inclusion !== "" || exclusion !== "";
  });

  return newArr;
}

const Policies = ({ onNext, onBack, isActive }) => {
  const { queryData, qoutationData, policyData } = useSelector(
    (data) => data?.queryReducer
  );

  // console.log(policyData, "TWEADES76666");
  const { QueryAlphaNumId } = queryData || {};
  const { QuotationNumber } = qoutationData || {};

  const [quotationData, setQoutationData] = useState({});
  const [hasFetched, setHasFetched] = useState(false);
  const [inclusionExclusionForm, setInclusionExclusionForm] = useState([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const dispatch = useDispatch();
  const { background } = useContext(ThemeContext);
  const formRef = useRef();

  const [textEditorValue, setTextEditorValue] = useState({
    Overview: "",
    TourHighlight: "",
    ItenararyIntroduction: "",
    ItenararySummery: "",
    PaymentPolicy: "",
    CancellationPolicy: "",
    Enclusive: "",
    Exclusive: "",
    Remarks: "",
    TermsCondition: "",
  });
  const [formValue, setFormValue] = useState([]);
  const [formData, setFormData] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [overViewList, setOverViewList] = useState([]);
  const [fitList, setFitList] = useState([]);
  const [GITList, setGITList] = useState([]);
  const [editorArray, setEditorArray] = useState([]);
  const [overView, setOverView] = useState("");
  const [fit, setFit] = useState("");
  const [git, setGit] = useState("");
  const [languageSecond, setLanguageSecond] = useState(20);
  const [language, setLanguage] = useState(20);
  const [mealPlanList, setMealPlanList] = useState([]);
  const [checkbox, setCheckbox] = useState(false); // chnage to false
  const [subjectHeading, setSubjectHeading] = useState("");
  // console.log(subjectHeading, "subjectHeading");

  const [fitDataFromApi, setFitDataFromApi] = useState({});
  const [GITDataFromApi, setGITDataFromApi] = useState({});

  const [fitPolicyForm, setFitPolicyForm] = useState({
    CancellationPolicy: "",
    Exclusion: "",
    Inclusion: "",
    PaymentPolicy: "",
    Remarks: "",
    TermsNCondition: "",
    Overview: "",
    TourHighlight: "",
    ItenararyIntroduction: "",
    ItenararySummery: "",
  });
  const [summaryList, setSummaryList] = useState([]);

  const [toggleTextArea, setToggleTextArea] = useState({
    name: "",
    index: "",
    isShow: false,
  });
  // console.log(isActive, "fitPolicyForm");

  // Fetch quotation data
  useEffect(() => {
    // console.log("Effect triggered", {
    //   isActive,
    //   hasFetched,
    //   QueryAlphaNumId,
    //   QuotationNumber,
    // });

    if (isActive || !hasFetched || QueryAlphaNumId || QuotationNumber) {
      axiosOther
        .post("listqueryquotation", {
          QueryId: QueryAlphaNumId,
          QuotationNo: QuotationNumber,
        })
        .then(({ data }) => {
          if (data?.success && data.data?.[0]) {
            setQoutationData(data.data[0]);
            setSubjectHeading(
              data.data[0]?.OverviewIncExcTc?.SubjectProgramName || ""
            );
          }
        })
        .catch(console.error)
        .finally(() => setHasFetched(false));
    }
    if (!isActive && hasFetched) setHasFetched(false);
  }, [isActive, QueryAlphaNumId, QuotationNumber, hasFetched]);

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const { data } = await axiosOther.post("hotelmealplanlist");
        if (data?.Status === 200) {
          setMealPlanList(data?.DataList);
        }
      } catch (error) {
        console.error(error, "error in fetching mealType");
      }
    };

    fetchMealPlans();
  }, [isActive, QueryAlphaNumId, QuotationNumber, hasFetched]);

  // Compute inclusionInitial
  const inclusionInitial = useMemo(() => {
    if (!quotationData?.Days) return [];

    const flight = quotationData?.Days?.flatMap((day) =>
      (day.DayServices ?? []).flatMap((service) =>
        (service.ServiceDetails ?? [])
          .filter((item) => item?.ItemCategory?.toLowerCase() === "airline")
          .map((item) => item.ItemName)
      )
    ).filter(Boolean);

    const trainDetails =
      quotationData?.Days?.flatMap((day) =>
        (day.DayServices ?? []).flatMap((service) =>
          (service.ServiceDetails ?? [])
            .filter((item) => item?.ItemCategory?.toLowerCase() === "train")
            .map((item) => ({
              name: item.ItemName,
              from: service?.FromDestinationName,
              to: service?.ToDestinationName,
              trainClassName: service?.TrainClassName || "",
            }))
        )
      ) || [];

    // console.log(trainDetails, "trainDetails4515");

    // console.log(trainDetails[0].trainClassName, 'trainClassName')

    let trainInclusion = "";
    if (trainDetails.length === 1) {
      const t = trainDetails[0];
      trainInclusion = `Train ${t.name}${
        t.trainClassName !== "" ? ` (${t.trainClassName})` : ""
      } from ${t.from} to ${t.to}`;
    } else if (trainDetails.length > 1) {
      trainInclusion = trainDetails
        .map(
          (t) =>
            `Train ${t.name}${
              t.trainClassName !== "" ? ` (${t.trainClassName})` : ""
            } from ${t.from} to ${t.to}`
        )
        .join(", ");
    }

    // console.log(quotationData, "Indskf78");

    const roomInfo = quotationData?.QueryInfo?.Accomondation?.RoomInfo || [];

    const roomDetails = roomInfo.map((room) => ({
      RoomType: room.RoomType,
      NoOfPax: room.NoOfPax ?? 0,
    }));

    const hasSGL = roomDetails.some(
      (room) => room.RoomType === "SGL Room" && room.NoOfPax > 0
    );

    const hasOther = roomDetails.some(
      (room) => room.RoomType !== "SGL Room" && room.NoOfPax > 0
    );

    let roomTypeText = "";
    if (hasSGL && hasOther) {
      roomTypeText = "double / twin";
    } else if (hasOther) {
      roomTypeText = "double / twin";
    } else if (hasSGL) {
      roomTypeText = "single";
    }

    const accommodationText = `Accommodation based on sharing a ${roomTypeText} room`;

    const includedItems = quotationData?.Days?.flatMap((day) =>
      day?.DayServices?.flatMap(
        (service) =>
          service?.ServiceDetails?.filter(
            (detail) => detail?.ItemCategory === "monument"
          ) || []
      )
    )
      ?.map((detail) => detail?.ItemName)
      ?.filter(Boolean)
      ?.join(", ");

    // const activityItems = Array.from(
    //   new Set(
    //     quotationData?.Days?.flatMap((day) =>
    //       (day?.DayServices ?? []).flatMap((service) =>
    //         (service?.ServiceDetails ?? [])
    //           .filter(
    //             (detail) =>
    //               detail?.ItemCategory === "activity" && detail?.ItemName
    //           )
    //           .map(
    //             (detail) => `${service?.DestinationName} - ${detail?.ItemName}`
    //           )
    //       )
    //     ).filter(Boolean)
    //   )
    // ).join("\n ");

    const activityItems = Array.from(
      new Set(
        quotationData?.Days?.flatMap((day) =>
          (day?.DayServices ?? [])
            // only keep services where Supplement is NOT "Yes"
            .filter((service) => service?.Supplement !== "Yes")
            .flatMap((service) =>
              (service?.ServiceDetails ?? [])
                .filter(
                  (detail) =>
                    detail?.ItemCategory === "activity" && detail?.ItemName
                )
                .map(
                  (detail) =>
                    `${service?.DestinationName} - ${detail?.ItemName}`
                )
            )
        ).filter(Boolean)
      )
    ).join("\n ");

    console.log(activityItems, "ACTIVITYslk31");

    const mealDescriptions =
      quotationData?.Days?.flatMap((day) =>
        (day.DayServices ?? [])
          .filter((service) => service?.ServiceType === "Restaurant")
          .flatMap(
            (service) =>
              (service.MealPlan ?? [])
                .filter(
                  (meal) =>
                    meal?.Amount != null &&
                    meal.Amount !== "" &&
                    meal.Supplement !== "Yes"
                )
                .map((meal) => {
                  const mealType = meal.MealType ?? "Meal";
                  const serviceName = meal.ServiceName;
                  const destination = service.DestinationName ?? "Location";

                  // Only return if serviceName is truthy
                  if (serviceName) {
                    return `${mealType} at ${serviceName} (${destination}),`;
                  } else {
                    return null;
                  }
                })
                .filter(Boolean) // Remove null values
          )
      ) || [];

    const mealPlan =
      quotationData?.Days?.flatMap((day) =>
        (day?.DayServices || []).filter(
          (service) => service?.ServiceType === "Hotel"
        )
      ) || [];

    // find matching meal plan from mealPlanList
    const matchedMealPlan = mealPlanList.find(
      (plan) => plan.Name === mealPlan[0]?.MealPlanName
    );

    let mealPlanType = "Daily Breakfast";

    if (matchedMealPlan?.ShortName) {
      mealPlanType = matchedMealPlan.ShortName.replace(/^Room\s*\+?/, "Daily ") // replace leading "Room+" or "Room " with "Daily "
        .replace(/\+/g, ", "); // replace + with ,
    }

    //collect all destinations that have monuments
    const monumentDestinations = new Set(
      quotationData?.Days?.flatMap((day) =>
        (day.DayServices ?? [])
          .filter(
            (service) =>
              service?.ServiceType === "Monument" && service?.ServiceName
          )
          .map((service) => service?.DestinationName)
      ).filter(Boolean)
    );

    //collect guide languages but only if destination has a monument
    const guideLanguages =
      quotationData?.Days?.flatMap((day) =>
        (day.DayServices ?? [])
          .filter(
            (service) =>
              service?.ServiceType === "Guide" && service?.DayType != null
          )
          .map((service) => ({
            language: service.LanguageName,
            destination: service?.DestinationName,
          }))
      ).filter(
        (service) =>
          service.language &&
          service.destination &&
          monumentDestinations.has(service.destination)
      ) || [];

    //make unique
    const uniqueGuideLanguages = Array.from(
      new Map(
        guideLanguages.map((item) => [
          `${item.language}_${item.destination}`,
          item,
        ])
      ).values()
    );

    const days = quotationData?.Days || [];
    const startDay = (days.length > 0 && days[0]?.Day) || 1;
    const endDay = days.length > 0 && days[days.length - 1]?.Day;

    const escort = quotationData?.ExcortLocalTotalCost;
    const hasEscortData = escort && Object.keys(escort).length > 0;
    const accompanyLang = quotationData.ExcortDays.filter(
      (day) => day.Type === "Local"
    ).flatMap((day) => day?.FeeCharges?.map((fee) => fee.LanguageName));

    console.log(uniqueGuideLanguages, "ADSFSD74");

    //descriptions
    const guideDescriptions = uniqueGuideLanguages.length
      ? Object.entries(
          uniqueGuideLanguages.reduce((acc, { language, destination }) => {
            acc[language] ??= new Set();
            acc[language].add(destination);
            return acc;
          }, {})
        )
          .map(
            ([language, dests]) =>
              `Services of local ${language} speaking guide in ${[
                ...dests,
              ].join(", ")}. `
          )
          .join("\n") +
        (hasEscortData
          ? `\n\nService of ${uniqueGuideLanguages[0]?.language} speaking escort from Day ${startDay} to Day ${endDay}.`
          : "") +
        (accompanyLang.length > 0
          ? `\nAccompanying ${accompanyLang[0]} speaking escort.`
          : "") +
        `\nNote: Different guides will be provided in each city. ${
          uniqueGuideLanguages.some(({ language }) => language !== "English")
            ? "Foreign language-speaking guides will be subject to availability."
            : ""
        }`
      : " ";

    return [
      {
        id: 1,
        Inclusion: `${accommodationText}`,
        Exclusion: `Any airfares, excess baggage ${
          flight?.length > 0 ? `(${flight?.[0]})` : "(no flight)"
        }`,
      },
      {
        id: 2,
        Inclusion: `${mealPlanType}\n${
          mealDescriptions?.length > 0 ? mealDescriptions.join("\n") : " "
        }`,
        Exclusion: "",
      },
      {
        id: 3,
        Inclusion: "",
        Exclusion:
          "Items of personal nature such as bar bills, alcoholic beverages, laundry, telephone calls, extra mileage, personal gratuities as tips to guide, porters, drivers etc",
      },
      {
        id: 4,
        Inclusion: `TRANSPORTATION: All ground transportation, using air-conditioned ${
          quotationData?.VehiclePreferenceName || "Innova Cresta"
        }`,
        Exclusion: "Any new tax imposed by the Govt",
      },
      {
        id: 5,
        Inclusion: guideDescriptions,
        Exclusion: "",
      },
      {
        id: 6,
        Inclusion:
          includedItems?.length > 0
            ? "Entrances to the monuments as mentioned in the program."
            : "",
        Exclusion:
          includedItems?.length === 0
            ? "Entrances to the monuments as mentioned in the program."
            : "",
      },
      {
        id: 7,
        Inclusion: activityItems
          ? `Following activities are included: ${activityItems}`
          : "",
        Exclusion:
          "Expenses incurred by re-routing, inclement weather, floods, famine, political disruptions, strikes, riots and other disturbances",
      },
      {
        id: 8,
        Inclusion: trainInclusion || "",
        Exclusion: "",
      },
      {
        id: 9,
        Inclusion: "Currently applicable taxes",
        Exclusion: "",
      },
    ];
  }, [quotationData]);

  // console.log(quotationData, "inclusionInitial452");

  // Initialize inclusionExclusionForm and apply shiftUpFields on mount
  useEffect(() => {
    if (quotationData?.Days) {
      setInclusionExclusionForm(shiftUpFields(inclusionInitial));
      setHasInitialized(true);
    }
  }, [quotationData, inclusionInitial]);

  // Fetch list data
  // useEffect(() => {
  //   const getListDataToServer = async () => {
  //     try {
  //       const { data } = await axiosOther.post("languagelist");
  //       setLanguageList(data?.DataList);
  //     } catch (error) {
  //       console.log("language-error", error);
  //     }
  //     try {
  //       const { data } = await axiosOther.post("getOverviewName");
  //       setOverViewList(data?.DataList);
  //     } catch (error) {
  //       console.log("overview-error", error);
  //     }
  //     try {
  //       const { data } = await axiosOther.post("fit-or-gitmasterlist");
  //       const filteredData = data?.Data?.filter((list) => list?.Type === "FIT");
  //       setFitList(filteredData || []);
  //     } catch (error) {
  //       console.log("overview-error", error);
  //     }
  //   };
  //   getListDataToServer();
  // }, []);

  // Inside the Policies component

  useEffect(() => {
    const getListDataToServer = async () => {
      try {
        const { data } = await axiosOther.post("languagelist");
        setLanguageList(data?.DataList);
      } catch (error) {
        console.log("language-error", error);
      }
      try {
        const { data } = await axiosOther.post("getOverviewName");
        setOverViewList(data?.DataList);
      } catch (error) {
        console.log("overview-error", error);
      }
      try {
        const { data } = await axiosOther.post("fit-or-gitmasterlist");
        const filteredData = data?.Data?.filter((list) => list?.Type === "FIT");
        const filteredDataGIT = data?.Data?.filter(
          (list) => list?.Type === "GIT"
        );
        console.log(filteredData, "filteredData");

        setFitList(filteredData || []);
        setGITList(filteredDataGIT || []);

        // Find the default FIT item with SetDefault: "Yes"
        const defaultFit = filteredData?.find(
          (item) => item.SetDefault === "Yes"
        );
        const defaultGit = filteredDataGIT?.find(
          (item) => item.SetDefault === "Yes"
        );
        // console.log(defaultGit, "defaultGit");

        if (defaultFit) {
          setFit(defaultFit.id); // Set the default FIT ID
          setLanguageSecond(1); // Assuming default language ID is 1, modify as needed
          // Trigger handleFitPolicy with the default FIT ID
          try {
            const { data: fitData } = await axiosOther.post(
              "fit-or-gitmasterlist",
              {
                Id: defaultFit.id,
                Type: "FIT",
                lauguageId: 1, // Adjust this based on your default language logic
              }
            );

            setFormValue({
              ...formValue,
              fit: fitData?.Data[0]?.LanguageData[0],
            });

            setFitDataFromApi(fitData?.Data);
          } catch (error) {
            console.log("fit-error", error);
          }
        }
        if (defaultGit) {
          setGit(defaultGit.id); // Set the default FIT ID
          setLanguageSecond(1);
          try {
            const { data: fitData } = await axiosOther.post(
              "fit-or-gitmasterlist",
              {
                Id: defaultGit.id,
                Type: "GIT",
                lauguageId: 1, // Adjust this based on your default language logic
              }
            );
            // console.log(fitData, "fitData");

            setFormValue({
              ...formValue,
              git: fitData?.Data[0]?.LanguageData[0],
            });

            setGITDataFromApi(fitData?.Data || {});
          } catch (error) {
            console.log("fit-error", error);
          }
        }
      } catch (error) {
        console.log("overview-error", error);
      }
    };
    getListDataToServer();
  }, []); // Empty dependency array to run once on mount

  // console.log("INCEXC753", quotationData);

  useEffect(() => {
    if (fitDataFromApi?.length > 0) {
      const fitData = fitDataFromApi[0];
      setFitPolicyForm({
        BookingPolicy: fitData?.LanguageData?.[0]?.BookingPolicy,
        CancellationPolicy: fitData?.LanguageData?.[0]?.Cancelation,
        Exclusion: fitData?.LanguageData?.[0]?.Exclusion,
        Inclusion: fitData?.LanguageData?.[0]?.Inclusion,
        PaymentPolicy: fitData?.LanguageData?.[0]?.PaymentTerm || "",
        Remarks: fitData?.LanguageData?.[0]?.Remarks || "",
        TermsNCondition: fitData?.LanguageData?.[0]?.TermsCondition || "",
        Overview: fitData?.LanguageData?.[0]?.OverviewName || "",
        TourHighlight: fitData?.LanguageData?.[0]?.Highlights || "",
        ItenararyIntroduction:
          fitData?.LanguageData?.[0]?.ItineraryIntroduction || "",
        ItenararySummery: fitData?.LanguageData?.[0]?.ItinerarySummary || "",
        Name: fitData?.Name,
        OptionalTour: fitData?.OptionalTour,
        ServiceUpgradation: fitData?.ServiceUpgradation,
        SetDefault: fitData?.SetDefault,
        Status: fitData?.Status,
        Type: fitData?.Type,
        id: fitData?.id,
      });

      dispatch(setPolicyData(fitPolicyForm));
    }
  }, [fitDataFromApi]);
  useEffect(() => {
    if (GITDataFromApi?.length > 0) {
      const fitData = GITDataFromApi[0];
      setFitPolicyForm({
        BookingPolicy: fitData?.LanguageData?.[0]?.BookingPolicy,
        CancellationPolicy: fitData?.LanguageData?.[0]?.Cancelation,
        Exclusion: fitData?.LanguageData?.[0]?.Exclusion,
        Inclusion: fitData?.LanguageData?.[0]?.Inclusion,
        PaymentPolicy: fitData?.LanguageData?.[0]?.PaymentTerm || "",
        Remarks: fitData?.LanguageData?.[0]?.Remarks || "",
        TermsNCondition: fitData?.LanguageData?.[0]?.TermsCondition || "",
        Overview: fitData?.LanguageData?.[0]?.OverviewName || "",
        TourHighlight: fitData?.LanguageData?.[0]?.Highlights || "",
        ItenararyIntroduction:
          fitData?.LanguageData?.[0]?.ItineraryIntroduction || "",
        ItenararySummery: fitData?.LanguageData?.[0]?.ItinerarySummary || "",
        Name: fitData?.Name,
        OptionalTour: fitData?.OptionalTour,
        ServiceUpgradation: fitData?.ServiceUpgradation,
        SetDefault: fitData?.SetDefault,
        Status: fitData?.Status,
        Type: fitData?.Type,
        id: fitData?.id,
      });

      dispatch(setPolicyData(fitPolicyForm));
    }
  }, [GITDataFromApi]);

  // Handle policy selection
  const handlePolicy = async () => {
    try {
      const { data } = await axiosOther.post("itineraryoverviewlist", {
        Id: overView,
        lauguageId: language,
        OverviewName: "",
        Status: "",
      });
      setFormValue({
        ...formValue,
        overviewId: data?.DataList[0]?.id,
        overView: data?.DataList[0]?.OverviewName,
      });
      dispatch(setPolicyData(formValue));
    } catch (error) {
      console.log("overview-error", error);
    }
  };

  const handleFitPolicy = async () => {
    try {
      if (qoutationData?.TourSummary?.PaxTypeName === "FIT") {
        const { data } = await axiosOther.post("fit-or-gitmasterlist", {
          Id: fit,
          Type: "FIT",
          lauguageId: languageSecond,
        });
        // console.log(data?.Data[0]?.LanguageData[0], "dataT666T");

        setFormValue((prev) => ({
          ...prev,
          fit: data?.Data[0]?.LanguageData[0],
        }));
        const newPolicyForm = {
          BookingPolicy:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.BookingPolicy
              : "",
          CancellationPolicy:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.Cancelation
              : "",
          Exclusion:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.Exclusion
              : "",
          Inclusion:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.Inclusion
              : "",
          PaymentPolicy:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.PaymentTerm
              : "",
          Remarks:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.Remarks
              : "",
          TermsNCondition:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.TermsCondition
              : "",
          Overview:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.OverviewName
              : "",
          TourHighlight:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.Highlights
              : "",
          ItenararyIntroduction:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.ItineraryIntroduction
              : "",
          ItenararySummery:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.ItinerarySummary
              : "",
        };
        setFitPolicyForm(newPolicyForm);
        dispatch(setPolicyData(newPolicyForm));
      } else if (qoutationData?.TourSummary?.PaxTypeName === "GIT") {
        const { data } = await axiosOther.post("fit-or-gitmasterlist", {
          Id: git,
          Type: "GIT",
          lauguageId: languageSecond,
        });
        // console.log(data?.Data[0]?.LanguageData[0], "dataT666T");

        setFormValue((prev) => ({
          ...prev,
          git: data?.Data[0]?.LanguageData[0],
        }));
        const newPolicyForm = {
          BookingPolicy:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.BookingPolicy
              : "",
          CancellationPolicy:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.Cancelation
              : "",
          Exclusion:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.Exclusion
              : "",
          Inclusion:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.Inclusion
              : "",
          PaymentPolicy:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.PaymentTerm
              : "",
          Remarks:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.Remarks
              : "",
          TermsNCondition:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.TermsCondition
              : "",
          Overview:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.OverviewName
              : "",
          TourHighlight:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.Highlights
              : "",
          ItenararyIntroduction:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.ItineraryIntroduction
              : "",
          ItenararySummery:
            Array.isArray(data?.Data) && data?.Data.length > 0
              ? data?.Data?.[0]?.LanguageData?.[0]?.ItinerarySummary
              : "",
        };
        setFitPolicyForm(newPolicyForm);
        dispatch(setPolicyData(newPolicyForm));
      }
    } catch (error) {
      console.log("fit-error", error);
    }
  };

  const overViewoptions = overViewList.map((item) => ({
    value: item.Id,
    label: item.Name,
  }));

  const languageoptions = languageList.map((item) => ({
    value: item.id,
    label: item.Name,
  }));

  const fitoptions = fitList.map((item) => ({
    value: item.id,
    label: item.Name,
  }));
  const gitoptions = GITList.map((item) => ({
    value: item.id,
    label: item.Name,
  }));

  const handleSelectChange = (selectedOption, name) => {
    switch (name) {
      case "fit":
        setFit(selectedOption.value);
        break;
      case "Git":
        setGit(selectedOption.value);
        break;
      case "overView":
        setOverView(selectedOption.value);
        break;
      case "language":
        setLanguage(selectedOption.value);
        break;
      default:
        setLanguageSecond(selectedOption.value);
    }
  };

  const handleToggle = (id) => {
    setEditorArray((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleChangeEditors = (name, value) => {
    setFitPolicyForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    dispatch(setPolicyData(fitPolicyForm));
  };

  const handleInclusionExclusionForm = (e, ind) => {
    const { name, value } = e.target;
    setInclusionExclusionForm((prevForm) => {
      let newForm = [...prevForm];
      newForm[ind] = { ...newForm[ind], [name]: value };
      return newForm;
    });
  };

  const handleToggleClick = (ind, name, isShow) => {
    setToggleTextArea({ name, index: ind, isShow });
  };

  const handleDecrementRow = (ind) => {
    setInclusionExclusionForm((prev) =>
      prev.filter((_, index) => index !== ind)
    );
  };

  const handleIncrementRow = (ind) => {
    setInclusionExclusionForm((prevArr) => {
      let newArr = [...prevArr];
      newArr.splice(ind + 1, 0, {
        id: Date.now() + ind,
        Inclusion: "",
        Exclusion: "",
      });
      return newArr;
    });
  };

  const getSummaryList = async () => {
    try {
      const { data } = await axiosOther.post("visa-summary-list");
      const convertedList = data?.Data?.map((list) => ({
        // isChecked: false,
        isChecked: list?.CountryName?.toLowerCase() === "india", // add this line
        Description: list?.Description,
        CountryName: list?.CountryName,
      }));
      setSummaryList(convertedList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSummaryList();
  }, []);

  // change checked
  const handleSummaryCheck = (e, ind) => {
    const { checked } = e.target;
    setSummaryList((prevArr) => {
      let newArr = [...prevArr];
      newArr[ind] = { ...newArr[ind], isChecked: checked };
      // Update "Select All" checkbox state based on whether all items are checked
      const allChecked = newArr.every((item) => item.isChecked);
      setCheckbox(allChecked);
      return newArr;
    });
  };
  // const handleSummaryCheck = (e, ind) => {
  //   const { checked } = e.target;
  //   setSummaryList((prevArr) => {
  //     let newArr = [...prevArr];
  //     newArr[ind] = { ...newArr[ind], isChecked: checked };
  //     return newArr;
  //   });
  // };

  const storeSummaryData = () => {
    const visa = summaryList?.filter((item) => item?.isChecked);
    const finalVisa = visa?.map((item) => ({
      Description: item?.Description || "",
      CountryName: item?.CountryName || "",
    }));
    const shiftedForm = shiftUpFields(inclusionExclusionForm);
    const inclusion = shiftedForm
      .filter((item) => item?.Inclusion) // skip empty
      .map((item) => {
        // Split on \n and wrap each line with <p>
        const html = item.Inclusion.split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => `<p>${line}</p>`)
          .join("");

        return { InclusionData: html };
      });
    const exclusion = shiftedForm
      .filter((item) => item?.Exclusion)
      .map((item) => {
        const html = item.Exclusion.split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => `<p>${line}</p>`)
          .join("");

        return { ExclusionData: html };
      });

    // console.log(inclusion, "INC51");
    // console.log(exclusion, "EXC956");

    dispatch(
      setSummaryIncAndExc({
        Inclusion: inclusion,
        Exclusion: exclusion,
      })
    );
    dispatch(setSummaryVisa(finalVisa));
    dispatch(setSubjectProgramName(subjectHeading));
  };

  // useEffect(() => {
  //   setSummaryList(summaryList.map((item) => ({ ...item, isChecked: true })));
  // }, [summaryList.length > 0]);

  // const handleCheck = (e) => {
  //   const { checked } = e.target;
  //   setCheckbox(checked);
  //   setSummaryList(summaryList.map((item) => ({ ...item, isChecked: checked })));
  // };
  const handleCheck = (e) => {
    const { checked } = e.target;
    setCheckbox(checked);
    setSummaryList((prevArr) =>
      prevArr.map((item) => ({
        ...item,
        isChecked: checked, // Toggle all checkboxes based on "Select All"
      }))
    );
  };
  // chnage checked

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setToggleTextArea({ name: "", index: "", isShow: false });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // console.log(
  //   qoutationData?.TourSummary?.PaxTypeName,
  //   "{qoutationData?.TourSummary?.PaxTypeName"
  // );
  // console.log(gitoptions, "gitoptions");

  return (
    <div className="container-fluid m-0 p-0">
      <div className="row align-items-end">
        <div className="col-lg-3 col-md-6 pl-0 mt-2">
          <div>
            <label>Program Name</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={subjectHeading}
              onChange={(e) => setSubjectHeading(e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-9 col-md-6">
          <div className="d-flex justify-content-end mt-2 mt-lg-0 gap-1">
            <button className="btn btn-dark btn-custom-size" onClick={onBack}>
              <span className="me-1">Back</span>
              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
            </button>
            <button
              className="btn btn-primary btn-custom-size"
              onClick={() => {
                storeSummaryData();
                onNext();
              }}
            >
              <span className="me-1">Next</span>
              <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="row my-2 mb-3">
        {qoutationData?.TourSummary?.PaxTypeName === "FIT" && (
          <div className="col-lg-3 col-md-6 pl-0 mt-2">
            <div>
              <label>Type</label>
              <Select
                name="fit"
                options={fitoptions}
                onChange={(fitoptions) => handleSelectChange(fitoptions, "fit")}
                value={fitoptions.find((option) => option.value === fit)}
                styles={customStylesTheme(background)}
                placeholder="Select"
              />
            </div>
          </div>
        )}

        {qoutationData?.TourSummary?.PaxTypeName === "GIT" && (
          <div className="col-lg-3 col-md-6 pl-0 mt-2">
            <div>
              <label>Type</label>
              <Select
                name="Git"
                options={gitoptions}
                onChange={(gitoptions) => handleSelectChange(gitoptions, "Git")}
                value={gitoptions.find((option) => option.value === git)}
                styles={customStylesTheme(background)}
                placeholder="Select"
              />
            </div>
          </div>
        )}

        <div className="col-lg-3 col-md-6 col-4 pl-0 mt-2">
          <div>
            <label className="m-0">Language</label>
            <Select
              name="languageSecond"
              options={languageoptions}
              onChange={(languageoptions) =>
                handleSelectChange(languageoptions, "languageSecond")
              }
              value={languageoptions.find(
                (option) => option.value === languageSecond
              )}
              styles={customStylesTheme(background)}
              placeholder="Select"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="col-2 col-md-4 d-flex align-items-end">
          <button
            className="btn btn-primary btn-custom-size"
            onClick={handleFitPolicy}
          >
            Select
          </button>
        </div>
      </div>
      {/* <div className="row my-2 mb-3">
        <div className="col-lg-3 col-md-6 pl-0 mt-2">
          <div>
            <label>Type</label>
            <Select
              name="fit"
              options={fitoptions}
              onChange={(fitoptions) => handleSelectChange(fitoptions, "fit")}
              value={fitoptions.find((option) => option.value === fit)}
              styles={customStylesTheme(background)}
              placeholder="Select"
            />
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-4 pl-0 mt-2">
          <div>
            <label className="m-0">Language</label>
            <Select
              name="languageSecond"
              options={languageoptions}
              onChange={(languageoptions) =>
                handleSelectChange(languageoptions, "languageSecond")
              }
              value={languageoptions.find(
                (option) => option.value === languageSecond
              )}
              styles={customStylesTheme(background)}
              placeholder="Select"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="col-2 col-md-4 d-flex align-items-end">
          <button
            className="btn btn-primary btn-custom-size"
            onClick={handleFitPolicy}
          >
            Select
          </button>
        </div>
      </div> */}
      <div
        className="row py-1 my-2 m-0 mb-3"
        style={{ background: "var(--rgba-primary-1) !important" }}
        onClick={() => handleToggle(2)}
      >
        <div className="col-12">
          <div className="d-flex justify-content-start gap-4 align-items-center justify-content-between">
            <div className="d-flex gap-2 align-items-center ms-5">
              <div className="square">
                <i className="fa-solid fa-circle" style={{ color: "red" }}></i>
              </div>
              <p className="m-0 text-black font-weight-bold font-size-12">
                Inclusion & Exclusion
              </p>
            </div>
            <div className="m-0 me-4">
              <i
                className={`fa-solid fs-4 cursor-pointer color-gray m-0 ${
                  editorArray.includes(2)
                    ? "fa-circle-chevron-up"
                    : "fa-circle-chevron-down"
                }`}
              ></i>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`row justify-content-center ${
          editorArray.includes(2) ? "d-none" : "d-block"
        }`}
      >
        <div className="col-12 px-5">
          <table className="table table-bordered itinerary-table itinerary-table-second mt-3">
            <thead>
              <tr>
                <th className="height-3rem align-middle fs-5 w-50">
                  Inclusion
                </th>
                <th className="height-3rem align-middle fs-5 w-50">
                  Exclusion
                </th>
                <th className="height-3rem align-middle">Action</th>
              </tr>
            </thead>
            <tbody>
              {inclusionExclusionForm.map((form, ind) => (
                <tr key={form.id}>
                  <td className="w-50">
                    <PerfectScrollbar
                      options={{ suppressScrollX: true }}
                      className="height-4rem"
                      style={{ resize: "vertical", overflow: "auto" }}
                      onClick={() => handleToggleClick(ind, "Inclusion", true)}
                    >
                      {toggleTextArea?.name === "Inclusion" &&
                      toggleTextArea?.index === ind &&
                      toggleTextArea?.isShow ? (
                        <textarea
                          ref={formRef}
                          name="Inclusion"
                          className="formControl1 w-100 h-100 p-2"
                          value={form?.Inclusion}
                          onChange={(e) => handleInclusionExclusionForm(e, ind)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="d-flex align-items-center justify-content-start h-100 px-2">
                          <span
                            className="text-start"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {form?.Inclusion}
                          </span>
                        </div>
                      )}
                    </PerfectScrollbar>
                  </td>
                  <td className="w-50">
                    <PerfectScrollbar
                      options={{ suppressScrollX: true }}
                      className="height-4rem"
                      style={{ resize: "vertical", overflow: "auto" }}
                      onClick={() => handleToggleClick(ind, "Exclusion", true)}
                    >
                      {toggleTextArea?.name === "Exclusion" &&
                      toggleTextArea?.index === ind &&
                      toggleTextArea?.isShow ? (
                        <textarea
                          ref={formRef}
                          name="Exclusion"
                          className="formControl1 w-100 h-100 p-2"
                          value={form?.Exclusion}
                          onChange={(e) => handleInclusionExclusionForm(e, ind)}
                        />
                      ) : (
                        <div className="d-flex align-items-center justify-content-start h-100 px-2">
                          <span className="text-start">{form?.Exclusion}</span>
                        </div>
                      )}
                    </PerfectScrollbar>
                  </td>
                  <td>
                    <div className="d-flex w-100 justify-content-center gap-2">
                      <span onClick={() => handleIncrementRow(ind)}>
                        <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                      </span>
                      <span onClick={() => handleDecrementRow(ind)}>
                        <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="row py-1 my-2 m-0 mb-3"
        style={{ background: "var(--rgba-primary-1) !important" }}
        onClick={() => handleToggle(1)}
      >
        <div className="col-12">
          <div className="d-flex justify-content-start gap-4 align-items-center justify-content-between">
            <div className="d-flex gap-2 align-items-center ms-5">
              <div className="square">
                <i className="fa-solid fa-circle" style={{ color: "red" }}></i>
              </div>
              <p className="m-0 font-weight-bold text-black font-size-12">
                Payment Policy & Cancellation Policy / Terms & Condition
              </p>
            </div>
            <div className="m-0 me-4">
              <i
                className={`fa-solid fs-4 cursor-pointer color-gray m-0 ${
                  editorArray.includes(1)
                    ? "fa-circle-chevron-up"
                    : "fa-circle-chevron-down"
                }`}
              ></i>
            </div>
          </div>
        </div>
      </div>
      <div
        id="1"
        className={`px-1 ${editorArray.includes(1) ? "d-none" : "d-block"}`}
      >
        <div className="row mt-2 policies">
          {/* <div className="col-lg-6">
          <label className="font-weight-bold">Overview</label>
          <CKEditor
            editor={ClassicEditor}
            data={fitPolicyForm?.Overview || ""}  
            onChange={(event, editor) => {
              const data = editor.getData();
              handleChangeEditors("Overview", data);
            }}
          />
        </div>
        <div className="col-lg-6">
          <label className="font-weight-bold">Tour Highlight</label>
          <CKEditor
            editor={ClassicEditor}
            data={fitPolicyForm?.TourHighlight || ""}
            onChange={(event, editor) => {
              const data = editor.getData();
              handleChangeEditors("TourHighlight", data);
            }}
          />
        </div>
        <div className="col-lg-6">
          <label>Itenarary Introduction</label>
          <CKEditor
            editor={ClassicEditor}
            data={fitPolicyForm?.ItenararyIntroduction || ""}
            onChange={(event, editor) => {
              const data = editor.getData();
              handleChangeEditors("ItenararyIntroduction", data);
            }}
          />
        </div>
        <div className="col-lg-6">
          <label>Itenarary Summary</label>
          <CKEditor
            editor={ClassicEditor}
            data={fitPolicyForm?.ItenararySummery || ""}
            onChange={(event, editor) => {
              const data = editor.getData();
              handleChangeEditors("ItenararySummery", data);
            }}
          />
        </div> */}
          {/* <div className="col-lg-6">
            <label className="font-weight-bold">Payment Policy</label>
            <CKEditor
              editor={ClassicEditor}
              data={fitPolicyForm?.PaymentPolicy || ""}
              onChange={(event, editor) => {
                const data = editor.getData();
                handleChangeEditors("PaymentPolicy", data);
              }}
            />
          </div> */}
          <div className="col-lg-6 mt-2">
            <label className="font-weight-bold">Terms & Condition</label>
            <CKEditor
              editor={ClassicEditor}
              data={fitPolicyForm?.TermsNCondition || ""}
              onChange={(event, editor) => {
                const data = editor.getData();
                handleChangeEditors("TermsNCondition", data);
              }}
            />
          </div>
          <div className="col-lg-6">
            <label className="font-weight-bold">Booking Policy</label>
            <CKEditor
              editor={ClassicEditor}
              data={fitPolicyForm?.BookingPolicy || ""}
              onChange={(event, editor) => {
                const data = editor.getData();
                handleChangeEditors("BookingPolicy", data);
              }}
            />
          </div>
          <div className="col-lg-6">
            <label className="font-weight-bold">Cancellation Policy</label>
            <CKEditor
              editor={ClassicEditor}
              data={fitPolicyForm?.CancellationPolicy || ""}
              onChange={(event, editor) => {
                const data = editor.getData();
                handleChangeEditors("CancellationPolicy", data);
              }}
            />
          </div>
          <div className="col-lg-6 mt-2">
            <label className="font-weight-bold">Remarks</label>
            <CKEditor
              editor={ClassicEditor}
              data={fitPolicyForm?.Remarks || ""}
              onChange={(event, editor) => {
                const data = editor.getData();
                handleChangeEditors("Remarks", data);
              }}
            />
          </div>

          {/* <div className="col-lg-6 mt-2">
            <label className="font-weight-bold">Payment Policy</label>
            <CKEditor
              editor={ClassicEditor}
              data={fitPolicyForm?.PaymentPolicy || ""}
              onChange={(event, editor) => {
                const data = editor.getData();
                handleChangeEditors("PaymentPolicy", data);
              }}
            />
          </div> */}
        </div>
      </div>

      <div
        className="row py-1 my-2 m-0 mb-3"
        style={{ background: "var(--rgba-primary-1) !important" }}
        onClick={() => handleToggle(3)}
      >
        <div className="col-12">
          <div className="d-flex justify-content-start gap-4 align-items-center justify-content-between">
            <div className="d-flex gap-2 align-items-center ms-5">
              <div className="square">
                <i className="fa-solid fa-circle" style={{ color: "red" }}></i>
              </div>
              <p className="m-0 font-weight-bold text-black font-size-12">
                Visa
              </p>
            </div>
            <div className="m-0 me-4">
              <i
                className={`fa-solid fs-4 cursor-pointer color-gray m-0 ${
                  editorArray.includes(3)
                    ? "fa-circle-chevron-up"
                    : "fa-circle-chevron-down"
                }`}
              ></i>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`row justify-content-center ${
          editorArray.includes(3) ? "d-none" : "d-block"
        }`}
      >
        <p className="m-0 font-weight-bold text-black font-size-12"></p>
        <div className="col-12 px-5">
          <table className="table table-bordered itinerary-table itinerary-table-second mt-3">
            <thead>
              <tr>
                <th
                  className="height-3rem align-middle"
                  style={{ width: "1rem" }}
                >
                  <span className="form-check check-sm d-flex align-items-center justify-content-center">
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                      checked={checkbox}
                      onChange={handleCheck}
                    />
                  </span>
                </th>
                <th className="height-3rem align-middle fs-5">City</th>
                <th className="height-3rem align-middle fs-5 w-50">Visa</th>
              </tr>
            </thead>
            <tbody>
              {summaryList?.map((list, ind) => (
                <tr key={ind + 1}>
                  <td style={{ width: "1rem" }}>
                    <div className="form-check check-sm d-flex align-items-center justify-content-center">
                      <input
                        type="checkbox"
                        className="form-check-input height-em-1 width-em-1"
                        id={`check-${ind}`}
                        checked={list?.isChecked}
                        onChange={(e) => handleSummaryCheck(e, ind)}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="minWidth5rem">{list?.CountryName}</div>
                  </td>
                  <td className="w-100">
                    <div className="height-3rem">
                      <div className="d-flex align-items-center h-100 px-2">
                        <span className="text-start">{list?.Description}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className={`px-5 ${editorArray.includes(3) ? "d-none" : "d-block"}`}
        id="3"
      >
        <div className="row mt-2 policies">
          {/* <div className="col-lg-6 mt-2">
            <label className="font-weight-bold">Inclusive</label>
            <CKEditor
              editor={ClassicEditor}
              data={fitPolicyForm?.Inclusion || ""}
              onChange={(event, editor) => {
                const data = editor.getData();
                handleChangeEditors("Inclusion", data);
              }}
            />
          </div>
          <div className="col-lg-6 mt-2">
            <label className="font-weight-bold">Exclusive</label>
            <CKEditor
              editor={ClassicEditor}
              data={fitPolicyForm?.Exclusion || ""}
              onChange={(event, editor) => {
                const data = editor.getData();
                handleChangeEditors("Exclusion", data);
              }}
            />
          </div> */}
        </div>
      </div>
      <div className="d-flex justify-content-end m-1 my-2 gap-1">
        <button className="btn btn-dark btn-custom-size" onClick={onBack}>
          <span className="me-1">Back</span>
          <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
        </button>
        <button
          className="btn btn-primary btn-custom-size"
          onClick={() => {
            storeSummaryData();
            onNext();
          }}
        >
          <span className="me-1">Next</span>
          <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
        </button>
      </div>
    </div>
  );
};

export default Policies;
