import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { destinationValidationSchema } from "../master_validation.js";
import { destinationimageInitialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import { wrap } from "highcharts";
import useImageContainer from "../../../../helper/useImageContainer";
import { Modal, Row, Table, Button } from "react-bootstrap";
import useSingleImageContainer from "../../../../helper/useSingleImageContainer";
import extractTextFromHTML from "../../../../helper/htmlParser.js";
import ImageViewModal from "../../../components/imageViewModal/ImageViewModal.jsx";

const Model = ({ serviceimagelist, handleimageDelete, row, open, Dataview, getserviceimagelist, setopen, setDataview }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const handleImageClick = (img) => {
        setSelectedImage(img);
        setIsModalOpen(true);
    };

    const { state } = useLocation();
    const [loading, setLoading] = useState(true);
    const {
        ImageContainer,
        multiFiles,
        setMultiFiles,
        handleFilesChange,
        multiImageData,
        setMultiImageData
    } = useImageContainer();

    useEffect(() => {
        if (serviceimagelist) {
            setLoading(false);
        }
    }, [serviceimagelist]);

    const handleSubmit = async (e, row) => {
        e.preventDefault();


        if (!multiImageData?.length) {
            notifyError("Please upload at least one image.");
            return;
        }

        try {

            const base64Images = multiImageData.map((img, index) => ({
                image_name: `Image${index + 1}`,
                image_path: img.imgString.includes(",")
                    ? img.imgString.split(",")[1]
                    : img.imgString,
            }));
            console.log();


            const { data } = await axiosOther.post("serviceimageupload", {
                images: base64Images,
                ServiceId: Dataview,
                ServiceType: "Destination",
            });
            console.log(data, "data");


            if (data?.Status == 1 || data?.status === 1) {
                notifySuccess(data?.Message || data?.message || data?.result);
                getserviceimagelist();
                setMultiFiles([])
                setMultiImageData([])
            } else {
                notifySuccess(data?.message || data?.Message || "Upload failed.");
            }

        } catch (error) {
            console.error("Upload Error:", error);

            if (error.response) {
                notifyError(error.response.data?.message || "Server error occurred.");
            } else if (error.request) {
                notifyError("No response from the server. Check your connection.");
            } else {
                notifyError("An unexpected error occurred.");
            }
        }
    }



    return (
        <>
            <ImageViewModal
                imageSrc={selectedImage}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <Modal show={open} onHide={() => setopen(false)} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Destination Images List  ({(row?.Name)}) Destination Images Dimension ( 318 * 544 )</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-12  mb-3">
                            <ImageContainer validateSize={true} targetWidth={318} targetHeight={544} />
                        </div>
                        <div className="col-lg-12 ">
                            <div className="d-flex justify-content-end">
                                <button
                                    className="btn btn-primary btn-custom-size"
                                    variant="primary"
                                    type="submit"
                                    onClick={(e) => handleSubmit(e)}
                                >
                                    Upload
                                </button>

                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <Table striped bordered responsive>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Image</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            {loading ? (
                                <tbody>
                                    <tr>
                                        <td colSpan="3" className="text-center">
                                            <span className="spinner-border text-primary" role="status"></span> Loading...
                                        </td>
                                    </tr>
                                </tbody>
                            ) : serviceimagelist && serviceimagelist.length > 0 ? (
                                <tbody>
                                    {serviceimagelist.map((image, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {/* <img
                                                    src={image.ImagePath}
                                                    style={{ height: "50px", width: "50px", cursor: "pointer" }}
                                                    alt="Open in new tab"
                                                    onClick={() => window.open(image.ImagePath, "_blank", "noopener,noreferrer")}
                                                /> */}
                                                <img
                                                    src={image.ImagePath}
                                                    style={{ height: "50px", width: "50px", cursor: "pointer" }}
                                                    alt="Preview"
                                                    onClick={() => handleImageClick(image.ImagePath)}
                                                />
                                            </td>
                                            <td className="text-center">
                                                <i
                                                    className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
                                                    onClick={() => image?.id && handleimageDelete(image.id)}
                                                ></i>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            ) : (
                                <tbody>
                                    <tr>
                                        <td colSpan="3" className="text-center">
                                            Image Not Found
                                        </td>
                                    </tr>
                                </tbody>
                            )
                            }


                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setopen(false)}
                        variant="danger light"
                        className="btn-custom-size"
                    >
                        Close
                    </Button>
                    {/* <Button variant="primary" className="btn-custom-size">
                Save
              </Button> */}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Model