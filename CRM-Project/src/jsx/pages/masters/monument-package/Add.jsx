import React, { useState, useEffect, useCallback } from "react";
import { monumentPackageValidationSchema } from "../master_validation";
import { monumentPackageInitialValue } from "../masters_initial_value";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import useMultipleSelect from "../../../../hooks/custom_hooks/useMultipleSelect";
import { ToastContainer, toast } from "react-toastify";

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
];
const notifyError = (message) => {
  toast.error(`${message}`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const AddRoomType = () => {
  const [formValue, setFormValue] = useState(monumentPackageInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [monumentList, setMonumentList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [descriptionForm, setDescriptionForm] = useState(languageDescObj);
  const [languageList, setLanguageList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();

  // get list for dropdown
  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist", {
        CountryId: "",
        StateId: "",
        Name: "",
        Default: "",
        Status: "",
      });
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axiosOther.post("languagelist");
      setLanguageList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  const postMonumentData = async () => {
    try {
      const { data } = await axiosOther.post("monumentmasterlist", {
        Destination: formValue?.destination?.toString(),
      });
      setMonumentList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (formValue?.destination) {
      postMonumentData();
    } else {
      setMonumentList([]);
    }
  }, [formValue?.destination]);

  // console.log("form-value", formValue);

  useEffect(() => {
    postDataToServer();
  }, []);

  // submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await monumentPackageValidationSchema.validate(
        {
          ...formValue,
        },
        { abortEarly: false }
      );

      setValidationErrors({});
      const { data } = await axiosOther.post(
        isUpdating ? "monument-package-update" : "monument-package",
        {
          ...formValue,
          descriptionForm,
          monumentId: selectedData,
        }
      );

      if (data?.Status == 1 || data?.status == 1) {
        const Id = data.packageId;

        try {
          const landata = await axiosOther.post(
            "updateMonumentPackageLanguageDescription",
            {
              Id: Id || formValue.id,
              LanguageDescription: descriptionForm,
            }
          );
          if (landata) {
            setDescriptionForm(landata?.data?.LanguageDescription);
          }
        } catch (error) {
          console.log(error);
        }
        setIsUpdating(false);
        navigate("/monument-package");
        localStorage.setItem("success-message", data?.Message || data?.message);
      }
      if (data?.status != 1 || data?.Status != 1) {
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

      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
      }
      console.log("error", error);
    }
  };

  // handlign form changes
  const handleInputChange = (e) => {
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

  // const languageDescriptionIncrement = () => {
  //   setLangaugeDescription([...languageDescription, languageDescObj]);
  // };
  // const languageDescriptionDecrement = (ind) => {
  //   const filteredLangDesc = languageDescription?.filter(
  //     (des, index) => ind != index && des
  //   );
  //   setLangaugeDescription(filteredLangDesc);
  // };

  // const handleLanguageDescriptionChange = (index, e) => {
  //   const { name, value } = e.target;
  //   setLangaugeDescription((prevArr) => {
  //     const newArray = [...prevArr];
  //     newArray[index] = { ...newArray[index], [name]: value };
  //     return newArray;
  //   });
  // };

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
    }
  }, [languageList]);

  // console.log("descform",languageDescription)
  // console.log("package-state", state);

  // setting data to form for update
  useEffect(() => {
    if (state?.row) {
      setIsUpdating(true);
      setFormValue({
        id: state?.row?.id,
        package_name: state?.row?.PackageName,
        destination: state?.row?.DestinationId,
        day_type: state?.row?.DayType,
        monumentId: state?.row?.MultipleMonument?.map((mon) => mon?.id),
        image_name: state?.row?.ImageName,
        image: "",
        status: state?.row?.Status,
        default: state?.row?.Default == null ? "Yes" : state?.row?.Default,
        // languageDescription: state?.row?.languageDescription?.map((item) => ({
        //   id: item?.languageId,
        //   description: item?.languageDescription,
        // })),
        updated_by: state?.row?.UpdatedBy,
      });
      setSelectedData(state?.row?.MultipleMonument?.map((mon) => mon?.id));
      // setDescriptionForm(
      //   state?.languageDescription?.map((item) => ({
      //     id: item?.languageId,
      //     description: item?.languageDescription,
      //   }))
      // );
    }
  }, [state]);
  // useEffect(() => {
  //   console.log(
  //     state?.listLanguagemonumentpackage?.flatMap(item =>
  //       item?.LanguageDescription?.map(lang => lang?.LanguageDescription)
  //     ),
  //     "aaaaa"
  //   );

  //   if (state?.listLanguagemonumentpackage) {
  //     setDescriptionForm(

  //       state?.listLanguagemonumentpackage?.flatMap(item =>
  //         item?.LanguageDescription?.map(lang => ({
  //           id: lang?.LanguageId || "",
  //           Description: lang?.LanguageDescription || ""
  //         }))
  //       ) || []
  //     );
  //   }
  // //   else if(state?.listLanguagemonumentpackage===undefined)
  // //     {setDescriptionForm(descriptionForm)
  // // }

  // }, [state]);
  useEffect(() => {
    if (
      Array.isArray(state?.listLanguagemonumentpackage) &&
      state.listLanguagemonumentpackage.length > 0
    ) {
      const newDescriptionForm = state.listLanguagemonumentpackage.flatMap(
        (item) =>
          Array.isArray(item?.LanguageDescription) &&
            item.LanguageDescription.length > 0
            ? item.LanguageDescription.map((lang) => ({
              id: lang?.LanguageId || "",
              Description: lang?.LanguageDescription || "",
            }))
            : []
      );

      setDescriptionForm(
        newDescriptionForm.length > 0
          ? newDescriptionForm
          : [...descriptionForm]
      );
    }
  }, [state]);

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

  const monumentOption = monumentList?.map((monument) => ({
    label: monument?.MonumentName,
    value: monument?.id,
  }));

  const { SelectInput, selectedData, setSelectedData } =
    useMultipleSelect(monumentOption);

  return (

    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Add Monument Package</h4>
            <div className="d-flex gap-3">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate("/monument-package", {
                  state: {
                    selectedDestination: state?.selectedDestination,
                    selectpackagename: state?.selectpackagename,
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
              <ToastContainer />
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
                <div className="row form-row-gap">
                  <div className="col-md-6 col-lg-2">
                    <div className="d-flex justify-content-between mt-1">
                      <label className="">
                        Package Name <span className="text-danger">*</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="Package Name"
                      className="form-control form-control-sm"
                      name="package_name"
                      value={formValue?.package_name}
                      onChange={handleInputChange}
                    />
                    {validationErrors?.package_name && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.package_name}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-lg-2">
                    <label className="" htmlFor="status">
                      Destination
                    </label>
                    <select
                      name="destination"
                      id="status"
                      className="form-control form-control-sm"
                      value={formValue?.destination}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {destinationList?.map((destination, index) => {
                        return (
                          <option value={destination?.id}>
                            {destination?.Name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <label className="" htmlFor="status">
                      Monument
                    </label>
                    <SelectInput />
                  </div>
                  <div className="col-md-6 col-lg-2">
                    <label>Set Default</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="default"
                          id="default_yes"
                          value="Yes"
                          checked={formValue?.default.includes("Yes")}
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
                          name="default"
                          id="default_no"
                          value="No"
                          checked={formValue?.default?.includes("No")}
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
                  <div className="col-md-6 col-lg-3">
                    <label>Day Type</label>
                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="day_type"
                          id="full_day"
                          value="Full Day"
                          checked={formValue?.day_type == "Full Day"}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="full_day">
                          Full Day
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="day_type"
                          id="half_day"
                          value="Half Day"
                          checked={formValue?.day_type == "Half Day"}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="half_day">
                          Half Day
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="day_type"
                          id="none_day"
                          value="None"
                          checked={formValue?.day_type == "None"}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="none_day">
                          None
                        </label>
                      </div>
                    </div>
                  </div>
                  {formValue?.day_type == "Half Day" && (
                    <div className="col-md-6 col-lg-1">
                      <label className="" htmlFor="status">
                        Day Time
                      </label>
                      <select
                        name="day_time"
                        id="status"
                        className="form-control form-control-sm"
                        value={formValue?.day_time}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                  )}
                  <div className="col-md-6 col-lg-2">
                    <div className="d-flex justify-content-between">
                      <label className="">
                        Package Image <span className="text-danger">*</span>
                      </label>
                      {validationErrors?.Name && (
                        <span className="text-danger font-size-11">
                          {validationErrors?.Name}
                        </span>
                      )}
                    </div>
                    <input
                      type="file"
                      placeholder="Room Name"
                      className="form-control form-control-sm"
                      name="Name"
                      value={formValue?.Name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-1">
                    <div className="d-flex justify-content-between">
                      <label className="" htmlFor="status">
                        Status
                      </label>
                    </div>
                    <select
                      name="status"
                      id="status"
                      className="form-control form-control-sm"
                      value={formValue?.status}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="col-md-12">
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
                                            <option
                                              key={lang.id}
                                              value={lang.id}
                                            >
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
                                            value={
                                              description?.Description || ""
                                            }
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
                    {/* {languageDescription?.map((desc, ind) => (
                      <div className="row form-row-gap mb-3">
                        <div className="col-md-4">
                          <label className="" htmlFor="status">
                            Language
                          </label>
                          <select
                            name="status"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.status}
                            onChange={handleInputChange}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="col-md-7">
                          <label className="" htmlFor="status">
                            Description
                          </label>
                          <textarea
                            name="status"
                            id="status"
                            className="form-control form-control-sm textarea-height30"
                            style={{ height: "30px" }}
                            value={formValue?.status}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-1 d-flex align-items-start mt-4">
                          {ind > 0 ? (
                            <Button
                              className="me-2"
                              variant="primary"
                              onClick={languageDescriptionIncrement}
                            >
                              <span className="fs-4">-</span>
                            </Button>
                          ) : (
                            <Button
                              className="me-2"
                              variant="primary"
                              onClick={languageDescriptionDecrement}
                            >
                              <span className="fs-4">+</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))} */}
                  </div>
                </div>
              </form>
            </div>
            <div className="d-flex gap-3 justify-content-end mt-1">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate("/monument-package", {
                  state: {
                    selectedDestination: state?.selectedDestination,
                    selectpackagename: state?.selectpackagename,
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
        </div>
      </div>
    </div>
  );
};

export default AddRoomType;
