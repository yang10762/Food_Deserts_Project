import React, { useEffect, useRef, ReactElement, useState } from "react";
import Navigation from "../components/Navigation.jsx";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import config from "../config.json";
import { getMap } from "../fetcher.js";
import { Select } from "antd";

const { Option } = Select;

let map;
let foodDesertHeatmap, secondaryHeatmap;

const mapStyle = [
  {
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#898989" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#bfd4ff" }],
  },
  {
    featureType: "administrative.province",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#ffffff" }],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#ffffff" }],
  },
  {
    featureType: "administrative.province",
    elementType: "labels.text",
    stylers: [
      { visibility: "on" },
      { color: "#cccccc" },
      { weight: 2 },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text",
    stylers: [
      { visibility: "on" },
      { color: "#cccccc" },
      { weight: 4 },
    ],
  },
];

const foodDesertHeatmapStyle = (heatmapData) => {
  return {
    data: heatmapData,
    dissipating: false,
    radius: 0.5,
    opacity: 0.6,
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
    maxIntensity: 30,
  };
};

const secondaryHeatmapStyle = (heatmapData, overlay) => {
  let radius, opacity, maxIntensity;

  if (overlay === "population") {
    radius = 0.7;
    opacity = 0.45;
    maxIntensity = 3000;
  } else if (overlay === "avg_hh_size") {
    radius  =  0.4;
    opacity = 0.45;
    maxIntensity = 5;
  } else if (overlay === "below_poverty_line") {
    radius  =  0.35;
    opacity = 0.45;
    maxIntensity = 32;
  } else if (overlay === "percent_minority") {
    radius  =  0.35;
    opacity = 0.4;
    maxIntensity = 90;
  } else if (overlay === "percent_food_assistance") {
    radius  =  0.35;
    opacity = 0.45;
    maxIntensity = 32;
  } else {
    radius  =  0.4;
    opacity = 0.45;
    maxIntensity = undefined;
  }
  
  return {
    data: heatmapData,
    dissipating: false,
    radius: radius,
    opacity: opacity,
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
    maxIntensity: maxIntensity,
  };
};

const getHeatmap = (overlay = "") => {
  
  if (overlay !== "") {
    getMap(overlay).then((res) => {
      const results = res.results;

      let heatmapData = [];
      for (let i = 0; i < results.length; i++) {
        heatmapData.push({
          location: new window.google.maps.LatLng(
            results[i].lat,
            results[i].lon
          ),
          weight: results[i].weight,
        });
      }

      secondaryHeatmap.setOptions(
        secondaryHeatmapStyle(heatmapData, overlay)
      );
      secondaryHeatmap.setMap(map);
    }).then( getFoodDesertHeatmap );
  } else {
    if (secondaryHeatmap && secondaryHeatmap.getMap()) {
      secondaryHeatmap.setOptions(null);
      secondaryHeatmap.setMap(null);
    }
    getFoodDesertHeatmap();
  }
  
};

const getFoodDesertHeatmap = () => {
  if (foodDesertHeatmap === undefined || !foodDesertHeatmap.getMap()) {
    getMap("food_desert").then((res) => {
      const results = res.results;

      let heatmapData = [];
      for (let i = 0; i < results.length; i++) {
        heatmapData.push({
          location: new window.google.maps.LatLng(results[i].lat, results[i].lon),
          weight: results[i].weight,
        });
      }

      foodDesertHeatmap.setOptions(
        foodDesertHeatmapStyle(heatmapData)
      );
      
      foodDesertHeatmap.setMap(map);
    });

  } else {
    foodDesertHeatmap.setMap(null);
    foodDesertHeatmap.setMap(map);
  }
}

function MyMapComponent({ center, zoom, styles }) {
  const ref = useRef();

  // const [overlay, setOverlay] = useState("food_desert");

  useEffect(() => {
    map = new window.google.maps.Map(ref.current, {
      center,
      zoom,
      styles,
      mapTypeControl: false,
      streetViewControl: false,
    });
    foodDesertHeatmap = new window.google.maps.visualization.HeatmapLayer();
    secondaryHeatmap = new window.google.maps.visualization.HeatmapLayer();
  }, [center, styles, zoom]);

  return <div ref={ref} 
              id="map" 
              style={{
                maxWidth: "1200px", 
                boxShadow:"0 0 1em #888888", 
                borderRadius:".5em",
                border: ".25em solid rgb(127, 176, 105)",
                height: "90vh",
                transition: "all .5s"
              }}
          />;
}

const render = (status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;
};

const center = { lat: 38, lng: -98 };
const zoom = 5;
export default function Map() {
  const [overlay, setOverlay] = useState("");

  useEffect(() => {
    getHeatmap(overlay);
  });

  const secondaryHeatmapOptions = [
    { label: "Choose a statistic to visualize...", value: ""},
    { label: "Population", value: "population", },
    { label: "Average Household Size", value: "avg_hh_size", },
    { label: "% Below Poverty Line", value: "below_poverty_line", },
    { label: "% Minority", value: "percent_minority", },
    { label: "% Receiving Food Assistance", value: "percent_food_assistance", },
  ]

  return (
    <div className="Map">
      <Navigation />
      <h2>Food Desert Heatmap</h2>
      <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center" }}>
        <p style={{ marginBottom:"1em" }}>
          View the heatmap below to see the distribution of food deserts and
          population across the United States
        </p>
        <Select
          defaultValue=""
          onChange={(value)=>{setOverlay(value);}}
          style={{ minWidth: "300px", width: "25vw", margin: "0", padding:"0" }}
          options={ secondaryHeatmapOptions }
        />
        <Wrapper
          apiKey={`${config.maps_api_key}`}
          render={render}
          libraries={["visualization"]}
        >
          <MyMapComponent center={center} zoom={zoom} styles={mapStyle} />
        </Wrapper>
      </div>
    </div>
  );
}
