import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker,
} from "react-google-maps";
import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
import { message } from "antd";
import { getLocaleMessages } from "redux/helper";
const GoogleMapsAPI = "AIzaSyC0Oy_hOdDR057p3qkw29NkYgjArSOEnt0";
Geocode.setApiKey(GoogleMapsAPI);

const Map = (props) => {
  const [Places, setPlaces] = useState(props.defaultPlace);
  const getCity = (addressArray) => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        ("administrative_area_level_2" === addressArray[i].types[0] ||
          "locality" === addressArray[i].types[0])
      ) {
        city = addressArray[i].long_name;
        setPlaces(city);
        return city;
      }
    }
  };
  const handlePlaceSelected = (place) => {
    if (
      place.address_components !== undefined &&
      place.address_components !== ""
    ) {
      props.setLocation(getCity(place.address_components) || "");
    } else {
      message.info(
        getLocaleMessages("Please selected the suggested city from below")
      );
    }
  };

  return (
    <>
      {" "}
      <Autocomplete
        apiKey={GoogleMapsAPI}
        defaultValue={Places}
        onPlaceSelected={handlePlaceSelected}
      />
    </>
  );
};

export default Map;
