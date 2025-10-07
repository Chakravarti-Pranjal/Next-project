import React from 'react'

const Hotelchart = () => {
    return (
        <div className="Hotelchart">
            <div className="card-body">
                <div className="row headings">
                    <div className="col-3"><div className="heading">Hotel</div></div>
                    <div className="col-3"><div className="heading">Transport/Transformation</div></div>
                    <div className="col-2"><div className="heading">Entrance/Sighseeing</div></div>
                    <div className="col-2"><div className="heading">Guide/Driver</div></div>
                    <div className="col-2"><div className="heading">Other/Activity</div></div>
                </div>
                <div className="row mt-3 content p-0">
                    <div className="col-3 pe-5 p-0 m-0 "><div className="p-1 pb-2 border m-0">
                        <span className='text-success'>Amarya Haveli (Closed) (Delhi)|5star</span>
                        <p className='mb-0'>DB2425/00090</p>
                        <p className='mb-0'>02-02-24 10:00 AM</p>
                        <div className="col-lg-12 d-flex justify-content-start align-content-center gap-1">
                            <div className="d-flex justify-content-start align-items-baseline actions "> <span className="badge text-white py-1 px-2 bg-danger cursor-pointer" >
                                <i className="fa-sharp fa-regular fa-eye"></i> View
                            </span>
                            </div>
                            <div className="d-flex justify-content-start align-items-baseline actions "> <span className="badge text-white py-1 px-2 cursor-pointer" style={{ background: "rgb(44, 161, 204)" }}>
                                <i className="fa-sharp fa-regular fa-eye"></i> Action
                            </span>
                            </div>
                        </div>
                    </div>

                    </div>

                    <div className="col-3"> <span className='text-red'>No Data Found</span></div>
                    <div className="col-2"><span className='text-red'>No Data Found</span></div>
                    <div className="col-2"><span className='text-red'>No Data Found</span></div>
                    <div className="col-2"><span className='text-red'>No Data Found</span></div>
                </div>
            </div>
        </div >
    )
}

export default Hotelchart