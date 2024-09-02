import React, { useState, useEffect } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import "./AutoCompleteStyle.css";

// const LocationSearchInput = (props) => {
//   const [address, setaddress] = useState(props.address)

//   const handleChange = (address) => {
//     setaddress(address);
//   };

//   const handleSelect = (address) => {
//     setaddress(address);
//     geocodeByAddress(address)
//       .then((results) => getLatLng(results[0]))
//       .then((latLng) => {
//         console.log(latLng)
//         this.props.cors({
//           lat: latLng.lat,
//           lng: latLng.lng,
//           address: this.state.address,
//         });
//       })
//       .catch((error) => console.error('Error', error));
//   };

//   return (
//     <PlacesAutocomplete
//       value={address}
//       onChange={handleChange}
//       onSelect={handleSelect}
//     >
//       {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
//         <div>
//           <input
//             style={{ width: '100%' }}
//             {...getInputProps({
//               placeholder: 'Search Places ...',
//               className: 'location-search-input',
//             })}
//           />
//           <div>
//             {loading && <div>Loading...</div>}
//             {suggestions.map((suggestion) => {
//               const className = suggestion.active
//                 ? 'suggestion-item--active'
//                 : 'suggestion-item';
//               // inline style for demonstration purpose
//               const style = suggestion.active
//                 ? { backgroundColor: '#fafafa', cursor: 'pointer' }
//                 : { backgroundColor: '#ffffff', cursor: 'pointer' };
//               return (
//                 <div
//                   className="input-suggestion"
//                   {...getSuggestionItemProps(suggestion, {
//                     style,
//                   })}
//                 >
//                   <span>{suggestion.description}</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </PlacesAutocomplete>
//   );

// }
class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.address,
    };
  }

  handleChange = (address) => {
    this.setState({ address });
  };

  handleSelect = (address) => {
    this.setState({ address });
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        this.props.cors({
          lat: latLng.lat,
          lng: latLng.lng,
          address: this.state.address,
        });
      })
      .catch((error) => console.error("Error", error));
  };

  onError = (status, clearSuggestions) => {
    console.log("Google Maps API returned error with status: ", status);
    clearSuggestions();
  };

  render() {
    const google = window.google;
    const searchOptions = {
      componentRestrictions: {
        country: ["sa", "AE", "IR", "KW", "QA"],
      },
    };

    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        onError={this.onError}
        searchOptions={searchOptions}
        googleCallbackName="myCallbackFunc"
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              style={{ width: "100%" }}
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "location-search-input",
              })}
            />
            <div>
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    className="input-suggestion"
                    {...getSuggestionItemProps(suggestion, {
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default LocationSearchInput;
