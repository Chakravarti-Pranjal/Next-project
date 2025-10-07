import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosOther } from "../../../http/axios_base_url";
import useMultipleSelect from "../../../hooks/custom_hooks/useMultipleSelect";
import { defaultemailsInitialValue } from "./emailTemplate-intial-values"
import { notifyError, notifySuccess } from "../../../helper/notify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const AddEmailTemplate = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [formValue, setFormValue] = useState(defaultemailsInitialValue);
    const [languageList, setLanguageList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [reportingManagerList, setReportingManagerList] = useState([]);
    const [designationList, setDesignationList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [emailKeyslist, setemailKeyslist] = useState([]);
    const [userType, setUserType] = useState([]);
    const [orgType, setOrgType] = useState([]);

    const [validationErrors, setValidationErrors] = useState({});

    const [isEditing, setIsEditing] = useState(state?.data?.id ? true : false);
    const companyId = JSON.parse(localStorage.getItem("token"))?.companyKey;

    const languageOption = languageList?.map((lang) => {
        return {
            value: lang?.id,
            label: lang?.Name,
        };
    });
    const roleOption = roleList?.map((role) => {
        return {
            value: role?.id,
            label: role?.name,
        };
    });
    const reportingManagerOptions = reportingManagerList?.map((role) => {
        return {
            value: role?.UserID,
            label: role?.UserName,
        };
    });
    const {
        SelectInput: LanguageInput,
        selectedData: languageSelected,
        setSelectedData: setLanguageSelected,
    } = useMultipleSelect(languageOption);
    const {
        SelectInput: ReportingManager,
        selectedData: reportingManagerSelected,
        setSelectedData: setReportingManagerSelected,
    } = useMultipleSelect(reportingManagerOptions);
    const {
        SelectInput: RoleInput,
        selectedData: roleSelected,
        setSelectedData: setRoleSelected,
    } = useMultipleSelect(roleOption);

    const getDataToServer = async () => {

        try {
            const Data = await axiosOther.post("email-keys");
            // console.log(Data.data, "email-keys");

            setemailKeyslist(Data.data);
            // console.log(Data.data.DataList, "Datalistss");
        } catch (err) {
            console.log(err);
        }
        try {
            const { data } = await axiosOther.post("designation-list");
            setDesignationList(data?.Data);
        } catch (err) {
            console.log(err);
        }

        try {
            const { data } = await axiosOther.post("orglistbycompanyid", {
                CompanyId: companyId,
            });
            setOrgType(data?.Datalist);
            // console.log({ userType });
        } catch (err) {
            console.log(err);
        }

        try {
            const language = await axiosOther.post("languagelist", {
                Search: "",
                Status: 1,
            });
            setLanguageList(language.data.DataList);
        } catch (err) {
            console.log(err);
        }
        try {
            const data = await axiosOther.post("roles", {
                name: "",
                company_id: companyId,
            });

            setRoleList(data?.data?.data);
        } catch (err) {
            console.log(err);
        }
        try {
            const data = await axiosOther.post("listofalluserbycompanyname", {
                CompanyId: companyId,
                OrgType: "Internal",
            });

            setReportingManagerList(data?.data?.Datalist);
            // console.log(reportingManagerList);
            // console.log(companyId);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getDataToServer();
    }, []);

    useEffect(() => {
        if (orgType?.length > 0 && !formValue.OrganizationId) {
            const internal = orgType.find((item) => item.name === "Internal");
            if (internal) {
                setFormValue((prev) => ({ ...prev, OrganizationId: internal.id }));
            }
        }
    }, [orgType, formValue.OrganizationId]);


    useEffect(() => {
        if (state?.data) {
            setFormValue({
                id: state.data.id,
                title: state.data.title,
                subject: state.data.subject,
                body: state.data.body,
                signature: state.data.signature,
                status: state.data.status,
                user_id: state.data.user_id,
                company_id: state.data.company_id,
                usertype: state.data.usertype,
                variable_json: state.data.variable_json,
                email_key_id: state.data.email_key_id,
                email_key: state.data.email_key,
            });
        }
    }, [state])

    // Form Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        let CompanyUniqueId = JSON.parse(localStorage.getItem("token"))?.companyKey;
        const UserID = JSON.parse(localStorage.getItem("token")).UserID;


        try {
            const { data } = await axiosOther.post("update-email-default-template", {
                ...formValue,
                id: state.data.id,
                user_id: state.data.user_id,
                company_id: state.data.company_id,
                usertype: state.data.usertype
            });
            // console.log(data, "email_data");
            // console.log(state, "email_dataS");

            if (data?.Status == 1) {
                notifySuccess("User update successfully");
                setTimeout(() => {
                    navigate("/user-profile/email-templates");
                }, 3000);
            } else {
                notifyError(data?.message || data?.Message);
            }
        } catch (error) {
            notifyError(err);
            console.log(error);
        }

    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        if (name === "email_key_id") {
            const selected = emailKeyslist.find((item) => String(item.id) === value);

            setFormValue((prev) => ({
                ...prev,
                [name]: value,
                email_key: selected ? selected.email_key : "",
            }));
        } else {

            setFormValue((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    // reset Handler
    const handleResetData = (e) => {
        e.preventDefault();
        setFormValue({
            title: "",
            subject: "",
            body: "",
            signature: "",
            status: "",
            email_key: "",
        })
        // setFormValue(userIntialValue);
        // console.log(companyId);
    };


    const handleMailBody = (data, editor) => {
        const cleanedData = data.replace(/<[^>]*>/g, "").trim();
        // const plainText = editor.editing.view.document.getRoot().getChild(0).getChild(0).data;
        setFormValue((prevState) => ({
            ...prevState,
            body: data,
        }));
    };

    const handleMailSignature = (data, editor) => {
        const cleanedData = data.replace(/<[^>]*>/g, "").trim();
        setFormValue((prevState) => ({
            ...prevState,
            signature: data,
        }));
    };

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header mb-2">
                        <h4 className="card-title">create email template</h4>
                        <button
                            className="btn btn-dark btn-custom-size"
                            name="SaveButton"
                            onClick={() => navigate(-1)}
                        >
                            <span className="me-1">Back</span>
                            <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="form-validation">
                            <ToastContainer />
                            <form className="form-valide" action="#" method="post" onSubmit={(e) => e.preventDefault()}>
                                <div className="row">
                                    <div className="col-md-6 col-lg-4">
                                        <label htmlFor="" className="mb-1">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm`}
                                            name="title"
                                            placeholder="Title"
                                            value={formValue?.title}
                                            onChange={handleFormChange}
                                        />
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <label htmlFor="" className="mb-1">
                                            Mail Subject
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm`}
                                            name="subject"
                                            placeholder="Enter Email Subject"
                                            value={formValue?.subject}
                                            onChange={handleFormChange}
                                        />
                                    </div>
                                    <div className="col-md-6 col-lg-2">
                                        <label className="" htmlFor="email_key_id">
                                            Email Key
                                        </label>
                                        <select
                                            name="email_key_id"
                                            className="form-control form-control-sm"
                                            value={formValue.email_key_id}
                                            onChange={handleFormChange}
                                        >
                                            <option value="">Select</option>
                                            {emailKeyslist?.length > 0 &&
                                                emailKeyslist.map((item) => (
                                                    <option value={item.id} key={item.id}>
                                                        {item.email_key}
                                                    </option>
                                                ))}
                                        </select>

                                    </div>
                                    <div className="col-md-6 col-lg-2">
                                        <label className="" htmlFor="status">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            className="form-control form-control-sm"
                                            value={formValue?.status}
                                            onChange={handleFormChange}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="col-12 p-0 mt-4">
                                        <div className="form-group" dir="ltr">
                                            <label htmlFor="mail-body" className="m-0">
                                                Mail Body
                                            </label>
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={formValue?.body || ""}
                                                name="Description"
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    handleMailBody(data, editor);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 p-0 mt-4">
                                        <div className="form-group" dir="ltr">
                                            <label htmlFor="mail-body" className="m-0">
                                                Signature
                                            </label>
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={formValue?.signature || ""}
                                                name="Description"
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    handleMailSignature(data, editor);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-12 d-flex align-items-center justify-content-end gap-2 mt-3">

                                        <button
                                            onClick={(e) => handleResetData(e)}
                                            className="btn btn-dark btn-custom-size"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-custom-size"
                                            onClick={(e) => handleSubmit(e)}
                                        >Submit
                                        </button>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEmailTemplate;
