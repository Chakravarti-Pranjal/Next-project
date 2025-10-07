const IsDataLoading = () => {
    return (
        <div className="d-flex align-items-center justify-content-center" style={{ width: "100vw", height: "100vh", background: "rgba(0,0,0,0.7)", position: "fixed", top: "0", left: "0", zIndex: "99999" }}>
            <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
                style={{ width: "30px", height: "30px" }}
            ></span>
        </div>
    )
}

export default IsDataLoading
