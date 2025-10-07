import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";

const profilestagemaster = () => {
  const rowintial = {
    id: "",
    Fk_statusId: "",
    description: "",
    StageNo: "",
    ShowName: "",
    Color: "",
    OederNo: "",
    Status: "",
    AddedBy: 1,
    UpdatededBy: 1,
  };
  const stageobject = {
    id: "",
    Fk_statusId: "",
    description: "",
    StageNo: "",
    ShowName: "",
    Color: "",
    OederNo: "",
    Status: "",
    AddedBy: 1,
    UpdatededBy: 1,
  };

  const navigate = useNavigate();
  const [descriptionForm, setDescriptionForm] = useState([
    {
      id: "",
      Fk_statusId: "",
      description: "",
      StageNo: "",
      ShowName: "",
      Color: "",
      OederNo: "",
      Status: "",
      AddedBy: 1,
      UpdatededBy: 1,
    },
  ]);
  const handleDescriptionInc = () => {
    setDescriptionForm((prev) => [...prev, stageobject]);
  };
  const handleDescriptionDec = (ind) => {
    // const filterdata = descriptionForm.filter((_, i) => i == ind);
    if (descriptionForm.length > 1) {
      setDescriptionForm((prev) => {
        let data = [...prev];
        data = descriptionForm.filter((_, i) => i !== ind);
        return data;
      });
    }
  };

  const handleFormChange = (e, ind) => {
    const { name, value } = e.target;
    // console.log(name, value, "name,value");
    setDescriptionForm((prev) => {
      const update = [...prev];
      update[ind] = {
        ...update[ind],
        [name]: value,
      };
      return update;
    });
  };
  console.log(descriptionForm, "descriptionForm");
  const handleSubmit = async () => {
    try {
      const data = await axiosOther.post(
        "add-update-stage-master",
        descriptionForm
      );
      console.log(data, "data");
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleReset = () => {
    setDescriptionForm(() => [
      {
        id: "",
        Fk_statusId: "",
        description: "",
        StageNo: "",
        ShowName: "",
        Color: "",
        OederNo: "",
        Status: "",
        AddedBy: 1,
        UpdatededBy: 1,
      },
    ]);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-header mb-2">
          <h3 className="mb-0">Add Task Scheduling Template</h3>
          <div className="d-flex gap-3">
            <button
              className="btn btn-dark btn-custom-size"
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
            <button
              onClick={handleReset}
              className="btn btn-secondary btn-custom-size"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="form-validation">
          <form
            className="form-valide"
            action="#"
            method="post"
            // onSubmit={handleSubmit}
          >
            <div className="row">
              <div className="col-md-12 col-lg-10">
                <table className="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      <th>Fk_statusId</th>
                      <th>StageNo</th>
                      <th>ShowName</th>
                      <th>Color</th>
                      <th>OederNo</th>
                      <th>Status</th>

                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {descriptionForm?.map((formValue, ind) => {
                      return (
                        <tr key={ind + 1}>
                          <td>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="name"
                              name="Fk_statusId"
                              value={formValue?.Fk_statusId}
                              onChange={(e) => handleFormChange(e, ind)}
                              placeholder="Fk_statusId"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="name"
                              name="StageNo"
                              value={formValue?.StageNo}
                              onChange={(e) => handleFormChange(e, ind)}
                              placeholder="StageNo"
                            />
                          </td>
                          <td>
                            <div className="customheight-editor">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="name"
                                name="ShowName"
                                value={formValue?.ShowName}
                                onChange={(e) => handleFormChange(e, ind)}
                                placeholder="Name"
                              />
                            </div>
                          </td>
                          <td>
                            <div className="customheight-editor">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="name"
                                name="Color"
                                value={formValue?.Color}
                                onChange={(e) => handleFormChange(e, ind)}
                                placeholder="Name"
                              />
                            </div>
                          </td>
                          <td>
                            <div className="customheight-editor">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id="name"
                                name="OederNo"
                                value={formValue?.OederNo}
                                onChange={(e) => handleFormChange(e, ind)}
                                placeholder="Name"
                              />
                            </div>
                          </td>
                          <td>
                            <div className="customheight-editor">
                              <select
                                name="Status"
                                id=""
                                className="form-control form-control-sm"
                                value={formValue?.Status}
                                onChange={(e) => handleFormChange(e, ind)}
                              >
                                <option value="">Select</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            {ind == 0 ? (
                              <button
                                type="button"
                                className="btn btn-primary btn-custom-size"
                                onClick={handleDescriptionInc}
                              >
                                +
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-primary btn-custom-size"
                                onClick={() => handleDescriptionDec(ind)}
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default profilestagemaster;
