import React from 'react'

const Movement = () => {
    return (
        <div className="card-body m-0 Movementlist p-1 ">
            <ul className="timeline">
                <li>
                    <div className="timeline-panel">
                        <div className="media-body  row Movementpara m-0 p-0">
                            <div className='col-1 '><p className="mb-0">CITY ID</p></div>
                            <div className='col-1  '><p className="mb-0">Tour Date</p></div>
                            <div className="col-1 "> <p className="mb-0">City</p></div>
                            <div className="col-1 "> <p className="mb-0">Type</p></div>
                            <div className="col-1  "> <p className="mb-0">Agent Name</p></div>
                            <div className="col-2 "> <p className="mb-0">Lead Pax Name</p></div>
                            <div className="col-1 "> <p className="mb-0">Total Pax</p></div>
                            <div className="col-2 "><p className="mb-0">Stay/Activity</p></div>
                            <div className='col-2 '><p className="mb-0">Tour Manager</p></div>

                        </div>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default Movement