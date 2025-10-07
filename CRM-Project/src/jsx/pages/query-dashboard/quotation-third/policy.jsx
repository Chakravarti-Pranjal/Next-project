import React, { useContext, useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { axiosOther } from "../../../../http/axios_base_url";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  setPolicyData,
  setSummaryIncAndExc,
  setSummaryVisa,
} from "../../../../store/actions/queryAction";
import { select_customStyles } from "../../../../css/custom_style";
import { ThemeContext } from "../../../../context/ThemeContext";

const customStyles = {
  control: (provided) => ({
    width: "auto", // Set to 'auto' for responsive width
    minHeight: "20px", // Minimum height
    height: "25px", // Fixed height
    padding: "0px", // Remove default padding
    border: "1px solid #d3d3d3", // Border to define control
    background: "#2e2e40",
    color: "#fff",
    borderRadius: "0.5rem",
    "&:hover": {
      border: "1px solid #aaa",
      background: "#2e2e40",
    },
  }),
  valueContainer: (provided) => ({
    // ...provided,
    padding: "0px", // Remove padding
    paddingLeft: "4px",
    height: "25px", // Match height
    display: "flex",
    alignItems: "center", // Center content vertically
    justifyContent: "center", // Center content horizontally
  }),
  placeholder: (provided) => ({
    // ...provided,
    margin: "0", // Adjust placeholder margin
    fontSize: "0.76562rem", // Adjust font size as needed
    textAlign: "center", // Center text horizontally
    flex: 1, // Allow placeholder to take available space
  }),
  singleValue: (provided) => ({
    // ...provided,
    margin: "0", // Adjust single value margin
    fontSize: "0.76562rem", // Adjust font size as needed
  }),
  dropdownIndicator: (provided) => ({
    // ...provided,
    display: "none", // Hide the dropdown indicator (icon)
  }),
  option: (provided) => ({
    ...provided,
    padding: "4px 1px", // Padding for options
    fontSize: "0.76562rem", // Adjust font size as needed
    overflow: "hidden", // Prevent overflow
    paddingLeft: "4px",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999, // Ensure the dropdown appears above other elements
    overflowY: "hidden", // Hide vertical scrollbar
    overflowX: "hidden", // Hide horizontal scrollbar
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "150px", // Set maximum height for list
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      display: "none", // Hide scrollbar for Chrome/Safari
      width: "2px",
    },
  }),
};
//   {
//     Inclusion: "Accommodation based on sharing a double /twin room ",
//     Exclusion: "Any airfares, excess baggage",
//   },
//   {
//     Inclusion: "Daily Breakfast.",
//     Exclusion:
//       "EItems of personal nature such as bar bills, alcoholic beverages, laundry, telephone calls, extra mileage, personal gratuities as tips to guide, porters, drivers etc",
//   },
//   {
//     Inclusion: `TRANSPORTATION: All ground transportation, as detailed in the itinerary using air-conditioned ${TransferName} / similar as the itinerary.`,
//     Exclusion: "Any new tax imposed by the Govt",
//   },
//   {
//     Inclusion: "German speaking guide",
//     Exclusion: "Any new tax imposed by the Govt",
//   },
//   {
//     Inclusion: "Entrances to the sites as mentioned in the program",
//     Exclusion:
//       "Expenses incurred by re-routing, inclement weather, floods, famine, political disruptions, strikes, riots and other disturbances",
//   },
//   {
//     Inclusion: "Following activities are included",
//     Exclusion: "",
//   },
//   {
//     Inclusion: "Currently applicable taxes",
//     Exclusion: "",
//   },
// ];
const inclusionInitial = [
  {
    Inclusion: "Accommodation based on sharing a double /twin room ",
    Exclusion: "Any airfares, excess baggage",
  },
  {
    Inclusion: "Daily Breakfast.",
    Exclusion:
      "EItems of personal nature such as bar bills, alcoholic beverages, laundry, telephone calls, extra mileage, personal gratuities as tips to guide, porters, drivers etc",
  },
  {
    Inclusion: `TRANSPORTATION: All ground transportation, as detailed in the itinerary using air-conditioned / similar as the itinerary.`,
    Exclusion: "Any new tax imposed by the Govt",
  },
  {
    Inclusion: "German speaking guide",
    Exclusion: "Any new tax imposed by the Govt",
  },
  {
    Inclusion: "Entrances to the sites as mentioned in the program",
    Exclusion:
      "Expenses incurred by re-routing, inclement weather, floods, famine, political disruptions, strikes, riots and other disturbances",
  },
  {
    Inclusion: "Following activities are included",
    Exclusion: "",
  },
  {
    Inclusion: "Currently applicable taxes",
    Exclusion: "",
  },
];
const Policies = ({ onNext, onBack }) => {
  const { qoutationData, itineryHeading } = useSelector(
    (data) => data?.queryReducer
  );

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
  const [editorArray, setEditorArray] = useState([]);
  const [overView, setOverView] = useState("");
  const [fit, setFit] = useState("");
  const [languageSecond, setLanguageSecond] = useState(20);
  const [language, setLanguage] = useState(20);
  const [checkbox, setCheckbox] = useState(true);
  const dispatch = useDispatch();

  const { background } = useContext(ThemeContext);
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
  const [inclusionExclusionForm, setInclusionExclusionForm] =
    useState(inclusionInitial);
  const [summaryList, setSummaryList] = useState([]);
  const [toggleTextArea, setToggleTextArea] = useState({
    name: "",
    index: "",
    isShow: false,
  });

  const formRef = useRef();

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
      const filteredData = data?.Data?.filter((list) => list?.Type == "FIT");
      setFitList(filteredData || []);
    } catch (error) {
      console.log("overview-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

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
        overView: data?.DataList[0]?.LanguageData,
      });

      dispatch(setPolicyData(formValue));
    } catch (error) {
      console.log("overview-error", error);
    }
  };

  const handleFitPolicy = async () => {
    try {
      const { data } = await axiosOther.post("fitmasterlist", {
        Id: fit,
        lauguageId: languageSecond,
      });
      setFormValue({
        ...formValue,
        fit: data?.ItineraryInfoMaster,
      });
      setFitPolicyForm({
        CancellationPolicy:
          data?.ItineraryInfoMaster.length > 0
            ? data?.ItineraryInfoMaster[0]?.Cancelation
            : "",
        Exclusion:
          data?.ItineraryInfoMaster.length > 0
            ? data?.ItineraryInfoMaster[0]?.Exclusion
            : "",
        Inclusion:
          data?.ItineraryInfoMaster.length > 0
            ? data?.ItineraryInfoMaster[0]?.Inclusion
            : "",
        PaymentPolicy:
          data?.ItineraryInfoMaster.length > 0
            ? data?.ItineraryInfoMaster[0]?.PaymentPolicy
            : "",
        Remarks:
          data?.ItineraryInfoMaster.length > 0
            ? data?.ItineraryInfoMaster[0]?.Remarks
            : "",
        TermsNCondition:
          data?.ItineraryInfoMaster.length > 0
            ? data?.ItineraryInfoMaster[0]?.TermsCondition
            : "",
        Overview:
          data?.ItineraryInfoMaster.length > 0
            ? data?.ItineraryInfoMaster[0].Overview
            : "",
        TourHighlight:
          data?.ItineraryInfoMaster.length > 0
            ? data?.ItineraryInfoMaster[0].TourHighlight
            : "",
        ItenararyIntroduction:
          data?.ItineraryInfoMaster.length > 0
            ? data?.ItineraryInfoMaster[0].ItenararyIntroduction
            : "",
        ItenararySummery:
          data?.ItineraryInfoMaster.length > 0
            ? data?.ItineraryInfoMaster[0].ItenararySummery
            : "",
      });
      dispatch(setPolicyData(formValue));
    } catch (error) {
      console.log("fit-error", error);
    }
  };

  console.log("fit Policy", fitPolicyForm)

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

  const handleSelectChange = (selectedOption, name) => {
    switch (name) {
      case "fit":
        setFit(selectedOption.value);
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

  const handleToggle = (id, e) => {
    let arr = [...editorArray];
    if (arr.includes(id)) {
      let index = arr.indexOf(id);
      arr.splice(index, 1);
    } else {
      arr.push(id);
    }
    setEditorArray(arr);
  };

  const handleChangeEditors = (name, value) => {
    setFitPolicyForm((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleInclusionExclusionForm = (e, ind) => {
    const { name, value } = e.target;
    setInclusionExclusionForm((prevForm) => {
      let newForm = [...prevForm];
      newForm[ind] = { ...newForm[ind], [name]: value };
      return newForm;
    });
  };

  const handleToggleClick = (Ind, Name, IsShow) => {
    setToggleTextArea({
      name: Name,
      index: Ind,
      isShow: IsShow,
    });
  };

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
  }, [formRef]);

  const handleDecrementRow = (ind) => {
    const filteredArr = inclusionExclusionForm.filter(
      (form, index) => index != ind
    );
    setInclusionExclusionForm(filteredArr);
  };

  const handleIncrementRow = (ind) => {
    setInclusionExclusionForm((prevArr) => {
      let newArr = [...prevArr];
      newArr.splice(ind + 1, 0, { Inclusion: "", Exlusion: "" });
      return newArr;
    });
  };

  const getSummaryList = async () => {
    try {
      const { data } = await axiosOther.post("visa-summary-list");
      const convertedList = data?.Data?.map((list) => ({
        isChecked: false,
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

  const handleSummaryCheck = (e, ind) => {
    const { checked } = e.target;
    setSummaryList((prevArr) => {
      let newArr = [...prevArr];
      newArr[ind] = { ...newArr[ind], isChecked: checked };
      return newArr;
    });
  };

  const storeSummaryData = () => {
    const visa = summaryList?.filter((item) => item?.isChecked);
    const finalVisa = visa?.map((item) => ({
      Description: item?.Description || "",
      CountryName: item?.CountryName || "",
    }));
    const inclusion = inclusionExclusionForm?.map((item) => ({
      InclusionData: item?.Inclusion || "",
    }));
    const exclusion = inclusionExclusionForm?.map((item) => ({
      ExclusionData: item?.Exclusion || "",
    }));
    dispatch(
      setSummaryIncAndExc({
        Inclusion: inclusion,
        Exclusion: exclusion,
      })
    );
    dispatch(setSummaryVisa(finalVisa));
  };

  useEffect(() => {
    const updatedForm = inclusionExclusionForm?.map((form, ind) => {
      if (ind == 2) {
        {
        }
      } else {
        return form;
      }
    });
  }, []);

  useEffect(() => {
    setSummaryList(summaryList.map((item) => ({ ...item, isChecked: true })));
  }, [summaryList.length > 0]); // updating the summary list

  const handleCheck = (e) => {
    // updating the summary list
    const { checked } = e.target;
    setCheckbox(checked);
    setSummaryList(
      summaryList.map((item) => ({ ...item, isChecked: checked }))
    );
  };

  return (
    <>
      <div className="container-fluid mt-3  m-0 p-0 ">
        <div className="d-flex justify-content-end m-1 my-2 gap-1">
          <button
            className="btn btn-dark btn-custom-size"
            name="SaveButton"
            onClick={onBack}
          >
            <span className="me-1">Back</span>
            <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
          </button>
          <button
            className="btn btn-primary btn-custom-size"
            name="SaveButton"
            onClick={() => {
              onNext(), storeSummaryData();
            }}
          >
            <span className="me-1">Next</span>
            <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
          </button>
        </div>
        <div
          className="row    py-1 my-2 m-0 mb-3"
          style={{ background: " var(--rgba-primary-1) !important" }}
        >
          <div className="col-12">
            <div className="d-flex justify-content-start gap-4 align-items-center">
              <div className="d-flex gap-2 align-items-center ms-5">
                <div className="square">
                  <i class="fa-solid fa-circle" style={{ color: "red" }}></i>
                </div>
                <p className="m-0 text-black font-weight-bold  font-size-12  ">
                  Overview & Others
                </p>
              </div>
              <div className="m-0" onClick={() => handleToggle(1)}>
                <i className="fa-solid fa-circle-chevron-down fs-4 cursor-pointer color-gray m-0"></i>
              </div>
            </div>
          </div>
        </div>
        <div
          id="1"
          className={` px-5  ${editorArray.includes(1) ? "d-none" : "d-block"}`}
        >
          <div className="row my-2">
            <div className="col-lg-3 col-md-6  col-5 pl-0 mt-2">
              <div>
                <label>Overview Name</label>
                <Select
                  name="overView"
                  id=""
                  options={overViewoptions}
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "overView")
                  }
                  value={overViewList?.find(
                    (option) => option.value === overView
                  )}
                  styles={customStyles}
                  placeholder="Select"
                  autocomplete="off"
                ></Select>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-4 pl-0 mt-2">
              <div>
                <label htmlFor="" className="m-0">
                  Language Type
                </label>
                <Select
                  name="language"
                  id=""
                  options={languageoptions}
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "language")
                  }
                  value={languageList?.find(
                    (option) => option.value === language
                  )}
                  styles={customStyles}
                  placeholder="Default"
                  autocomplete="off"
                ></Select>
              </div>
            </div>
            <div className="col-2 col-md-4 d-flex align-items-end">
              <button
                type="submit"
                className="btn btn-primary btn-custom-size"
                onClick={handlePolicy}
              >
                Select
              </button>
            </div>
          </div>

          <div className="row mt-2 policies">
            <div className="col-lg-6">
              <label className="font-weight-bold">Overview</label>

              {/* <CKEditor
                editor={ClassicEditor}
                data={formValue?.overView?.[0]?.OverviewName ?? ""}
                name="Description"
                onChange={(event, editor) => {
                  const data = editor.getData();
                  handleOverview(data);
                }}
              /> */}
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
              {/* <CKEditor
                editor={ClassicEditor}
                data={formValue?.overView?.[0]?.Highlights ?? ""}
                // data={""}
                name="Description"
                onChange={(event, editor) => {
                  const data = editor.getData();
                  hanldeTourHighlight(data);
                }}
              /> */}
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
              {/* <CKEditor
                editor={ClassicEditor}
                data={formValue?.overView?.[0]?.ItineraryIntroduction ?? ""}
                name="Description"
                onChange={(event, editor) => {
                  const data = editor.getData();
                  hanldeItenararyIntroduction(data);
                }}
              /> */}
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
              {/* <CKEditor
                editor={ClassicEditor}
                data={formValue?.overView?.[0]?.ItinerarySummary ?? ""}
                name="Description"
                onChange={(event, editor) => {
                  const data = editor.getData();
                  hanldeItenararySummary(data);
                }}
              /> */}
              <CKEditor
                editor={ClassicEditor}
                data={fitPolicyForm?.ItenararySummery || ""}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  handleChangeEditors("ItenararySummery", data);
                }}
              />
            </div>
          </div>
        </div>
        <div
          className="row py-1 my-2 m-0 mb-3"
          style={{ background: " var(--rgba-primary-1) !important" }}
        >
          <div className="col-12">
            <div className="d-flex justify-content-start gap-4 align-items-center">
              <div className="d-flex gap-2 align-items-center ms-5">
                <div className="square">
                  <i class="fa-solid fa-circle" style={{ color: "red" }}></i>
                </div>
                <p className="m-0  font-weight-bold text-black font-size-12">
                  Payment Policy & Cancellation Policiy
                </p>
              </div>
              <div className="m-0" onClick={() => handleToggle(2)}>
                <i className="fa-solid fa-circle-chevron-down fs-4 cursor-pointer color-gray m-0"></i>
              </div>
            </div>
          </div>
        </div>
        <div
          id="2"
          className={`px-5 ${editorArray.includes(2) ? "d-none" : "d-block"}`}
        >
          <div className="row my-2">
            <div className="col-lg-3 col-md-6  col-5 pl-0 mt-2">
              <div>
                <label>FIT Type</label>
                <Select
                  name="fit"
                  id=""
                  options={fitoptions}
                  onChange={(fitoptions) =>
                    handleSelectChange(fitoptions, "fit")
                  }
                  value={fitList?.find((option) => option.value === "fit")}
                  styles={select_customStyles(background)}
                  placeholder="Select"
                ></Select>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-4 pl-0 mt-2">
              <div>
                <label htmlFor="" className="m-0">
                  Language Type
                </label>
                <Select
                  name="languageSecond"
                  id=""
                  options={languageoptions}
                  onChange={(languageoptions) =>
                    handleSelectChange(languageoptions, "languageSecond")
                  }
                  value={fitList?.find(
                    (option) => option.value === languageSecond
                  )}
                  styles={customStyles}
                  placeholder="Default"
                  autocomplete="off"
                ></Select>
              </div>
            </div>
            <div className="col-2 col-md-4 d-flex align-items-end">
              <button
                type="submit"
                className="btn btn-primary btn-custom-size"
                onClick={handleFitPolicy}
              >
                Select
              </button>
            </div>
          </div>
          <div className="row mt-2 policies">
            <div className="col-lg-6 ">
              <label className="font-weight-bold ">Payment Policy</label>
              <CKEditor
                editor={ClassicEditor}
                data={fitPolicyForm?.PaymentPolicy || ""}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  handleChangeEditors("PaymentPolicy", data);
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
          </div>
        </div>
        <div
          className="row   py-1 my-2 m-0 mb-3"
          style={{ background: " var(--rgba-primary-1) !important" }}
        >
          <div className="col-12">
            <div className="d-flex justify-content-start gap-4 align-items-center">
              <div className="d-flex gap-2 align-items-center ms-5">
                <div className="square">
                  <i class="fa-solid fa-circle" style={{ color: "red" }}></i>
                </div>
                <p className="m-0 text-black font-weight-bold  font-size-12">
                  Inc. & Exc / Terms & Condition
                </p>
              </div>
              <div className="m-0" onClick={() => handleToggle(3)}>
                <i className="fa-solid fa-circle-chevron-down fs-4 cursor-pointer color-gray m-0"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 px-5">
            <div>
              <table class="table table-bordered itinerary-table itinerary-table-second mt-3">
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
                  {inclusionExclusionForm?.map((form, ind) => {
                    return (
                      <tr key={ind + 1}>
                        <td className="w-50">
                          <div
                            className="height-3rem"
                            onClick={() =>
                              handleToggleClick(ind, "Inclusion", true)
                            }
                          >
                            {toggleTextArea?.name == "Inclusion" &&
                              toggleTextArea?.index == ind &&
                              toggleTextArea?.isShow ? (
                              <textarea
                                ref={formRef}
                                name="Inclusion"
                                className="formControl1 w-100 h-100 p-2"
                                value={form?.Inclusion}
                                onChange={(e) =>
                                  handleInclusionExclusionForm(e, ind)
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <div className="d-flex align-items-center justify-contetn-center h-100 px-2">
                                <span className="text-start">
                                  {form?.Inclusion}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="w-50">
                          <div
                            className="height-3rem"
                            onClick={() =>
                              handleToggleClick(ind, "Exclusion", true)
                            }
                          >
                            {toggleTextArea?.name == "Exclusion" &&
                              toggleTextArea?.index == ind &&
                              toggleTextArea?.isShow ? (
                              <textarea
                                ref={formRef}
                                name="Exclusion"
                                className="formControl1 w-100 h-100 p-2"
                                value={form?.Exclusion}
                                onChange={(e) =>
                                  handleInclusionExclusionForm(e, ind)
                                }
                              />
                            ) : (
                              <div className="d-flex align-items-center justify-content-start h-100 px-2">
                                <span className="text-start">
                                  {form?.Exclusion}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex w-100 justify-content-center gap-2 ">
                            <span onClick={() => handleIncrementRow(ind)}>
                              <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                            <span onClick={() => handleDecrementRow(ind)}>
                              <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 px-5">
            <div>
              <table class="table table-bordered itinerary-table itinerary-table-second mt-3">
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
                          onChange={(e) => handleCheck(e)}
                        />
                      </span>
                    </th>
                    <th className="height-3rem align-middle fs-5">City</th>
                    <th className="height-3rem align-middle fs-5 w-50">Visa</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryList?.map((list, ind) => {
                    return (
                      <tr key={ind + 1}>
                        <td style={{ width: "1rem" }}>
                          <div className="form-check check-sm d-flex align-items-center justify-content-center">
                            <input
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              id={`check-${ind}`}
                              value="extrabed"
                              checked={list?.isChecked}
                              onChange={(e) => handleSummaryCheck(e, ind)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="minWidth5rem">
                            {list?.CountryName}
                          </div>
                        </td>
                        <td className="w-100">
                          <div className="height-3rem">
                            <div className="d-flex align-items-center h-100 px-2">
                              <span className="text-start">
                                {list?.Description}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div
          className={`px-5   ${editorArray.includes(3) ? "d-none" : "d-block"}`}
          id="3"
        >
          <div className="row mt-2 policies">
            <div className="col-lg-6 mt-2">
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
            <div className="col-lg-6 mt-2">
              <label className="font-weight-bold ">Terms & Condition</label>
              <CKEditor
                editor={ClassicEditor}
                data={fitPolicyForm?.TermsNCondition || ""}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  handleChangeEditors("TermsNCondition", data);
                }}
              />
            </div>
            <div className="col-lg-6 mt-2">
              <label className="font-weight-bold">Payment Policy</label>
              <CKEditor
                editor={ClassicEditor}
                data={fitPolicyForm?.PaymentPolicy || ""}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  handleChangeEditors("PaymentPolicy", data);
                }}
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end m-1 my-2 gap-1">
          <button
            className="btn btn-dark btn-custom-size"
            name="SaveButton"
            onClick={onBack}
          >
            <span className="me-1">Back</span>
            <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
          </button>
          <button
            className="btn btn-primary btn-custom-size"
            name="SaveButton"
            onClick={() => {
              onNext(), storeSummaryData();
            }}
          >
            <span className="me-1">Next</span>
            <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default Policies;
