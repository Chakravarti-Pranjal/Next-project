import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosOther } from "../../http/axios_base_url";
import { setQueryData } from "../../store/actions/queryAction";

const useQueryData = () => {
  const dispatch = useDispatch();
  const queryData = useSelector((state) => state?.queryReducer?.queryData);

  const getqueryData = async () => {
    const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
    if (!queryQuotation?.QueryID) {
      console.error("QueryID is missing in localStorage");
      return;
    }

    const payload = {
      QueryId: queryQuotation?.QueryID,
    };

    try {
      console.log(payload, "payloadcheckkk112");

      const { data } = await axiosOther.post("querymasterlist", payload);
      console.log(data, "99999data");

      dispatch(
        setQueryData({
          QueryId: data?.DataList[0]?.id,
          QueryAlphaNumId: data?.DataList[0]?.QueryID,
          QueryAllData: data?.DataList[0],
        })
      );
    } catch (error) {
      console.error("Error fetching query data:", error);
    }
  };

  useEffect(() => {
    if (!queryData) {
      getqueryData();
    }
  }, [queryData]);

  return queryData;
};

export default useQueryData;
