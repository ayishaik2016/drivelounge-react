import { IntlProvider } from "react-intl";
import { allMessages } from "./../helpers/I18nProvider";
import axios from "axios";

export function getLocaleMessages(id) {
  const locale = localStorage.getItem("language") || "en";
  const { intl } = new IntlProvider(
    {
      locale,
      messages: allMessages[locale],
      onError: (err) => {
        if (err.code === "MISSING_TRANSLATION") {
        }
        //throw err;
        return "TExt";
      },
    },
    {}
  ).state;
  let messages = intl.formatMessage({ id });
  return messages !== undefined ? messages : "";
}

export function customAPIRequest({ URL, headers, fileData }) {
  return axios
    .put(URL, fileData, {
      headers: { ...headers },
    })
    .then((response) => response);
}

export function checkValid() {
  return localStorage.getItem("user_data");
}

export function getLocalData(key) {
  return checkValid()
    ? JSON.parse(localStorage.getItem("user_data"))[key]
    : undefined;
}

export function getLocalDataType() {
  return localStorage.getItem("login_type");
}
