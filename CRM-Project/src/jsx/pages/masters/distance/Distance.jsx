import React, { useState, useEffect } from "react";
import { DistanceValidationSchema } from "../master_validation";
import useMultipleSelect from "../../../../hooks/custom_hooks/useMultipleSelect";
import { distanceInitialValue } from "../masters_initial_value";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../../../../scss/main.css";
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const languageDescObj =
{
    ToDestinationId: "",
    DistanceKm: "",
    DistanceTime: "",
}



const Distance = () => {
    const [formValue, setFormValue] = useState(distanceInitialValue);
    const [validationErrors, setValidationErrors] = useState({});
    const [destinationList, setDestinationList] = useState([]);
    const [descriptionForm, setDescriptionForm] = useState([languageDescObj]);
    const [toDestinationList, settoDestinationList] = useState([]);
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
        try {
            const destinationlist = await axiosOther.post("destinationlist", {
                Search: "",
                Status: 1,
            });
            settoDestinationList(destinationlist.data.DataList);
        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        getDataToServer();
    }, []);



    // Handle form submission
    // console.log("languageDescObj",descriptionForm)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await DistanceValidationSchema.validate({ ...formValue, ToDestination: descriptionForm }, { abortEarly: false });

            // setValidationErrors({});
            // console.log("Submitting form:");

            const { data } = await axiosOther.post("store-distance", { ...formValue, ToDestination: descriptionForm, });

            if (data?.Status === 1) {
                getDataToServer()
                toast.success("Successfully submitted!");
                setFormValue(distanceInitialValue)
                navigate("/distance-master");
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

    // console.log("validation-error",validationErrors);

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
    const handleEditorChange = (e, ind) => {
        const { name, value } = e.target;
        setDescriptionForm((prevArr) => {
            let newArr = [...prevArr];

            // Ensure the index exists in the array
            if (!newArr[ind]) {
                newArr[ind] = {};
            }

            newArr[ind] = { ...newArr[ind], [name]: value };
            return newArr;
        });

    };

    // console.log("Updated Data:",field,data);
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
    useEffect(() => {
        if (state) {
            setFormValue({
                ...distanceInitialValue,
                ...state,
                // ToDestination: state?.ToDestination?.map((dest) => ({
                //     ToDestinationId: dest.ToDestinationId,
                //     DistanceKm: dest.DistanceKm,
                //     DistanceTime: dest.DistanceTime
                // })),
                AddedBy: 0,
                UpdatedBy: "1",
            });
            setDescriptionForm(state?.ToDestination)
            // console.log(state?.ToDestination, "state?.ToDestination")
        }
    }, [state]);


    const handleDescriptionInc = () => {
        // setDescriptionForm([...descriptionForm,languageDescObj]);
        setDescriptionForm((descriptionForm) => {
            let newForm = [...descriptionForm];
            newForm = [...descriptionForm, languageDescObj];
            return newForm;
        });
    };

    const handleDescriptionDec = (ind) => {
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




    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header py-3">
                        <h4 className="card-title">Add distance</h4>
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



                                        {/* Destination Field */}

                                        <div className="col-md-6 col-lg-3">
                                            <label htmlFor="DestinationId">
                                                From  Destination <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                name="FromDestination"
                                                id="FromDestination"
                                                className="form-control form-control-sm"
                                                value={formValue?.FromDestination} // Ensure it matches state
                                                onChange={(e) => handleFormChange(e)}
                                            >
                                                <option value="">Select</option>
                                                {destinationList?.map((dist) => (
                                                    <option key={dist.id} value={dist.id}>
                                                        {dist.Name}
                                                    </option>
                                                ))}
                                            </select>
                                            {/* {validationErrors?.FromDestination && (
                                                <div className="invalid-feedback d-block">
                                                    {validationErrors?.FromDestination}
                                                </div>
                                            )} */}

                                        </div>
                                        <div className="card shadow border mt-3">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-12 col-lg-8">
                                                        <table className="table card-table display mb-4 shadow-hover default-table dataTablesCard dataTable no-footer mt-2" id="example2">
                                                            <thead>
                                                                <tr className="d-flex justify-content-center w-100">
                                                                    <th className=" w-5">Sr. No.</th>
                                                                    <th className="w-50 " > To Destination</th>
                                                                    <th className="d-flex flex-wrap w-100">Distance Km</th>
                                                                    <th className="d-flex flex-wrap w-100">Distance Time</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {descriptionForm?.map((description, ind) => (
                                                                    <tr className="d-flex justify-content-center w-100 gap-2" key={ind}>
                                                                        <td className="pt-5 ps-5 ">{ind + 1}</td>
                                                                        <td className="w-50 ps-4">
                                                                            <div className="col-md-6 col-xl-12 ">

                                                                                <label>To Destination</label>
                                                                                <select
                                                                                    name="ToDestinationId"
                                                                                    id="ToDestinationId"
                                                                                    className="form-control form-control-sm"
                                                                                    value={description.ToDestinationId} // Ensure it matches state
                                                                                    onChange={(e) => handleDescriptionFomChange(ind, e)}
                                                                                >
                                                                                    <option value="">Select</option>
                                                                                    {toDestinationList?.map((dist) => (
                                                                                        <option key={dist.id} value={dist.id}>
                                                                                            {dist.Name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                        </td>
                                                                        <td className="d-flex flex-wrap w-100 ps-4">

                                                                            <div className="col-md-6 col-xl-12 ">
                                                                                <label>Distance Km</label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm"
                                                                                    // Unique ID per field
                                                                                    name={"DistanceKm"}
                                                                                    placeholder={`Enter DistanceKm`} // Dynamic placeholder
                                                                                    value={description?.DistanceKm || ""}
                                                                                    onChange={(e) => handleEditorChange(e, ind)}
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td className="d-flex flex-wrap w-100">
                                                                            <div className="col-md-6 col-xl-12 ps-4">
                                                                                <label>Distance Time </label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm"
                                                                                    name={"DistanceTime"}
                                                                                    placeholder="Enter" // Dynamic placeholder
                                                                                    value={description?.DistanceTime || ""}
                                                                                    onChange={(e) => handleEditorChange(e, ind)}
                                                                                />
                                                                            </div>
                                                                        </td>


                                                                        <td className="pt-5">
                                                                            {ind === 0 ? (
                                                                                <button className="btn btn-primary btn-custom-size" onClick={handleDescriptionInc}>+</button>
                                                                            ) : (
                                                                                <button className="btn btn-primary btn-custom-size" onClick={() => handleDescriptionDec(ind)}>-</button>
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

export default Distance;
