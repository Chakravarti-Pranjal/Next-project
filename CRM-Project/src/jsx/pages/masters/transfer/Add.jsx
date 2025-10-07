import React, { useState, useEffect } from "react";
import { transferMasterValidationSchema } from "../master_validation";
import { transferMasterInitialValue } from "../masters_initial_value";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import useMultipleSelect from "../../../../hooks/custom_hooks/useMultipleSelect";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Add = () => {
  const [formValue, setFormValue] = useState(transferMasterInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [destinationList, setDestinationList] = useState([]);
  const [transferTypeList, setTransferTypeList] = useState([]);
  const destinationOption = destinationList?.map((dest) => {
    return {
      value: dest?.id,
      label: dest?.Name,
    };
  });
  const [editorData, setEditorData] = useState("");

  const {
    SelectInput: DestinationInput,
    selectedData: destinationSelected,
    setSelectedData: setDestinationSelected,
  } = useMultipleSelect(destinationOption);

  const { state } = useLocation();
  const navigate = useNavigate();

  const getDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("transfertypemasterlist", {
        Search: "",
        Status: 1,
      });
      setTransferTypeList(data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("destinationlist", {
        Search: "",
        Status: 1,
      });
      setDestinationList(data.DataList);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getDataToServer();
  }, []);

  // submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await transferMasterValidationSchema.validate(
        {
          ...formValue,
        },
        { abortEarly: false }
      );

      // console.log("form-value", {
      //   ...formValue,
      //   Destinations: destinationSelected,
      //   Details: editorData,
      // });

      setValidationErrors({});
      const { data } = await axiosOther.post("addupdatetransfermaster", {
        ...formValue,
        Destinations: destinationSelected,
        Details: editorData,
      });

      if (data?.Status == 1) {
        navigate("/transfer");
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
        alert(data[0][1]);
      }

      console.log("error", error);
    }
  };

  // handlign form changes
  const handleInputChange = (e) => {
    const { name, value, files, type } = e.target;

    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // setting data to form for update
  useEffect(() => {
    if (state) {
      setFormValue({
        id: state?.id,
        TransferName: state?.TransferName,
        Destinations: state?.DestinationId?.map((dest) =>
          parseInt(dest?.DestinationId)
        ),
        TransferType: state?.TransferTypeId,
        Details: state?.Details,
        SetDefault:
          state?.SetDefault == null || state?.SetDefault == ""
            ? "No"
            : state?.SetDefault,
        Status: state?.Status == "" ? 0 : state?.Status,
        AddedBy: state?.AddedBy,
        UpdatedBy: state?.UpdatedBy,
      });
      setDestinationSelected(
        state?.DestinationId?.map((dest) => parseInt(dest?.DestinationId))
      );
      setEditorData(state?.Details != null ? state?.Details : "");
    }
  }, [state]);

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };

  // console.log('state', state);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Add Transfer</h4>
            <div className="d-flex gap-3">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <button onClick={handleSubmit} className="btn btn-primary btn-custom-size">
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
                <div className="row form-row-gap">
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Transfer Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Transfer Name"
                      className="form-control form-control-sm"
                      name="TransferName"
                      value={formValue?.TransferName}
                      onChange={handleInputChange}
                    />

                    {validationErrors?.TransferName && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.TransferName}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <label className="m-0">Destination</label>
                    <DestinationInput />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Transfer Type</label>
                    <select
                      name="TransferType"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.TransferType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {transferTypeList?.map((value, index) => {
                        return (
                          <option value={value.id} key={index + 1}>
                            {value.Name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Status</label>
                    <select
                      name="Status"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.Status}
                      onChange={handleInputChange}
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label>Set Default</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="SetDefault"
                          value="Yes"
                          id="default_yes"
                          checked={formValue?.SetDefault.includes("Yes")}
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
                          value="No"
                          id="default_no"
                          checked={formValue?.SetDefault.includes("No")}
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

                  <div className="col-12">
                    <CKEditor
                      editor={ClassicEditor}
                      data={editorData} // Preloaded content for editing
                      onChange={handleEditorChange}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="d-flex gap-3 justify-content-end mt-1">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <button onClick={handleSubmit} className="btn btn-primary btn-custom-size">
                Submit
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Add;
