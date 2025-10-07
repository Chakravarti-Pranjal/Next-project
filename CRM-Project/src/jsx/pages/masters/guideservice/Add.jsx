<div className="row">
  <div className="col-12">
    <div className="row form-row-gap">
      <div className="col-md-6 col-lg-3">
        <label className="" htmlFor="status">
          Service Type
        </label>
        <select
          name="ServiceType"
          id="status"
          value={formValue?.ServiceType}
          onChange={handleFormChange}
          className="form-control form-control-sm"
        >
          <option value="Guide">Guide</option>
          <option value="Porter">Porter</option>
          <option value="Tour Manager">Tour Manager</option>
        </select>
      </div>

      <div className="col-md-6 col-lg-3">
        <label className="" htmlFor="status">
          Destination
        </label>
        <select
          name="State"
          id="status"
          className="form-control form-control-sm"
          value={formValue?.State}
          onChange={handleFormChange}
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
      </div>
      <div className="col-md-6 col-lg-3">
        <label className="" htmlFor="status">
          Guide Service
        </label>
        <input
          type="text"
          placeholder="Guide Service"
          name="State"
          id="status"
          className="form-control form-control-sm"
          value={formValue?.State}
          onChange={handleFormChange}
        />
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
          Default <span className="text-danger">*</span>
        </label>
        <div className="d-flex gap-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="Default"
              value="1"
              id="default_yes"
              checked={formValue?.Default?.includes("1")}
              onChange={handleFormChange}
            />
            <label className="form-check-label" htmlFor="default_yes">
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
              checked={formValue?.Default?.includes("0")}
              onChange={handleFormChange}
            />
            <label className="form-check-label" htmlFor="default_no">
              No
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>;