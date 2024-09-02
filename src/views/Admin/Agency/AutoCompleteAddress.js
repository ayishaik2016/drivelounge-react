import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker,
} from "react-google-maps";
import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
import { getLocaleMessages } from "redux/helper";

const GoogleMapsAPI = "AIzaSyC0Oy_hOdDR057p3qkw29NkYgjArSOEnt0";
// Geocode.setApiKey(GoogleMapsAPI);
// Geocode.enableDebug();
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.address,
      city: this.props.location,
    };
  }

  onPlaceSelected = (place) => {
    const address = this.getCity(place.address_components),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    this.setState({ address });
    this.setState({ city: address });
    this.props.cors({
      lat: latValue,
      lng: lngValue,
      address: place.formatted_address,
    });
  };
  getCity = (addressArray) => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        ("administrative_area_level_2" === addressArray[i].types[0] ||
          "locality" === addressArray[i].types[0])
      ) {
        city = addressArray[i].long_name;
        return city;
      }
      if (city == "") {
        if (
          addressArray[i].types[0] &&
          ("administrative_area_level_2" === addressArray[i].types[0] ||
            "political" === addressArray[i].types[1])
        ) {
          city = addressArray[i].long_name;
          return city;
        }
      }
      if (city == "") {
        if (
          addressArray[i].types[0] &&
          ("administrative_area_level_1" === addressArray[i].types[0] ||
            "locality" === addressArray[i].types[0])
        ) {
          city = addressArray[i].long_name;
          return city;
        }
      }
      if (city == "") {
        if (
          addressArray[i].types[0] &&
          ("administrative_area_level_1" === addressArray[i].types[0] ||
            "political" === addressArray[i].types[1])
        ) {
          city = addressArray[i].long_name;
          return city;
        }
      }
    }
  };

  render() {
    const AsyncMap = withScriptjs(
      withGoogleMap((props) => (
        <Autocomplete
          onPlaceSelected={this.onPlaceSelected}
          placeholder={getLocaleMessages("Enter a city")}
          defaultValue={this.state.city || this.props.location}
          types={["(regions)"]}
        />
      ))
    );

    let map = (
      <div>
        <AsyncMap
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: this.props.height }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />{" "}
      </div>
    );
    return map;
  }
}
export default Map;
