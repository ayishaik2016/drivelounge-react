import React from 'react'
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
const GoogleMapsAPI = "AIzaSyC0Oy_hOdDR057p3qkw29NkYgjArSOEnt0";
Geocode.setApiKey(GoogleMapsAPI);
Geocode.enableDebug();

const mapContainerStyle = {
  height: "70vh",
  width: "85vw",
};

class Map extends React.Component{
constructor( props ){
  super( props );
  this.state = {
  // defaultcenter: this.props.defaultCenter, 
   defaultlat:this.props.defaultcenter.lat,
   defaultlng:this.props.defaultcenter.lng,
   address: this.props.center.address,
   address1: this.props.agency.address,
   mapPosition: {
    lat: this.props.center.lat,
    lng: this.props.center.lng
   },
   markerPosition: {
    lat: this.props.center.lat,
    lng: this.props.center.lng
  },
  markerPosition1: {
    lat: this.props.agency.lat,
    lng: this.props.agency.lng
  },
  }
 }


render(){
const AsyncMap = withScriptjs(
   withGoogleMap(
    props => (
     <GoogleMap
      google={this.props.google}
      defaultZoom={this.props.zoom}
      mapContainerStyle={mapContainerStyle}
      defaultCenter={{lat: this.state.markerPosition1.lat != '' ? (this.state.markerPosition1.lat) :(this.state.defaultlat), lng: this.state.markerPosition1.lng != '' ? (this.state.markerPosition1.lng) :(this.state.defaultlng) }}
      onClick={this.onClick}
     >
      <Marker google={this.props.google}
        name={'Dolores park'}
          draggable={true}
          onDragEnd={ this.onMarkerDragEnd }
          position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
          title={ this.state.address }
      />
      <Marker />
      <Marker google={this.props.google}
        name={'Dolores park'}
          draggable={true}
          onDragEnd={ this.onMarkerDragEnd }
          position={{ lat: this.state.markerPosition1.lat, lng: this.state.markerPosition1.lng }}
          title={ this.state.address1 }
      /> 
      <Marker />      
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
       <div style={{ height: `85%` }} />
      }
      containerElement={
       <div style={{ height: this.props.height }} />
      }
      mapElement={
       <div style={{ height: `85%` }} />
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