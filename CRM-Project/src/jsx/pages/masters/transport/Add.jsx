import React, { useState, useEffect } from "react";
import { transportMasterValidationSchema } from "../master_validation";
import { transportMasterInitialValue } from "../masters_initial_value";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import "react-international-phone/style.css";
import useMultipleSelect from "../../../../hooks/custom_hooks/useMultipleSelect";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { notifyHotError, notifyHotSuccess } from "../../../../helper/notify";

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

const Add = () => {
  const [formValue, setFormValue] = useState(transportMasterInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [destinationList, setDestinationList] = useState([]);
  const [transferTypeList, setTransferTypeList] = useState([]);
  const [descriptionForm, setDescriptionForm] = useState(languageDescObj);
  const [languageList, setLanguageList] = useState([]);
  const destinationOption = destinationList?.map((dest) => {
    return {
      value: dest?.id,
      label: dest?.Name,
    };
  });

  const [editorData, setEditorData] = useState("");
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

  const {
    SelectInput: DestinationInput,
    selectedData: destinationSelected,
    setSelectedData: setDestinationSelected,
  } = useMultipleSelect(destinationOption);

  const { state } = useLocation();
  const location = useLocation();
  const { rowDatas, listLanguageTransport } = location.state || {}; // ✅ Ensure proper destructuring

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

  const Token = JSON.parse(localStorage.getItem("token"));
  // console.log(Token, "Token")

  // submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await transportMasterValidationSchema.validate(
        {
          ...formValue,
          DestinationId: destinationSelected ? [destinationSelected] : [],
        },
        { abortEarly: false }
      );

      setValidationErrors({});
      const { data } = await axiosOther.post("addupdatetransportmaster", {
        ...formValue,
        companyid: Token?.companyKey,
        DestinationId: [+(formValue?.DestinationId)],
        Detail: editorData,
      });

      if (data?.Status == 1) {
        const transportId = data?.TransportId; // Explicitly extract transport ID

        try {
          const landata = await axiosOther.post("updateLanguageDescription", {
            // ...descriptionForm,

            Id: transportId || formValue.id,
            LanguageDescription: descriptionForm,
          });
          if (landata) {
            setDescriptionForm(landata?.data?.LanguageDescription);
          }
        } catch (error) {
          console.log(error);
        }
        notifyHotSuccess(data?.Message || data?.message);
        navigate("/transport");
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
        notifyHotError(data[0][1]);
      }
    }
  };

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

  // handlign form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: name === "DestinationId" ? [value] : value,
    }));
  };

  // setting data to form for update
  useEffect(() => {
    if (state?.rowDatas) {
      setFormValue({
        id: rowDatas?.id,
        Name: rowDatas?.Name,
        DestinationId: rowDatas?.Destinations?.map((dest) => parseInt(dest?.id)),
        TransferType: rowDatas?.TransferType?.id,
        TransportType: rowDatas?.TransportType,
        NoOfDays: rowDatas?.NoOfDays,
        Details: rowDatas?.Detail == null ? "" : rowDatas?.Detail,
        Default: rowDatas?.Default == "Yes" ? "1" : "0",
        Status: rowDatas?.Status == "" ? 0 : rowDatas?.Status,
        AddedBy: rowDatas?.AddedBy,
        UpdatedBy: rowDatas?.UpdatedBy,
      });
      setDestinationSelected(
        rowDatas?.Destinations?.map((dest) => parseInt(dest?.id))
      );

      setEditorData(rowDatas?.Detail != null ? rowDatas?.Detail : "");
    }
  }, [state]);
  // useEffect(() => {
  //   console.log(state, "aaaaa");

  //   if (state?.listLanguageTransport?.length > 0) {
  //     setDescriptionForm(

  //       state.listLanguageTransport[0]?.LanguageDescription?.map(dest => ({
  //         id: dest?.LanguageId || "",
  //         Description: dest?.LanguageDescription || ""
  //       })) || []
  //     );
  //   }
  // }, [state?.listLanguageTransport]);
  useEffect(() => {
    if (
      Array.isArray(state?.listLanguageTransport) &&
      state.listLanguageTransport.length > 0
    ) {
      const newDescriptionForm = state.listLanguageTransport.flatMap((item) =>
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

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };

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

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Add Transport</h4>
            <div className="d-flex gap-3">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate("/transport", { state: { selectedDestination: state?.rowDatas?.selectedDestination, selecttransfername: state?.rowDatas?.selecttransfername, selectedTransferlist: state?.rowDatas?.selectedTransferlist } })}
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
                <div className="row form-row-gap">
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Transport"
                      className="form-control form-control-sm"
                      name="Name"
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
                    <label className="m-0">Destination</label>
                    <select
                      name="DestinationId"
                      className="form-control form-control-sm"
                      value={formValue?.DestinationId || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {destinationList?.map((dest) => (
                        <option key={dest.id} value={dest.id}>
                          {dest.Name}
                        </option>
                      ))}
                    </select>
                    {validationErrors?.DestinationId && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.DestinationId}
                      </div>
                    )}
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
                          name="Default"
                          value="1"
                          id="default_yes"
                          checked={formValue?.Default.includes("1")}
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
                          name="Default"
                          value="0"
                          id="default_no"
                          checked={formValue?.Default.includes("0")}
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
                    <label className="m-0">
                      No Of Day <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="NoOfDays"
                      className="form-control form-control-sm"
                      name="NoOfDays"
                      value={formValue?.NoOfDays}
                      onChange={handleInputChange}
                    />
                    {validationErrors?.NoOfDays && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.NoOfDays}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label>Transport Type</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="TransportType"
                          id="Railway"
                          value="Railway Station"
                          checked={
                            formValue?.TransportType === "Railway Station"
                          }
                          onChange={handleInputChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="Railway Station"
                        >
                          Railway
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="TransportType"
                          id="Airport"
                          value="Airport"
                          checked={formValue?.TransportType === "Airport"}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="Airport">
                          Airport
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* <div className="col-12">
                    <CKEditor
                      editor={ClassicEditor}
                      data={editorData} // Preloaded content for editing
                      onChange={handleEditorChange}
                    />
                  </div> */}
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
            <div className="d-flex gap-3 justify-content-end mt-1">
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
        </div>
      </div>
    </div>
  );
};

export default Add;
