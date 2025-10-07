import { axiosOther } from "../../http/axios_base_url";

export const fetchProductList = async (prod_name) => {
  if (prod_name) {
    try {
      const { data } = await axiosOther.post("listproduct", {
        name: prod_name,
      });
      if(data?.Datalist?.length >=1){
          return data?.Datalist[0];
      }else{
        return "Response not valid"
      }

    } catch (err) {
      console.log("error");
      if (err) {
        return "Error occured !";
      }
    }
  } else {
    return "Please enter product name";
  }
};
