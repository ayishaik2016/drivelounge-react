import React from "react";
import { useSelector } from "react-redux";
import { IntlProvider } from "react-intl";
import "@formatjs/intl-relativetimeformat/polyfill";
// import '@formatjs/intl-relativetimeformat/dist/locale-data/en';

import enMessages from "./localizer/en";
import arMessages from "./localizer/ar";

export const allMessages = {
  en: enMessages,
  ar: arMessages,
};

export default function I18nProvider({ children }) {
  const locale = useSelector(({ Auth }) => Auth.subLang);
  const messages = allMessages[locale];

  return (
    <IntlProvider
      locale={locale}
      messages={messages}
      onError={() => alert("missing keywpords")}
    >
      {children}
    </IntlProvider>
  );
}
