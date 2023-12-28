import { zodI18nMap } from "zod-i18n-map";
// Import your language translation files
import translation from "zod-i18n-map/locales/pl/zod.json";
import { z } from "zod";
import i18next from "i18next";

export const translate = () => {
  i18next
    .init({
      lng: "pl",
      resources: {
        pl: { zod: translation },
      },
    })
    .then(() => null)
    .catch(() => null);
  z.setErrorMap(zodI18nMap);
};
