import { useEffect, useState } from "react";

const GoogleTranslate = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("");

  // Function to get the current language from the googtrans cookie
  const getCurrentLanguage = () => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const googtransCookie = cookies.find((cookie) =>
      cookie.startsWith("googtrans=")
    );
    if (googtransCookie) {
      const lang = googtransCookie.split("/")[2]; // Extract language code from /en/hi
      return lang || "en"; // Fallback to English if not found
    }
    return "en"; // Default to English
  };

  useEffect(() => {
    // Set initial language from cookie
    setSelectedLanguage(getCurrentLanguage());

    const addScript = () => {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,fr,es,de,ar",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );

      // Update selected language after Google Translate initializes

      // setTimeout(() => {
      //   const currentLang =
      //     window.google?.translate?.TranslateElement?.getInstance?.()?.getLanguage() ||
      //     getCurrentLanguage();
      //   setSelectedLanguage(currentLang);
      // }, 100); // Small delay to ensure Google Translate is ready

      setTimeout(() => {
        const currentLang = getCurrentLanguage(); // Use your cookie method
        setSelectedLanguage(currentLang);
      }, 100);

    };

    if (!window.google?.translate) {
      addScript();
    }

    // Cleanup script on component unmount
    return () => {
      const scripts = document.querySelectorAll(
        'script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
      );
      scripts.forEach((script) => script.remove());
      delete window.googleTranslateElementInit;
    };
  }, []);

  // Change language by setting cookie and URL hash
  const changeLanguage = (lang) => {
    setSelectedLanguage(lang); // Update state
    const langCode = `/en/${lang}`;
    document.cookie = `googtrans=${langCode};path=/`;
    document.cookie = `googtrans=${langCode};domain=${window.location.hostname};path=/`;
    window.location.reload(); // Force reload to apply translation
  };

  return (
    <div className="translate-wrapper">
      <select
        value={selectedLanguage} // Bind select value to state
        onChange={(e) => changeLanguage(e.target.value)}
        className="form-control form-control-sm"
      >
        <option value="">🌐 Select Language</option>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
        <option value="de">German</option>
        <option value="ar">Arabic</option>
      </select>

      {/* <div id="google_translate_element" style={{ display: "none" }}></div> */}
    </div>
  );
};

export default GoogleTranslate;