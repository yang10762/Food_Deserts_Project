import React, { useEffect, useRef, ReactElement, useState } from "react";
import Navigation from "../components/Navigation.jsx";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import config from "../config.json";
import { getMap } from "../fetcher.js";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Col, Row, Select, Switch } from "antd";

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
    stylers: [{ visibility: "on" }, { color: "#cccccc" }, { weight: 2 }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text",
    stylers: [{ visibility: "on" }, { color: "#cccccc" }, { weight: 4 }],
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

const secondaryHeatmapOptions = [
  { label: "Choose a statistic to visualize...", value: "" },
  { label: "Population", value: "population" },
  { label: "% Households With 6 or More People", value: "percent_large_hh" },
  { label: "% Below Poverty Line", value: "below_poverty_line" },
  { label: "% Minority", value: "percent_minority" },
  { label: "% Receiving Food Assistance", value: "percent_food_assistance" },
];

const secondaryHeatmapStyle = (heatmapData, overlay) => {
  let radius = 0.35,
    opacity = 0.4,
    maxIntensity = undefined;

  if (overlay === "population") {
    radius = 0.7;
    opacity = 0.45;
    maxIntensity = 3000; // == 3,000,000
  } else if (overlay === "percent_large_hh") {
    maxIntensity = 8;
  } else if (overlay === "below_poverty_line") {
    maxIntensity = 32;
  } else if (overlay === "percent_minority") {
    maxIntensity = 90;
  } else if (overlay === "percent_food_assistance") {
    maxIntensity = 32;
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

const getHeatmap = (overlay = "", showFoodDeserts = true) => {
  if (overlay !== "") {
    getMap(overlay)
      .then((res) => {
        const results = res.results;

        if (results.error) {
          alert("Error getting heatmap data.");
          return;
        }

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
      })
      .then(() => {
        getFoodDesertHeatmap(showFoodDeserts);
      });
  } else {
    if (secondaryHeatmap && secondaryHeatmap.getMap()) {
      secondaryHeatmap.setOptions(null);
      secondaryHeatmap.setMap(null);
    }
    getFoodDesertHeatmap(showFoodDeserts);
  }
};

const getFoodDesertHeatmap = (showFoodDeserts = true) => {
  if (
    showFoodDeserts &&
    (foodDesertHeatmap === undefined || !foodDesertHeatmap.getMap())
  ) {
    getMap("food_desert").then((res) => {
      const results = res.results;

      if (results.error) {
        alert("Error getting heatmap data.");
        return;
      }

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

      foodDesertHeatmap.setOptions(foodDesertHeatmapStyle(heatmapData));
      foodDesertHeatmap.setMap(null);
      if (showFoodDeserts) {
        foodDesertHeatmap.setMap(map);
      }
    });
  } else {
    foodDesertHeatmap.setMap(null);
    if (showFoodDeserts) {
      foodDesertHeatmap.setMap(map);
    }
  }
};

function MyMapComponent({ center, zoom, styles }) {
  const ref = useRef();

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

  return (
    <div
      ref={ref}
      id="map"
      style={{
        marginLeft: "0",
        marginRight: "0",
        boxShadow: "0 0 1em #888888",
        borderRadius: ".5em",
        height: "65vh",
      }}
    />
  );
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
  const [showFoodDeserts, setShowFoodDeserts] = useState(true);

  useEffect(() => {
    getHeatmap(overlay, showFoodDeserts);
  });

  return (
    <>
      <Navigation />

      <div className="Map">
        <div style={{ width: "67vw", margin: "0 auto", marginTop: "5vh" }}>
          <h2>Food Desert Heatmap</h2>
          <h7 style={{ textAlign: "center" }}>
            View the heatmap below to see the distribution of food deserts and
            population across the United States
          </h7>
        </div>
        <br />
        <br />
        <div>
          <Row align={"middle"}>
            <Col xs={0} xl={4}></Col>
            <Col xs={24} md={8} xl={6}>
              <label>Show Food Desert Heatmap</label>
              <Switch
                defaultChecked
                onChange={() => {
                  setShowFoodDeserts(!showFoodDeserts);
                }}
                style={{ marginLeft: "1.5em", backgroundColor: "#7FB069" }}
              />
            </Col>
            <Col xs={24} md={16} lg={10}>
              <Row justify={"end"}>
                <label style={{ margin: "0 1em" }}>Secondary Statistic</label>
                <Select
                  defaultValue=""
                  onChange={(value) => {
                    setOverlay(value);
                  }}
                  style={{ margin: "0 1em", minWidth: "300px" }}
                  options={secondaryHeatmapOptions}
                />
              </Row>
            </Col>
            <Col xs={0} xl={4}></Col>
          </Row>
          <br />
          <Row>
            <Col xs={0} xl={4}></Col>
            <Col xs={24} xl={16}>
              <Wrapper
                apiKey={`${config.maps_api_key}`}
                render={render}
                libraries={["visualization"]}
              >
                <MyMapComponent center={center} zoom={zoom} styles={mapStyle} />
              </Wrapper>
            </Col>
            <Col xs={0} xl={4}></Col>
          </Row>
        </div>
      </div>
    </>
  );
}
