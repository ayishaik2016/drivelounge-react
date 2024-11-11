import { IntlProvider } from "react-intl";
import { allMessages } from "./../helpers/I18nProvider";
import axios from "axios";
import Geocode from "react-geocode";
const GoogleMapsAPI = "AIzaSyC0Oy_hOdDR057p3qkw29NkYgjArSOEnt0";
Geocode.setApiKey(GoogleMapsAPI);
Geocode.enableDebug();

export function getLocaleMessages(id) {
  if(localStorage.getItem("language") == null || localStorage.getItem("language") == undefined) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          Geocode.fromLatLng(latitude, longitude).then(
            (response) => {
              // Find country from the results
              const address = response.results[0];
              let country = null;

              // Loop through the address components to find the country
              for (let component of address.address_components) {
                if (component.types.includes("country")) {
                  country = component.long_name;
                  break;
                }
              }

              if(country != '' && country == 'Saudi Arabia') {
                localStorage.setItem("language", 'sa');
              } else {
                localStorage.setItem("language", 'en');
              }
            },
            (error) => {
              console.error("Error in reverse geocoding:", error);
            }
          );
        }
      )
    }
  }

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
