import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { axiosOther } from "../../../../../http/axios_base_url";
import { addQueryContext } from "..";
// import "./index.css";
// import styles from "./Destination.module.css";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setCreateQueryDataPackageList } from "../../../../../store/actions/createQueryAction/createQueryAction";

const Destination = () => {
  const [filteredDestination, setFilteredDestination] = useState([]);
  const [filteredPackage, setFilteredPackage] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [destinationList, setDestinationList] = useState([]);
  const [packageList, setPackageList] = useState([]);
  const [activeTab, setActiveTab] = useState("destination");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hoveredTab, setHoveredTab] = useState(null);
  const observer = useRef();
  const { destinationObject } = useContext(addQueryContext);
  const { editDestinationTemplate, setEditDestinationTemplate } =
    destinationObject;

  const dispatch = useDispatch();

  const fetchData = async (pageNo, search = "") => {
    try {
      setLoading(true);
      const res = await axiosOther.post("query-destination-list", {
        Search: search,
        page: pageNo.toString(),
        perPage: "15",
      });

      const newData = res.data?.DataList || [];

      setDestinationList((prev) => [...prev, ...newData]);
      setHasMore(pageNo < res.data.TotalPages);
      setLoading(false);
    } catch (err) {
      console.error("API error:", err);
      setLoading(false);
    }
  };

  const fetchDatas = async (pageNo, search = "") => {
    try {
      setLoading(true);
      const res = await axiosOther.post("packagelist", {
        Search: search,
        page: pageNo.toString(),
        perPage: "15",
      });
      const newData = res.data?.DataList || [];
      setPackageList((prev) => [...prev, ...newData]);
      setHasMore(pageNo < res.data.TotalRecord);
      setLoading(false);
    } catch (err) {
      console.error("API error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setDestinationList([]);
    setPackageList([]);
    setPage(1);
    setHasMore(true);
    if (activeTab === "destination") {
      fetchData(1, searchInputValue);
    } else {
      fetchDatas(1, searchInputValue);
    }
  }, [searchInputValue, activeTab]);

  useEffect(() => {
    if (page > 1) {
      if (activeTab === "destination") {
        fetchData(page, searchInputValue);
      } else {
        fetchDatas(page, searchInputValue);
      }
    }
  }, [page, activeTab, searchInputValue]);

  useEffect(() => {
    if (searchInputValue === "") {
      setFilteredDestination(destinationList);
    } else {
      const filtered = destinationList.filter((value) =>
        value.Title?.toLowerCase()
          .replace(/\s/g, "")
          .includes(searchInputValue.toLowerCase().replace(/\s/g, ""))
      );
      setFilteredDestination(filtered);
    }
  }, [searchInputValue, destinationList]);

  useEffect(() => {
    if (searchInputValue === "") {
      setFilteredPackage(packageList);
    } else {
      const filtered = packageList.filter((value) =>
        (value.Title || value.QueryNumber)
          ?.toLowerCase()
          .replace(/\s/g, "")
          .includes(searchInputValue.toLowerCase().replace(/\s/g, ""))
      );
      setFilteredPackage(filtered);
    }
  }, [searchInputValue, packageList]);

  const handleSearchDestination = (e) => {
    setSearchInputValue(e.target.value);
  };

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold: 0.1 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const swalStyle = document.createElement("style");
    swalStyle.innerHTML = `.swal-title { font-size: 10px !important; }`;
    document.head.appendChild(swalStyle);
    return () => document.head.removeChild(swalStyle);
  }, []);

  const handleDestinationClick = async (destination) => {
    const confirmation = await swal({
      title: `Are you sure to select: ${destination?.Title}?`,
      icon: "warning",
      buttons: {
        confirm: {
          text: "Ok",
          value: true,
          visible: true,
          className: "btn-custom-size btn btn-primary",
          closeModal: true,
        },
        cancel: {
          text: "Cancel",
          value: false,
          visible: true,
          className: "btn-custom-size btn light btn-primary",
          closeModal: true,
        },
      },
      dangerMode: true,
    });

    if (confirmation) {
      setEditDestinationTemplate(destination);
      // setSelectedDestination(null);
    }
    //  else {
    //   setSelectedDestination(null);
    // }
  };

  const getQueryDataFromApi = async (QueryId) => {
    try {
      const { data } = await axiosOther.post("querymasterlist", {
        QueryId: QueryId,
      });

      if (data?.Status === 200) {
        return data?.DataList[0];
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePackageClick = async (data) => {
    console.log(data, "VALUE67");

    const confirmation = await swal({
      title: `Are you sure?`,
      icon: "warning",
      buttons: {
        confirm: {
          text: "Ok",
          value: true,
          visible: true,
          className: "btn-custom-size btn btn-primary",
          closeModal: true,
        },
        cancel: {
          text: "Cancel",
          value: false,
          visible: true,
          className: "btn-custom-size btn light btn-primary",
          closeModal: true,
        },
      },
      dangerMode: true,
    });
    if (confirmation) {
      const response = await getQueryDataFromApi(data?.QueryNumber);
      console.log(response, "response");
      const updatedJson = {
        TravelDataJson: { ...response?.TravelDateInfo },
      };
      setEditDestinationTemplate(updatedJson);
      dispatch(setCreateQueryDataPackageList(data));
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card m-0 query-big-box-height query-big-box-m-height">
          <div className="card-header px-2 py-3 d-flex justify-content-between align-items-center custom-tab-1">
            <ul className="nav nav-tabs card-header-tabs">
              <li
                className="nav-item"
                style={{ paddingLeft: "10px", position: "relative" }}
              >
                <button
                  className={`nav-link ${activeTab === "destination" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("destination")}
                  onMouseEnter={() => setHoveredTab("destination")}
                  onMouseLeave={() => setHoveredTab(null)}
                  style={{ color: "gray" }}
                >
                  Destination
                </button>
                {hoveredTab === "destination" && (
                  <div className="preview-box">Destination Template</div>
                )}
              </li>
              <li className="nav-item" style={{ position: "relative" }}>
                <button
                  className={`nav-link ${activeTab === "package" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("package")}
                  onMouseEnter={() => setHoveredTab("package")}
                  onMouseLeave={() => setHoveredTab(null)}
                  style={{ color: "gray" }}
                >
                  Package
                </button>
                {hoveredTab === "package" && (
                  <div className="preview-box">Package Template</div>
                )}
              </li>
            </ul>
          </div>

          <div className="card-body px-1 py-3" style={{ height: "100%" }}>
            {activeTab === "destination" && (
              <div
                className="flex-fill"
                style={{ minWidth: "0", height: "100%" }}
              >
                <input
                  type="text"
                  placeholder="Search Destination"
                  className="form-control form-control-sm mb-2"
                  value={searchInputValue}
                  onChange={handleSearchDestination}
                />
                {filteredDestination.length > 0 && (
                  <label
                    className="ml-2"
                    style={{ fontSize: "8px", fontWeight: "600" }}
                  >
                    Click to select the Destinations
                  </label>
                )}
                <PerfectScrollbar
                  options={{ suppressScrollX: true }}
                  // className="destination-scroll-container"
                  style={{ height: "calc(100% - 106px)", overflowY: "auto" }}
                >
                  {filteredDestination.map((value, index) => {
                    const isLast = index === filteredDestination.length - 1;
                    return (
                      <div
                        className="padding-2 d-flex align-items-center rounded cursor-pointer mt-1 destination-template-hover"
                        key={`dest-${index}`}
                        onClick={() => handleDestinationClick(value)}
                        ref={isLast ? lastElementRef : null}
                      >
                        <div className="pl-2">
                          <p className="destination-text m-0">{value?.Title}</p>
                        </div>
                      </div>
                    );
                  })}
                  {loading && page > 1 && (
                    <div className="text-center p-2">
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  )}
                  {/* {!hasMore && filteredDestination.length > 0 && (
                    <div className="text-center p-2 text-muted">
                      No more destinations
                    </div>
                  )} */}
                </PerfectScrollbar>
                {loading && page === 1 && (
                  <p className="text-center font-weight-bold mt-3">
                    Loading Destination...
                  </p>
                )}
                {!loading && filteredDestination.length === 0 && (
                  <p className="text-center font-weight-bold mt-3">
                    No destination found
                  </p>
                )}
              </div>
            )}

            {activeTab === "package" && (
              <div
                className="flex-fill"
                style={{ minWidth: "0", height: "100%" }}
              >
                <input
                  type="text"
                  placeholder="Search Package"
                  className="form-control form-control-sm mb-2"
                  value={searchInputValue}
                  onChange={handleSearchDestination}
                />
                {filteredPackage.length > 0 && (
                  <label
                    className="ml-2"
                    style={{ fontSize: "8px", fontWeight: "600" }}
                  >
                    Click to select the Package
                  </label>
                )}
                <PerfectScrollbar
                  options={{ suppressScrollX: true }}
                  // className="package-scroll-container"
                  style={{ height: "calc(100% - 106px)", overflowY: "auto" }}
                >
                  {filteredPackage.map((value, index) => {
                    const isLast = index === filteredPackage.length - 1;
                    return (
                      <div
                        className="padding-2 d-flex align-items-center rounded cursor-pointer mt-1 destination-template-hover"
                        key={`pkg-${index}`}
                        onClick={() => handlePackageClick(value)}
                        ref={isLast ? lastElementRef : null}
                      >
                        <div className="pl-2">
                          <p className="destination-text m-0">
                            {value?.Subject}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {loading && page > 1 && (
                    <div className="text-center p-2">
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  )}
                  {/* {!hasMore && filteredPackage.length > 0 && (
                    <div className="text-center p-2 text-muted">
                      No more packages
                    </div>
                  )} */}
                </PerfectScrollbar>
                {loading && page === 1 && (
                  <p className="text-center font-weight-bold mt-3">
                    Loading Packages...
                  </p>
                )}
                {!loading && filteredPackage.length === 0 && (
                  <p className="text-center font-weight-bold mt-3">
                    No package found
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destination;
