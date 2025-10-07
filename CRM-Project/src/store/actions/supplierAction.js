export const setCommunicationData = (data) => {
    return {
      type: "SET-COMMUNICATION-DATA",
      payload: data,
    };
  };
  
  export const resetCommunicationData = () => {
    return {
      type: "RESET-COMMUNICATION-DATA",
    };
  };