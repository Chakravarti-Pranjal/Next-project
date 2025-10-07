import React from 'react'
import Operationtodolist from './Operationtodolist'
import "../../../../css/new-style.css"
import Movement from './Movement'
import Hotelchart from './Hotelchart'

const OperationsDashboard = () => {
    return (
        <div className="row">
            <div className="col-xl-12">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="d-flex booking-status-scroll gap-2">
                            <div className="col-xl-2 col-sm-6">
                                <div className="card booking">
                                    <div className="card-body p-0">
                                        <div className="booking-status d-flex align-items-center booking-status-padding">
                                            <span>
                                                <i className="fa-solid fa-location-dot"></i>
                                            </span>
                                            <div className="ms-auto me-auto ">
                                                <h3 className="mb-0 font-w600 ">2</h3>
                                                <p className="mb-0 text-nowrap">TODAYS PAX TRAVELING</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-2 col-sm-6">
                                <div className="card booking">
                                    <div className="card-body p-0">
                                        <div className="booking-status d-flex align-items-center booking-status-padding">
                                            <span>
                                                <i className="fa-solid fa-hotel"></i>
                                            </span>
                                            <div className="ms-auto me-auto ">
                                                <h3 className="mb-0 font-w600 ">0</h3>
                                                <p className="mb-0 text-nowrap ">
                                                    TODAY'S HOTEL BOOKING
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-2 col-sm-6">
                                <div className="card booking">
                                    <div className="card-body p-0">
                                        <div className="booking-status d-flex align-items-center booking-status-padding">
                                            <span>
                                                <i className="fa-brands fa-guilded"></i>
                                            </span>
                                            <div className="ms-auto me-auto ">
                                                <h3 className="mb-0 font-w600 ">0</h3>
                                                <p className="mb-0 text-nowrap ">
                                                    TODAY'S GUIDE/DRIVER
                                                </p>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-2 col-sm-6">
                                <div className="card booking">
                                    <div className="card-body p-0">
                                        <div className="booking-status d-flex align-items-center booking-status-padding">
                                            <span>
                                                <i className="fa-brands fa-fantasy-flight-games"></i>
                                            </span>
                                            <div className="ms-auto me-auto ">
                                                <h3 className="mb-0 font-w600 ">0</h3>
                                                <p className="mb-0">TODAY'S TRANSPORT</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-2 col-sm-6">
                                <div className="card booking">
                                    <div className="card-body p-0">
                                        <div className="booking-status d-flex align-items-center booking-status-padding">
                                            <span>
                                                <i className="fa-brands fa-fantasy-flight-games"></i>
                                            </span>
                                            <div className="ms-0">
                                                <h3 className="mb-0 font-w600 ">0</h3>
                                                <p className="mb-0 ">TODAY'S FLIGHT</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-2 col-sm-6">
                                <div className="card booking">
                                    <div className="card-body p-0">
                                        <div className="booking-status d-flex align-items-center booking-status-padding">
                                            <span>
                                                <i className="fa-solid fa-train"></i>
                                            </span>
                                            <div className="ms-0">
                                                <h3 className="mb-0 font-w600 ">0</h3>
                                                <p className="mb-0">TODAY'S TRAIN</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-2 col-sm-6 ">
                                <div className="card booking">
                                    <div className="card-body p-0">
                                        <div className="booking-status d-flex align-items-center booking-status-padding">
                                            <span>
                                                <i className="fa-solid fa-file-invoice"></i>
                                            </span>
                                            <div className="ms-auto me-auto   ">
                                                <h3 className="mb-0 font-w600 ">0</h3>
                                                <p className="mb-0 ">PENDING INVOICES</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="col-xl-12">
                        <div className="row">
                            <div className="col-xl-6 h-75">
                                <div className="card p-0">
                                    <div className="card-header p-0 py-2 px-3 d-flex justify-content-between">
                                        <h4 className="fs-15">To Do List</h4>
                                        <div className="col-6">
                                            <select
                                                name="Status"
                                                id="status"
                                                className="form-control form-control-sm"
                                                style={{ height: "30px", borderRadius: "10px" }}
                                            >
                                                <option value="">All Operation Person</option>
                                            </select>
                                        </div>
                                    </div>
                                    <Operationtodolist />
                                </div>
                            </div>
                            <div className="col-xl-6 h-75">
                                <div className="card p-0">
                                    <div className="card-header p-0 py-2 px-3 d-flex justify-content-between">
                                        <h4 className="fs-15">Movement Chart</h4>
                                        <div className="col-6">
                                            <select
                                                name="Status"
                                                id="status"
                                                className="form-control form-control-sm"
                                                style={{ height: "30px", borderRadius: "10px" }}
                                            >
                                                <option value="">Movement Chart</option>
                                            </select>
                                        </div>
                                    </div>
                                    <Movement />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-12">
                        <div className="row">
                            <div className="col-xl-12 h-75">
                                <div className="card p-0">
                                    <Hotelchart />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default OperationsDashboard