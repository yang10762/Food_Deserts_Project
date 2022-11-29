import React, { useEffect, useRef, ReactElement } from "react";
import Navigation from "../components/Navigation.jsx";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import config from '../config.json'
import { getMap } from '../fetcher.js'

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
    featureType: "administrative.province",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#000000" }, { brightness: 25 }],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#000000" }, { brightness: 25 }],
  },
  {
    featureType: "administrative.province",
    elementType: "labels.text",
    stylers: [{ visibility: "on" }, { color: "#5a5a5a" }, { brightness: 25 }, { stroke: .8 }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text",
    stylers: [{ visibility: "on" }, { color: "#6a6a6a" }, { brightness: 25 }, { stroke: .8 }],
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

    getHeatmap();
  });
 
  return <div ref={ref} id="map"/>;
}

const center = { lat: 40, lng: -100 };
const zoom = 4;

let heatmapData = []
let getHeatmap = async function () {
  let heatmapDataRaw = await getMap();

  
  let cnt = 10;
  for (let row in heatmapDataRaw.results) {
    console.log(row)
    // heatmapData.push({location: new window.google.maps.LatLng(row.lat,row.lon), weight: row.weight});
    cnt--;
    if (cnt == 0) break;
  }
  
  let heatmap = new window.google.maps.visualization.HeatmapLayer({
    data: heatmapData
  })

  heatmap.setMap(map)
}

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