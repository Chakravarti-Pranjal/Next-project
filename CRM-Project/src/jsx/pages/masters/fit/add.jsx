import React, { useState, useEffect } from "react";
import { fitValidationSchema } from "../master_validation";
import { fitInitialValue } from "../masters_initial_value";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../../../../scss/main.css";
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Add = () => {
  const [formValue, setFormValue] = useState(fitInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [destinationList, setDestinationList] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();

  // Fetch destination list
  const getDataToServer = async () => {
    try {
      const response = await axiosOther.post("destinationlist", {
        Search: "",
        Status: 1,
      });
      setDestinationList(response.data.DataList);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  useEffect(() => {
    getDataToServer();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fitValidationSchema.validate(formValue, { abortEarly: false });

      setValidationErrors({});
      // console.log("Submitting form:", formValue);

      const { data } = await axiosOther.post("addupdatefit", formValue);

      if (data?.Status == 1) {
        toast.success("Successfully submitted!");
        navigate("/fit");
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
  const handleEditorChange = (field) => (_, editor) => {
    setFormValue((prev) => ({
      ...prev,
      [field]: editor.getData(),
    }));
  };

  useEffect(() => {
    if (state) {
      setFormValue({
        ...fitInitialValue,
        ...state,
        Status: state?.Status === "Active" ? "1" : "0",
        AddedBy: 0,
        UpdatedBy: "1",
      });
    }
  }, [state]);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Add Fit</h4>
            <div className="d-flex gap-3">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate(-1)}
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
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-12">
                  <div className="row form-row-gap">

                    <div className="col-md-6 col-lg-4">
                      <label htmlFor="Name">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="Name"
                        name="Name"
                        value={formValue?.Name}
                        onChange={handleFormChange}
                        placeholder="Name"
                      />
                      {validationErrors?.Name && (
                        <div className="invalid-feedback d-block">
                          {validationErrors?.Name}
                        </div>
                      )}
                    </div>

                    {/* Destination Field */}
                    <div className="col-md-6 col-lg-3">
                      <label htmlFor="DestinationId">
                        Destination <span className="text-danger">*</span>
                      </label>
                      <select
                        name="DestinationId"
                        id="DestinationId"
                        className="form-control form-control-sm"
                        value={formValue?.DestinationId}
                        onChange={handleFormChange}
                      >
                        <option value="">Select</option>
                        {destinationList.map((dest, index) => (
                          <option key={index} value={dest.id}>
                            {dest.Name}
                          </option>
                        ))}
                      </select>
                      {validationErrors?.DestinationId && (
                        <div className="invalid-feedback d-block">
                          {validationErrors?.DestinationId}
                        </div>
                      )}
                    </div>

                    {/* CKEditor Fields */}
                    {[
                      "Inclusion",
                      "Exclusion",
                      "TermsCondition",
                      "Cancelation",
                      "ServiceUpgradation",
                      "OptionalTour",
                      "PaymentPolicy",
                      "Remarks",
                    ].map((field, index) => (
                      <div className="col-md-6 col-xl-6" key={index}>
                        <label>{field.replace(/([A-Z])/g, " $1")}</label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={formValue?.[field] || ""}
                          onChange={handleEditorChange(field)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="d-flex gap-3 justify-content-end mt-3">
                <button
                  className="btn btn-dark btn-custom-size"
                  name="SaveButton"
                  onClick={() => navigate(-1)}
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
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Add;
