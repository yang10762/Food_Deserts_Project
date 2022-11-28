import React, { useEffect, useRef, ReactElement } from "react";
import Navigation from "../components/Navigation.jsx";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import config from '../config.json'

const render = (status) => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    return null;
};

let map;

const mapStyle = [
  {
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#fcfcfc" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#bfd4ff" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#999" }],
  }
];
  
function MyMapComponent({ center,zoom,styles }) {
  const ref = useRef();

  useEffect(() => {
    map = new window.google.maps.Map(ref.current, {
      center,
      zoom,
      styles,
    });
  });
 
  return <div ref={ref} id="map"/>;
}

const center = { lat: 40, lng: -100 };
const zoom = 4;

export default function MapPage() {
    return (
        <div className="MapPage">
            <Navigation />
            <Wrapper apiKey={ `${config.maps_api_key}` } render={ render } libraries={ ['visualization'] }>
                <MyMapComponent center={center} zoom={zoom} styles={mapStyle}/>
            </Wrapper>
        </div>
    );
}