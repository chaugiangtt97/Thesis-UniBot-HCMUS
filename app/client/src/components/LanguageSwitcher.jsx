import React from 'react'
import { useTranslation } from "react-i18next";
function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const flags = {
    us: "🇺🇸",
    fr: "fr",
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0px 10px 20px ' }}>
      {Object.keys(flags).map((lang) => (
        <button
          key={lang}
          onClick={() => changeLanguage(lang)}
          style={{
            fontSize: "24px",
            margin: "0 8px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {/* {flags[lang]} */}
          <img src={`https://flagcdn.com/24x18/${lang}.png`} alt={lang} />
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher