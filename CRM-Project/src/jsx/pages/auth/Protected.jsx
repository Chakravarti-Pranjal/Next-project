import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {
  const storedData = localStorage.getItem("token");
  const credential = JSON?.parse(storedData);

  const convertedTime = new Date(credential?.expirationTime * 1000).getTime();
  const timeChecking = convertedTime > new Date().getTime();

  if (!timeChecking) {
    localStorage.removeItem("token");
  }

  if (credential?.token && timeChecking) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default Protected;