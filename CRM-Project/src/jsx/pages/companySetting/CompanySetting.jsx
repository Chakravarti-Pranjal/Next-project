import { useEffect, useState } from 'react';
import { axiosOther } from "../../../http/axios_base_url.js";
import "react-toastify/dist/ReactToastify.css";
import { notifySuccess, notifyError } from "../../../helper/notify.jsx";
import PerfectScrollbar from "react-perfect-scrollbar";

const CompanySetting = () => {
    const [productList, setProductList] = useState([]);
    const [formData, setFormData] = useState({});
    const [formError, setFormError] = useState("");

    // const getListDataToServer = async () => {

    //     try {
    //         const listResponse = await axiosOther.post("listproduct");
    //         const productListData = listResponse?.data?.Datalist || [];
    //         setProductList(productListData);

    //         // Initialize formData
    //         const initialData = {};
    //         productListData.forEach((item) => {
    //             initialData[item.id] = {
    //                 ProductName: item.name,
    //                 MarkupType: "%",
    //                 MarkupValue: "",
    //             };
    //         });
    //         setFormData(initialData);
    //     } catch (err) {
    //         console.error("Error fetching data:", err);
    //     }



    //     const listResponse = await axiosOther.post("listCompanySetting");

    //     try {

    //     } catch (err) {
    //         console.error("Error fetching data:", err);
    //     }
    // };

    const getListDataToServer = async () => {
        try {
            const productRes = await axiosOther.post("listproduct");
            const productListData = productRes?.data?.Datalist || [];
            setProductList(productListData);

            // Pehle default initialize
            const defaultData = {};
            productListData.forEach((item) => {
                defaultData[item.id] = {
                    ProductName: item.name,
                    MarkupType: "%",
                    MarkupValue: "",
                };
            });

            // Ab CompanySetting API call
            const companySettingRes = await axiosOther.post("listCompanySetting");
            const existingSetting = companySettingRes?.data?.DataList?.find(
                (item) => item?.Key === "markup"
            );

            // Final data banayenge
            let finalFormData = { ...defaultData };

            if (existingSetting && Array.isArray(existingSetting.Value)) {
                existingSetting.Value.forEach((settingItem) => {
                    const { ProductID, ProductName, MarkupType, MarkupValue } = settingItem;
                    if (finalFormData[ProductID]) {
                        finalFormData[ProductID] = {
                            ProductName,
                            MarkupType,
                            MarkupValue,
                        };
                    }
                });
            }

            setFormData(finalFormData);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };



    useEffect(() => {
        getListDataToServer();
    }, []);


    const handleChange = (productId, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async () => {
        let CompanyUniqueId = JSON.parse(localStorage.getItem("token"))?.companyKey;
        // Validation
        for (let [productId, data] of Object.entries(formData)) {
            if (!data.MarkupType || !data.MarkupValue) {
                setFormError(`Please fill all fields for product`);
                return;
            }
        }

        // Clear error message if all fields are filled
        setFormError("");
        const valueArray = Object.entries(formData).map(([productId, data]) => ({
            ProductID: productId,
            ProductName: data.ProductName,
            MarkupType: data.MarkupType,
            MarkupValue: data.MarkupValue,
        }));

        const payload = {
            id: "",
            CompanyId: CompanyUniqueId,
            Key: "markup",
            Value: valueArray,
            Status: 1,
            AddedBy: "1",
            UpdatedBy: "1",
        };

        // console.log("Final Payload =>", payload);
        try {
            const { data } = await axiosOther.post("/craeteupdatecompanySetting", payload);
            if (data?.Status === 1) {
                notifySuccess(data?.Message || "Success");

                // ✅ Reset form fields after successful submission
                const resetData = {};
                productList.forEach((item) => {
                    resetData[item.id] = {
                        ProductName: item.name,
                        MarkupType: "",
                        MarkupValue: "",
                    };
                });
                // setFormData(resetData);
            }
        } catch (err) {
            notifyError("Something went wrong");
        }
    };
    // console.log(formData, "formData")


    return (
        <>
            <div className="col-12">
                <h3 className="mb-2">Service Wise Markup</h3>
                <table
                    className="table table-bordered itinerary-table"
                // style={{ tableLayout: "fixed", width: "100%" }}
                >
                    <thead>
                        <tr>
                            {productList.map((item, index) => (
                                <th key={index} className="py-1 text-center align-middle text-text-capitalize">
                                    {item.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {productList.map((item, index) => (
                                <td key={`select-${index}`} style={{ minWidth: "120px", wordBreak: "break-word" }}>
                                    <select
                                        className="formControl1 w-100"
                                        value={formData[item.id]?.MarkupType || "%"}
                                        onChange={(e) =>
                                            handleChange(item.id, "MarkupType", e.target.value)
                                        }
                                    >
                                        {/* <option value="">Select</option> */}
                                        <option value="%">%</option>
                                        <option value="flat">Flat</option>
                                    </select>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            {productList.map((item, index) => (
                                <td key={`input-${index}`} style={{ minWidth: "120px", wordBreak: "break-word" }}>
                                    <input
                                        type="number"
                                        className="formControl1 w-100"
                                        value={formData[item.id]?.MarkupValue || ""}
                                        onChange={(e) =>
                                            handleChange(item.id, "MarkupValue", e.target.value)
                                        }
                                    />
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            {formError && (
                <div className="animated fadeInUp text-red" style={{ marginTop: "-13px", fontSize: "12px" }}>
                    {formError}
                </div>
            )}

            <div className="col-12 d-flex justify-content-end align-items-end">
                <button
                    className="btn btn-primary py-1 px-2 radius-4"
                    onClick={handleSubmit}
                >
                    {/* <i className="fa-solid fa-floppy-disk fs-4"></i> */}
                    Update
                </button>
            </div>
        </>
    );
};

export default CompanySetting;
