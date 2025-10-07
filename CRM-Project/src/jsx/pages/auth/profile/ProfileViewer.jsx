import React, { useEffect, useState, useCallback } from 'react'
// import avatar from "../../../../images/avatar/profile.jpg";
import "./Profile.css"
import { Link, useNavigate } from 'react-router-dom';
import { axiosOther } from '../../../../http/axios_base_url';
import Cropper from "react-easy-crop";
import getCroppedImg from './CropImage.jsx';

import { Modal, Button } from "react-bootstrap";
import { notifyError, notifyHotSuccess } from '../../../../helper/notify';
import { uploadlogo } from "./Profileinfointialvalue"

const ProfileViewer = () => {
  const [croppedImage, setCroppedImage] = useState(null);
  const [formValue, setFormValue] = useState(uploadlogo)
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [companylistdata, setcompanylistdata] = useState([]);
  const [filename, setFileName] = useState([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [data, setdata] = useState([])
  const [userId, setUserId] = useState(null);
  const [companyids, setcompanyid] = useState(null);
  const navigate = useNavigate()
  console.log(data, "001")

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    event.target.value = null; // Clear file input for future use

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setFileName(file.name);
        setShowModal(true); // Open modal for cropping after setting image
      };
      reader.readAsDataURL(file);
    }
  };



  const handleCropDone = async () => {
    let croppedImageUrl;

    try {
      croppedImageUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      console.log("Upload ke liye ready Image:", croppedImageUrl);

      setCroppedImage(croppedImageUrl);
      console.log(croppedImageUrl, "croppedImageUrl");

      setShowModal(false);
    } catch (e) {
      console.error(e);
      return;
    }
    console.log(croppedImageUrl)
    try {
      const fileNameorg = filename.replace(/\s+/g, "_")
      const { data } = await axiosOther.post("updateProfileById", {
        ...formValue,
        id: userId,
        ProfileLogo: fileNameorg,
        ProfileLogoImageData: croppedImageUrl
      });

      if (data?.Status == 1) {
        notifyHotSuccess(data?.Message || data?.message);
        localStorage.setItem("success-message", data?.Message || data?.message);
        getprofilelist()

      } else {
        notifyError(data?.message || data?.Message);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };




  // const handlesubmit = async () => {


  const handleCloseModal = () => {
    setShowModal(false);
  };



  const getprofilelist = async () => {
    let Id = null;

    try {
      const token = localStorage.getItem("token");
      const persed = JSON.parse(token)
      console.log(persed, "persed")
      Id = persed?.UserID
      // companyid=persed?.companyKey
      setUserId(Id)



      console.log(Id, "id1")

    } catch (error) {
      console.log(error, "error")

    }

    try {
      console.log(Id, "Id11")
      const data = await axiosOther.post("listusers", { id: Id })
      setdata(data?.data?.Datalist)
      console.log(data?.data?.Datalist, 'data')

    } catch (error) {
      console.log(error)

    }

  }
  useEffect(() => {
    getprofilelist()
  }, [])
  const handledit = (data) => {
    console.log(data, "123")
    navigate("/user-profile/profile-info", { state: data });
  };
  return (
    <div className="card profilePhoto
                        ">
      <div className="card-body">
        {data && data.length > 0 && (
          <>
            {data.map((item, index) => {
              //  const encodedUrl = encodeURI(item.ProfileLogoImageData || '');

              return (
                <div className="d-flex flex-column my-2 text-center" key={index}>
                  <div className="d-flex justify-content-center align-items-center position-relative mb-2" style={{ width: "140px", height: " 140px", margin: "0 auto" }}>
                    <img
                      src={(item.ProfileLogoImageData || croppedImage)}
                      alt="Profile"
                      width="100%"
                      height="100%"
                      style={{ borderRadius: "50%" }}
                    />
                    {console.log(encodeURI(item.ProfileLogoImageData || ''), "itemss")}

                    <span className='profile_edit position-absolute fs-6 d-flex align-items-center gap-2'
                      style={{ bottom: "24px", right: "0px", overflow: "hidden", borderRadius: "50%" }}>
                      <div className="text-center">
                        <label htmlFor="file-upload" className="file-upload-label">
                          <i className="fa fa-pencil text-black" aria-hidden="true"></i>
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          id="file-upload"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                        />

                        <Modal show={showModal} onHide={handleCloseModal} centered>
                          <Modal.Header closeButton>
                            <Modal.Title>Crop Your Image</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div style={{ position: "relative", width: "100%", height: "300px", background: "#333" }}>
                              <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                              />
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <button className='btn btn-dark btn-custom-size ms-2' onClick={handleCloseModal}>
                              Cancel
                            </button>
                            <button className='btn btn-primary btn-custom-size' onClick={handleCropDone}>
                              Crop & Upload
                            </button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                    </span>
                  </div>

                  <h3>{item?.FirstName} {item?.LastName}</h3>
                  <h3>{item?.role}</h3>

                  <button onClick={() => handledit(item)} className="btn btn-primary btn-custom-size my-2 mx-2">
                    <i className="fa-solid fa-user me-2 text-light"></i>
                    Personal Information
                  </button>

                  <Link to="/user-profile/change-password" className="btn btn-dark btn-custom-size my-2 mx-2">
                    <i className="fa-solid fa-lock me-2"></i>
                    Change Password
                  </Link>
                </div>
              );
            })}
          </>

        )}


      </div>
    </div>
  )
}

export default ProfileViewer
