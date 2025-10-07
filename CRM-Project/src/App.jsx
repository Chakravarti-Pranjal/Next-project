import { lazy, Suspense, useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Index from "./jsx";
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";
import "./css/new-style.css";

const SignUp = lazy(() => import("./jsx/pages/Registration"));
const WebForm = lazy(() => import("./jsx/pages/WebForm"));
const ForgotPassword = lazy(() => import("./jsx/pages/ForgotPassword"));
const Login = lazy(() => import("./jsx/pages/Login"));
import Protected from "./jsx/pages/auth/Protected";
import { MyProvider } from "./jsx/components/Dashboard/ReportDashboard/ReportDashboardContext";
import { SubdomainProvider } from "./context/SubdomainContext"; // adjust the path if needed
import subdomainConfig from "./config/subdomainConfig";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const hostname = window.location.hostname;
  const subdomain = hostname.split(".")[0];
  const config = subdomainConfig[subdomain] || subdomainConfig.default;

  ///check for subdomain
  useEffect(() => {
    // Set title
    document.title = config.title;

    // Set favicon
    const favicon = document.querySelector("link[rel='icon']") || document.createElement("link");
    favicon.rel = "icon";
    favicon.href = config.faviconIcon;
    document.head.appendChild(favicon);
  }, []);

  // Check token validity
  useEffect(() => {
    const storedData = localStorage.getItem("token");
    if (storedData) {
      const credential = JSON.parse(storedData);
      const convertedTime = new Date(
        credential?.expirationTime * 1000
      ).getTime();
      if (credential?.token && convertedTime > new Date().getTime()) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login");
      }
    } else {
      setIsAuthenticated(false);
      navigate("/login");
    }
  }, []);

  // periodic token expiry check (every 1 min)
  useEffect(() => {
    const interval = setInterval(() => {
      const storedData = localStorage.getItem("token");
      if (storedData) {
        const credential = JSON.parse(storedData);
        const convertedTime = new Date(credential?.expirationTime * 1000).getTime();
        if (!credential?.token || convertedTime <= new Date().getTime()) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          navigate("/login");
        }
      } else {
        setIsAuthenticated(false);
        navigate("/login");
      }
    }, 6000); // 6 sec 60000 -> 1 min

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <SubdomainProvider>
      <MyProvider>
        <Suspense
          fallback={
            <div id="preloader">
              <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/page-register" element={<SignUp />} />
            <Route path="/webform" element={<WebForm />} />
            <Route
              path="/page-forgot-password"
              element={
                <Protected>
                  <ForgotPassword />
                </Protected>
              }
            />
            <Route path="/*" element={<Index />} />
          </Routes>
        </Suspense>
      </MyProvider>
    </SubdomainProvider>
  );
}

export default App;