import i18n from "i18next"
import Backend from "i18next-http-backend"
import LangDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

i18n.use(Backend)
    .use(LangDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        whitelist: ["en", "ru"],
        debug: false,
        detection: {
            order: ["localStorage", "cookie"],
            caches: ["localStorage", "cookie"],
        },
        interpolation: {
            escapeValue: false,
        },
    })

export default i18n
