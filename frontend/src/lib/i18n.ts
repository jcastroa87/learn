import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import esUi from "@/locales/es/ui.json";
import esActivities from "@/locales/es/activities.json";
import enUi from "@/locales/en/ui.json";
import enActivities from "@/locales/en/activities.json";
import ruUi from "@/locales/ru/ui.json";
import ruActivities from "@/locales/ru/activities.json";

i18n.use(initReactI18next).init({
  resources: {
    es: { ui: esUi, activities: esActivities },
    en: { ui: enUi, activities: enActivities },
    ru: { ui: ruUi, activities: ruActivities },
  },
  lng: "es",
  fallbackLng: "en",
  ns: ["ui", "activities"],
  defaultNS: "ui",
  interpolation: { escapeValue: false },
});

export default i18n;
