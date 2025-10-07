import React, { useState } from 'react';
import "react-international-phone/style.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const MailReply = () => {
    const [validationErrors, setValidationErrors] = useState({});
    const [destinationList, setDestinationList] = useState([]);
    const [supplierList, setSupplierList] = useState([]);
    const [editorData, setEditorData] = useState("");


    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className='card-header bg-grey  p-0'>
                        <div className='d-flex justify-content-start gap-2 align-items-center px-2 py-1 '>
                            <i class="fa-solid fa-reply text-primary" ></i>
                            <p className='m-0 font-size10'>Reply (Please Write Down OR Copy Paste Your Query)</p>
                        </div>

                    </div>

                    <div className="card-body py-1 px-1">
                        <div className='row'>
                            <div className='col-lg-3 col-md-6 col-sm-6'>
                                <div className='card email-column p-2'>

                                    <label className='font-w500 py-1' style={{ background: '#efefef' }}> <i class="fa-solid fa-envelope text-primary"></i> CLIENT:</label>
                                    <p className='m-0 font-size10'> nitin.kumboj@gmail.com</p></div>

                            </div>
                            <div className='col-lg-3 col-md-6 col-sm-6'>
                                <div className='card email-column p-2'>
                                    <label className='font-w500 py-1' style={{ background: '#efefef' }}> <i class="fa-solid fa-envelope text-primary"></i> OPERATION PERSON:</label>
                                    <p className='m-0 font-size10'> nitin.kumboj@gmail.com</p></div>

                            </div>
                            <div className='col-lg-3 col-md-6 col-sm-6'>
                                <div className='card email-column p-2'>
                                    <label className='font-w500 py-1' style={{ background: '#efefef' }}> <i class="fa-solid fa-envelope text-primary"></i> SALES PERSON:</label>
                                    <p className='m-0 font-size10'> nitin.kumboj@gmail.com</p></div>

                            </div>
                            <div className='col-lg-3 col-md-6 col-sm-6'>
                                <div className='card email-column p-2'>
                                    <label className='font-w500 py-1' style={{ background: '#efefef' }}> <i class="fa-solid fa-envelope text-primary"></i> GROUP:</label>
                                    <p className='m-0 font-size10'> </p></div>
                            </div>
                        </div>
                        <div className="form-validation p-2">
                            <form
                                className="form-valide"
                                action="#"
                                method="post"
                            //   onSubmit={(e) => e.preventDefault()}
                            >
                                <div className="row form-row-gap">
                                    <div className="col-md-6 col-lg-3">
                                        <label className="m-0">File From Desktop</label>
                                        <input
                                            type="file"
                                            placeholder="Service Name"
                                            className="form-control form-control-sm p-0 px-1"
                                            name="ServiceName"

                                        />

                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <label className="m-0">
                                            Reply Template
                                        </label>
                                        <select
                                            name="Destination"
                                            id=""
                                            className="form-control form-control-sm"
                                        // value={formValue?.Destination}
                                        // onChange={handleInputChange}
                                        >
                                            <option value="">Select</option>
                                            {destinationList?.map((value, index) => {
                                                return (
                                                    <option value={value.id} key={index + 1}>
                                                        {value.Name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <label className="m-0">CC:(Comma Separated Emails)</label>
                                        <input
                                            type="email"
                                            placeholder="test@example.com,test@example.com"
                                            className="form-control form-control-sm"
                                            name="email"

                                        />

                                    </div>



                                    <div className="col-12">
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={editorData} // Preloaded content for editing
                                        // onChange={handleEditorChange}
                                        />
                                    </div>
                                </div>
                            </form>
                            <div className='d-flex justify-content-end gap-2 mt-2 mb-2'>
                            <button type="submit" className="btn btn-primary btn-custom-size" >
                            Send</button>
                            <button type="submit" className="btn btn-dark btn-custom-size" >
                            Cancel</button>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MailReply;