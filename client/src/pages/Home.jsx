import React from "react";
import Navigation from "../components/Navigation.jsx";
import styled from "styled-components";
import squiggle from "../images/squig.svg";
import tempUS from "../images/us.svg";

import shopper from "../images/shopper.webp";
import groceries from "../images/groceries.webp";
import TextImageContent from "../components/TextImageContent.jsx";
import "../App.css";

const PaddedContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 25vw;
  height: 40vh;
  margin: 2.5vw 1.25vw;
  padding: 2.5vw 1.25vw;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 60vh;
  margin: 2.5vw 1.25vw;
  padding: 2.5vw 1.25vw;
  width: 30vw;
  justify-content: space-between;
`;

const Map = styled.div`
  display: flex;
  flex-direction: column;
  height: 60vh;
  // max-height: 50vh;
  margin: 2.5vw 1.25vw;
  padding: 2.5vw 1.25vw;
  width: 60vw;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  justify-content: space-between;
`;

export default function Home() {
  const imageSquareDimension = "35vh";
  return (
    <div className="Home">
      <Navigation />
      <Wrapper>
        <Content>
          <h2 style={{ fontWeight: "normal", alignSelf: "center" }}>
            The place to be for
          </h2>
          <div className="intro">
            <h1 style={{ fontSize: "60px", lineHeight: "1.25em" }}>
              understanding
            </h1>
            <img
              src={squiggle}
              style={{
                zIndex: -1,
                position: "absolute",
                // height: "30vh",
                width: "44vh",
                // objectFit: "cover",
                // borderRadius: "10px",
              }}
            />
            <h1 style={{ fontSize: "60px", lineHeight: "1.25em" }}>
              food accesibility in
            </h1>

            <h1 style={{ fontSize: "60px", lineHeight: "1.25em" }}>
              the United States
            </h1>
          </div>
          <div className="tagline">
            <h2 style={{ fontWeight: "normal" }}>The interactive food</h2>
            <h2 style={{ fontWeight: "normal" }}>desert visualizer.</h2>
          </div>
        </Content>
        <Map>
          <img
            src={tempUS}
            style={{
              // height: "75vw",
              width: "55vw",
              objectFit: "contain",
              // borderRadius: "10px",
            }}
          />
        </Map>
      </Wrapper>

      <div style={{ marginTop: "20vh" }}>
        <TextImageContent color="#666A86">
          <PaddedContent style={{ color: "#EBE9E9" }}>
            <h1 style={{ color: "#EBE9E9" }}>So, what are food deserts?</h1>
            <p>
              Food deserts are areas with low access to affordable and
              nutritious food, often due to low proximity to supermarkets or
              scarcity of transportation.
            </p>
          </PaddedContent>
          {/* <PaddedContent> */}
          <img
            src={groceries}
            style={{
              height: imageSquareDimension,
              width: imageSquareDimension,
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
          {/* </PaddedContent> */}
        </TextImageContent>
        <TextImageContent>
          <img
            src={shopper}
            style={{
              height: imageSquareDimension,
              width: imageSquareDimension,
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />

          <PaddedContent>
            <h1>How does Food Desert Finder Help?</h1>
            <p>
              In a country full of seemingly abundant food options we often
              forget about the many food deserts throughout the US that could
              exist even one town over from us. Food Desert Finder intends to
              illustrate this issue using visually appealing heatmap technology
              to educate the public on just how prevalent food deserts are and
              their secondary effects on the health of Americans.
            </p>
          </PaddedContent>
        </TextImageContent>
      </div>
    </div>
  );
}
