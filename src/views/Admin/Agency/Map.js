import React from 'react'
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
const GoogleMapsAPI = "AIzaSyC0Oy_hOdDR057p3qkw29NkYgjArSOEnt0";
Geocode.setApiKey(GoogleMapsAPI);
Geocode.enableDebug();

const mapContainerStyle = {
  height: "60vh",
  width: "85vw",
};

class Map extends React.Component{
constructor( props ){
  super( props );
  this.state = {
   address: this.props.center.address,
   mapPosition: {
    lat: this.props.center.lat,
    lng: this.props.center.lng
   },
   markerPosition: {
    lat: this.props.center.lat,
    lng: this.props.center.lng
  }
  }
  this.updateLocation = this.updateLocation.bind(this);
  this.onClick = this.onClick.bind(this)
 }
/**
  * Get the current address from the default map position and set those values in the state
  */
 componentDidMount() {
  this.updateLocation();
 };
/**
  * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
  *
  * @param nextProps
  * @param nextState
  * @return {boolean}
  */
 shouldComponentUpdate(prevProps){
  if(this.props.center.lat !== prevProps.center.lat) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
  {  
    this.setState({
    address: ( prevProps.center.address ) ? prevProps.center.address : '',
    mapPosition: {
      lat: prevProps.center.lat,
      lng: prevProps.center.lng
     },
     markerPosition: {
      lat: prevProps.center.lat,
      lng: prevProps.center.lng
    }})
    this.updateLocation();
    return true;
  }
  return false;
 }

 updateLocation(){
  Geocode.fromLatLng( this.state.mapPosition.lat , this.state.mapPosition.lng ).then(
    response => {
     const address = response.results[0].formatted_address;
     this.setState({
      address: ( address ) ? address : '',
      markerPosition: {
       lat:  this.state.mapPosition.lat,
       lng: this.state.mapPosition.lng
      },
      mapPosition: {
       lat:  this.state.mapPosition.lat,
       lng: this.state.mapPosition.lng
      },
     })
    },
    error => {
     console.error(error);
    }
   );
 }

 onClick(event){
  let newLat = event.latLng.lat(),
  newLng = event.latLng.lng();
Geocode.fromLatLng( newLat , newLng ).then(
 response => {
  const address = response.results[0].formatted_address;
  this.setState({
    address: ( address ) ? address : '',
    markerPosition: {
     lat: newLat,
     lng: newLng
    },
    mapPosition: {
     lat: newLat,
     lng: newLng
    },
   })
   this.props.setAddress({
    address: ( address ) ? address : '',   
     lat: newLat,
     lng: newLng
   })
   this.props.setPlaces(this.getCity(response.results[0].address_components))
 },
 error => {
  console.error(error);
 }
);
 }
/**
  * Get the city and set the city input value to the one selected
  *
  * @param addressArray
  * @return {string}
  */

/**
  * Get the area and set the area input value to the one selected
  *
  * @param addressArray
  * @return {string}
  */
 
/**
  * Get the address and set the address input value to the one selected
  *
  * @param addressArray
  * @return {string}
  */
 
/**
  * And function for city,state and address input
  * @param event
  */
 onChange = ( event ) => {
  this.setState({ [event.target.name]: event.target.value });
 };
/**
  * This Event triggers when the marker window is closed
  *
  * @param event
  */
 onInfoWindowClose = ( event ) => {
};
/**
  * When the user types an address in the search box
  * @param place
  */
 getCity = ( addressArray ) => {
  let city = '';
  for( let i = 0; i < addressArray.length; i++ ) {
      if ( addressArray[ i ].types[0] && ('administrative_area_level_2' === addressArray[ i ].types[0] && 'locality' === addressArray[ i ].types[0]) ) {
          city = addressArray[ i ].long_name;
          return city;
      }
      if( city == ""){
          if ( addressArray[ i ].types[0] && ('administrative_area_level_2' === addressArray[ i ].types[0] && 'political' === addressArray[ i ].types[1]) ) {
              city = addressArray[ i ].long_name;
              return city;
          }
      }
      if( city == ""){
          if ( addressArray[ i ].types[0] && ('administrative_area_level_1' === addressArray[ i ].types[0] && 'locality' === addressArray[ i ].types[0]) ) {
              city = addressArray[ i ].long_name;
              return city;
          }
      }
      if( city == ""){
          if ( addressArray[ i ].types[0] && ('administrative_area_level_1' === addressArray[ i ].types[0] && 'political' === addressArray[ i ].types[1]) ) {
              city = addressArray[ i ].long_name;
              return city;
          }
      }                
  }
}
 onPlaceSelected = ( place ) => {
  const address = place.formatted_address,   
   latValue = place.geometry.location.lat(),
   lngValue = place.geometry.location.lng();
// Set these values in the state.
  this.setState({
   address: ( address ) ? address : '',
   markerPosition: {
    lat: latValue,
    lng: lngValue
   },
   mapPosition: {
    lat: latValue,
    lng: lngValue
   },
  })
 };
/**
  * When the marker is dragged you get the lat and long using the functions available from event object.
  * Use geocode to get the address, city, area and state from the lat and lng positions.
  * And then set those values in the state.
  *
  * @param event
  */
 onMarkerDragEnd = ( event ) => {
  
  let newLat = event.latLng.lat(),
    newLng = event.latLng.lng();
  Geocode.fromLatLng( newLat , newLng ).then(
   response => {
    const address = response.results[0].formatted_address;
    this.setState({
      address: ( address ) ? address : '',
      markerPosition: {
       lat: newLat,
       lng: newLng
      },
      mapPosition: {
       lat: newLat,
       lng: newLng
      },
     })

    this.props.setPlaces(this.getCity(response.results[0].address_components))
     this.props.setAddress({
      address: ( address ) ? address : '',     
       lat: newLat,
       lng: newLng
     })
   },
   error => {
    console.error(error);
   }
  );
 };
render(){
const AsyncMap = withScriptjs(
   withGoogleMap(
    props => (
     <GoogleMap google={this.props.google}
      defaultZoom={this.props.zoom}
      mapContainerStyle={mapContainerStyle}
      defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
      onClick={this.onClick}
     >
      {/* For Auto complete Search Box */}
      {/* <Autocomplete
       style={{
        width: '100%',
        height: '40px',
        paddingLeft: '16px',
        marginTop: '2px',
        marginBottom: '100px'
       }}
       onPlaceSelected={ this.onPlaceSelected }
       types={['(regions)']}
      /> */}
{/*Marker*/}
      <Marker google={this.props.google}
       name={'Dolores park'}
          draggable={true}
          onDragEnd={ this.onMarkerDragEnd }
          position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
          
      />
      <Marker />
{/* InfoWindow on top of marker */}
      <InfoWindow
       onClose={this.onInfoWindowClose}
       position={{ lat: ( this.state.markerPosition.lat + 0.0018 ), lng: this.state.markerPosition.lng }}
      >
       <div>
        <span style={{ padding: 0, margin: 0 }}>{ this.state.address }</span>
       </div>
      </InfoWindow>
</GoogleMap>
)
   )
  );
let map;
  if( this.props.center.lat !== undefined ) {
   map = <div>
    <AsyncMap
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places`}
      loadingElement={
       <div style={{ height: `90%` }} />
      }
      containerElement={
       <div style={{ height: this.props.height }} />
      }
      mapElement={
       <div style={{ height: `90%` }} />
      }
     />
    </div>
} else {
   map = <div style={{height: this.props.height}} />
  }
  return( map )
 }
}
export default Map