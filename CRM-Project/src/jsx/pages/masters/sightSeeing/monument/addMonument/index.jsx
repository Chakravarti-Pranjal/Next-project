import React, { useState, useEffect } from "react";
import { monumentValidatinSchema } from "../../../master_validation";
import { monumentInitialValue } from "../../../masters_initial_value";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMultipleSelect from "../../../../../../hooks/custom_hooks/useMultipleSelect";
import { axiosOther } from "../../../../../../http/axios_base_url";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { country_head } from "../../head_columns.js";
import { useTable, useSortBy } from "react-table";
import "../../../../../../scss/main.css";
import { Button, Table } from "react-bootstrap";
import { Toaster } from "react-hot-toast";
import {
  notifySuccess,
  notifyError,
  notifyHotSuccess,
} from "../../../../../../helper/notify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useImageContainer from "../../../../../../helper/useImageContainer";
import useSingleImageContainer from "../../../../../../helper/useSingleImageContainer";
const languageDescObj = [
  {
    id: "",
    description: "",
  },
  {
    id: "",
    description: "",
  },
  {
    id: "",
    description: "",
  },
];
const weekendDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AddMonument = () => {
  const [formValue, setFormValue] = useState(monumentInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  //   const [cityList, setCityList] = useState([]);
  const [weekendDaysValue, setWeekendDaysValue] = useState([]);
  const [weekendList, setWeekendList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);

  const [monumentList, setMonumentList] = useState([]);
  const [descriptionForm, setDescriptionForm] = useState(languageDescObj);
  const [languageList, setLanguageList] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [showEditor, setShowEditor] = useState({});
  const [newTableData, setNewTableData] = useState([]); // State for the new table data
  const { state } = useLocation();
  console.log(state, "state-46");
  const [monuemntId, setMonumentId] = useState("");
  const navigate = useNavigate();

  //  useEffect(() => {
  //     if (languageList.length > 0) {
  //       const langForm = languageDescription?.map((form,index) => {
  //         const langId = languageList[index];
  //         return {
  //           ...form,
  //           id: langId?.id
  //         }
  //       })
  //       setLangaugeDescription(langForm);

  //     }
  //   },[languageList])

  const {
    ImageContainer,
    multiFiles,
    setMultiFiles,
    handleFilesChange,
    multiImageData,
  } = useImageContainer();
  // console.log('image-value',multiImageData);

  const getMonumentListAPI = async () => {
    try {
      const { data } = await axiosOther.post("monumentmasterlist");
      setMonumentList(data?.DataList);
    } catch (error) {
      console.log("Error fetching monument data:", error);
    }
  };
  const handleShowDescription = () => {
    setShowDescription(true); // Set to true to show the div
    getMonumentListAPI();
  };
  // get list for dropdown
  const getDataToServer = async () => {
    try {
      const countryData = await axiosOther.post("destinationlist", {
        Search: "",
        Status: 1,
      });
      setCountryList(countryData.data.DataList);
    } catch (err) {
      console.log(err);
    }

    try {
      const stateData = await axiosOther.post("statelist", {
        Search: "",
        Status: 1,
      });
      setStateList(stateData.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const weekend = await axiosOther.post("weekendlist", {
        Search: "",
        Status: 1,
      });
      setWeekendList(weekend.data.DataList);
    } catch (err) {
      console.log("Erro Occured", err);
    }

    try {
      const destination = await axiosOther.post("destinationlist", {
        Search: "",
        Status: 1,
      });
      setDestinationList(destination.data.DataList);
    } catch (err) {
      console.log(err);
    }

    try {
      const data = await axiosOther.post("languagelist", {});
      setLanguageList(data.data.DataList);
      // console.log(data.data.DataList,"lanngg")
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getDataToServer();
  }, []);

  // const handleAddButtonClick = () => {
  //   if (formValue?.Description && languageDescription?.length > 0) {
  //     const newEntries = languageDescription.map((desc) => {
  //       const matchedLanguage = languageList.find(
  //         (lang) => lang.id === desc.id
  //       );

  //       return {
  //         language: matchedLanguage ? matchedLanguage.Name : "N/A", // Use "N/A" if no match found
  //         description: formValue.Description,
  //       };
  //     });

  //     // Update the state with the new entries
  //     setNewTableData((prevData) => [...prevData, ...newEntries]);
  //   } else {
  //     alert("Please select a language and provide a description.");
  //   }
  // };

  const handleRemoveDescription = () => {
    setShowDescription(false); // Set to false to hide the div
  };

  // const languageOption = languageList?.map((lang) => {
  //   return {
  //     value: lang?.id,
  //     label: lang?.Name,
  //   };
  // });

  // const {
  //   SelectInput: LanguageInput,
  //   selectedData: languageSelected,
  //   setSelectedData: setLanguageSelected,
  // } = useMultipleSelect(languageOption);

  const falseList = ["UNESCO", "ASI", "Private ONED"];
  const handleWeekendDaysValue = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setWeekendDaysValue([...weekendDaysValue, value]);
    } else {
      const filteredDays = weekendDaysValue.filter((day) => day !== value);
      setWeekendDaysValue(filteredDays);
    }
  };
  // submitting data to server

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await monumentValidatinSchema.validate(
        {
          ...formValue,
        },
        { abortEarly: false }
      );

      setValidationErrors({});

      const base64Images = multiImageData.map((img, index) => ({
        image_name: `Image${index + 1}`, // Assign unique names
        image_path: img.imgString.includes(",")
          ? img.imgString.split(",")[1]
          : img.imgString, // Remove metadata if needed
      }));

      const { data } = await axiosOther.post("addupdatemonumentmaster", {
        ...formValue,
        Images: base64Images,
        WeekendDays: weekendDaysValue,
      });

      if (data?.Status == 1) {
        const Id = data.Id;
        try {
          const landata = await axiosOther.post(
            "monuments-language-description",
            {
              Id: data.Id || formValue?.id,
              languageDescription: descriptionForm,
            }
          );
          // if (landata) {
          //   setDescriptionForm(landata?.data?.LanguageDescription);
          // }
        } catch (error) {
          console.log(error);
        }
        notifyHotSuccess(data?.Message || data?.message || data?.result);
        navigate("/monument");
        setMonumentId(data?.Id);
        handleShowDescription();
      }
    } catch (error) {
      if (error.inner) {
        const validationErrorss = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrorss);
      }

      if (error.response?.data?.Errors) {
        const data = Object.entries(error.response?.data?.Errors);
        alert(data[0][1]);
      }

      console.log("error", error);
    }
  };

  // handlign form changes
  const handleFormChange = (e) => {
    const { name, value, file, type } = e.target;
    if (type == "file") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const base64String = base64.split(",")[1];
        setFormValue({
          ...formValue,
          image: base64String,
          image_name: file.name,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFormValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // setting data to form for update
  console.log(state,"statecheck");
  
  useEffect(() => {
    if (state?.data) {
      setFormValue({
        ...formValue,
        id: state?.data?.id,
        MonumentName: state?.data?.MonumentName,
        Destination: state?.data?.DestinationId,
        TransferType: state?.data?.TransferTypeId,
        ClosedOnDays: state?.data?.ClosedOnDays,
        DefaultQuotation: state?.data?.DefaultQuotation,
        DefaultProposal: state?.data?.DefaultProposal,
        WeekendDays: state?.data?.WeekendDays,
        Description: state?.data?.Description,
        Status: state?.data?.Status === "Active" ? "1" : "0",
        AddedBy: 0,
        UpdatedBy: "1",
        falseUnder: state?.data?.falseUnder,
        Images: state?.data?.Images,
      });
      setWeekendDaysValue(state?.data?.WeekendDays);
      // setDescriptionForm((des)=>({
      //   ...des,
      //    id: state?.data?.id || "",
      //    description: lang?.LanguageDescription || "",

      // }))
      // setWeekendDaysValue({
      //   ...
      // })
      // console.log(languageDescription, "languageDescription");
      // if (state?.languageDescription) {
      //   const formattedLanguageArray = state.languageDescription.map(
      //     (item) => ({
      //       id: item.languageId, // Assuming "id" is the language ID
      //       description: item.languageDescription, // Assuming "description" holds the description
      //     })
      //   );

      //   //  setLanguageArray(formattedLanguageArray);
      // }
    }
  }, [state]);

  // console.log(weekendDaysValue,"weekendDays")
  // console.log(state,"state")

  // console.log
useEffect(() => {
  if (state?.data && typeof state.data === "object") {
    const languageDescriptions = Array.isArray(state.data.languageDescription)
      ? state.data.languageDescription.map((lang) => ({
          id: lang?.languageId || "",
          description: lang?.languageDescription || "",
        }))
      : [];

    // console.log(languageDescriptions, "newDescriptionForm");

    setDescriptionForm(
      languageDescriptions.length > 0 ? languageDescriptions : [...descriptionForm]
    );

    // console.log(descriptionForm, "checkdescriptionForm");
    // console.log(state, "state");
  }
}, [state]);

  // console.log(state,"descriptionForm1")



  // console.log(descriptionForm,"descriptionForm")


  useEffect(() => {
    if (languageList.length > 0) {
      const langForm = descriptionForm?.map((form, index) => {
        const langId = languageList[index];

        return {
          ...form,
          id: langId?.id,
        };
      });
      setDescriptionForm(langForm);
      // console.log(langForm,"langForm")
    }
  }, [languageList]);
  // console.log(languageList,"languageList")
  // console.log(weekendDaysValue,"weekendDaysValue")

  // const languageDescriptionIncrement = () => {
  //   setLangaugeDescription([...languageDescription, languageDescObj]);
  // };

  // const languageDescriptionDecrement = (ind) => {
  //   const filteredLangDesc = languageDescription?.filter(
  //     (des, index) => ind != index && des
  //   );
  //   setLangaugeDescription(filteredLangDesc);
  // };

  // const handleEditDescription = (index) => {
  //   setShowEditor((prev) => ({
  //     ...prev,
  //     [index]: !prev[index], // Toggle for specific row
  //   }));
  // };
  // const handleEditorDescriptionChange = (index, data) => {
  //   setLangaugeDescription((prevForm) => {
  //     const newForm = [...prevForm];
  //     newForm[index] = { ...newForm[index], description: data };
  //     return newForm;
  //   });
  // };

  // const handleLanguageDescriptionChange = (index, e) => {
  //   const { name, value } = e.target;
  //   console.log(name, value);
  //   setLangaugeDescription((prevArr) => {
  //     const newArray = [...prevArr];
  //     newArray[index] = { ...newArray[index], [name]: value };
  //     return newArray;
  //   });
  // };
  // console.log(languageDescription, "236");
  // const handleDescription = (data) => {
  //   const cleanedData = data.replace(/<[^>]*>/g, "");
  //   setFormValue((prevState) => ({
  //     ...prevState,
  //     Description: cleanedData, // Update Description field in state
  //   }));
  // };

  // const handleDelete = (index) => {
  //   const updatedData = newTableData.filter((_, i) => i !== index);
  //   setNewTableData(updatedData);
  // };
  // ];

  // Update the languageArray based on index

  // Handle description change based on index
  const handleDescriptionInc = () => {
    setDescriptionForm([...descriptionForm, languageDescObj]);
  };

  const handleDescriptionDec = (ind) => {
    const filteredDesc = descriptionForm?.filter((_, index) => ind != index);
    setDescriptionForm(filteredDesc);
  };

  const handleLanguageDescriptionChanges = (e, ind) => {
    const { name, value } = e.target;

    setDescriptionForm((prevArr) => {
      let newArr = [...prevArr];
      newArr[ind] = { ...(newArr[ind] || {}), [name]: value };
      return newArr;
    });
  };
  const handleDescriptionFomChange = (index, e) => {
    const { name, value } = e.target;
    setDescriptionForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[index] = { ...newForm[index], id: value };
      return newForm;
    });
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Add Monument</h4>
            <div className="d-flex  gap-3 ">
              {/* <Link to={"/monument"} className="btn btn-dark btn-custom-size">
                Back
              </Link> */}
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate("/monument", {
                  state: {
                    selectedDestination: state?.selectedDestination,
                    selectmonumentname: state?.selectmonumentname,
                  },
                })}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary btn-custom-size"
              >
                Submit
              </button>
            </div>
          </div>
          <div className="card-body">
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
                      <div className="col-md-6 col-lg-3">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="country">
                            Destination
                            <span className="text-danger">*</span>
                          </label>
                        </div>
                        <select
                          name="Destination"
                          id="country"
                          className="form-control form-control-sm"
                          value={formValue?.Destination}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {destinationList?.length > 0 &&
                            destinationList.map((value, index) => {
                              return (
                                <option value={value.id} key={index + 1}>
                                  {value.Name}
                                </option>
                              );
                            })}
                        </select>
                        {validationErrors?.Destination && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.Destination}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Monument Name
                            <span className="text-danger">*</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="MonumentName"
                          value={formValue?.MonumentName}
                          onChange={handleFormChange}
                          placeholder="Name"
                        />

                        {validationErrors?.MonumentName && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.MonumentName}
                          </div>
                        )}
                      </div>
                      {/* <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          Transfer Type
                        </label>
                        <select
                          name="TransferType"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.TransferType}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          <option value="1">Ticket Only</option>
                          <option value="2">ALL</option>
                          <option value="3">SIC</option>
                          <option value="4">PVT</option>
                        </select>
                      </div> */}
                      <div className="col-md-6 col-lg-4 d-flex flex-column gap-2">
                        <label className="m-0">Holiday</label>
                        <div className="d-flex gap-3">
                          {weekendDays.map((day, index) => (
                            <div className="d-flex gap-1" key={index}>
                              <label htmlFor={day} className="m-0">
                                {day.slice(0, 3)}
                              </label>
                              <input
                                type="checkbox"
                                name={day}
                                className="form-check-input"
                                value={day}
                                checked={weekendDaysValue?.includes(day)}
                                onChange={handleWeekendDaysValue}
                                id={day}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <label>False Under</label>

                        <div className="d-flex gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="falseUnder"
                              value="ASI"
                              id="default_yes"
                              checked={formValue?.falseUnder === "ASI"}
                              onChange={handleFormChange}
                            />

                            <label
                              className="form-check-label"
                              htmlFor="default_yes"
                            >
                              ASI
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="falseUnder"
                              value="UNESCO"
                              id="default_no"
                              checked={formValue?.falseUnder === "UNESCO"}
                              onChange={handleFormChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="default_no"
                            >
                              UNESCO
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="falseUnder"
                              value="Private ONED"
                              id="default_no"
                              checked={formValue?.falseUnder === "Private ONED"}
                              onChange={handleFormChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="default_no"
                            >
                              Private ONED
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          Add Image
                        </label>
                        <ImageContainer />
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          Status <span className="text-danger">*</span>
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

                      <div className="col-md-6 col-lg-3">
                        <label>
                          Set Default for Quotation
                          <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="DefaultQuotation"
                              value="1"
                              id="default_yes"
                              checked={formValue?.DefaultQuotation == 1}
                              onChange={handleFormChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="default_yes"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="DefaultQuotation"
                              value="0"
                              id="default_no"
                              checked={formValue?.DefaultQuotation == 0}
                              onChange={handleFormChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="default_no"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <label>
                          Set Default for Proposal
                          <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="DefaultProposal"
                              value="1"
                              id="default_yes"
                              checked={formValue?.DefaultProposal == 1}
                              onChange={handleFormChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="default_yes"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="DefaultProposal"
                              value="0"
                              id="default_no"
                              checked={formValue?.DefaultProposal == 0}
                              onChange={handleFormChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="default_no"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label>
                          Set Default <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="Default"
                              value="Yes"
                              id="default_yes"
                              checked={formValue?.Default == "Yes"}
                              onChange={handleFormChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="default_yes"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="Default"
                              value="No"
                              id="default_no"
                              checked={formValue?.Default == "No"}
                              onChange={handleFormChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="default_no"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <table
                            className="table card-table display mb-4 shadow-hover default-table dataTablesCard dataTable no-footer mt-2"
                            id="example2"
                          >
                            <thead>
                              <tr>
                                <th>Sr. No.</th>
                                <th>Language</th>
                                <th>Description</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {descriptionForm?.map((description, ind) => {
                                return (
                                  <tr key={ind + 1}>
                                    <td>{ind + 1}</td>
                                    <td>
                                      <select
                                        name="id"
                                        id="status"
                                        className="form-control form-control-sm"
                                        value={description?.id}
                                        onChange={(e) =>
                                          handleDescriptionFomChange(ind, e)
                                        }
                                      >
                                        <option value="">Select</option>
                                        {languageList?.map((lang) => (
                                          <option key={lang.id} value={lang.id}>
                                            {lang.Name}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td>
                                      <div className="customheight-editor">
                                        <textarea
                                          type="text"
                                          className="form-control form-control-sm"
                                          name={"description"}
                                          placeholder="description"
                                          value={description?.description || ""}
                                          onChange={(e) =>
                                            handleLanguageDescriptionChanges(
                                              e,
                                              ind
                                            )
                                          }
                                        ></textarea>
                                      </div>
                                    </td>
                                    <td>
                                      {ind == 0 ? (
                                        <button
                                          className="btn btn-primary btn-custom-size"
                                          onClick={handleDescriptionInc}
                                        >
                                          +
                                        </button>
                                      ) : (
                                        <button
                                          className="btn btn-primary btn-custom-size"
                                          onClick={() =>
                                            handleDescriptionDec(ind)
                                          }
                                        >
                                          -
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default AddMonument;
