import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosOther } from "../../../../http/axios_base_url";
import { notifySuccess, notifyError } from "../../../../helper/notify";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setQoutationData } from "../../../../store/actions/queryAction";

const AddQuotation = () => {
  const [hotelCategoryList, setHotelCategoryList] = useState([]);
  const [quotatinoList, setQuotationList] = useState([]);
  const [queryList, setQueryList] = useState([]);

  const { queryData, qoutationData, queryUpdateData } = useSelector(
    (data) => data?.queryReducer
  );
  const dispatch = useDispatch();

  const [quotationFormValue, setQuotationFormValue] = useState({
    QueryId: queryData?.QueryAlphaNumId,
    Subject: "Corenthum",
    HotelCategory: "Single Hotel Category",
    PaxSlabType: "Single Slab",
    HotelMarkupType: "Service Wise Markup",
    HotelStarCategory: [],
    PackageID: "",
  });

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("listqueryquotation", {
        QueryId: queryData?.QueryAlphaNumId,
      });

      setQuotationList(data?.data);
    } catch (error) {
      console.log("error", error);
    }

    try {
      const { data } = await axiosOther.post("querymasterlist", {
        id: queryData?.QueryAlphaNumId,
      });
      setQueryList(data?.DataList[0]);
    } catch (error) {
      console.log("error", error);
    }

    try {
      const { data } = await axiosOther.post("hotelcategorylist");
      setHotelCategoryList(data?.DataList);
    } catch (error) {
      console.log("error");
    }
  };
  useEffect(() => {
    postDataToServer();
  }, []);

  const handleQuotationFormChange = (e) => {
    const { name, value, checked } = e.target;
    if (checked == undefined) {
      setQuotationFormValue({ ...quotationFormValue, [name]: value });
    }

    if (checked && checked != undefined) {
      setQuotationFormValue({
        ...quotationFormValue,
        HotelStarCategory: [...quotationFormValue?.HotelStarCategory, value],
      });
    }

    if (!checked && checked != undefined) {
      const checkedCategory = quotationFormValue?.HotelStarCategory?.filter(
        (category) => category != value
      );
      setQuotationFormValue({
        ...quotationFormValue,
        HotelStarCategory: checkedCategory,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosOther.post(
        "addquerywithjson",
        quotationFormValue
      );

      if (data?.status == 1 || data?.Status == 1) {
        dispatch(setQoutationData(data?.Response));
        setQuotationFormValue({
          QueryId: queryData?.QueryAlphaNumId,
          Subject: "Corenthum",
          HotelCategory: "Single Hotel Category",
          PaxSlabType: "Single Slab",
          HotelMarkupType: "Service Wise Markup",
          HotelStarCategory: [],
          PackageID: "",
        });
      } else {
        notifyError(data?.Message || data?.message || data?.error);
      }
    } catch (error) {
      console.log("quotation-error", error);
      if (error.response?.data?.Errors || error.response?.data?.error) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.error
        );
        notifyError(data[0][1]);
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12 p-0">
          <div>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
              <div className="row form-row-gap">
                <div className="col-sm-6 col-md-3">
                  <label htmlFor="" className="font-size-12">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="Subject"
                    placeholder="Subject"
                    value={quotationFormValue?.Subject}
                    onChange={handleQuotationFormChange}
                  />
                </div>
                <div className="col-sm-6 col-md-3">
                  <label htmlFor="" className="font-size-12">
                    Hotel Category Type
                  </label>
                  <select
                    name="HotelCategory"
                    id=""
                    className="form-control form-control-sm"
                    value={quotationFormValue?.HotelCategory}
                    onChange={handleQuotationFormChange}
                  >
                    <option value="Single Hotel Category">
                      Single Hotel Category
                    </option>
                    <option value="Multiple Hotel Category">
                      Multiple Hotel Category
                    </option>
                  </select>
                </div>
                <div className="col-sm-6 col-md-3">
                  <label htmlFor="" className="font-size-12">
                    Pax Slab Type
                  </label>
                  <select
                    name="PaxSlabType"
                    id=""
                    className="form-control form-control-sm"
                    value={quotationFormValue?.PaxSlabType}
                    onChange={handleQuotationFormChange}
                  >
                    <option value="Single Slab">Single Slab</option>
                    <option value="Multiple Slab">Multiple Slab</option>
                  </select>
                </div>
                <div className="col-sm-6 col-md-3">
                  <label htmlFor="" className="font-size-12">
                    Hotel Markup Type
                  </label>
                  <select
                    name="HotelMarkupType"
                    id=""
                    className="form-control form-control-sm"
                    value={quotationFormValue?.HotelMarkupType}
                    onChange={handleQuotationFormChange}
                  >
                    <option value="Service wise Markeup">
                      Service Wise Markup
                    </option>
                    <option value="Hotel wise Markeup">
                      Hotel Wise Markup
                    </option>
                  </select>
                </div>
                {quotationFormValue?.HotelCategory ==
                  "Multiple Hotel Category" && (
                  <div className="col-6">
                    <label htmlFor="" className="m-0 font-size-12">
                      Multiple Hotel Star Category
                    </label>
                    <div className="d-flex gap-2 flex-wrap border px-1 min-heihgt-25">
                      {hotelCategoryList?.map((category, index) => {
                        return (
                          <div
                            className="form-check custom-checkbox mb-3 checkbox-danger"
                            key={index}
                          >
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`star${index}`}
                              value={category?.id}
                              checked={quotationFormValue?.HotelStarCategory.some(
                                (value) => value == category?.id
                              )}
                              onChange={handleQuotationFormChange}
                            />

                            <label
                              htmlFor={`star${index}`}
                              className="form-check-label"
                            >
                              {category?.UploadKeyword}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="col-sm-6 col-md-3">
                  <label htmlFor="" className="font-size-12">
                    Select Inbuilt Packages
                  </label>
                  <select
                    name="PackageID"
                    id=""
                    className="form-control form-control-sm"
                    value={quotationFormValue?.PackageID}
                    onChange={handleQuotationFormChange}
                  >
                    <option value="">Select</option>
                  </select>
                </div>
                <div className="col-sm-6 col-md-3 d-flex align-items-end">
                  <button className="btn btn-primary" type="submit">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuotation;
