import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { destinationValidationSchema } from "../master_validation.js";
import { destinationInitialValue } from "../masters_initial_value.js";
// import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import { wrap } from "highcharts";
import useImageContainer from "../../../../helper/useImageContainer";
import useSingleImageContainer from "../../../../helper/useSingleImageContainer";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Model from "./Model.jsx";

const languageDescObj = [
  {
    id: "",
    Description: "",
  },
  {
    id: "",
    Description: "",
  },
  {
    id: "",
    Description: "",
  },
]

const Destinationsadd = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(destinationInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [errorFileMessage, setErrorFileMessage] = useState("");
  const [stateList, setStateList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [descriptionForm, setDescriptionForm] = useState(languageDescObj);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  //  console.log("initi", initialList);

  const {
    ImageContainer,
    multiFiles,
    setMultiFiles,
    handleFilesChange,
    multiImageData,
  } = useImageContainer();

  // console.log("image-value",multiImageData);

  const getDataToServers = async () => {

    try {
      const language = await axiosOther.post("languagelist", {
        Search: "",
        Status: 1,
      });
      setLanguageList(language.data.DataList);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDataToServers();
  }, []);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist");
      // console.log("Initial List: ",data?.DataList);
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("destination-error", error);
    }
  };

  const getStateDataToServer = async () => {
    if (!formValue?.CountryId) return; // Prevent API call if CountryId is not set
    try {
      const response = await axiosOther.post("listStateByCountry", {
        Search: "",
        Status: 1,
        countryid: formValue?.CountryId,
      });
      setStateList(response.data.DataList || []);
    } catch (err) {
      console.error("Error fetching state data:", err);
    }
  };

  useEffect(() => {
    getStateDataToServer();
  }, [formValue?.CountryId]);

  const getDataToServer = async () => {
    try {
      const countryData = await axiosOther.post("countrylist", {
        Search: "",
        Status: 1,
      });
      setCountryList(countryData.data.DataList);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getDataToServer();
  }, []);

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    if (languageList.length > 0) {
      const langlist = descriptionForm?.map((form, index) => {
        const langid = languageList[index];
        return {
          ...form,
          id: langid?.id
        }
      })
      setDescriptionForm(langlist)

    }

  }, [languageList])

  //   useEffect(() => {
  //     const filteredList = initialList?.filter(
  //       (data) =>
  //         data?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
  //         data?.StateName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
  //         data?.CountryName?.toLowerCase()?.includes(
  //           filterInput?.toLowerCase()
  //         ) ||
  //         data?.Description?.toLowerCase()?.includes(
  //           filterInput?.toLowerCase()
  //         ) ||
  //         data?.WeatherInformation?.toLowerCase()?.includes(
  //           filterInput?.toLowerCase()
  //         ) ||
  //         data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
  //     );
  //     setFilterValue(filteredList);
  //   }, [filterInput]);

  // console.log("multiple-file",multiFiles);

  //   const table_columns = [
  //     {
  //       name: "Sr. No.",
  //       selector: (row, index) => (
  //         <span className="font-size-11">
  //           {currentPage * rowsPerPage + index + 1}
  //         </span>
  //       ),
  //       sortable: true,
  //       width: "4rem",
  //       style: {
  //         display: "flex",
  //         justifyContent: "center",
  //       },
  //     },
  //     {
  //       name: "Country Name",
  //       selector: (row) => <span>{row?.CountryName}</span>,
  //       sortable: true,
  //       width: "10rem",
  //     },
  //     {
  //       name: "State Name",
  //       selector: (row) => <span>{row?.StateName}</span>,
  //       sortable: true,
  //       width: "12rem",
  //     },

  //     {
  //       name: "Destination Name",
  //       selector: (row) => <span>{row?.Name}</span>,
  //       sortable: true,
  //       width: "12rem",
  //       wrap: true,
  //     },
  //     {
  //       name: "Description",
  //       selector: (row) => <span>{row?.Description}</span>,
  //       sortable: true,
  //       // width: "18rem",
  //       wrap: true,
  //     },
  //     {
  //       name: "WeatherInformation",
  //       selector: (row) => <span>{row?.WeatherInformation}</span>,
  //       sortable: true,
  //       // width: "18rem",
  //       wrap: true,
  //     },
  //     {
  //       name: "AdditionalInformation",
  //       selector: (row) => <span>{row?.AdditionalInformation}</span>,
  //       sortable: true,
  //       // width: "18rem",
  //       wrap: true,
  //     },
  //     {
  //       name: "images",

  //       selector: (row) => (
  //         <div style={{ display: "flex", gap: "5px" }}>
  //           {row?.images?.map((imageUrl, index) => (
  //             <img
  //               key={index}
  //               src={imageUrl}
  //               style={{ height: "30px", width: "30px" }}
  //             />
  //           ))}
  //         </div>
  //       ),
  //       sortable: true,
  //     },
  //     {
  //       name: "SetDefault",
  //       selector: (row) => <span>{row?.SetDefault}</span>,
  //       sortable: true,
  //       // width: "18rem",
  //       wrap: true,
  //     },

  //     {
  //       name: "Status",
  //       selector: (row) => (
  //         <span
  //           className={`badge ${
  //             row.Status === "Active"
  //               ? "badge-success light badge"
  //               : "badge-danger light badge"
  //           }`}
  //         >
  //           {row.Status}
  //         </span>
  //       ),
  //       sortable: true,
  //       width: "4.5rem",
  //     },
  //     {
  //       name: "Action",
  //       selector: (row) => (
  //         <div className="d-flex align-items-center gap-1 sweetalert">
  //           <i
  //             className="fa-solid fa-pencil cursor-pointer text-success action-icon"
  //             onClick={() => handleEdit(row)}
  //           ></i>
  //           <i
  //             className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
  //             onClick={() => handleDelete(row?.id)}
  //           ></i>
  //         </div>
  //       ),
  //       width: "4.5rem",
  //     },
  //   ];

  // const handleFormChange = (e) => {
  //   const { name,value } = e.target;
  //   setFormValue((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // console.log("multiFiles",multiFiles);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await destinationValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});

      // Append image files properly

      // console.log("data",multiFiles)
      // const formData = new FormData();

      // // Append other form fields
      // Object.keys(formValue).forEach((key) => {
      //   formData.append(key, formValue[key]);
      // });

      // // Append multiple images
      // multiFiles.forEach((fileObj) => {
      //   formData.append("images[]", fileObj.file); // Ensure fileObj.file contains the File instance
      // });

      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1],"images");
      // }

      // Send request with correct headers




      const { data } = await axiosOther.post("addupdatedestination", {
        ...formValue,

      });

      if (data?.Status == 1) {
        const dataid = data?.DestinationId
        try {
          const destinationlang = await axiosOther.post("updateDestinationLanguageDescription", {
            Id: dataid || formValue.id,
            LanguageDescription: descriptionForm
          })
          // if (destinationlang) {
          //   setDescriptionForm(destinationlang?.data?.LanguageDescription);
          // }
          // console.log(destinationlang,"landata")

        } catch (error) {

        }



        toast.success("Successfully submitted!");
        navigate("/destinations");
        getListDataToServer();
        setIsEditing(false);
        setFormValue(destinationInitialValue);
        notifySuccess(data?.message || data?.Message);
      } else {
        notifyError(data?.message || data?.Message);
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
        const errorData = Object.entries(error.response?.data?.Errors);
        notifyError(errorData[0][1]);
      }
    }
  };

  //   const handleEdit = (value) => {
  //     setFormValue({
  //       id: value?.id,
  //       Name: value?.Name,
  //       CountryId: value?.CountryId,
  //       StateId: value?.StateId,
  //       Description: value?.Description,
  //       WeatherInformation: value?.WeatherInformation,
  //       AdditionalInformation: value?.AdditionalInformation,
  //       SetDefault: value?.SetDefault == "Yes" ? 1 : 0,
  //       Status: value?.Status == "Active" ? 1 : 0,
  //       AddedBy: value?.AddedBy,
  //       UpdatedBy: value?.UpdatedBy,
  //     });

  //     setIsEditing(true);
  //     scrollToTop();
  //   };
  const { state } = useLocation();
  useEffect(() => {
    if (state?.value) {
      setFormValue({
        id: state?.value?.id,
        Name: state?.value?.Name,
        StateId: state?.value?.StateId,
        CountryId: state?.value?.CountryId,
        Description: state?.value?.Description,
        WeatherInformation: state?.value?.WeatherInformation,
        AdditionalInformation: state?.value?.AdditionalInformation,
        images: state?.value?.images,

        SetDefault: state?.value?.SetDefault == "Yes" ? "1" : "0",
        Status: state?.value?.Status == "Active" ? 1 : 0,
        AddedBy: state?.value?.AddedBy,
        UpdatedBy: state?.value?.UpdatedBy,
      });
    }
  }, [state]);
  // useEffect(() => {
  //   if (state?.langdes?.length > 0) {
  //     const newlandes = state.langdes.flatMap(i =>
  //       i.LanguageDescription && Array.isArray(i.LanguageDescription)
  //         ? i.LanguageDescription.map(lang => ({
  //             id: lang?.LanguageId || "",
  //             Description: lang?.LanguageDescription || ""
  //           }))
  //         : []
  //     );

  //     setDescriptionForm(newlandes.length > 0 ? newlandes : [...descriptionForm]);
  //   }
  // }, [state]); 
  useEffect(() => {
    if (Array.isArray(state?.langdes) && state.langdes.length > 0) {
      const newDescriptionForm = state.langdes.flatMap(item =>
        Array.isArray(item?.LanguageDescription) && item.LanguageDescription.length > 0
          ? item.LanguageDescription.map(lang => ({
            id: lang?.LanguageId || "",
            Description: lang?.LanguageDescription || ""
          }))
          : []
      );

      setDescriptionForm(newDescriptionForm.length > 0 ? newDescriptionForm : [...descriptionForm]);
    }
  }, [state]);



  const handleReset = () => {
    setFormValue(destinationInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };
  const handleDescriptionInc = () => {
    setDescriptionForm([...descriptionForm, languageDescObj]);
    // console.log(descriptionForm,languageDescObj,"descriptionForm")
  };

  const handleDescriptionDec = (ind) => {
    const filteredDesc = descriptionForm?.filter((_, index) => ind != index);
    setDescriptionForm(filteredDesc);
  };

  const handleLanguageDescriptionChanges = (e, ind) => {
    const { name, value } = e.target;

    setDescriptionForm((prevArr) => {
      let newArr = [...prevArr];

      // Ensure the index exists
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
  // const handleDescriptionFomChange = (index,e) => {

  //   const { name,value } = e.target;

  //   setDescriptionForm((prevForm) => {
  //     const newForm = [...prevForm];
  //     newForm[index] = { ...newForm[index],id: value };
  //     return newForm;
  //   });
  // };

  return (


    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">
              {isEditing ? "Update Destination" : "Add Destination "}
            </h4>
            <div className="col-lg-2 d-flex justify-content-end align-items-center gap-2">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <button
                className="btn btn-primary btn-custom-size"
                variant="primary"
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="form-validation" ref={formRef}>
              <ToastContainer />
              <form className="form-valide" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12">
                    <div className="row form-row-gap">
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">
                          Country
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          name="CountryId"
                          id=""
                          className="form-control form-control-sm"
                          value={formValue?.CountryId}
                          onChange={handleInputChange}
                        >
                          <option value="">Select</option>
                          {countryList?.map((value, index) => {
                            return (
                              <option value={value.id} key={index + 1}>
                                {value.Name}
                              </option>
                            );
                          })}
                        </select>
                        {validationErrors?.CountryId && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.CountryId}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 col-lg-2">
                        <label className="m-0">
                          State <span className="text-danger">*</span>
                        </label>
                        <select
                          name="StateId"
                          id=""
                          className="form-control form-control-sm"
                          value={formValue?.StateId}
                          onChange={handleInputChange}
                        >
                          <option value="">Select</option>
                          {stateList?.map((value, index) => {
                            return (
                              <option value={value.id} key={index + 1}>
                                {value.Name}
                              </option>
                            );
                          })}
                        </select>
                        {validationErrors?.StateId && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.StateId}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label className="m-0">
                          Destination Name{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="Name"
                          placeholder="Enter a Destination Name"
                          value={formValue?.Name}
                          onChange={handleInputChange}
                        />
                        {validationErrors?.Name && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.Name}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label>Status</label>
                        <select
                          name="Status"
                          className="form-control form-control-sm"
                          value={formValue?.Status}
                          onChange={handleInputChange}
                        >
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                      </div>

                      <div className="col-md-6 col-lg-2">
                        <label>Default</label>
                        <div className="d-flex gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="SetDefault"
                              value="1"
                              id="default_yes"
                              checked={formValue?.SetDefault == "1"}
                              onChange={handleInputChange}
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
                              name="SetDefault"
                              value="0"
                              id="default_no"
                              checked={formValue?.SetDefault == "0"}
                              onChange={handleInputChange}
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
                      {/* <div className="col-md-6 col-lg-6">
                        <label className="m-0">Description</label>
                        <textarea
                          name="Description"
                          id="Description"
                          className="form-control form-control-sm"
                          placeholder="Description"
                          value={formValue?.Description}
                          onChange={handleInputChange}
                        ></textarea>

                        {validationErrors?.Description && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.Description}
                          </div>
                        )}
                      </div> */}
                      <div className="col-md-6 col-lg-6">
                        <label className="m-0">WeatherInformation</label>
                        <textarea
                          name="WeatherInformation"
                          id="WeatherInformation"
                          className="form-control form-control-sm"
                          placeholder="WeatherInformation"
                          value={formValue?.WeatherInformation}
                          onChange={handleInputChange}
                        ></textarea>
                        {validationErrors?.WeatherInformation && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.WeatherInformation}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <label className="m-0">AdditionalInformation</label>
                        <textarea
                          name="AdditionalInformation"
                          id="AdditionalInformation"
                          className="form-control form-control-sm"
                          placeholder="AdditionalInformation"
                          value={formValue?.AdditionalInformation}
                          onChange={handleInputChange}
                        ></textarea>
                        {validationErrors?.AdditionalInformation && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.AdditionalInformation}
                          </div>
                        )}
                      </div>


                      <div className="card shadow border">
                        <div className="card-body">

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
                                              name={"Description"}
                                              placeholder="Description" // Dynamic placeholder
                                              value={description?.Description || ""}
                                              onChange={(e) => handleLanguageDescriptionChanges(e, ind)}
                                            ></textarea>
                                          </div>
                                        </td>
                                        <td>
                                          {ind == 0 ? (
                                            <button
                                              type='button'
                                              className="btn btn-primary btn-custom-size"
                                              onClick={handleDescriptionInc}
                                            >
                                              +
                                            </button>
                                          ) : (
                                            <button
                                              type='button'
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



                      <div className="col-md-6 col-lg-2 d-flex justify-content-end  align-items-center mt-3 w-100">
                        <button
                          type="submit"
                          className="btn btn-primary btn-custom-size"
                        >
                          {isEditing ? "Update" : "Submit"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-dark btn-custom-size ms-2"
                          onClick={handleReset}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};


export default Destinationsadd;
