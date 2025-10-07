// subdomainConfig.js
import defaultLogo from "../images/logo/logo-white.svg";
import defaultLogoDark from "../images/logo/logo-dark.svg";
//import darkLogo from "../src/images/logo/logo-white.svg";
//import stratos from "../images/logo/stratos-logo.png";
import stratos from "../images/logo/stratos-logo-white.svg";
import stratosLogoDark from "../images/logo/Stratos-Logo-02.svg";
import faviconIconDefault from "/assets/favicon-logo/logo-icon.svg";
import faviconIconStratos from "/assets/favicon-logo/stratos-icon.svg";

// Get current hostname or subdomain
const hostname = window?.location?.hostname || "";
const isExperienceIndiaDomain = hostname === "experienceindiacrm.com";

// Dynamic title adjustment for main domain
// let defaultTitle = "NEXGENOV8";
// if (hostname.includes("experienceindia")) {
//   defaultTitle = "Experience India";
// }

const subdomainConfig = {
  default: {
    logo: defaultLogo,
    faviconIcon: faviconIconDefault,
    title: isExperienceIndiaDomain ? "Experience India" : "NEXGENOV8",
    darkLogo: defaultLogoDark,
    theme: "dark",
    hideMenus: [],
  },
  stratos: {
    logo: stratos,
    faviconIcon: faviconIconStratos,
    title: "STRATOS",
    darkLogo: stratosLogoDark,
    theme: "light",
    hideMenus: [
      "Mails",
      "Marketing",
      "Sales",
      "Operations",
      "Finance",
      "Documents",
      // "Masters",
      "User Management",
    ],
  },
  // You can add more subdomains here
};

export default subdomainConfig;
