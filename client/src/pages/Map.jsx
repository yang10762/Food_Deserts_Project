import React, { useEffect, useRef, ReactElement, useState } from "react";
import Navigation from "../components/Navigation.jsx";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import config from '../config.json'
import { getMap } from '../fetcher.js'

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

const foodDesertHeatmapStyle = (heatmapData) => {
  return {
    data: heatmapData,
    dissipating: false,
    radius: .9,
    opacity: .6,
    gradient: [
      "rgba(255,255,229,0)",
      "rgba(255,255,229,0.5)",
      "rgba(255,247,188,1)",
      "rgba(254,227,145,1)",
      "rgba(254,196,79,1)",
      "rgba(254,153,41,1)",
      "rgba(236,112,20,1)",
      "rgba(204,76,2,1)",
      "rgba(153,52,4,1)",
      "rgba(102,37,6,1)",
    ],
    maxIntensity: 200
  }
}

const populationHeatmapStyle = (heatmapData) => {
  return {
    data: heatmapData,
    dissipating: false,
    radius: .7,
    opacity: .45,
    gradient: [
      "rgba(0, 255, 255, 0)",
      "rgba(0, 255, 255, 1)",
      "rgba(0, 127, 255, 1)",
      "rgba(0, 191, 255, 1)",
      "rgba(0, 63, 255, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(0, 0, 223, 1)",
      "rgba(0, 0, 191, 1)",
      "rgba(0, 0, 159, 1)",
      "rgba(0, 0, 127, 1)",
      "rgba(63, 0, 91, 1)",
      "rgba(127, 0, 63, 1)",
      "rgba(191, 0, 31, 1)",
      "rgba(255, 0, 0, 1)",
    ],
    maxIntensity: 5000
  }
} 

const avgHHSizeHeatmapStyle = (heatmapData) => {
  return {
    data: heatmapData,
    dissipating: false,
    radius: .4,
    opacity: .45,
    gradient: [
      "rgba(0, 0, 255, 0)",
      "rgba(0, 0, 225, 0.5)",
      "rgba(0, 0, 245, 0.5)",
      "rgba(0, 0, 235, 0.5)",
      "rgba(0, 0, 215, 0.6)",
      "rgba(0, 0, 205, 0.6)",
      "rgba(0, 0, 195, 0.6)",
      "rgba(0, 0, 185, 0.7)",
      "rgba(0, 0, 175, 0.7)",
      "rgba(0, 0, 165, 0.7)",
      "rgba(0, 20, 155, 0.8)",
      "rgba(0, 30, 145, 0.8)",
      "rgba(0, 40, 135, 0.8)",
      "rgba(0, 50, 125, 1)",
    ],
    maxIntensity: 5
  }
}

const belowPovertyLineHeatmapStyle = (heatmapData) => {
  return {
    data: heatmapData,
    dissipating: false,
    radius: .4,
    opacity: .45,
    gradient: [
      "rgba(0, 255, 255, 0)",
      "rgba(0, 255, 255, 1)",
      "rgba(0, 127, 255, 1)",
      "rgba(0, 191, 255, 1)",
      "rgba(0, 63, 255, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(0, 0, 223, 1)",
      "rgba(0, 0, 191, 1)",
      "rgba(0, 0, 159, 1)",
      "rgba(0, 0, 127, 1)",
      "rgba(63, 63, 91, 1)",
      "rgba(127, 127, 63, 1)",
      "rgba(191, 191, 31, 1)",
      "rgba(255, 255, 0, 1)",
    ],
    maxIntensity: 35
  }
}

const getHeatmap = (overlay='') => {
  
  if (overlay === 'population') {
    getMap('population').then(res => {
      const results = res.results;
      
      let heatmapData = [];
      for (let i = 0; i < results.length; i++) {
        heatmapData.push({
          location: new window.google.maps.LatLng(results[i].lat,results[i].lon), 
          weight: results[i].weight
        });
      }
      
      let heatmap = new window.google.maps.visualization.HeatmapLayer(populationHeatmapStyle(heatmapData));
      heatmap.setMap(map);
    });
  } else if (overlay === 'avg_hh_size') {
    getMap('avg_hh_size').then(res => {
      const results = res.results;
      
      let heatmapData = [];
      for (let i = 0; i < results.length; i++) {
        heatmapData.push({
                            location: new window.google.maps.LatLng(results[i].lat,results[i].lon), 
                            weight: results[i].weight
                          });
                        }
                        
      let heatmap = new window.google.maps.visualization.HeatmapLayer(avgHHSizeHeatmapStyle(heatmapData));
      heatmap.setMap(map);
    });
  } else if (overlay === 'below_poverty_line') {
    getMap('below_poverty_line').then(res => {
      const results = res.results;
      
      let heatmapData = [];
      for (let i = 0; i < results.length; i++) {
        heatmapData.push({
          location: new window.google.maps.LatLng(results[i].lat,results[i].lon), 
          weight: results[i].weight
        });
      }
      
      let heatmap = new window.google.maps.visualization.HeatmapLayer(belowPovertyLineHeatmapStyle(heatmapData));
      heatmap.setMap(map);
    });
  }
  getMap('food_desert').then(res => {
    const results = res.results;
    
    let heatmapData = [];
    for (let i = 0; i < results.length; i++) {
      heatmapData.push({
                          location: new window.google.maps.LatLng(results[i].lat, results[i].lon), 
                          weight: results[i].weight
                        });
    }
    
    let heatmap = new window.google.maps.visualization.HeatmapLayer(foodDesertHeatmapStyle(heatmapData));
    heatmap.setMap(map);
  });
}


function MyMapComponent({ center,zoom,styles }) {
  const ref = useRef();

  const [overlay, setOverlay] = useState('food_desert');
  
  useEffect(() => {
    map = new window.google.maps.Map(ref.current, {
      center,
      zoom,
      styles,
    });
  });
  useEffect(() => {
    getHeatmap('population');
  })
  
  return <div ref={ref} id="map"/>;
}

const render = (status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;
};

const center = { lat: 38, lng: -98 };
const zoom = 5;
export default function Map() {
    const [overlay, setOverlay] = useState('');
  
    return (
        <div className="Map">
            <Navigation />
            <h1>Food Desert Heatmap</h1>
            <Wrapper apiKey={ `${config.maps_api_key}` } render={ render } libraries={ ['visualization'] }>
                <MyMapComponent center={center} zoom={zoom} styles={mapStyle}/>
            </Wrapper>
        </div>
    );
}