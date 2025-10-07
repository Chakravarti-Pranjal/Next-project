import React, { useState, useEffect } from "react";
import { fitValidationSchema } from "../master_validation";
import useMultipleSelect from "../../../../hooks/custom_hooks/useMultipleSelect";
import { gitInitialValue } from "../masters_initial_value";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../../../../scss/main.css";
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
const languageDescObj =
{
  LanguageId: "",
  LanguageName: "",
  OverviewName: "",
  Highlights: "",
  ItineraryIntroduction: "",
  ItinerarySummary: "",
  Inclusion: "",
  Exclusion: "",
  TermsCondition: "",
  Cancelation: "",
  PaymentTerm: "",
  BookingPolicy: "",
  Remarks: "",
}



const GitAdd = () => {
  const [formValue, setFormValue] = useState(gitInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [destinationList, setDestinationList] = useState([]);
  const [descriptionForm, setDescriptionForm] = useState([languageDescObj]);
  const [LanguageDataList, setLanguageDataList] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();

  // Fetch destination list
  const getDataToServer = async () => {
    try {
      const response = await axiosOther.post("destinationlist", {
        Search: "",
        Status: 1,
      });
      setDestinationList(response.data.DataList|| []);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
    try {
      const language = await axiosOther.post("languagelist", {
        Search: "",
        Status: 1,
      });
      setLanguageDataList(language.data.DataList|| []);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    getDataToServer();
  }, []);

  const Destinationoption = destinationList?.map((destination) => {
    return {
      value: destination?.id,
      label: destination?.Name,
    };
  });

  // Handle form submission
  // console.log("languageDescObj",descriptionForm)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fitValidationSchema.validate({ ...formValue, Destination: DestinationSelected, }, { abortEarly: false });

      setValidationErrors({});
      // console.log("Submitting form:");

      const { data } = await axiosOther.post("fit-or-git-add", { ...formValue, Destination: DestinationSelected, LanguageData: descriptionForm || [], });

      if (data?.Status === 1) {
        // toast.success("Successfully submitted!");
        notifySuccess(data?.Message)
        navigate("/git-master");
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (error) {
      if (error.inner) {
        const errors = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(errors);
      }

      if (error.response?.data?.Errors) {
        const serverErrors = Object.values(error.response.data.Errors);
        toast.error(serverErrors[0]);
      }

      console.error("Form submission error:", error);
    }
  };

  // Handle form changes
  // const handleFormChange = (e) => {
  //   const { name, value, type, files } = e.target;
  //   if (type === "file" && files.length > 0) {
  //     const file = files[0];
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setFormValue((prev) => ({
  //         ...prev,
  //         image: reader.result.split(",")[1],
  //         image_name: file.name,
  //       }));
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setFormValue((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }
  // };


  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setFormValue((prev) => ({
          ...prev,
          image: reader.result.split(",")[1],
          image_name: file.name,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle CKEditor changes
  const handleEditorChange = (field, data, ind) => {
    // setFormValue((prev) => ({
    //   ...prev,
    //   [field]: data, // Use 'data' directly instead of editor.getData()
    // }));
    // console.log("Updated Data:", field, data);
    // setLanguageDataList
    setDescriptionForm((prevArr) => {
      let newArr = [...prevArr];
      newArr[ind] = { ...newArr[ind], [field]: data };
      return newArr;
    })
  };

  // console.log("form-data",descriptionForm);

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
  // useEffect(() => {
  //   if (state) {
  //     setFormValue({
  //       ...gitInitialValue,
  //       ...state,
  //       Status: state?.Status === "Active" ? "1" : "0",
  //       SetDefault: state?.SetDefault === null ? "Yes" : state?.SetDefault,
  //       AddedBy: 0,
  //       UpdatedBy: "1",
  //     });
  //   }
  // }, [state]);

  

  const handleDescriptionInc = () => {
    // e.preventDefault();
    setDescriptionForm([...descriptionForm, languageDescObj]);
  };

  const handleDescriptionDec = (ind) => {
    // e.preventDefault();
    const filteredDesc = descriptionForm?.filter((_, index) => ind != index);
    setDescriptionForm(filteredDesc);
  };

  const handleLanguageDescriptionChange = (index, data) => {
    setDescriptionForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[index] = { ...newForm[index], description: data };
      return newForm;
    });
  };

  const handleDescriptionFomChange = (index, e) => {
    const { name, value } = e.target;
    setDescriptionForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[index] = { ...newForm[index], [name]: value };
      return newForm;

    });
  };

  const DestinationInitialValue = state?.DestinationId;

  const {
    SelectInput: DestinationInput,
    selectedData: DestinationSelected,
    setSelectedData: setDestinationSelected,  // Renamed for clarity
  } = useMultipleSelect(Destinationoption, DestinationInitialValue);
  // console.log("selectedData:",DestinationSelected);
useEffect(() => {
  if (state) {
    setFormValue({
      ...gitInitialValue,
      ...state,
      Status: state?.Status === "Active" ? "1" : "0",
      SetDefault: state?.SetDefault === "Yes" ? "1" : "0",
      AddedBy: 0,
      UpdatedBy: "1",
    });
    setDescriptionForm(state?.LanguageData || [languageDescObj]);
    setDestinationSelected(
      state?.Destinations?.map((dest) => dest.DestinationId) || []
    );
  }
}, [state, setDestinationSelected]);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Add Git</h4>
            <div className="d-flex gap-3">
              <button className="btn btn-dark btn-custom-size" variant="dark" onClick={() => navigate(-1)}>
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark custom-btn bg-white p-1 rounded"></i>
              </button>
              <button className="btn btn-primary btn-custom-size" variant="primary" type="submit" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-12">
                  <div className="row form-row-gap">



                    
                    <div className="col-md-6 col-lg-2">
                      <label htmlFor="Name">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="Name"
                        name="Name"
                        placeholder="Enter a Name"
                        value={formValue?.Name}
                        onChange={handleFormChange}
                      />
                      {validationErrors?.Name && (
                        <div className="invalid-feedback d-block">
                          {validationErrors?.Name}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 col-lg-2">
                      <label className="" htmlFor="status">
                        Status
                      </label>
                      <select
                        name="Status"
                        id="status"
                        className="form-control form-control-sm"
                        value={formValue?.Status}
                        onChange={handleInputChange}
                      >
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>
                    {/* Destination Field */}
                    {/* <div className="col-md-6 col-lg-3">
                      <label htmlFor="DestinationId">
                        Destination <span className="text-danger">*</span>
                      </label>
                      <DestinationInput />
                      {validationErrors?.Destination && (
                        <div className="invalid-feedback d-block">
                          {validationErrors?.Destination}
                        </div>
                      )}
                    </div> */}
                    {/* <div className="col-md-6 col-lg-2">
                      <label htmlFor="Name">
                        Service Upgradation
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="ServiceUpgradation"
                        name="ServiceUpgradation"
                        placeholder="Enter a ServiceUpgradation"
                        value={formValue?.ServiceUpgradation}
                        onChange={handleFormChange}
                      />
                      {validationErrors?.ServiceUpgradation && (
                        <div className="invalid-feedback d-block">
                          {validationErrors?.ServiceUpgradation}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 col-lg-2">
                      <label htmlFor="Name">
                        OptionalTour
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="OptionalTour"
                        name="OptionalTour"
                        placeholder="Enter a OptionalTour"
                        value={formValue?.OptionalTour}
                        onChange={handleFormChange}
                      />
                      {validationErrors?.OptionalTour && (
                        <div className="invalid-feedback d-block">
                          {validationErrors?.OptionalTour}
                        </div>
                      )}
                    </div> */}
                    <div className="col-md-6 col-lg-2 ms-5">
                      <label>Type</label><span className="text-danger">*</span>
                      <div className="d-flex gap-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="Type"
                            id="GIT"
                            value="GIT"
                            checked={formValue?.Type === "GIT"}
                            onChange={handleFormChange}
                          />
                          <label className="form-check-label" htmlFor="GIT">
                            GIT
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="Type"
                            id="FIT"
                            value="FIT"
                            checked={formValue?.Type === "FIT"}
                            onChange={handleFormChange}
                          />
                          <label className="form-check-label" htmlFor="FIT">
                            FIT
                          </label>
                        </div>
                      </div>
                      {validationErrors?.Type && (
                        <div className="invalid-feedback d-block">
                          {validationErrors?.Type}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 col-lg-2">
                      <label>Set Default</label>
                      <div className="d-flex gap-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="SetDefault"
                            value="1"
                            id="default_yes"
                            checked={formValue?.SetDefault === "1"}
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
                            name="SetDefault"
                            value="0"
                            id="default_no"
                            checked={formValue?.SetDefault === "0"}
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
                    
                    <div className="card shadow border mt-3">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-12 col-lg-12">
                            <table className="table card-table display mb-4 shadow-hover default-table dataTablesCard dataTable no-footer mt-2" id="example2">
                              <thead>
                                <tr className="d-flex justify-content-center w-100">
                                  <th className=" w-5">Sr. No.</th>
                                  <th className="w-50 " >Language</th>
                                  <th className="d-flex flex-wrap w-100">Description</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                {descriptionForm?.map((description, ind) => (
                                  <tr className="d-flex justify-content-center w-100 gap-2" key={ind}>
                                    <td className="pt-5 ps-5">{ind + 1}</td>
                                    <td className="w-50 pt-5">
                                      <select
                                        name="LanguageId"
                                        id="LanguageId"
                                        className="form-control form-control-sm"
                                        // value={languageDescObj.id} // Ensure it matches state
                                        value={descriptionForm[ind].LanguageId}
                                        onChange={(e) => handleDescriptionFomChange(ind, e)}
                                      >
                                        <option value="">Select</option>
                                        {LanguageDataList?.map((lang) => (
                                          <option key={lang.id} value={lang.id}>
                                            {lang.Name}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="d-flex flex-wrap w-100">
                                      {/* {["LanguageName", "OverviewName", "Highlights", "ItineraryIntroduction", "ItinerarySummary", "Inclusion", "Exclusion", "TermsCondition", "Cancelation", "PaymentTerm", "BookingPolicy", "Remarks"].map((field, index) => ( */}
                                      {["Inclusion", "Exclusion", "TermsCondition", "Cancelation", "BookingPolicy", "Remarks"].map((field, index) => (
                                        <div className="col-md-6 col-xl-6 pe-3" key={index}>
                                          <label>{field.replace(/([A-Z])/g, " $1")}</label>
                                          <CKEditor
                                            editor={ClassicEditor}
                                            // data={languageDescObj[field] || ""}  // Fix: Bind to correct object
                                            data={descriptionForm[ind][field] || ""}
                                            // onChange={handleEditorChange}
                                            onChange={(event, editor) => {
                                              const data = editor.getData();
                                              handleEditorChange(
                                                field, data, ind
                                              );
                                            }}
                                          />
                                        </div>
                                      ))}
                                    </td>
                                    <td className="pt-5">
                                      {ind === 0 ? (
                                        <button type="button" className="btn btn-primary btn-custom-size" onClick={handleDescriptionInc}>+</button>
                                      ) : (
                                        <button type="button" className="btn btn-primary btn-custom-size" onClick={() => handleDescriptionDec(ind)}>-</button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>



                  </div>
                </div>
              </div>
              <div className="d-flex gap-3 justify-content-end mt-3">
                <button className="btn btn-dark btn-custom-size" variant="dark" onClick={() => navigate(-1)}>
                  <span className="me-1">Back</span>
                  <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                </button>
                <button className="btn btn-primary btn-custom-size" variant="primary custom-size" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default GitAdd;
