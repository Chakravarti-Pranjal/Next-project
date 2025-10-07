import React from 'react'

const SearchDate = () => {
    return (
        <div className="col-lg-3  my-2">
            <div className="row">

                <div className="w-20 col-lg-6">
                    <select
                        name="dropdown"
                        className="form-control form-control-sm  "
                    >
                        <option className='text-center' value="0">2025-2026 </option>
                    </select>
                </div>

                <div className="btn btn-primary p-0 col-lg-5 m-1 ">Search</div>
            </div>

        </div>
    )
}

export default SearchDate