import React, { useState } from "react";
// import Editor from "../../../../helper/Editor";
import { itenarayInfoPopupList } from "../quotationdata";

const ItineraryModal = () => {
  const [formData, setFormData] = useState({
    Language: "",
  });

  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelect = (value) => {
    setSelectedValue(value);
  };

  const handleItenararyEditor = (content) => {};

  const handleBackTitle = () => {
    setSelectedValue("");
  };

  return (
    <>
      {selectedValue == "" && (
        <div className="row">
          <div className="col-6">
            <input
              type="text"
              placeholder="Enter Search Keyword"
              className="form-control"
            />
          </div>
          <div className="col-12 mt-3">
            <table className="table table-bordered table-striped">
              <thead className="border-0">
                <tr className="border-0">
                  <th className="border-0">#</th>
                  <th className="border-0">TITLE/DESCRIPTION</th>
                  <th className="border-0">LANGUAGE</th>
                  <th className="border-0">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {itenarayInfoPopupList?.DataList?.map((value) => {
                  return (
                    <tr key={value?.id}>
                      <td className="p-1 font-size-11 text-center">
                        {value?.id}
                      </td>
                      <td className="p-1 font-size-11">
                        <p className="m-0 font-weight-bold">{value?.Title}</p>
                        <p>{value?.Text}</p>
                      </td>
                      <td className="p-1 font-size-11 text-center">
                        <select
                          name="Language"
                          value={formData?.Language}
                          onChange={handleChange}
                          className="form-control form-control-sm"
                        >
                          <option value="">Select</option>
                          <option value="1">English</option>
                          <option value="2">Hindi</option>
                        </select>
                      </td>
                      <td className="p-1 font-size-11 text-center">
                        <p
                          className="border px-3 py-1 bg-success rounded m-0 cursor-pointer"
                          onClick={() => handleSelect(value)}
                        >
                          Select
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {selectedValue != "" && (
        <div className="row row-gap-3 position-relative">
          <div className="col-12">
            <input
              type="text"
              name="Title"
              value={selectedValue?.Title}
              className="form-control"
            />
          </div>
          <div className="col-12">
            {/* <Editor
              heightValue="100px"
              handleChangeEditor={handleItenararyEditor}
              initialValue={selectedValue == "" ? "" : selectedValue?.Text}
            /> */}
          </div>
          <button
            className=" btn width60px btn-sm btn-dark position-absolute bottom-80px right190px"
            onClick={handleBackTitle}
          >
            Back
          </button>
        </div>
      )}
    </>
  );
};

export default ItineraryModal;
