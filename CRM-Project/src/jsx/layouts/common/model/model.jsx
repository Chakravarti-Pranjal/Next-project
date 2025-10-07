import React, { useEffect, useRef } from "react";
import { axiosOther } from "../../http/axios/axios_new";
import toast, { Toaster } from "react-hot-toast";
import { Formik, Form } from "formik";
import { IoMdAdd } from "react-icons/io";
import Tooltip from "../../helper/Tooltip";

const Model = ({
  children,
  heading,
  apiurl,
  initialValues,
  validationSchema,
  forEdit,
  isEditing,
  setIsEditing,
  setChangeValue,
  setUpdateData,
  updateData,
  imageValue,
  setImageValue,
  description,
  multipleValue,
  setMultipleValue,
  setCheckValue,
  setSearch,
  setDescription,
}) => {
  const modelRef = useRef();

  const handleSubmit = async (values, { resetForm }) => {
    console.log("Submit Modal Value", {
      ...values,
      ...imageValue,
      ...description,
      ...multipleValue,
      
    });

    try {
      const { data } = await axiosOther.post(apiurl, {
        ...values,
        ...imageValue,
        ...description,
        ...multipleValue,
      });

      console.log("rsponse", data);

      if (data?.Status == 1) {
        toast.success(data?.Message);
        setUpdateData(!updateData);
        setMultipleValue?.forEach((setterFunction) => {
          setterFunction([]);
        });
        resetForm();
        modelRef.current.click();
        imageValue != undefined &&
          setImageValue({ ImageName: "", ImageData: "" });
        if (setCheckValue) {
          setCheckValue("No");
        }
        if (setDescription) {
          setDescription("");
        }
        setSearch({
          Search: "",
          Status: "",
        });
      }

      if (data?.Status != 1) {
        toast.error(data?.Message);
      }
    } catch (err) {

      if (err.response?.data.Errors) {
        const error = Object.entries(err.response?.data.Errors).map(
          ([key, value]) => {
            toast.error(value[0]);
          }
        );
        return null;
      }

      if (err) {
        toast.error(err?.response?.statusText);
      }

      console.log('error', err);
    }
  };

  return (
    <>
      <Tooltip text="Create New" position="bottom" textColor="text-dark">
        <button
          type="button"
          className="back-button box-shadow-2"
          data-toggle="modal"
          data-target="#modal_form_vertical"
          onClick={() => setIsEditing(false)}
        >
          <IoMdAdd size={18} color="green" fontWeight={700} />
        </button>
      </Tooltip>
      <Toaster />
      <div
        className="modal fade"
        id="modal_form_vertical"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header blue-background py-1 text-light">
              <h5 className="modal-title m-0" id="exampleModalLabel">
                {heading}
              </h5>
              <p
                className="m-0 cursor-pointer font-weight-normal"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" className="m-0 fs-3">
                  &times;
                </span>
              </p>
            </div>
            <Formik
              method="POST"
              initialValues={isEditing ? forEdit : initialValues}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values, { resetForm });
              }}
            >
              {({ values, handleChange, handleBlur, setFieldValue }) => {
                {
                  useEffect(() => {
                    setChangeValue(values);
                  }, [values]);
                }
                return (
                  <Form>
                    <div className="modal-body p-3">
                      {/* modal body */}
                      {children}
                      {/* /modal body */}
                    </div>

                    <div className="modal-footer p-3 pt-0">
                      <button type="submit" className="modal-save-button">
                        Save
                      </button>
                      <button
                        type="button"
                        ref={modelRef}
                        className="modal-close-button"
                        data-dismiss="modal"
                      >
                        Close
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Model;

